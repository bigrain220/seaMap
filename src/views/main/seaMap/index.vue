<template>
  <div class="map-main-home">
    <top-header/>
    <router-view></router-view>
  </div>
</template>

<script>
import topHeader from "@/views/main/seaMap/topHeader";
export default {
  name: "index",
  components: {topHeader},
  data(){
    return{

    }
  },
  beforeRouteEnter(to, from, next){
    const userName = localStorage.getItem('map_userName');
    if(userName){
      next()
    }else{
      next('/maplogin')
    }
  },
  mounted() {

  }
}
</script>

<style scoped lang="scss">
.map-main-home {
  height: 100vh;
  width: 100vw;
  position: relative;
  background: #fff;
  //overflow: hidden;
  header.home-head{
    //background: #0a278c;
  }
}
</style>