<template>
  <div class="home">
    <home-panel class="left">
      <home-module>
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          TERMINAL
        </template>
        <template v-slot:msg>{{  display.berthName }}</template>
      </home-module>
      <home-module>
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          SYSTEM STATUS
        </template>
        <!-- getModeCn(mode) -->
        <template v-slot:msg>{{ mode|| 'OFF' }}</template>
      </home-module>
      <home-module>
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          LEFT SENSOR
        </template>
        <template v-slot:msg>
          <div v-if="leftDis">
            <span>{{ leftDis }}</span>
            <span> m </span>
          </div>
          <div v-else>
            NO TARGET
          </div>
        </template>
      </home-module>
      <home-module>
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          RIGHT SENSOR
        </template>
        <template v-slot:msg>
          <div v-if="rightDis">
            <span>{{ rightDis }}</span>
            <span> m </span>
          </div>
          <div v-else>
            NO TARGET
          </div>
        </template>
      </home-module>
      <home-module>
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          START TIME
        </template>
        <template v-slot:msg>
          <!-- <span class="start-date" v-if="startTime" v-text="startTime" /> -->
          <span class="start-time" v-if="startTime">
            {{startTime.slice(0,10)}}<br/>{{startTime.slice(11)}}
          </span>
          <span v-else>N/A</span>
        </template>
      </home-module>
      <home-module>
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          ELAPSED TIME
        </template>
        <template v-slot:msg>{{ display.time || "N/A" }}</template>
      </home-module>
    </home-panel>
    <home-panel class="main">
      <!-- <vessel-animation class="vesselAnimation" :terminal-svg-name="vesselSvgName" ref="docking1"
        :distance="(terminal.disL + terminal.disR) / 2"
        :angle="terminal.ange"
        :vessel-svg-name="vesselSvgName" 
        :vessel-berthing-dir="berth.dir" 
        :vessel-width="Number(vessel.width)"
        :vessel-length="Number(vessel.length)"
        :vessel-text="vessel.vesselName"
        :vessel-title="vessel.imoNumber"
        :scale-mark="vesselScaleMark" 
        /> -->
           <!-- :vessel-visible-distance="300" -->
         <vessel-animation
              class="vesselAnimation" ref="docking1"
              :scale-mark="vesselScaleMark" 
              :terminal-svg-name="terminalSvgName"
              :distance="vesselDistance"
              :angle="vesselAngle"
              :vessel-width="Number(vessel.width)"
              :vessel-length="Number(vessel.length)"
              :vessel-text="vessel.name"
              :vessel-title="vessel.imoNumber"
              :vessel-berthing-dir="vesselBerthingDir"/>
      <el-slider v-model="vesselScale" :min="0" :max="1000" :show-tooltip="false" vertical height="200px" class="vessel-scale-slider" />
      <div class="swiperWrap" v-show="mode==='MOORING'">
        <near-drift-line class="swiperDrift" :id="id + '-swpier1'" :ref="id + '-swpier1'" :slideItemOptions="swiperOptions" :value="leftSwiperValue" />
        <near-drift-Line class="swiperDrift" :id="id + '-swpier2'" :ref="id + '-swpier2'" :slideItemOptions="swiperOptions" :value="rightSwiperValue" />
      </div>
    </home-panel>
    <home-panel class="bottom-chart speedChart">
       <line-chart-of-docking class="lineChartOfDocking" ref="speedChart"
                                 :data-name="['左速度','右速度']"
                                 :axis-pointer-location="currentTime"
                                 @echartsClick="echartsClick"/>
    </home-panel>
    <home-panel class="bottom-chart vesselAngleChart">
      <gauge-chart-of-docking class="gaugeChartOfDocking" :chart-data="0" ref="angle" />
      <!-- <line-chart-of-docking class="line-chart-of-dock-angle" ref="angle"
                                 :data-name="['角度']"
                                 @echartsClick="echartsClick"/> -->
    </home-panel>
    <home-panel class="bottom-chart distanceChart">
       <line-chart-of-docking class="lineChartOfDocking" ref="disChart"
                                 :data-name="['左距离','右距离']"
                                 :axis-pointer-location="currentTime"
                                 @echartsClick="echartsClick"/>
    </home-panel>
  </div>
</template>

<script>
import HomePanel from "@/components/content/HomePanel.vue";
import HomeMenu from "@/components/content/HomeMenu";
import HomeModule from "@/components/content/HomeModule";
import vesselAnimation from "@/views/main/shipall/vesselAnimation";
import nearDriftLine from "@/views/main/shipall/nearDriftLine";
import MainSlots from "@/components/content/MainSlots";
import lineChartOfDocking from "@/components/content/echarts/lineChartOfDocking";
import gaugeChartOfDocking from "@/components/content/echarts/gaugeChartOfDocking";
import {mapState} from "vuex";
import {deleteObj} from "@/util/content";
import echarts from 'echarts';
export default {
  name: "Home",
  components: {
    HomeModule,
    HomePanel,
    HomeMenu,
    MainSlots,
    vesselAnimation,
    nearDriftLine,
    lineChartOfDocking,
    gaugeChartOfDocking,
  },
  props: {
    //泊位id
    id: {
      type: String,
      required: true,
    },
     //缆绳配置
    //[{cableNum, waring, alert,]
    //cableNum: 缆绳数量，waring: 预警值 alert:报警值
    cableTensionOptions: {type:Array},
     //swiper配置(近距离漂移的距离值显示配置)
    //{min, max, precision}
    //min:最小值 max:最大值 precision:精度()
    swiperOptions: {
      type: Object,
      default: () => {
        return { min: -2, max: 2.5, precision: 0.02 };
      }
    },
    //当前指定的时间点
    currentTime: {
      type: Number || String,
    },
    //当前选择的泊位信息
    record:{
      type:Object
    },
    sliderValue:{
      type:Number
    }
  },
  beforeDestroy() {
    // 清理全部定时任务
    this.intervalArr.forEach((interval) => {
      clearInterval(interval);
    });
    deleteObj(this.$data);
  },
  computed: {
    ...mapState({
      berths: state => state.berth.berths,
      vessels: state => state.vessel.vessels,
      statusDic:state=>state.statusDic
    }),
    vesselScaleMark() {
      return 3 * (this.vesselScale / 1000) + 2;
    },
    dockSpeedRef() {
      return this.$refs.speedChart;
    },
    dockDistanceRef() {
      return this.$refs.disChart;
    },
    dockAngleRef() {
      return this.$refs.angle;
    },
    driftDistanceRef() {
      return this.$refs[this.id + "-drift"];
    },
    cableRef() {
      return this.$refs[this.id + '-cable'];
    },
    vesselAnimation1() {
      return this.$refs.docking1;
    },
    vessel() {
       let id = this.record?.vesselId;
       return id?this.vessels[id]:{}
    },
    display() {
      // console.log(this.sliderValue,this.startTime)
      let timeStamp = this.sliderValue-new Date(this.startTime).getTime()/1000;
      let hours=parseInt(timeStamp/3600);
      let minutes=parseInt(timeStamp/60%60);
      let seconds=timeStamp%60;
      let timeStr= (hours<10?('0'+hours):hours )+ ':' +(minutes<10?('0'+minutes):minutes )+ ':' +(seconds<10?('0'+seconds):seconds);
      let time =timeStamp?timeStr:0;
      return {
        berthName:this.berths[this.record.berthId]?.berthName,
        time
      };
    },
    terminalSvgName(){
       let obj = {
        1: 'TERMINAL1',
        2: 'TERMINAL2',
        3: 'TERMINAL3',
        4: 'TERMINAL4',
        5: 'TERMINAL5',
      }
      return obj[this.id];
    }
    // vesselAnimation2() {
    //   return this.$refs.docking2;
    // },
  },
  created() {
      
  },
  mounted() {
    this.connectChart();
  },
  data() {
    return {
      // id: "home-viewer",
      dialogTableVisible: false,
      berthData: [],
      intervalArr: [],
      startDockingTime: null,
      elapsedTimeStr: null,
      //显示靠泊界面还是漂移界面  true:靠泊界面  false：漂移界面
      pageVisible: true,
      //船舶svg文件名（不包含.svg后缀）
      vesselSvgName: "",
      vesselScale: 700,
      //选择的泊位
      berthId: null,
      //选择的泊位名称
      berthName: null,
      // 泊位id-->berthDTO
      allBerth: new Map(),
      //{label,value}
      allBerthName: [],
      dockingWebSocket: undefined,

      //船舶的夹角值
      vesselAngle: 0,
      //船舶与码头的距离
      vesselDistance: 0,
      //船舶的靠泊方向  0表示右舷靠泊  1表示左舷靠泊
      vesselBerthingDir: '0',
      leftSwiperValue: 0,
      rightSwiperValue: 0,
      mode:"",
      leftDis:null,
      rightDis:null,
      startTime:"",
      endTime:""
    };
  },
  methods: {
    switchPage(flag) {
      this.pageVisible = flag;
    },
    /**
     * 点击切换按钮的事件
     */
    switchButtonClick() {
      this.switchPage(!this.pageVisible);
    },
    /**
     * 用于处理缆绳拉力图以及码头和船的连线
     * @param message 格式为：{
     *                index:第几组脱缆钩(从0开始),
     *                hookStationRecords:[
     *                  {
     *                    value: 拉力值
     *                    warn: 警告标志 有ALERT、WARING
     *                    status: 当前缆绳的状态 opened,closed,releasing,release failed,off
     *                  }
     *                ]
     *               }
     */
    handleHookData(message) {
      let index = message['index'];
      let values = [];
      //把非closed状态转换为一个指定的数，显示状态时再根据这个数显示相应的状态
      //同时这个指定的数也是柱状图的高度，所以数都很小
      each(message['hookStationRecords'], (ind, record) => {
        let value = record['value'];
        let status = record['status'];
        if (status !== 'CLOSED') {
          values[ind] = status;
        } else {
          values[ind] = value;
        }
      });
      this.cableTensionData = [{index: index, detail: values}];
    },
    //联接echarts图
    connectChart() {
      const dockSpeedInstance = this.dockSpeedRef.getEChartsInstance();
      const dockDistanceInstance = this.dockDistanceRef.getEChartsInstance();
      // const dockAngleInstance = this.dockAngleRef.getEChartsInstance();
      echarts.connect([dockDistanceInstance, dockSpeedInstance]);
    },
    /**
     * 给靠泊界面的左右距离图设置值，一般是1个小时内(靠泊也就不到1个小时)的全部数据
     * @param data 格式为{leftText:[[时间,值]...],rightText:[[时间,值]...]}
     */
    setDockDistance(data) {
      this.dockDistanceRef.setChartData(data);
    },
    /**
     * 给靠泊界面的左右速度图设置值，一般是1个小时内(靠泊也就不到1个小时)的全部数据
     * @param data 格式为{leftText:[[时间,值]...],rightText:[[时间,值]...]}
     */
    setDockSpeed(data) {
      this.dockSpeedRef.setChartData(data);
    },
    /**
     *@param data [[时间戳,角度值]...]
     */
    setDockAngle(data) {
      this.dockAngleRef.setChartData(data);
    },
    /**
     *@param data Number 如果展示折线图用上面的setDockAngle
     */
    setDockAngleNum(data) {
      this.dockAngleRef.setChartData(data);
    },
    // 获取terminal对象用于左侧展示
    getleftShow({leftDis, rightDis,mode}){
      this.leftDis=leftDis;
      this.rightDis=rightDis;
      this.mode=mode;
    },
    //获取时间用于展示
    getTimeObj({startTime,endTime}){
      this.startTime=startTime;
    },
    /**
     * 给漂移界面的左右距离折线图设置值，
     * @param data 格式为{leftDrift:[[时间,值]...],rightDrift:[[时间,值]...]}
     */
    setDriftDistance(data) {
      // this.driftDistanceRef.setChartData(data);
    },
    /**
     * 继续把点击事件抛出去
     * @param time
     */
    echartsClick(time) {
      this.$emit("echartsClick", time);
    },
    /**
     * 用于更改靠泊左右距离折线图的axisPointer
     * @param milliSecond 毫秒值
     */
    setDockDistanceAxisPointer(milliSecond) {
      this.dockDistanceRef.setAxisPointerLocation(milliSecond);
    },
    /**
     * 用于更改靠泊左右距离折线图的dataZoom
     * @param milliSecond 毫秒值
     */
    setDockDistanceDataZoom(milliSecond) {
      this.dockDistanceRef.setShowAreaStartValue(milliSecond);
    },
    /**
     * 用于更改靠泊左右速度折线图的axisPointer
     * @param milliSecond 毫秒值
     */
    setDockSpeedAxisPointer(milliSecond) {
      this.dockSpeedRef.setAxisPointerLocation(milliSecond);
    },
    /**
     * 用于更改靠泊左右速度折线图的dataZoom
     * @param milliSecond 毫秒值
     */
    setDockSpeedDataZoom(milliSecond) {
      this.dockSpeedRef.setShowAreaStartValue(milliSecond);
    },
    /**
     * 用于更改靠泊角度折线图的axisPointer
     * @param milliSecond 毫秒值
     */
    setDockAngleAxisPointer(milliSecond) {
      // this.dockAngleRef.setAxisPointerLocation(milliSecond);
    },
    /**
     * 用于更改靠泊角度折线图的dataZoom
     * @param milliSecond 毫秒值
     */
    setDockAngleDataZoom(milliSecond) {
      // this.dockAngleRef.setShowAreaStartValue(milliSecond);
    },
    /**
     * 用于更改漂移左右距离折线图的AxisPointer
     * @param milliSecond
     */
    setDriftDistanceAxisPointer(milliSecond) {
      this.driftDistanceRef.setAxisPointerLocation(milliSecond);
    },
    /**
     * 用于更改漂移左右距离折线图的dataZoom
     * @param milliSecond
     */
    setDriftDistanceDataZoom(milliSecond) {
      this.driftDistanceRef.setShowAreaStartValue(milliSecond);
    },
    /**
     * 设置漂移界面的swiper
     * @param leftValue
     * @param rightValue
     */
    setDriftSwiperValue({leftValue = 2.5, rightValue = 2.5}) {
      this.leftSwiperValue = leftValue;
      this.rightSwiperValue = rightValue;
    },
    /**
     * 设置缆绳的值
     * @param hookStation
     */
    // setCableData(hookStation) {
    //   this.cableRef.setChartData(hookStation);

    //   (this.pageVisible ? this.vesselAnimation1 : this.vesselAnimation2)
    //       .setHookCableGroup(
    //           hookStation.index - 1,
    //           hookStation.hookStationRecords.map(this.convertWarnFlag)
    //       )
    // },
    convertWarnFlag(flag) {
      return convertWarnFlag(flag);
    },

    /**
     * 设置船舶夹角和距离
     * @param vesselAngle
     * @param vesselDistance
     */
    setVessel({vesselAngle, vesselDistance}) {
      this.vesselAngle = vesselAngle;
      this.vesselDistance = vesselDistance;
    },
    /**
     * 清除显示内容
     */
    clearContent() {
      this.clearDockContent();
      this.clearDriftContent();
      this.mode="";
      this.leftDis=null;
      this.rightDis=null;
    },
    /**
     * 清除靠泊界面的显示内容
     */
    clearDockContent() {
      this.dockSpeedRef.clear();
      this.dockDistanceRef.clear();
      // this.dockAngleRef.clear();
      this.vesselAnimation1.reset();
    },
    /**
     * 清除漂移界面的显示内容
     */
    clearDriftContent() {
      // this.driftDistanceRef.clear();
      this.setDriftSwiperValue({leftValue: 2.5, rightValue: 2.5});
      // this.cableRef.clear();
      // this.vesselAnimation2.reset();
    },
    getModeCn(val){
      return this.statusDic[val]?.name;
    }
  },
  destroyed() {
    this.dockingWebSocket?.close();
  },
};
</script>

<style scoped>
.home {
  height: 100%;
  display: grid;
  grid-gap: 6px;
  grid-template-columns: 1fr 2fr 1fr 2fr;
  grid-template-rows: repeat(10, 1fr);
  overflow: hidden;
}

.left {
  grid-column: 1 / 2;
  grid-row: 1 / 11;
  display: flex;
  flex-direction: column;
}

.left >>> .home-module .msg {
  font-size: 1.5rem;
}

.left >>> .home-module .start-date {
  font-size: 1rem;
}

.main {
  grid-column: 2 / 5;
  grid-row: 1 / 9;
}

.main > .vessel-scale-slider {
  position: absolute;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  opacity: 0.2;
  transition: all 0.1s ease-in-out;
  z-index: 9;
}

.main > .vessel-scale-slider:hover {
  opacity: 1;
}

.bottom-chart {
  grid-row-start: 9;
  grid-row-end: 11;
  padding: 5px 15px;
  overflow: hidden;
}

.bottom-chart .lineChartOfDocking {
  height: 100%;
}

.bottom-chart .gaugeChartOfDocking {
  height: 100%;
}

.speedChart {
  grid-column-start: 2;
  grid-column-end: 3;
}

.vesselAngleChart {
  grid-column-start: 3;
  grid-column-end: 4;
}

.distanceChart {
  grid-column-start: 4;
  grid-column-end: 5;
}

.swiperWrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.swiperDrift {
  background: rgba(255, 255, 255, 0);
  /* height: 50%; */
  height: 40%;
  width: 5rem;
  margin: 0 0.6rem;
  padding: 0.5rem 0.4rem;
  align-self: center;
}
/* 更改布局 */
/* .home{grid-gap:4px;}
.home .swiperDrift{height:50%;}
.home .home-module{width: 17%;}
.home .home-module:nth-child(1){width: 12%;}
.home .home-module:nth-child(2){width: 20%;}
.home .home-module{
  box-sizing: border-box;
  padding: 2% 0;
}
.left {
  grid-column: 1 / 5;
  grid-row: 1 / 2;
  display: flex;
  flex-direction: row;
}
.main {
  grid-column: 1 / 5;
  grid-row: 2 / 9;
}
.home .left .el-icon-s-home{display: none;} */

</style>