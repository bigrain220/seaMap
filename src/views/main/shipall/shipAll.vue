<template>
  <div class="ship-all" onselectstart="return false;">
    <div class="top-header">
      <el-row type="flex" class="row-bg" justify="space-between" align="middle">
        <el-col :xs="0" class="top-1">
          <svg @click="logoEvent" class="brand-logo" viewBox="0 0 148.83 34.01">
            <path
              d="M110.06,25.25c0-4.16,0-8.45-.06-12.68a5.9,5.9,0,0,0-5.84-5.68h-6.4A6.07,6.07,0,0,0,92,13.23v18c0,1.06,0,1.67.37,2.06s.94.45,2.1.45h2.33a1.83,1.83,0,0,0,1.38-.47,1.86,1.86,0,0,0,.45-1.44v-8a4.16,4.16,0,0,1,.08-1.45,5.4,5.4,0,0,1,1.79-.12h2.12a1.05,1.05,0,0,1,.75.17,1.11,1.11,0,0,1,.19.79V31c0,1.1-.13,1.74.38,2.23s1.35.49,3.35.49h.91a1.7,1.7,0,0,0,.45,0,1.67,1.67,0,0,0,1.44-1.89Zm-6.57-7.47a.82.82,0,0,1-.53.6,1.79,1.79,0,0,1-.86,0h-1.6a4.76,4.76,0,0,1-1.68-.12,4.55,4.55,0,0,1-.1-1.56V14.47a17,17,0,0,1,0-1.75,2.46,2.46,0,0,1,2.35-2.23,2.33,2.33,0,0,1,2.42,2.1A37.46,37.46,0,0,1,103.49,17.78Z"
              transform="translate(-5.53 0)" />
            <path
              d="M38.92,7H33.34A6.3,6.3,0,0,0,27,13.29c-.13,5-.12,9.87,0,14.49.1,3.61,2.57,6,6.3,6.16q1.59.06,3,.06c1,0,1.91-.07,2.8-.08h.3a6.16,6.16,0,0,0,5.88-6.44V13.29A6.34,6.34,0,0,0,38.92,7Zm-.23,20.44c0,1.71-.93,2.78-2.4,2.84a2.49,2.49,0,0,1-1.86-.63,2.9,2.9,0,0,1-.81-2.09c-.08-4.5-.08-9.12,0-14.12a2.67,2.67,0,0,1,2.53-2.75l0-.11h0a2.76,2.76,0,0,1,2.5,3v9C38.69,24.21,38.72,25.73,38.69,27.44Z"
              transform="translate(-5.53 0)" />
            <path
              d="M67.93,6.93a1.76,1.76,0,0,0-1.4.46,2.33,2.33,0,0,0-.44,1.77V21c-.46-.39-.89-.73-1.19-1-2.13-1.88-4.28-3.93-6.37-5.88-2.32-2.17-4.71-4.4-7.14-6.57a1.66,1.66,0,0,0-1.74-.2,1.6,1.6,0,0,0-1,1.44V32a2.1,2.1,0,0,0,.48,1.46,1.75,1.75,0,0,0,1.32.46h0a1.88,1.88,0,0,0,1.36-.47A2,2,0,0,0,52.29,32V20.05l.26.19a12.67,12.67,0,0,1,1.15.9C55.78,23,57.93,25,59.93,27c2.21,2.13,4.49,4.35,6.75,6.35a2.17,2.17,0,0,0,.49.32,1.72,1.72,0,0,0,1.7-.06,1.74,1.74,0,0,0,.86-1.52v-23C69.74,8.22,69.74,6.93,67.93,6.93Z"
              transform="translate(-5.53 0)" />
            <path
              d="M12.19,13.06A2.34,2.34,0,0,1,14,10.75a5.06,5.06,0,0,1,6.1,2,2.3,2.3,0,0,0,2.61.62c.82-.37.72-1.51.72-1.85C23.16,9,20.93,7.12,17.93,7c-2.1-.08-4.21-.08-6.3,0h-.05a6.14,6.14,0,0,0-6,6.23V27.77a5.9,5.9,0,0,0,5.72,6.07c1,.1,2.09.1,3.09.1,1.37,0,2.73,0,4.08-.14a4.91,4.91,0,0,0,4.82-3.51c.22-.67.18-2.27-.54-2.67A2,2,0,0,0,21,27.45a2.14,2.14,0,0,0-1.24,1.37,2.17,2.17,0,0,1-2.25,1.39h-.94c-.68,0-1.37,0-2.06,0H14.3a2.24,2.24,0,0,1-2.11-2.35V13.06Z"
              transform="translate(-5.53 0)" />
            <path
              d="M129,30.53a1.72,1.72,0,0,0-1.34-.43h-2.22a29,29,0,0,0-3.23,0,1.72,1.72,0,0,1-1.25-.24,1.81,1.81,0,0,1-.3-1.3c0-5,.06-10.59,0-17.46V9.55c0-1.17.06-1.78-.38-2.24s-1.11-.46-2.56-.46h-1.47a2.28,2.28,0,0,0-1.72.51,2.19,2.19,0,0,0-.51,1.7V31.61a2.28,2.28,0,0,0,.49,1.65,1.7,1.7,0,0,0,1.34.46H127.7a1.86,1.86,0,0,0,.41,0,1.61,1.61,0,0,0,1.32-1.84A1.73,1.73,0,0,0,129,30.53Z"
              transform="translate(-5.53 0)" />
            <path
              d="M147,30.11h-2.31c-1.08,0-2.2-.05-3.3,0a1.52,1.52,0,0,1-1.08-.21,1.67,1.67,0,0,1-.27-1.19c0-5.46.05-11.17,0-17.46V9.65c0-1.21.06-1.86-.39-2.32s-1.13-.46-2.6-.46h-1.46a2.15,2.15,0,0,0-1.68.5,2.36,2.36,0,0,0-.52,1.75V31.65a2.16,2.16,0,0,0,.5,1.58,2,2,0,0,0,1.53.5l.06,0H147a1.89,1.89,0,0,0,1.35-.45,2,2,0,0,0,.47-1.47,1.72,1.72,0,0,0-.45-1.3A1.92,1.92,0,0,0,147,30.11Z"
              transform="translate(-5.53 0)" />
            <path
              d="M72.36,9.89c0,1,0,2.51,1.65,2.51H87.14a1.63,1.63,0,0,0,1.18-.4,3.11,3.11,0,0,0,.56-2.29,3.11,3.11,0,0,0-.54-2.31A1.63,1.63,0,0,0,87.12,7H74a1.54,1.54,0,0,0-1.14.36,2.91,2.91,0,0,0-.51,2.18Z"
              transform="translate(-5.53 0)" />
            <path
              d="M72.36,20.55c0,1,0,2.51,1.65,2.51H87.14a1.57,1.57,0,0,0,1.18-.45,3.1,3.1,0,0,0,.56-2.32,3.09,3.09,0,0,0-.54-2.3,1.55,1.55,0,0,0-1.22-.4H74a1.58,1.58,0,0,0-1.17.41,2.91,2.91,0,0,0-.48,2.2Z"
              transform="translate(-5.53 0)" />
            <path
              d="M88.37,29a1.55,1.55,0,0,0-1.22-.4H78.83c-1.57,0-3.19.05-4.79,0a1.5,1.5,0,0,0-1.17.41,2.91,2.91,0,0,0-.51,2.18v.34c0,1,0,2.51,1.65,2.51H87.14a1.57,1.57,0,0,0,1.21-.42,3.1,3.1,0,0,0,.56-2.32A3.09,3.09,0,0,0,88.37,29Z"
              transform="translate(-5.53 0)" />
            <path
              d="M149.16,0a5.19,5.19,0,1,0,5.19,5.19A5.19,5.19,0,0,0,149.16,0ZM152,8.1a4.91,4.91,0,0,1-.14-.84,2.88,2.88,0,0,0-.07-.59,2.05,2.05,0,0,0-.16-.41,1.11,1.11,0,0,0-.32-.4,2,2,0,0,0-.53-.27,1.6,1.6,0,0,0,.71-.42A1.85,1.85,0,0,0,152,3.82a1.49,1.49,0,0,0-.19-.77,1.3,1.3,0,0,0-.52-.57,3.36,3.36,0,0,0-1.74-.32h-2.94v6h1.27V5.9h1a1.9,1.9,0,0,1,1,.18,1,1,0,0,1,.42.43,2.17,2.17,0,0,1,.18.8,4.86,4.86,0,0,0,.14.85H152a4.07,4.07,0,0,1-6.88-2.95v0A4.08,4.08,0,1,1,152,8.1ZM150.53,4a.77.77,0,0,1-.26.7,1.17,1.17,0,0,1-.64.13h-1.77l0-1.58h1.77a1.4,1.4,0,0,1,.5.06A.64.64,0,0,1,150.53,4Z"
              transform="translate(-5.53 0)" />
          </svg>
        </el-col>
        <el-col :xs="24" class="top-2">
          <div class="top-center">
            <svg width="768" height="60">
              <polyline fill="transparent" stroke="#957b6c" stroke-width="3" points="0,12 138.24,12 153.60000000000002,24 192,24 207.36,36 552.96,36 576,24 614.4000000000001,24 629.76,12 768,12">
                <animate attributeName="stroke-dasharray" attributeType="XML" from="0, 391.66653108874107, 0, 391.66653108874107" to="0, 0, 783.3330621774821, 0" dur="3.2s" begin="0s"
                  calcMode="spline" keyTimes="0;1" keySplines="0.4,1,0.49,0.98" repeatCount="indefinite"></animate>
              </polyline>
              <polyline fill="transparent" stroke="#957b6c" stroke-width="2" points="230.39999999999998,48 537.5999999999999,48">
                <animate attributeName="stroke-dasharray" attributeType="XML" from="0, 153.59999999999997, 0, 153.59999999999997" to="0, 0, 307.19999999999993, 0" dur="3.2s" begin="0s"
                  calcMode="spline" keyTimes="0;1" keySplines=".4,1,.49,.98" repeatCount="indefinite"></animate>
              </polyline>
            </svg>
            <div class="title">镇海炼化靠泊辅助监控系统</div>
          </div>
        </el-col>
        <el-col :xs="0" class="top-3">
          <div class="top-btn">
            <div v-if="$route.path==='/shipall/shippage'">
              <router-link :to="{ path: '/shipall/shipcontrol' }" style="color:#fff;font-size:1.5rem;">
                <!-- <span class="el-icon-data-line" title="历史回放与报表"></span> -->
                <el-tooltip class="item" effect="light" content="历史回放与报表" placement="top-start">
                  <span class="el-icon-data-line"></span>
                </el-tooltip>
              </router-link>
            </div>
            <div v-else-if="$route.path==='/shipall/shipcontrol'">
              <router-link :to="{ path: '/shipall/shippage' }" style="color:#fff;font-size:1.5rem;">
                <el-tooltip class="item" effect="light" content="返回首页" placement="top-start">
                  <span class="el-icon-s-home"></span>
                </el-tooltip>
              </router-link>
            </div>
            <div class="logout-box">
              <logout></logout>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { dockingWebSocket, environmentWebsocket } from "@/network/websocketList";
import { keepDecimal } from "@/util/content";
import { arrayLimit } from "@/util/common";
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    logout: () => import('@/views/main/shipall/shipLogout')
  },
  data() {
    return {
      dockingWebSocket: undefined,
      environmentWebsocket: null,
      // envConfig: [
      //   {
      //     berth: '2#',
      //     srv: 2,
      //     type: 'wind'
      //   },
      //   {
      //     berth: '6#',
      //     srv: 4,
      //     type: 'wind'
      //   },
      //   {
      //     berth: '7#',
      //     srv: 5,
      //     type: 'wind'
      //   },
      //   {
      //     berth: '',
      //     srv: '3',
      //     type: 'tide'
      //   }
      // ],
      tideValueArray: [],//当天的潮汐值，到第二天清空
    }
  },
  computed: {
    ...mapState({
      berths: state => state.berth.berths,
      tide: state => state.env.tide,
      wind: state => state.env.wind,
      windArr: state => state.env.windArr,
      berthStatus: state => state.berth.status,
    }),
    ids() {
      return Object.values(this.berthStatus).map(item => item.vessel);
    },

  },
  watch: {
    ids: {
      handler(newValue) {
        if(newValue.length!==Object.keys(this.berths).length){
          return false;
        }
        let arr=newValue.filter(x=>x!=null)
        arr.map(id => {
            this.$store.dispatch('vessel/loadVessel', { id });
        })
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('timeout', [
      'timeStart', // -> this.timeStart(),
    ]),
    handleCommand(i) {
      this.$router.push({ path: '/shipall/shipcontrol' })
    },
    setComponentData(componentRefStr, obj) {
      this.$refs[componentRefStr]?.setData(obj);
    },
    logoEvent(){
      this.$router.push('/shipall')
    },
    // envEvents() {
    //   // tide
    //   let tideSrv = this.envConfig.find(x => x.type === 'tide')?.srv
    //   let tide = this.tide[tideSrv];
    //   tide ? this.tideHandler(tide.time, tide) : "";
    //   // wind
    //   // console.log(this.wind,'wind')
    //   let keys = Object.keys(this.wind);
    //   keys.map(item => {
    //     let windObj = this.envConfig.find(x => x.type === 'wind' && x.srv === item);
    //     let wind = this.wind[item];
    //     windObj ? this.windHandle(wind.time, { ...wind, ...windObj }) : "";
    //   })
    // },
    // //处理潮汐数据
    // tideHandler(traceTime, message) {
    //   let { height, tendency } = message;
    //   height = keepDecimal(height);
    //   const hour = new Date(traceTime - 0).getHours() + '';
    //   this.tideValueArray = arrayLimit(this.tideValueArray, [hour, height], 24);
    //   this.setComponentData('tide', { tideValue: this.tideValueArray, tideFlag: tendency });
    // },
    // //处理风力风向数据
    // windHandle(traceTime, receivedMsg) {
    //   let obj = {
    //     speed: receivedMsg.spd,
    //     direct: receivedMsg.dir,
    //     flag: receivedMsg.flag,
    //     berth: receivedMsg.berth,
    //     time:traceTime-0
    //   }
    //   let { speed, direct, flag, berth,time } = obj;
    //   speed = keepDecimal(speed);
    //   direct = keepDecimal(direct);
    //   let val = this.windArr.find(x => x.name === berth);
    //   console.log(val)
    //   val ? val = Object.assign({}, val, { speed, dir: direct, flag ,time}) : "";
    //   // console.log(val,'val')
    //   this.setWindArrAction({ val });
    // },
  },
  created() {
    this.timeStart();
    this.$store.dispatch('berth/setup').then((berths) => {
      const socket = dockingWebSocket();
      socket.onopen = () => this.$store.dispatch('docking/onOpen', { socket, berths });
      socket.onmessage = (msg) => this.$store.dispatch('docking/onMessage', msg);
      this.dockingWebSocket = socket;
      // // 潮汐和风力风向数据 id: wind 2  tide 3
      // const envSocket = environmentWebsocket();
      // envSocket.onopen = () => this.$store.dispatch('env/onOpen', { socket: envSocket, id: [2, 3] });
      // envSocket.onmessage = (msg) => this.$store.dispatch('env/onMessage', msg).then(this.envEvents());
      // this.environmentWebsocket = envSocket;
    });
    this.$store.dispatch('env/setup').then((env) => {
      const socket = environmentWebsocket();
      socket.onopen = () => this.$store.dispatch('env/onOpen', {socket, id: env.map(e => e.id)});
      socket.onmessage = (msg) => this.$store.dispatch('env/onMessage', msg);
      this.environmentWebsocket = socket;
    });
  },
  beforeDestroy() {
    console.log('beforeDestroy 有效');
    this.dockingWebSocket.close();
    this.environmentWebsocket.close();
  }
}
</script>

<style lang="scss" scoped>
$headerHeight: 4.6rem;
.ship-all {
  width: 100%;
  min-width: 760px;
  height: 100vh;
  // height: 100%;
  position: relative;
  overflow: hidden;
  .top-header {
    position: fixed;
    width: 100%;
    z-index: 1;
    background: #2c3035;
    height: $headerHeight;
    .row-bg {
      padding: 0 20px;
    }

    .brand-logo {
      padding: 1rem 0 1rem 0;
      height: 2rem;
      cursor: pointer;
    }
    .brand-logo > path {
      fill: #fff;
    }
    .top-2 {
      display: flex;
      justify-content: center;
      .top-center {
        position: relative;
        text-align: center;
        background-color: #2c3035;
        svg {
          padding: 10px 0 0;
        }
        .title {
          position: absolute;
          color: #fff;
          line-height: 3rem;
          font-size: 1.6rem;
          font-weight: bold;
          top: 0;
          left: calc(50% - 154px);
        }
      }
    }
    .top-3 {
      padding-right: 30px;
      .top-btn {
        right: 3rem;
        height: $headerHeight;
        line-height: $headerHeight;
        display: flex;
        justify-content: flex-end;
        .logout-box {
          margin-left: 10px;
        }
      }
    }
  }
}
@media only screen and (max-width: 1024px) {
  .top-1 {
    display: none;
  }
  .top-3 {
    display: none;
  }
}
@media only screen and (min-width: 1024px) {
  .top-1 {
    display: block;
  }
  .top-3 {
    display: block;
  }
  .logout-box {
    display: none;
  }
}
@media only screen and (min-width: 1200px) {
  .logout-box {
    display: block;
  }
}
</style>
