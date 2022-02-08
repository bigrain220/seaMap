<template>
  <div class="meet-page">
    <div class="number-box">
      <div class="number-item">
        <div>HDG(AIS)</div>
        <div>211.0°</div>
      </div>
      <div class="number-item">
        <div>ROT(推算)</div>
        <div>4.2</div>
      </div>
      <div class="number-item">
        <div>COG</div>
        <div>210.9°</div>
      </div>
      <div class="number-item">
        <div>SOG</div>
        <div>10.9km</div>
      </div>
    </div>
    <div class="title-box">
      <span><label>航线:</label><span>IOS_Test</span></span>
      <span><label>转向点:</label><span>未命名</span></span>
    </div>
    <div class="ship-box">
      <div class="ship-left">
        <div class="line">
          <div class="item">
            <div>666</div>
          </div>
          <div class="item">
            <div>方位</div>
            <div>248.2°</div>
          </div>
        </div>
        <div class="line">
          <div class="item">
            <div>DTG</div>
            <div>179m</div>
          </div>
          <div class="item">
            <div>TTG</div>
            <div>1m 15s</div>
          </div>
        </div>
        <div class="line">
          <div class="item">
            <div>距终点</div>
            <div>13.74nm</div>
          </div>
          <div class="item">
            <div>ETA</div>
            <div>9-02 21:16</div>
          </div>
        </div>
      </div>
      <div class="ship-middle">
        <div class="ship-pic">
          <div class="nav-top"></div>
          <div class="nav-1 nav"><span class="number">0.2</span><span>km</span></div>
          <div class="nav-2 nav"><span class="number">0.2</span><span>km</span></div>
          <div class="nav-3 nav"><span class="number">0.2</span><span>km</span></div>
        </div>
      </div>
      <div class="ship-right">
        <div class="line">
          <div class="item">
            <div>距终点</div>
            <div>13.74nm</div>
          </div>
          <div class="item">
            <div>ETA</div>
            <div>9-02 21:16</div>
          </div>
        </div>
        <div class="line">
          <div class="item">
            <div>左舷距</div>
            <div>24.0m</div>
          </div>
          <div class="item">
            <div>船尾距</div>
            <div>227.0m</div>
          </div>
        </div>
        <div class="line">
          <div class="item lon-lat">
            <div class="lon"><label>LON:</label> 121°51′26.24″ E</div>
            <div class="lat"><label>LAT:</label> 31°10′31.87″ N</div>
          </div>
        </div>
      </div>
    </div>
    <div class="meet-box">
      <el-divider content-position="left">会遇列表</el-divider>
      <div class="scroll-box">
        <el-scrollbar style="height:100%">
        <div :class="['meet-list',index%2===0?'warning':'success']" v-for="(item,index) in meetList" :key="index">
          <el-row style="height: 100%;">
            <el-col :span="4" style="height: 100%;display: flex;justify-content: center;align-items: center;">
              <span class="el-icon-setting icon-left"></span>
            </el-col>
            <el-col :span="20" style="height: 100%;">
              <div class="list">
                <div style="font-size: 14px;margin:2px 0 6px 0;">MMSI:{{ item.mmsi }}</div>
                <div>
                  <span>安全速度:-.-{{index}}</span>
                  <span style="margin-left: 30px;">船舶尺寸:175.0×31.0</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-if="meetList.length===0">
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
  props:{
    meetData:{
      type:Object,
      default:()=>{}
    }
  },
  data() {
    return {
      meetList:[],
      addPos:-1
    }
  },
  computed:{
    ...mapState({
      faceLayerPos: state => state.map.faceLayerPos,
      faceStylePos: state => state.map.faceStylePos,
    }),
    loc(){
      return {x:this.meetData.shipGeoPoX ?? 0,y:this.meetData.shipGeoPoY ?? 0}
    },
  },
  watch:{
    loc(newVal){
      this.getList();
    }
  },
  methods: {
    getList(){
      let params={
        // lon:this.loc.x, lat:this.loc.y, dis:1, count:null
        mmsi:4132212,dis:500
      }
      getCircleApi(params).then(res=>{
        this.meetList=res||[];
        if(res?.length>0){
          //没有设置样式就会用默认的面图层样式
          this.setCircleStyle(this.faceLayerPos,this.addPos)
        }
      })
      this.drawCircle(this.meetData);
    },
    drawCircle(obj){
      // console.log(obj,'obj')
      if (!obj) {
        return false;
      }
      let {shipId,shipGeoPoX,shipGeoPoY} = obj;
      let layerPos = this.faceLayerPos; //获取图层的pos
      const iObjPosObject = API_GetObjectPosById(shipId) //根据物标的id获取物标的pos(只返回第一个符合条件的物标) 返回格式 {layerPos:2,iObjPos:0}
      // console.log(iObjPosObject)
      let iObjPos=iObjPosObject?.iObjPos;
      if(layerPos>-1 && iObjPos>-1){
        API_DelObjectByPos(layerPos, iObjPos)//先删除之前的
      }
      let objInfo = [];
      objInfo.objId = "ship-circle"; 			//物标的id(数字)
      objInfo.objType = 5; 		//物标类型(数字)：1=点、2=线、3=面、4=矩形、5=圆
      objInfo.name = obj.shipName; 		//物标名称(字符串)
      // objInfo.strShowText=; 	//海图上显示的内容（字符串）
      objInfo.bShow = true; 		//是否显示，true=显示，false=不显示
      objInfo.r = 1; 		//圆半径(km)
      objInfo.layerPos = layerPos;
      // objInfo.layerStylePos; //使用图层样式的索引pos（数字），只有使用图层样式，该值才有效
      // objInfo.bGetOwnStyle;  //是否启用自己样式（布尔），true=自己样式，false=图层样式
      // objInfo.rotationAngle = 0; //点物标的旋转角度
      this.addPos=API_AddNewObject(objInfo, [{x: shipGeoPoX, y: shipGeoPoY}], null);
      //设置样式
      // this.setCircleStyle(layerPos, addPos)
      //重绘
      API_ReDrawLayer();
    },
    setCircleStyle(layerPos, addPos) {
        let objStyleInfo = [];
        objStyleInfo.bFilled = true;       //是否填充(布尔)，true=填充，false=不填充
        objStyleInfo.fillColor = '#FF0000';     //填充颜色(字符串)，例如"#000000"
        objStyleInfo.iOpacity = 20;      //填充透明度(数字)，0~100，100为不透明
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
      // objStyleInfo.color="#4d5854"
      // objStyleInfo.color="#020202"
        // if(this.meetList.length>0){
        //   objStyleInfo.fillColor = '#FF0000';
        //   objStyleInfo.iOpacity = 20;
        // }
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
.meet-page {
  overflow: hidden;
  .number-box {
    display: flex;
    justify-content: space-around;

    .number-item {
      flex: 1;
      text-align: center;
      border-right: 1px solid $border-color;

      &:nth-last-child(1) {
        border-right: 0;
      }

      & > div:nth-last-child(1) {
        font-weight: bold;
      }
    }
  }

  .title-box {
    display: flex;
    justify-content: space-between;
    border: 1px dashed $border-color;
    border-left: 0;
    border-right: 0;
    padding: 10px;
    margin: 4px 0;
    font-weight: bold;

    label {
      margin-right: 10px;
      font-weight: normal;
    }
  }

  .ship-box {
    display: flex;
    font-size: 12px;

    .line {
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-bottom: 1px solid $border-color;

      .item {
        flex: 1;
        text-align: center;
        padding-top: 2px;

        & > div:nth-last-child(1) {
          padding: 4px;
          font-weight: bold;
        }
      }
    }

    .ship-left {
      width: 33.33%;
    }

    .ship-middle {
      width: 33.33%;
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      border: 1px solid $border-color;
      position: relative;
      overflow: hidden;
      padding: 2px 30px;
      border-top: 0;

      .ship-pic {
        width: 100%;

        .nav-top {
          border: 1px solid $ship-color;
          background: $ship-color;
          border-bottom: 0;
          height: 20px;
          position: relative;

          &::before {
            content: '';
            position: absolute;
            top: -1px;
            left: -1px;
            right: 0;
            bottom: 0;
            width: 0;
            height: 0;
            border-top: 20px solid #fff;
            border-right: 20px solid transparent;
          }

          &::after {
            content: '';
            position: absolute;
            top: -1px;
            //left: 0px;
            right: -1px;
            //bottom: 0;
            width: 0;
            height: 0;
            border-top: 20px solid #fff;
            border-left: 20px solid transparent;
          }
        }

        .nav {
          border-left: 1px solid $ship-color;
          border-right: 1px solid $ship-color;
          background: $ship-color;
          height: 32px;
          line-height: 32px;
          color: #fff;
          text-align: center;
          font-size: 12px;

          .number {
            font-weight: bold;
            font-size: 15px;
          }
        }

        .nav-3 {
          position: relative;
          border-radius: 0 0 8px 8px;
        }
      }
    }

    .ship-right {
      width: 33.33%;

      .lon-lat {
        overflow: hidden;

        .lat {
          padding-left: 0 !important;
        }

        .lon {
          font-weight: bold;
        }

        label {
          float: left;
          padding-left: 14px;
          font-weight: normal !important;
        }
      }
    }
  }

  .meet-box {
    *{box-sizing: border-box;}
    .scroll-box{
      overflow: auto;
      height: 40vh;
      border:1px dashed #999;
      ::v-deep .el-scrollbar__wrap{
        overflow-x: hidden;
      }
    }
    ::v-deep .el-scrollbar__thumb{
      background: rgba(144,147,153,1);
    }
    .meet-list {
      height: 50px;
      font-size: 12px;
      cursor: pointer;
      color: #000;
      background: #67C23A;
      border-top:1px solid #ddd;
      &:nth-last-child(1){
        border-bottom: 1px solid #ddd;
      }
      //&.warning{
      //  background: #F56C6C;
      //}
      //&.success{
      //  background: #67C23A;
      //}
      &:hover{
        background: #2770d4;
        color: #fff;
      }
    }
  }
}
</style>