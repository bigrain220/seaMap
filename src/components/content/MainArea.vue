<template>
  <div class="main-area">
    <el-menu
        :default-active="activeName"
        mode="horizontal"
        class="home-nav"
        @select="handleSelect"
    >
      <el-menu-item index="/home/ad">
        <i class="el-icon-s-home">Approach/Departure</i>
      </el-menu-item>
      <el-menu-item index="/home/mlms">
        <i class="el-icon-data-analysis">MLMS</i>
      </el-menu-item>
      <el-menu-item index="/home/env">
        <i class="el-icon-cloudy-and-sunny">ENV</i>
      </el-menu-item>
    </el-menu>
    <div class="main-body">
      <transition>
        <keep-alive>
          <router-view class="home-body"/>
        </keep-alive>
      </transition>
      <!--    菜单    -->
      <home-menu class="home-menu" @show="show"/>
    </div>
  </div>


</template>

<script>
import HomePanel from "@/components/content/HomePanel";
import HomeModule from "@/components/content/HomeModule";
import Home from "@/views/main/Home";
import HomeMenu from "@/components/content/HomeMenu";

export default {
  name: "MainArea",
  components: {HomeMenu, Home, HomeModule, HomePanel},
  data() {
    return {
      activeName: '/home/env'
    };
  },
  methods: {
    handleSelect(key) {
      this.$router.push(key);
      this.activeName = key
      console.log(key);
    },
    show(data) {
      this.handleSelect(data);
    }
  },
  mounted() {
    this.activeName = this.$route.path
  }
}
</script>

<style scoped>

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-body {
  margin: 6px;
  flex: 1;
  display: flex;
  gap: 6px;
}

.home-nav {
  width: 100%;
  height: 8vh;
  min-height: 1.5em;
  max-height: 5rem;
  line-height: 5rem;
  background: #212327;
  color: #4e4f52;
  border: 0;
}

.home-nav  * {
  font-size: 1em !important;
}

.home-body {
  flex: 1;
}

.home-menu {
  width: 12rem;
}

* {
  min-height: 0;
}

.el-menu >>> .el-menu-item {
  text-align: center;
  width: 33.33%;
  height: 100%;
  line-height: 0;
  display: flex;
  align-items: center;
  color: #909399;
}

.el-menu >>> .el-menu-item > * {
  width: 100%;
}

.el-menu >>> .el-menu-item:active, .el-menu >>> .el-menu-item:focus, .el-menu >>> .el-menu-item:hover {
  color: #ffffff;
  background: #212327;
}

.el-menu >>> .el-menu-item.is-active {
  border-bottom: 4px solid #ffffff;
  color: #ffffff;
}

</style>