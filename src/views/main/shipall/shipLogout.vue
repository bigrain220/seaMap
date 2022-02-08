<template>
  <div>
    <!-- <el-dropdown>
      <span class="el-dropdown-link">
        <i class="el-icon-user" style="margin:0 6px 0 20px;" />{{ username }}
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="logoutVisible = true">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->
    <el-tooltip class="logout-btn" effect="light" content="退出登录" placement="top-start">
      <span class="el-icon-user" @click="logoutVisible = true">{{ username }}</span>
    </el-tooltip>
    <el-dialog title="警告" :visible.sync="logoutVisible" width="30%" append-to-body>
      <span>确认退出登录?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logoutVisible = false">取 消</el-button>
        <el-button type="primary" @click="logout">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUser, removeBerth, removeToken } from "@/util/content";
import { logout } from "@/network/request-api";
export default {
  data() {
    return {
      username: '未登录',
      logoutVisible: false,
    }
  },
  mounted() {
    let user = getUser();
    if (user) {
      this.username = user['user'];
    }
  },
  methods: {
    logout() {
      let _this = this;
      logout().then(() => {
        removeToken();
        removeBerth()
        _this.logoutVisible = false;
        _this.$router.push('/shiplogin')
      });
    }
  }
}
</script>
<style scoped lang="scss">
.el-dropdown {
  color: #fff;
}
.logout-btn{
    color: #fff;
    margin-left: 20px;
    cursor: pointer;
}
</style>