<template>
  <div class="meet-page">
    <div class="number-box">
      <div class="number-item back">
        <div>COG</div>
        <div>{{ meetObj.cog || 0 }}°</div>
      </div>
      <div class="number-item back">
        <div>SOG</div>
        <div>{{ meetObj.sog || 0 }}km</div>
      </div>
      <div class="number-item back">
        <div>ROT</div>
        <div>{{ meetObj.rot || 0 }}km</div>
      </div>
    </div>
    <div class="ship-box back">
      <div class="ship-item">
         <span> <label>船名:</label><span>{{ meetData.shipName }}</span></span>
      </div>
      <div class="ship-item">
        <span class="block1"><label>MMSI:</label><span>{{ meetData.shipMMSI }}</span></span>
        <span class="block2"><label>船长:</label><span>{{meetObj.length || 0}}m</span></span>
        <span><label>船宽:</label><span>{{meetObj.width || 0}}mm</span></span>
      </div>
      <div class="ship-item">
        <span class="block1"><label>ETA:</label><span>{{meetObj.eta || 0}}</span></span>
        <span><label>距终点:</label><span>{{meetObj.th || 0}}米</span></span>
        <span></span>
      </div>
    </div>
    <div class="point-box back">
      <span><label>LON:</label><span>{{ getLonLatStr(meetData.shipGeoPoX, true) || '-' }}</span></span>
      <span><label>LAT:</label><span>{{ getLonLatStr(meetData.shipGeoPoY, false) || '-' }}</span></span>
    </div>
    <div class="meet-box">
      <el-divider content-position="left">会遇列表</el-divider>
      <div class="scroll-box">
        <el-scrollbar style="height:100%">
          <div :class="['meet-list',index%2===0?'warning':'success']" v-for="(item,index) in meetObj.meeting" :key="index">
            <el-row style="height: 100%;">
              <el-col :span="4" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                <span class="el-icon-setting icon-left"></span>
              </el-col>
              <el-col :span="20" style="height: 100%;">
                <div class="list">
                  <div style="font-size: 14px;margin:2px 0 6px 0;">MMSI:{{ item.mmsi }}</div>
                  <div>
                    <!--<span>安全速度:-.-{{ index }}</span>-->
                    <span>船舶尺寸:{{ meetObj.length }}×{{ meetObj.width }}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-if="meetObj.meeting && meetObj.meeting.length===0">
            <el-empty description="暂无数据"></el-empty>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import {getCircleApi} from "@/api/seamap";
import {mapState} from 'vuex'

export default {
  name: "meet",
  props: {
    meetData: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      meetObj: {},
      addPos: -1
    }
  },
  computed: {
    ...mapState({
      faceLayerPos: state => state.map.faceLayerPos,
      faceStylePos: state => state.map.faceStylePos,
    }),
    loc() {
      return {x: this.meetData.shipGeoPoX ?? 0, y: this.meetData.shipGeoPoY ?? 0}
    },
  },
  watch: {
    loc(newVal) {
      this.getList();
    }
  },
  methods: {
    // 航道，避碰圈半径都是500m
    getLonLatStr(val, isX) {
      return API_LonLatToString(val / 10000000, isX);
    },
    getList() {
      let params = {
        mmsi: this.meetData.shipMMSI, dis: 500
      }
      getCircleApi(params).then(res => {
        let {cog, dst, eta, length, loc, meeting, rot, sog, status, th, type, width}=res;
        this.meetObj = res;
        if (meeting?.length > 0) {
          //没有设置样式就会用默认的面图层样式
          this.setCircleStyle(this.faceLayerPos, this.addPos)
        }
      })
      this.drawCircle(this.meetData);
    },
    drawCircle(obj) {
      // console.log(obj,'obj')
      if (!obj) {
        return false;
      }
      let {shipId, shipGeoPoX, shipGeoPoY} = obj;
      let layerPos = this.faceLayerPos; //获取图层的pos
      const iObjPosObject = API_GetObjectPosById(shipId) //根据物标的id获取物标的pos(只返回第一个符合条件的物标) 返回格式 {layerPos:2,iObjPos:0}
      // console.log(iObjPosObject)
      let iObjPos = iObjPosObject?.iObjPos;
      if (layerPos > -1 && iObjPos > -1) {
        API_DelObjectByPos(layerPos, iObjPos)//先删除之前的
      }
      let objInfo = [];
      objInfo.objId = "ship-circle"; 			//物标的id(数字)
      objInfo.objType = 5; 		//物标类型(数字)：1=点、2=线、3=面、4=矩形、5=圆
      objInfo.name = obj.shipName; 		//物标名称(字符串)
      // objInfo.strShowText=; 	//海图上显示的内容（字符串）
      objInfo.bShow = true; 		//是否显示，true=显示，false=不显示
      objInfo.r = 0.5; 		//圆半径(km)
      objInfo.layerPos = layerPos;
      // objInfo.layerStylePos; //使用图层样式的索引pos（数字），只有使用图层样式，该值才有效
      // objInfo.bGetOwnStyle;  //是否启用自己样式（布尔），true=自己样式，false=图层样式
      // objInfo.rotationAngle = 0; //点物标的旋转角度
      this.addPos = API_AddNewObject(objInfo, [{x: shipGeoPoX, y: shipGeoPoY}], null);
      //设置样式
      // this.setCircleStyle(layerPos, addPos)
      //重绘
      API_ReDrawLayer();
    },
    setCircleStyle(layerPos, addPos) {
      let objStyleInfo = [];
      objStyleInfo.bFilled = true;       //是否填充(布尔)，true=填充，false=不填充
      objStyleInfo.fillColor = '#FFF';     //填充颜色(字符串)，例如"#000000"
      objStyleInfo.iOpacity = 2;      //填充透明度(数字)，0~100，100为不透明
      objStyleInfo.borderWith = 2;    //线粗细(数字)
      objStyleInfo.iLineOpacity = 50; //线的透明度(数字)，0~100，100为不透明
      objStyleInfo.borderColor = "#666";   //线颜色(字符串)，例如"#000000"
      objStyleInfo.bShowText = false;     //是否显示信息(布尔)，true=显示，false=不显示
      objStyleInfo.textColor = "#00ff00";     //物标名称字体颜色(字符串)，例如"#000000"
      objStyleInfo.fontSize = "20px 宋体";      //物标名称字体(字符串)，格式例如"12px 宋体"
      objStyleInfo.iTextOpacity = 20;  //文本透明度(数字)，0~100，100为不透明
      objStyleInfo.lineType = 0;  //线类型：0=实线，1=虚线
      objStyleInfo.lineLen = 8;  //虚线时，线段长度
      objStyleInfo.dashLen = 4;  //虚线时，线段的间隔
      if(this.meetObj.meeting?.length>0){
        objStyleInfo.fillColor = '#FF0000';
        objStyleInfo.iOpacity = 20;
      }
      // console.log(layerPos, addPos)
      //设置样式
      API_SetFaceObjStyleByPos(layerPos, addPos, true, objStyleInfo);
    }
  },
  mounted() {
    this.getList();
  }
}
</script>

<style scoped lang="scss">
$border-color: #999;
$ship-color: olive;
.back {
  background: #f5f7fa;
  color: #333;
  border: 1px solid #ddd;
}
label {
  margin-right: 4px;
  font-weight: bold;
}
.meet-page {
  overflow: hidden;

  .number-box {
    display: flex;
    justify-content: space-around;

    .number-item {
      width: 30%;
      text-align: center;
      border-radius: 5px;
      font-weight: bold;
      padding: 4px;
    }
  }

  .point-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    margin: 4px 0;
    border-radius: 5px;

  }

  .ship-box {
    margin: 6px 0;
    font-size: 13px;
    padding:4px 8px;
    border-radius: 5px;
    .ship-item{
      padding:10px 0;
      border-bottom: 1px dashed #ddd;
      box-sizing: border-box;
      display: flex;
      .block1{
        width: 40%;
      }
      .block2{
        width: 30%;
      }
    }
  }

  .meet-box {
    * {
      box-sizing: border-box;
    }

    .scroll-box {
      overflow: auto;
      height: 40vh;
      //border: 1px dashed #999;

      ::v-deep .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }

    ::v-deep .el-scrollbar__thumb {
      background: rgba(144, 147, 153, 1);
    }

    .meet-list {
      height: 50px;
      font-size: 12px;
      cursor: pointer;
      color: #fff;
      background: #409eff;
      margin:2px 0;
      border-radius: 5px;
      //&:nth-last-child(1) {
      //  border-bottom: 1px solid #ddd;
      //}

      //&.warning{
      //  background: #E6A23C;
      //}
      &:hover {
        background: #66b1ff;
        color: #fff;
        //animation: scale_size 1s;
      }
      @keyframes scale_size {
        from {
          transform: scale(1);
        }
        to {
          transform: scale(1.1);
        }
      }
    }
  }
}
</style>
