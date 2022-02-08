<template>
  <div class="ship-manage">
    <el-tabs v-model="activeName">
      <el-tab-pane label="HISTORY REPLAY" name="0">
        <div class="views-0">
          <historyPlayBack></historyPlayBack>
        </div>
      </el-tab-pane>
      <el-tab-pane label="REPORT" name="1">
        <div class="views-0">
          <reportGeneration></reportGeneration>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  components: {
    historyPlayBack: () => import("@/views/main/shipall/shipControlPages/historyPlayBack.vue"),
    reportGeneration: () => import("@/views/main/reportGeneration")
  },
  data() {
    return {
        activeName: '0'
    }
  },
  mounted(){
    
  },
  created(){

  }
}
</script>

<style lang="scss">
.ship-manage {
  padding:70px 20px 0 20px;
  .views-0 {
    height: calc(100vh - 140px);
    overflow: hidden;
  }
  .el-tabs__item {
    color: #fff;
  }
  .el-tabs__item.is-active {
    color: #409eff;
  }
}
</style>