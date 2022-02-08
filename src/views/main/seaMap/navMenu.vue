<template>
  <div class="nav-menu">
<!--    <div class="menu-btn" @click="attentionClick('attention')"><i class="el-icon-star-on"></i>我的关注</div>-->
<!--    <div class="menu-btn" @click="schedulerClick('scheduler')"><i class="el-icon-time"></i>排期管理</div>-->
<!--    <div class="menu-btn" @click="meetClick('meet')"><i class="el-icon-warning"></i>会遇列表</div>-->
<!--    <div class="menu-btn" @click="pathClick('path')"><i class="el-icon-edit-outline"></i>航路管理</div>-->
    <div class="menu-btn" v-for="(item,index) in menuConfig" :key="index" @click="menuClick(item)">
      <i :class="item.icon"></i>{{item.name}}
      <i class="icon-point" v-if="item.key==='shipFilter' && !isTypeConfig"></i>
    </div>
    <el-drawer :modal="true" :title="titleObj.name" :visible.sync="visible.drawer" direction="btt" append-to-body class="nav-drawer" :wrapperClosable="false" destroy-on-close>
      <Scheduler v-if="type==='scheduler'"></Scheduler>
    </el-drawer>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "navMenu",
  components:{
    // Scheduler:()=>import('@/views/main/seaMap/menu/testScheduler')
    Scheduler:()=>import('@/views/main/seaMap/menu/scheduler')
  },
  data() {
    return {
      visible:{
        drawer:false
      },
      type:"",
      menuConfig:[
        {
          name:"我的关注",
          key:"attention",
          icon:"el-icon-star-on",
          openType:"card"
        },
        {
          name:"筛选",
          key:"shipFilter",
          icon:"el-icon-s-open",
          openType:"card"
        },
        {
          name:"排期管理",
          key:"scheduler",
          icon:"el-icon-time",
          openType:"draw"
        },
        // {
        //   name:"会遇列表",
        //   key:"meet",
        //   icon:"el-icon-warning",
        //   openType:"card"
        // },
        {
          name:"航路管理",
          key:"path",
          icon:"el-icon-s-promotion",
          openType:"card"
        }
      ],
    }
  },
  computed:{
    titleObj(){
      return this.menuConfig.find(x=>x.key===this.type) ?? {name:"",key:"",icon:"",openType:""};
    },
    ...mapState({
      types: state => state.map.types,
    }),
    isTypeConfig(){
      let {status,speed} = this.types;
      return status.length===16 && speed.length===2;
    }
  },
  methods: {
    menuClick(item){
      let {key:type,openType} =item;
      this.type=type;
      if(openType==='card'){
        this.$emit('navEvent',this.titleObj);
      }else{
        this.visible.drawer=true;
      }
    },
  }
}
</script>

<style scoped lang="scss">
.nav-menu {
  position: fixed;
  z-index: 2;
  left: 200px;
  bottom: 0;
  overflow: hidden;
  width: calc(100vw - 400px);
  background: #fff;
  border-radius: 4px 4px 0 0;
  display: flex;
  .menu-btn{
    background: #fff;
    font-size: 12px;
    color: #333;
    padding: 0 10px;
    cursor: pointer;
    height: 36px;
    line-height: 36px;
    border-left: 1px solid #eee;
    position: relative;
    i{
      font-size: 12px;
      margin-right: 4px;
    }
    &:hover{
      color: #409EFF;
    }
    .icon-point{
      position: absolute;
      height: 6px;
      width: 6px;
      padding: 0;
      top: 4px;
      right: 0;
      border-radius: 50%;
      background-color: #f56c6c;
      border: 1px solid #fff;
    }
  }
  .menu-btn:nth-child(1){
    border-left: 0;
  }
}
.nav-drawer{
  ::v-deep .el-drawer{
    width:100vw!important;
  }
  ::v-deep .el-drawer__container.el-drawer__open>div{
    height: auto!important;
  }
  ::v-deep .el-drawer__header{
    margin-bottom: 0;
    padding: 12px;
    border-bottom: 1px solid #eee;
  }
  ::v-deep .el-drawer__body{
    padding: 20px;

  }
}
</style>