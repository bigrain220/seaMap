<template>
  <div class="topHeaderContainer">
    <sub-badge :value="unreadMessageNum" :max="99" @click.native="clickInfo">
      <i class="el-icon-message-solid"></i>
    </sub-badge>
    <el-dropdown trigger="click" @command="handleCommand">
      <i class="el-icon-user-solid"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="logout">logout</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <audio
        src="~@/assets/audio/alarm.wav"
        webkit-playsinline="true"
        playsinline="true"
        style="display: none"
    ></audio>
  </div>
</template>

<script>
import {logout, refreshToken} from "@/network/request-api";
import {UNREAD_MESSAGE_NUM_CHANGE} from "@/store/mutations/mutations_type";
import subBadge from "@/components/common/subBadge";
import {deleteObj, getToken, removeToken, setToken} from "@/util/content";

export default {
  name: "topHeader",
  components: {
    subBadge
  },
  data() {
    return {
      audio: null,
      warningSocket: null,
    }
  },
  computed: {
    unreadMessageNum() {
      return this.$store.state.user.unreadMessageNum;
    }
  },
  mounted() {
    this.audio = document.getElementsByTagName("audio")[0];
    //TODO 放开
    // this.warningSocket = warningSocket();
    // warningSocket.onmessage = this.onMessage;
    // this.refresh();
  },
  beforeDestroy() {
    // this.warningSocket.close();
    deleteObj(this.$data);
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout();
          break;
        case 'profile':
          break;
        default:
          return;
      }
    },
    logout() {
      let _this = this;
      logout().then((data) => {
        removeToken();
        _this.$message.info('登出成功');
        console.log(data);
      })
    },
    /**
     * 点击信息事件
     */
    clickInfo() {
      this.$router.replace("/aside/warnList");
    },
    /**
     * 刷新token
     */
    refresh() {
      let _this = this;
      let tokenInterval;
      let refreshInterval;
      //每隔5秒查一下有没有token
      tokenInterval = setInterval(() => {
        let token = getToken();
        //若有token 则不再每5秒查一次 改为每3分钟刷新一下token
        if (token) {
          //停止检查
          clearInterval(tokenInterval);
          //每3分钟刷新token
          refreshInterval = setInterval(() => {
            refreshToken().then((data) => {
              let userName = data.user.username;
              let token = data.token;
              setToken(userName, token);
            })
          }, 3 * 60 * 1000);
        }
      }, 5000);
    },

    onMessage(msg) {
      let _this = this;
      let wd = JSON.parse(msg.data);
      if (wd.flag === 'WARN' || wd.flag === 'ALERT') {
        //  info / warning / danger
        _this.$message.error(_this.warningMessage(wd));
        try {
          _this.audio.play();
        } catch (e) {
        }
        let num = _this.$store.state.user.unreadMessageNum;
        _this.$store.commit(UNREAD_MESSAGE_NUM_CHANGE, num + 1);
      }
    },

    /**
     * 根据类型来决定显示警告信息
     * @param warningJson
     * @return {string}
     */
    warningMessage(warningJson) {
      let warnType = (flag) => {
        return flag === 'WARN' ? '警告' : '预警';
      };
      let message;
      switch (warningJson.serviceType) {
        case 'visibility':
          message = `能见度${warnType(warningJson.send.viewAbleFlag)}：${warningJson.send.viewAble.toFixed(2)}`;
          break;
        case 'wind':
          message = `风速${warnType(warningJson.send.flag)}: ${warningJson.send.speed}`;
          break;
        case 'humidity':
          message = `湿度${warnType(warningJson.flag)}：${warningJson.send.humidity.toFixed(3)}`;
          break;
        case 'temperature':
          message = `温度${warnType(warningJson.flag)}：${warningJson.send.temperature}`;
          break;
        case 'tide':
          message = `潮汐高度${warnType(warningJson.flag)}：${warningJson.send.height}`;
          break;
        case 'pressure':
          message = `大气压强${warnType(warningJson.flag)}：${warningJson.send.pressure.toFixed(3)}`;
          break;
        case 'wave':
          message = `波浪${warnType(warningJson.flag)}`;
          break;
        case 'current':
          message = `层流${warnType(warningJson.flag)}`;
          break;
        default:
          break;
      }
      return message;
    }
  }
}
</script>

<style scoped>
.topHeaderContainer {
  display: flex;
  flex-direction: row-reverse;
  /*align-items: center;*/
}

.el-dropdown {
  order: 0;
}

.el-badge {
  order: 1;
  margin-right: 20px;
}

.el-badge:hover {
  cursor: pointer;
}

</style>