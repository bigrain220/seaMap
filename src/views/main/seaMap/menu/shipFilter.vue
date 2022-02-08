<template>
  <div class="filter-box">
    <div class="list">
      <div class="header">船舶状态</div>
      <div class="content">
        <el-checkbox-group v-model="statusList" class="check-box" @change="changEvent">
          <el-checkbox :label="index" v-for="(item,index) in statusDic" :key="index">{{ item }}</el-checkbox>
          <el-checkbox :label="-1">其它</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="list">
      <div class="header">船舶速度</div>
      <div class="content">
        <el-checkbox-group v-model="speedList" class="check-box" @change="changEvent">
          <el-checkbox :label="0">静止</el-checkbox>
          <el-checkbox :label="1">在航</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <!--<div class="list">-->
    <!--  <div class="header">船舶类型</div>-->
    <!--  <div class="content">-->
    <!--    <el-checkbox-group v-model="typeList" class="check-box" @change="changEvent">-->
    <!--      <el-checkbox :label="index" v-for="(item,index) in typeDic" :key="index">{{ item }}</el-checkbox>-->
    <!--    </el-checkbox-group>-->
    <!--  </div>-->
    <!--</div>-->
  </div>
</template>

<script>
export default {
  name: "shipFilter",
  props:{
    statusDic:{
      type:Array
    },
    typeDic:{
      type:Array
    }
  },
  data() {
    return {
      //默认全选 -1代表其它多个
      statusList:[0,1,2,3,4,5,6,7,8,-1],
      speedList: [0,1],
      //默认全选 1000代表其它
      typeList:[]
    }
  },
  methods: {
    changEvent(){
      // console.log(this.statusList,this.speedList)
      // console.log(this.typeList)
      let statusArr =[]
      if(this.statusList.includes(-1)){
        statusArr=[...this.statusList.slice(0,this.statusList.length-1),9,10,11,12,13,14,15]
      }else {
        statusArr=this.statusList;
      }
      this.$store.commit('map/setStatusTypes',statusArr);
      this.$store.commit('map/setSpeedTypes',this.speedList);
      this.$parent.$parent.viewShipData();
    },
    // handlerShip(){
    //   let statusList=this.statusList;
    //   let speedList=this.speedList;
    //   const count = API_GetShipsCount();
    //   let idArr=[];
    //   for (let i = 0; i < count; i++) {
    //     let info = API_GetShipInfoByPos(i);
    //     idArr.push(info.shipMMSI)
    //   }
    //   //删除会改变pos，所以要通过id去重新获取pos
    //   idArr.forEach((id,index)=>{
    //     const pos = API_GetShipPosById(id);
    //     const info = API_GetShipInfoByPos(pos);
    //     let iShipState=info.iShipState;
    //     let shipSpeed=info.shipSpeed;
    //     // console.log(iShipState,shipSpeed,index)
    //     //状态判断
    //     let isState = statusList.includes(iShipState);
    //     //速度判断
    //     const speedType = speedList?.[0] ?? 0;
    //     let isSpeed=true;
    //     if(speedList.length===1){
    //       if(speedType>0){
    //         isSpeed = shipSpeed>0;
    //       }else {
    //         isSpeed = shipSpeed===0;
    //       }
    //     }else if(speedList.length===0){
    //       isSpeed=false;
    //     }
    //     //总判断
    //     if(!isState || !isSpeed){
    //       API_DelOneShipByPos(pos);
    //       // API_ReDrawShips();
    //     }
    //   })
    //   API_ReDrawShips();
    // }
  }
}
</script>

<style lang="scss" scoped>
.filter-box {
  .list{
    .header{
      font-size: 12px;
      font-weight: bold;
      color: #666;
      margin: 5px;
      line-height: 24px;
    }
    .content{
      padding: 6px;
      border-bottom: 1px dashed #ddd;
      margin-bottom: 20px;
      .check-box{
        overflow: hidden;
        &>label{float: left;}
      }
    }
  }
}
::v-deep .el-checkbox-group label.el-checkbox{width: calc(50% - 30px)}
</style>