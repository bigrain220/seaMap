<template>
<div class="attention-box">
  <el-table :data="list" style="width: 100%" size="mini">
    <el-table-column prop="shipName" label="船名">
      <template slot-scope="{row}">
        <div @click="attentionClick(row&&row.shipMMSI)" style="cursor: pointer;">
          <span v-if="row&&row.shipName">{{row.shipName}}</span>
          <span v-else>MMSI：{{row.shipMMSI}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="80" align="center">
      <template slot-scope="{row}">
        <el-popconfirm @confirm="delClick(row&&row.shipMMSI)" title="确定要取消关注该船舶？">
          <el-button slot="reference" type="text" size="mini" icon="el-icon-delete"></el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
<!--    <div v-for="(item,index) in list" :key="index">-->
<!--      <span @click="attentionClick(item.shipId)">{{item.shipName}}</span>-->
<!--      <i class="el-icon-delete" @click="delClick(item.shipId)"></i>-->
<!--    </div>-->
<!--  <div v-if="list.length===0">-->
<!--    <el-empty description="暂无数据"></el-empty>-->
<!--  </div>-->
</div>
</template>

<script>
import {delAttentionApi} from "@/api/seamap";

export default {
  name: "attention",
  props:{
    attentionData:{
      type:Array,
      default:()=>[]
    }
  },
  data() {
    return {

    }
  },
  computed:{
    list(){
      return this.attentionData.map(item=>{
        let iShipPos = API_GetShipPosById(item.mmsi);
        return Object.assign(item,API_GetShipInfoByPos(iShipPos),{shipMMSI:item.mmsi});
      })
    }
  },
  methods:{
    attentionClick(shipId){
      let iShipPos = API_GetShipPosById(shipId);
      if(iShipPos===-1){return false}
      API_SetSelectShipByPos(iShipPos);
      let curShipInfo = API_GetShipInfoByPos(iShipPos);
      let {shipGeoPoX,shipGeoPoY}=curShipInfo;
      API_SetMapLevel(12, {x:shipGeoPoX/10000000, y:shipGeoPoY/10000000});//设置当前显示的比例尺级别和中心点
      this.$emit('attentionEvent',curShipInfo);
      this.getCircleShip(curShipInfo);//获取会遇列表
    },
    delClick(shipMMSI){
        delAttentionApi({userId:"1",mmsi:shipMMSI}).then(()=>{
          this.$parent.$parent.getAttention();
          this.$message.success('取消关注成功!');
        });
    },
    getCircleShip(){

    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.attention-box{
  .del-btn{
    cursor: pointer;
    &:hover{
      color: #66b1ff;
    }
  }
}
</style>