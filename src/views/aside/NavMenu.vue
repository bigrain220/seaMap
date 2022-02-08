<template>
    <div>
        <el-row class="tac">
            <el-col :span="24">
                <h5>{{$t("navMenu.title")}}</h5>
                <el-menu
                        :default-active="activeIndex"
                        class="el-menu-vertical-demo"
                        background-color="inherit"
                        :router=true
                >
                    <el-menu-item v-for="set in displaySetting"
                                  :key="set.path"
                                  :index="set.path"
                                  @click="changePath(set.path,set.menuVisible)"
                    >
                        <i :class="set.icon"></i>
                        <span slot="title">{{set.title}}</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import {CHANGE_ASIDE_VISIBLE, CHANGE_NAV_MENU_DRAWER_VISIBLE} from "@/store/mutations/mutations_type";
  import {deleteObj} from "@/util/content";

  export default {
    name: "NavMenu",
    data() {
      return {}
    },
    computed: {
      activeIndex: {
        get() {
          //  /aside/berthInfo
          return this.$route.path.split("/")[2]
        }
      },
      displaySetting: {
        get() {
          let setting = [];
          let visibilityMenu = this.$store.state.user.displayMenu;
          for (let menu of visibilityMenu) {
            let path = menu['path'];
            let item = {
              path: path,
              title: this.$t('navMenu.' + path),
              icon: menu['icon'],
              menuVisible: menu['menuVisible']
            };
            setting.push(item);
          }
          return setting;
        }
      }
    },
    beforeDestroy() {
      deleteObj(this.$data);
    },
    methods: {
      changePath(path, menuVisible) {
        //TODO 后面把这个aside写成灵活的
        this.$router.replace('/aside/' + path);
        this.$store.commit(CHANGE_ASIDE_VISIBLE, menuVisible);
      }
    }
  }
</script>

<style scoped>

</style>
