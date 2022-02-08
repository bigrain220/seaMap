<template>
    <div>
        <div class="operation">
            <i class="el-icon-s-operation" @click="showOrCloseNavMenuDrawer" v-if="!$store.state.asideVisible"></i>
        </div>
        <nav-menu-drawer/>
        <el-container style="height: 100vh">
            <el-aside width="12rem" v-if="$store.state.asideVisible">
                <nav-menu/>
            </el-aside>
            <el-container>
                <el-header height="2%">
                    <top-header style="width: 100%" />
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
                <el-footer height="2%">Footer</el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>
  import NavMenu from "@/views/aside/NavMenu";
  import NavMenuDrawer from "@/views/aside/NavMenuDrawer";
  import {CHANGE_NAV_MENU_DRAWER_VISIBLE} from "@/store/mutations/mutations_type";
  import topHeader from "@/views/header/topHeader";

  export default {
    name: "mainLayout",
    components: {
      topHeader,
      NavMenu,
      NavMenuDrawer
    },
    methods: {
      //打开或关闭侧边栏抽屉
      showOrCloseNavMenuDrawer() {
        this.$store.commit(CHANGE_NAV_MENU_DRAWER_VISIBLE, !this.$store.state.navMenuDrawerVisible);
      }

    }
  }
</script>

<style scoped>
    .operation {
        position: fixed;
        top: 0;
        left: 0;
        font-size: 28px;
    }

    .operation:hover {
        cursor: pointer;
        background-color: rgba(0,0,0,0.1);
    }

    .el-aside {
        background-color: #aeff00;
    }

    .el-header {
        background-color: yellow;
    }

    .el-main {
        background-color: rgba(116, 228, 196, 0.35);
    }

    .el-footer {
        background-color: wheat;
    }
</style>
