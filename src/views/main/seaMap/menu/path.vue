<template>
  <div>
    <div class="path-list-box" v-if="!visible.detail">
      <div class="header">
        <el-button type="primary" icon="el-icon-edit-outline" size="mini" @click="addClick({},'draw')">绘制</el-button>
        <el-button type="success" icon="el-icon-plus" size="mini" @click="addClick({},'path')">添加</el-button>
      </div>
      <el-table :data="pathData" style="width: 100%" height="60vh" size="mini" border key="1">
        <!--<el-table-column type="index" width="40" label=""></el-table-column>-->
        <el-table-column prop="id" label="ID" width="40"></el-table-column>
        <el-table-column prop="name" label="航路名称"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit" @click="viewClick(scope,'path')" style="margin-right: 10px;">编辑</el-button>
<!--            <el-button type="text" size="mini" icon="el-icon-edit" @click="editClick(scope,'path')"-->
<!--                       style="margin-right: 10px;"></el-button>-->
            <el-popconfirm @confirm="deleteClick(scope,'path')" title="确定删除该条航路吗？">
              <el-button slot="reference" type="text" size="mini" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="point-list-box" v-if="visible.detail">
      <div class="header">
        <i class="el-icon-back back" @click="backClick">返回 |</i><el-input v-model="dialogData.name" size="mini" style="width:200px;" placeholder="请输入航路名称"></el-input>
      </div>
      <div style="font-size: 12px;color: red;margin-bottom: 6px;" v-show="type==='draw'">提示：鼠标左键单击为选择,鼠标右键单击为结束</div>
      <el-table ref="pointTable" :data="pointArr"
                highlight-current-row style="width: 100%" height="55vh" border class="point-table"
                size="mini" empty-text="NO DATA" key="2">
        <el-table-column type="index" width="40" label=""></el-table-column>
        <el-table-column prop="lon" label="LON" min-width="100">
          <template slot-scope="scope">
            <el-input-number :controls="false" size="mini" v-model="scope.row.lon" @change="inputChange"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="lat" label="LAT" min-width="100">
          <template slot-scope="scope">
            <el-input-number :controls="false" size="mini" v-model="scope.row.lat" @change="inputChange"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="deep" label="deep">
          <template slot-scope="scope">
            <el-input-number :controls="false" size="mini" v-model="scope.row.deep" @change="inputChange"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="operate" align="center" class-name="operate-cell" width="60">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-circle-plus-outline"
                       @click="addClick(scope,'point')" style="margin-right: 10px;"></el-button>
            <!--<el-button type="text" size="mini" icon="el-icon-edit" @click="editClick(scope,'point')"></el-button>-->
            <el-popconfirm @confirm="deleteClick(scope,'point')" title="确定删除该航路点吗？">
              <el-button slot="reference" type="text" size="mini" icon="el-icon-delete"></el-button>
            </el-popconfirm>
            <!--<el-button type="text" size="mini" icon="el-icon-delete" @click="deleteClick(scope,'point')"></el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 12px;">
        <el-button icon="el-icon-close" size="small" @click="backClick">取消</el-button>
        <el-button type="success" icon="el-icon-check" size="small" @click="tableSubmit">提交</el-button>
      </div>
    </div>
<!--    <el-dialog title="EDIT" :visible.sync="visible.point" width="30%" class="point-dialog" append-to-body-->
<!--               :close-on-click-modal="false">-->
<!--      <el-form :inline="true" :model="pointForm" class="point-form" ref="pointForm">-->
<!--        <el-form-item label="LON:" prop="x" :rules="[{ required: true,message: 'LON cannot be empty'}]"-->
<!--                      label-width="80px">-->
<!--          <el-input-number v-model="pointForm.x" :controls="false" size="small"></el-input-number>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="LAT:" prop="y" :rules="[{ required: true,message: 'LAT cannot be empty'}]"-->
<!--                      label-width="80px">-->
<!--          <el-input-number v-model="pointForm.y" :controls="false" size="small"></el-input-number>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div style="text-align: center">-->
<!--        <el-button @click="visible.point = false" size="mini">cancel</el-button>-->
<!--        <el-button type="primary" @click="pointSubmitClick('pointForm')" size="mini">submit</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
<!--    <edit-add-dialog v-if="visible.common" :isShow.sync="visible.common" :data="dialogData" :config="dialogConfig"-->
<!--                     @formSubmit="formSubmit">-->
<!--    </edit-add-dialog>-->
  </div>
</template>

<script>
import {getPathDraw} from "@/util/map/route.js"
import {updatePathApi,deletePathApi} from "@/api/seamap.js"
import {mapState} from 'vuex'

export default {
  name: "route",
  // components: {
  //   editAddDialog: () => import("@/views/main/seaMap/editAddDialog")
  // },
  props:{
    pathData:{
      type: Array,
      default:()=>[]
    }
  },
  data() {
    return {
      DynamicSymbolType: {
        none: 0, //无状态
        drawPoint: 1, //绘制点
        drawLine: 2, //绘制线
        drawFace: 3, //绘制面
        drawRect: 4, //绘制矩形
        drawCircle: 5,//绘制圆
        measureDist: 6, //测距
        measureArea: 7, //测面积
        directionLine: 8,//方位线
        drawLineArea: 9,  //绘制线区域
        drawSector: 10  //绘制扇区
      },
      pointForm: {
        order: null,
        x: null,
        y: null
      },
      visible: {
        point: false,
        common: false,
        detail: false
      },
      pointArr:[],
      dialogConfig: {},
      dialogData: {},
      type:null
    }
  },
  computed: {
    ...mapState({
      compositeLayerPos: state => state.map.compositeLayerPos,
      compositeStylePos: state => state.map.compositeStylePos
    }),
    pointResArr() {
      return this.pointArr.filter(item => {
        return item.lat && item.lon
      });
    }
  },
  methods: {
    //绘制图形
    DrawDynamicSymbol(type) {
      // ClearDrawObjTextInfo();
      API_SetCurDrawDynamicUseType(type);
    },
    //动态绘制物标时，选中点之后返回的坐标
    // objDynamicInfo:格式例如 {type:2,po:{x:1210000000,y:10000000},uuid:'ad919ad5-8b5b-e736-b7da-5be7e9027d44',curPo:undefined}
    ReturnDrawDynamicObjNewInfo(objDynamicInfo, curGeoPoInfo) {
      // console.log(objDynamicInfo, 111, curGeoPoInfo)
      if (objDynamicInfo) {
        this.GetCurDrawObjCurPo(objDynamicInfo.po.x, objDynamicInfo.po.y);
      } else if (curGeoPoInfo) { //动态绘制信息框(线物标和面物标)
        switch (curGeoPoInfo.type) {
          case this.DynamicSymbolType.drawLine: //绘制线
            // ShowCurDrawLineObjInfoBox(curGeoPoInfo.po, curGeoPoInfo.bEndDraw);
            break;
        }
      }
    },
    //得到动态绘制物标(点、线、一般面)时，最后一个点坐标
    GetCurDrawObjCurPo(geoPoX, geoPoY) {
      // console.log(geoPoX, geoPoY)
      this.pointArr.push({lon: parseInt(geoPoX), lat: parseInt(geoPoY)})
    },
    ReturnOnMouseRightDown(objInfo){
      // console.log(objInfo,'ReturnEditObjByMouseRightDown')
      this.getLineView();
      this.DrawDynamicSymbol(0);
    },
    //清空图形
    reset() {
      this.clearLineView();
      window.ReturnDrawDynamicObjNewInfo = null;
      window.ReturnOnMouseRightDown=null;
    },
    viewClick({$index, row}, type) {
      this.type=type;
      this.dialogData = row;
      // console.log(row);
      this.pointArr=this.dialogData.path;
      this.visible.detail = true;
    },
    addClick({$index, row}, type) {
      this.type=type;
      if (type === 'path') {
        this.dialogData = {name: ""};
        this.pointArr=[{lon: null, lat: null,deep:null}];
        this.visible.detail=true;
        // this.dialogConfig = Object.assign({}, this.pathConfig);
        // this.dialogConfig.title = {name: "新增航路", value: "add"};
        // this.visible.common = true;
      } else if (type === 'point') {
        this.pointArr.splice($index + 1, 0, {lon: null, lat: null,deep:null});
      }else if(type==='draw'){
        this.dialogData = {name: ""};
        this.pointArr=[];
        this.visible.detail = true;
        this.DrawDynamicSymbol(2);//启动手动绘制功能
      }
    },
    editClick({$index, row}, type) {
      this.type=type;
      // if (type === 'path') {
      //   this.dialogData = row;
      //   this.dialogConfig = Object.assign({}, this.pathConfig);
      //   this.dialogConfig.title = {name: "修改航路", value: "edit"};
      //   this.visible.common = true;
      // } else if (type === 'point') {
      //   this.visible.point = true;
      //   this.pointForm = {
      //     ...row,
      //     order: $index
      //   };
      // }
    },
    deleteClick({$index, row}, type) {
      this.type=type;
      if (type === 'path') {
        deletePathApi({id:row.id}).then(res=>{
          this.$message.success('删除成功！')
          this.$emit('pathEvent');
        })
      } else if (type === 'point') {
        if (this.pointArr.length === 1) {
          this.pointArr = [{lon: null, lat: null,deep:null}]
        } else {
          this.pointArr.splice($index, 1);
        }
        this.getLineView();
      }
    },
    inputChange(){
      this.getLineView();
    },
    // pointSubmitClick(formName) {
    //   this.$refs[formName]?.validate((valid) => {
    //     if (valid) {
    //       let {order, x, y} = this.pointForm;
    //       this.$set(this.pointArr, order, {x, y});
    //       this.getLineView();
    //       this.visible.point = false;
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    tableSubmit() {
      if(!this.dialogData.name){
        this.$message.warning('请输入航路名称！');
        return false
      }
      let path =this.pointResArr.map(item=>{
        return{
          deep:item.deep || 0,
          loc:[(item.lat),(item.lon)]
        }
      })
      let data=Object.assign({},this.dialogData,{path});
      // console.log(data)
      if(!data.id){
        data.id=null;
      }
      updatePathApi(data).then(()=>{
       this.$message.success('保存成功');
       this.visible.detail=false;
       this.$emit('pathEvent')
      })
    },
    backClick() {
      this.visible.detail = false;
      this.clearLineView();
    },
    // //公用弹框表单提交
    // formSubmit(params) {
    //   console.log('formSubmit', params)
    //   const formName = this.dialogConfig.title.value;
    //   if (formName === "edit") {
    //     // MentEdit(params).then(res => {
    //     //   this.dealResponse("edit", res);
    //     // });
    //   } else if (formName === "add") {
    //     // MentAdd(params).then(res => {
    //     //   this.dealResponse("add", res);
    //     // });
    //   }
    // },
    getLineView() {
      let id = this.dialogData.id ?? 999;
      let {compositeLayerPos,compositeStylePos}=this;
      getPathDraw(this.pointResArr,id,{compositeLayerPos,compositeStylePos},this.dialogData.name)
    },
    clearLineView(){
      this.pointArr=[];
      this.getLineView();
      API_SetCurDrawDynamicUseType(0) //0=结束绘制动态标绘
    }
  },
  mounted() {
    window.ReturnDrawDynamicObjNewInfo = this.ReturnDrawDynamicObjNewInfo;
    window.ReturnOnMouseRightDown=this.ReturnOnMouseRightDown;
    // this.getLineView();
  },
  beforeDestroy() {
    this.reset();
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}
::v-deep .el-table__body-wrapper.is-scrolling-none{
  height: 60vh!important;
}

::v-deep .operate-cell > .cell {
  padding: 0 !important;

  .el-button--text:hover {
    background: #409EFF;
    color: #fff;
  }
}

::v-deep .el-table__header-wrapper .el-table__header thead tr > th {
  background: #f5f7fa !important;
  //border-right: ;
}

.path-list-box {
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  ::v-deep .el-button [class*=el-icon-]+span{
    margin-left: 0;
  }
}

.point-list-box {
  .header {
    font-size: 12px;
    display: flex;
    height: 30px;
    line-height: 30px;
    margin-bottom: 6px;
    .back {
      cursor: pointer;
      font-weight: bold;
      height: 30px;
      line-height: 30px;
      margin-right: 4px;
      &:hover {
        color: #00a1d6;
      }
    }
  }

  .point-table {
    ::v-deep .el-input__inner {
      padding: 0 6px !important;
    }
    ::v-deep .el-input-number{
      width: 100%!important;
    }
  }
}
</style>