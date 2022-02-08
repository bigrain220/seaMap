<template>
  <div>
    <div class="fixed-footer" ref="fixedFooter">
      <span class="el-icon-ship" style="font-weight:bold;">上海永乾科技工程有限公司</span>
      <span>（CONEALL TECHNOLOGY & ENGINEERING CO., LTD）</span>
    </div>
    <div class="box">
      <img ref="mapWarp" class="mapWarp" src="../../../assets/img/shipBackground.jpg" alt="" style="width:100%;height:auto;position:relative;z-index:0;">
      <div class="point" v-for="(p,i) in points" :key="i" :style="{
          'width': `${p.point.width}px !important`,
          'transform':`translate(${p.point.x}px, calc(${p.point.y}px - 100%)) rotate(${p.point.r}deg)`,
        }">
<!--        <div class="vessel" v-if="berthStatus[p.id]&&berthStatus[p.id].vessel&& (now - berthStatus[p.id].time<=30000)">-->
        <div class="vessel" v-if="terminals[p.id] && (now - terminals[p.id].time<=30000)">
          <div :class="['point-container',activeI===p.id?'active-ship':'']"
            :style="{'transform':`translateY(${-getPixelDistence(vessel[p.id] && vessel[p.id].point.dis)}px) rotate(${vessel[p.id] && vessel[p.id].point.r}deg)`}" ref="ships" @click="doOneClick(p.id)"
            @dblclick="doDbClick(p.id)" onselectstart="return false;">
            <span style="color: #eee;position: absolute;bottom: 0;left:0;right:0;font-size: 1rem;" v-if="berthStatus[p.id] && berthStatus[p.id].vessel && vessels[berthStatus[p.id].vessel]">
              {{vessels[berthStatus[p.id].vessel].name}}
            </span>
            <div class="vessel-body" :style="{
              'width':`${getPixelDistence(getVesselBody(berthStatus[p.id].vessel) && getVesselBody(berthStatus[p.id].vessel).length)}px !important`,
              'height': `${getPixelDistence(getVesselBody(berthStatus[p.id].vessel) && getVesselBody(berthStatus[p.id].vessel).width)}px !important`}">
              <img src="../../../assets/img/vessel/OIL_L.svg" alt="" style="display:block;width:100%;height:100%;">
            </div>
            <div class="border border-one"></div>
            <div class="border border-two"></div>
            <div class="border border-three"></div>
            <div class="border border-four"></div>
          </div>
        </div>
        <div class="terminal">
          <div style="color:#fff;font-size: 1rem;">{{ p.name }}</div>
<!--           <el-popover placement="bottom-end" title="" trigger="hover" popper-class="wind-list">-->
<!--            <div slot>-->
<!--              <div>2# 东南风 09级</div>-->
<!--              <div>6# 东南风 09级</div>-->
<!--              <div>7# 东南风 09级</div>-->
<!--            </div>-->
<!--            <el-button type="text" slot="reference" class="wind-text">{{windShow}}</el-button>-->
<!--          </el-popover> -->
        </div>
      </div>
      <!-- 、、、 -->
    </div>
    <div class="fixed-box">
      <list-data-dialog :activeI="activeI"></list-data-dialog>
      <tide id="tide" :chart-data="[tide[3]]" :range="86400"></tide>
      <div class="wind-table">
        <div class="wind-item header">
          <div style="width:40px;">泊 位</div>
          <div style="width:45%;">风 向</div>
          <div style="width:35%">风 速</div>
        </div>
        <div class="wind-item" v-for="(item,index) in windShow" :key="index">
          <div style="width:40px;"><span v-text="item.name.replace('风力风向','')|| '--'"></span>&nbsp;&nbsp;</div>
          <div style="width:45%;" v-if="!item.timeout"><span>{{item.dir}}°</span><span>({{item.dirLevel}})</span></div>
          <div style="width:45%;" v-else-if="item.timeout"><span>NA</span></div>
          <div style="width:35%" v-if="!item.timeout"><span :class="flagObj[item.flag]">{{item.speed}}</span><span>({{item.speedLevel}})</span></div>
          <div style="width:35%" v-else-if="item.timeout"><span>NA</span></div>
        </div>
        <!-- <div class="wind-item header">
          <span>环境数据</span>
        </div>
        <div class="wind-item" v-for="(item,index) in windShow" :key="index">
          <div style="width:40px;"><span v-text="item.name.replace('风力风向','')|| '--'"></span>&nbsp;&nbsp;</div>
          <div style="width:45%;">风向：<span>{{item.dir}}°</span><span>({{item.dirLevel}})</span></div>
          <div style="width:35%">风速：<span :class="flagObj[item.flag]">{{item.speed}}</span><span>({{item.speedLevel}})</span></div>
        </div> -->

      </div>
    </div>
    <dbView v-if="visible.dbView" @beforeClose="beforeClose"></dbView>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import {scaleThreshold} from "d3-scale";

export default {
  components: {
    listDataDialog: () => import("@/views/main/shipall/listDataDialog"),
    dbView: () => import("@/views/main/shipall/dbView"),
    tide: () => import("@/components/content/echarts/environment/Tide")
  },
  //  flag:     0:normal（正常）; 1:alert（预警）; 2:warn（报警）
  data() {
    return {
      tideValueArray: [],//当天的潮汐值，到第二天清空
      range: {
        wind: {
          level: scaleThreshold()
            .domain([0.2, 1.5, 3.3, 5.4, 7.9, 10.7, 13.8, 17.1, 20.7, 24.4, 28.4, 32.6, 36.9, 41.4, 46.1, 50.9, 56])
            .range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
          dir: scaleThreshold()
            .domain([11.25, 78.75, 101.25, 168.75, 191.25, 258.75, 281.25, 348.75, 360])
            .range(['北', '东北', '东', '东南', '南', '西南', '西', '西北', '北']),
        },
      },
      berth: {},
      pixels: {
        width: 3840,
        height: 2160,
        ratio: 0.96364
      },
      warp: {
        width: 0,
        height: 0,
      },
      terminal: [
        {
          name: '1#',
          id: 1,
          point: [
            { x: 2052, y: 1852 },
            { x: 2182, y: 1932 },
          ],
        },
        {
          name: '2#东',
          id: 2,
          point: [
            { x: 1810, y: 1644 },
            { x: 1890, y: 1718 },
          ],
        },
        {
          name: '2#',
          id: 3,
          point: [
            { x: 1700, y: 1552 },
            { x: 1800, y: 1638 },
          ],
        },
        {
          name: '2#西',
          id: 4,
          point: [
            { x: 1620, y: 1480 },
            { x: 1686, y: 1538 },
          ],
        },

        {
          name: '7#',
          id: 5,
          point: [
            { x: 354, y: 454 },
            { x: 522, y: 560 },
          ],
        },
      ],
      timer: null,
      activeI: null,
      visible: {
        dbView: false
      },
      berthId: null,
      flagObj: {
        0: "NORMAL",
        1: "ALERT",
        2: "WARN"
      },
    }
  },
  computed: {
    ...mapState({
      berths: state => state.berth.berths,
      vessels: state => state.vessel.vessels,
      terminals: state => state.docking.terminal,
      wind: state => state.env.wind,
      tide: state => state.env.tide,
      berthStatus: state => state.berth.status,
      envConfig: state => state.env.envConfig,
      now:state=> state.timeout.now,
    }),
    scaleWrap() {
      let pixels = this.pixels
      let wrap = this.warp
      return {
        x: wrap.x,
        y: wrap.y,
        ratio: {
          x: wrap.width / pixels.width,
          y: wrap.height / pixels.height,
        }
      }
    },
    points() {
      let { x, y, ratio } = this.scaleWrap;
      // let pixels = this.pixels
      // let wrap = this.warp
      // let ratio = {
      //   x: wrap.width / pixels.width,
      //   y: wrap.height / pixels.height,
      // }
      //   console.log(ratio);
      // 2040 m  = 1977 pixels
      // currentDis = currentPixel / ratio * (2040/1977);
      // currentPixel = currentDis / (2040/1977) * ratio
      let terminal = this.terminal
      return terminal.map((t) => {
        return {
          name: t.name,
          id: t.id,
          point: t.point.reduce((o1, o2) => {
            return {
              x: x + o1.x * ratio.x,
              y: y + o1.y * ratio.y,
              width: Math.sqrt(Math.pow((o2.y - o1.y) * ratio.x, 2) + Math.pow((o2.x - o1.x) * ratio.y, 2)),
              r: 90 - (Math.atan((o2.x - o1.x) / (o2.y - o1.y)) * 180) / Math.PI,
            };
          }),
        }
      })
    },
    vessel() {
      let res = {};
      this.terminal.map((item, index) => {
        let dataObj = this.terminals[item.id];
        if (dataObj) {
          const { disL, disR, ange } = dataObj;
          let obj = {
            name: "",
            point: {}
          };
          let now = { dis: (disL + disR) / 2, r: ange }
          obj.point = now;
          this.$set(res, item.id, obj)
        }
      })
      return res;
    },
    //风力风向
    windShow() {
      let windArr = this.envConfig.filter(x=>x.type==='wind');
      if (windArr.length === 0) { return [] };
      let res = [];
      windArr.map(item => {
        let obj= this.wind[item.srv];
        if(obj){
          const { spd:speed, dir ,time} = obj;
          const {berth:name}=item;
          const { level, dir: dS } = this.range.wind;
          res.push({
            dir,
            speed,
            name,
            timeout: this.now - time > 30_000,
            dirLevel: `${dS(dir ?? undefined)?.concat("风") ?? '风向'}`,
            speedLevel: `${level(speed ?? undefined)?.toString().concat("级") ?? '风速'}`
          });
        }
      })
      return res;
    },
  },
  methods: {
    ...mapActions('vessel', [
      'activeIdActions', // -> this.activeIdActions()
    ]),
    moveShip(ref) {
      ref.style.animation = "myfirst 10s"
    },
    getPixelDistence(dis) {
      if (dis instanceof String) {
        dis = Number(dis);
      }
      let { ratio: scale } = this.scaleWrap;
      // return (dis * this.pixels.ratio) * scale.x;
      return (dis * this.pixels.ratio) * scale.x / (2040/1977) * this.pixels.ratio
    },
    doOneClick(id) {
      if (this.timer) {	//取消上次延时未执行的方法
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        // console.log('单击事件', i);	//延时300毫秒执行
        this.activeI = id;
      }, 300);
    },
    doDbClick(id) {
      this.doOneClick(id)
      // if (this.timer) {	//取消上次延时未执行的方法
      //   clearTimeout(this.timer);
      // }
      this.activeIdActions(id)
      // console.log('双击事件', i);
      this.visible.dbView = true;
    },
    setComponentData(componentRefStr, obj) {
      this.$refs[componentRefStr]?.setData(obj);
    },
    getVesselBody(id) {
      // {color:null
      // id:1
      // imoNumber:"1000"
      // length:200
      // name:"LOCAL_UPDATE:Terminal 2"
      // remark:null
      // type:"OLI"
      // width:30}
      // console.log(id,this.vessels,666)
      return id ? this.vessels[id] : {};
    },
    beforeClose() {
      this.visible.dbView = false;
    },
    // 更换泊位
    choiceBerthData(id) {
      if (id) {
        this.berthId = id;
        this.loadBerthStatus(id);
        this.$nextTick(() => {
          setBerth(this.berth);
        })
      }
    },
  },
  mounted() {
    const resizeObserver = new ResizeObserver((entries) => {
      let { height, left, right, top, width, x, y } = entries[0].contentRect
      this.warp = { height, left, right, top, width, x, y };
      const footerRef = this.$refs.fixedFooter;
      let footerHeight = this.$refs.fixedFooter.clientHeight;
      footerRef.style.top = (height - footerHeight) + 'px';
    })
    resizeObserver.observe(this.$refs.mapWarp);
  },
}
</script>

<style lang="scss" scoped>
$borderX: -8px;
$borderY: -8px;
$width: 28%; //fixed-box宽度
$borderStyle: 2px solid #fff;
$tide-top: 350px; //潮汐margin-top
$wind-top: 570px; //风力风向margin-top
$WARN: #f56c6c;
$NORMAL: #67c23a;
$ALERT: #e6a23c;
.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #eee;
  color: #000;
  opacity: 0.7;
  height: 2rem;
  line-height: 2rem;
  z-index:2;
  text-align: center;
  font-size: 0.7rem;
}
#tide {
  width: 100%;
  height: 200px;
  background-color: rgba(26, 29, 30, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 5px;
}
.wind-text {
  color: #fff;
}
.box {
  position: relative;
  .point {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 100%;

    > * {
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .point-container {
      position: absolute;
      // width: 100%;
      bottom: 0;
      text-align: center;
      cursor: pointer;
      transition: all 1s linear;
    }

    .vessel-body {
      svg {
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }

    @keyframes living {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(0.6);
        opacity: 1.5;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .point-container.active-ship .border {
      width: 8px;
      height: 8px;
      position: absolute;
      animation: living 1s linear infinite;
      &.border-one {
        top: $borderX;
        left: $borderY;
        border-left: $borderStyle;
        border-top: $borderStyle;
      }
      &.border-two {
        top: $borderX;
        right: $borderY;
        border-right: $borderStyle;
        border-top: $borderStyle;
      }
      &.border-three {
        bottom: $borderX;
        left: $borderY;
        border-left: $borderStyle;
        border-bottom: $borderStyle;
      }
      &.border-four {
        bottom: $borderX;
        right: $borderY;
        border-right: $borderStyle;
        border-bottom: $borderStyle;
      }
    }
  }
}
.fixed-box {
  position: fixed;
  top: 70px;
  right: 0;
  width: $width;
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  padding-right: 2rem;
  padding-top: 2rem;
  box-sizing: border-box;
  & > div {
    margin-bottom: 1.3rem;
  }
}
.wind-table {
  width: 100%;
  box-sizing: border-box;
  background-color: rgba(26, 29, 30, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 5px;
  color: #fff;
  font-size: 0.8em;
  padding: 10px;
  .wind-item {
    padding: 4px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    &.header {
      justify-content: space-between;
      border-bottom: 1px solid #dcdfe6;
      font-weight: bold;
      color: #66b1ff;
    }
    & > div {
      text-align: center;
    }
  }
}
.WARN {
  color: $WARN;
  font-weight: bold;
}
// .NORMAL {
//   color: $NORMAL;
// }
.ALERT {
  color: $ALERT;
  font-weight: bold;
}
@media screen and (max-width: 760px) {
  .fixed-box {
    width: 100%;
  }
}
</style>
<style lang="scss">
.wind-list.el-popover--plain {
  padding: 8px 4px !important;
}
</style>
