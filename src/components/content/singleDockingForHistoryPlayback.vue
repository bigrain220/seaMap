<template>
  <div style="height: 100%;width: inherit;position: relative;">
    <el-button class="switchPage" type="primary" icon="el-icon-refresh" @click="switchButtonClick"></el-button>
    <div style="width: 100%;height: 100%;">
      <el-row class="dockPage" :class="{transparent:!pageVisible}" style="height: inherit;width: inherit;">
        <el-col :span="12" class="left-container">
          <line-chart-of-docking class="lineChartOfDocking" ref="speedChart"
                                 :data-name="['左速度','右速度']"
                                 :axis-pointer-location="currentTime"
                                 @echartsClick="echartsClick"/>
          <line-chart-of-docking class="lineChartOfDocking" ref="disChart"
                                 :data-name="['左距离','右距离']"
                                 :axis-pointer-location="currentTime"
                                 @echartsClick="echartsClick"/>
          <line-chart-of-docking class="line-chart-of-dock-angle" ref="angle"
                                 :data-name="['角度']"
                                 @echartsClick="echartsClick"/>
        </el-col>
        <el-col :span="12" style="height: inherit;">
          <vessel-animation
              class="vesselAnimation" ref="docking1"
              :vessel-visible-distance="300"
              :distance="vesselDistance"
              :angle="vesselAngle"
              :vessel-svg-name="vesselSvgName"
              :vessel-berthing-dir="vesselBerthingDir"/>
        </el-col>
      </el-row>

      <el-row class="driftPage" :class="{transparent:pageVisible}" style="height: 100%">
        <el-row class="driftLine">
          <line-chart-of-drift class="lineChartOfDrift"
                               :id="id+'-drift'"
                               :ref="id+'-drift'"
                               @echartsClick="echartsClick"
                               :left-and-right-name="['左漂移距离','右漂移距离']"
          />
        </el-row>
        <el-row class="driftVessel">
          <el-col :span="24" class="vesselCol">
            <vessel-animation class="vesselAnimation2" ref="docking2"
                              :vessel-visible-distance="5"
                              :distance="vesselDistance"
                              :angle="vesselAngle"
                              :vessel-svg-name="vesselSvgName"
                              :vessel-berthing-dir="vesselBerthingDir"
            />
          </el-col>
        </el-row>
        <el-row class="driftCable">
          <cable class="cable"
                 :id="id + '-cable'"
                 :options="cableTensionOptions"
                 :ref="id + '-cable'"/>
        </el-row>
      </el-row>
    </div>
  </div>
</template>
<script>
import cable from "@/components/content/echarts/cable";
import vesselAnimation from "@/components/content/vesselAnimation";
import gaugeChartOfDocking from "@/components/content/echarts/gaugeChartOfDocking";
import lineChartOfDocking from "@/components/content/echarts/lineChartOfDocking";
import lineChartOfDrift from "@/components/content/echarts/lineChartOfDrift";
import {convertWarnFlag, each} from "@/util/common";
import echarts from 'echarts';
import {deleteObj} from "@/util/content";

//单一靠泊页面
export default {
  name: "singleDockingForHistoryPlayback",
  components: {
    cable,
    vesselAnimation,
    gaugeChartOfDocking,
    lineChartOfDrift,
    lineChartOfDocking,
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
    cableTensionOptions: {
      type: Array,
      default: () => {
        return [
          {cableNum: 4, waring: 50, alert: 75},
          {cableNum: 4, waring: 50, alert: 75},
          {cableNum: 4, waring: 50, alert: 75},
          {cableNum: 4, waring: 50, alert: 75},
          {cableNum: 4, waring: 50, alert: 75},
          {cableNum: 4, waring: 50, alert: 75},
          {cableNum: 4, waring: 50, alert: 75},
          {cableNum: 4, waring: 50, alert: 75},
          {cableNum: 4, waring: 50, alert: 75},
          {cableNum: 4, waring: 50, alert: 75},
        ]
      }
    },
    //swiper配置(近距离漂移的距离值显示配置)
    //{min, max, precision}
    //min:最小值 max:最大值 precision:精度()
    swiperOptions: {
      type: Object,
      default: () => {
        return {min: -2, max: 2.5, precision: 0.02};
      }
    },
    //当前指定的时间点
    currentTime: {
      type: Number || String,
    }
  },
  data() {
    return {
      //显示靠泊界面还是漂移界面  true表示靠泊界面 false表示漂移界面
      pageVisible: true,
      //船舶svg文件名（不包含.svg后缀）
      vesselSvgName: 'OIL',
      //船舶的靠泊方向  0表示右舷靠泊  1表示左舷靠泊
      vesselBerthingDir: '0',
      //船舶的夹角值
      vesselAngle: 0,
      //船舶与码头的距离
      vesselDistance: 0,
      leftSwiperValue: 0,
      rightSwiperValue: 0,
    }
  },
  computed: {
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
    vesselAnimation2() {
      return this.$refs.docking2;
    },
  },
  mounted() {
    this.connectChart();
  },
  beforeDestroy() {
    deleteObj(this.$data);
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
      const dockAngleInstance = this.dockAngleRef.getEChartsInstance();
      echarts.connect([dockDistanceInstance, dockSpeedInstance, dockAngleInstance]);
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
     * 给漂移界面的左右距离折线图设置值，
     * @param data 格式为{leftDrift:[[时间,值]...],rightDrift:[[时间,值]...]}
     */
    setDriftDistance(data) {
      this.driftDistanceRef.setChartData(data);
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
      this.dockAngleRef.setAxisPointerLocation(milliSecond);
    },
    /**
     * 用于更改靠泊角度折线图的dataZoom
     * @param milliSecond 毫秒值
     */
    setDockAngleDataZoom(milliSecond) {
      this.dockAngleRef.setShowAreaStartValue(milliSecond);
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
    setCableData(hookStation) {
      this.cableRef.setChartData(hookStation);
      (this.pageVisible ? this.vesselAnimation1 : this.vesselAnimation2)
          .setHookCableGroup(
              hookStation.index,
              hookStation.records.map(a => 1))
    },
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
    },
    /**
     * 清除靠泊界面的显示内容
     */
    clearDockContent() {
      this.dockSpeedRef.clear();
      this.dockDistanceRef.clear();
      this.dockAngleRef.clear();
      this.vesselAnimation1.reset();
    },
    /**
     * 清除漂移界面的显示内容
     */
    clearDriftContent() {
      this.driftDistanceRef.clear();
      this.setDriftSwiperValue({leftValue: 2.5, rightValue: 2.5});
      this.cableRef.clear();
      this.vesselAnimation2.reset();
    }
  }
}
</script>


<style scoped>
.switchPage {
  position: absolute;
  right: 0;
  top: 200px;
  cursor: pointer;
  z-index: 10;
  opacity: 0.2;
}

.switchPage:hover {
  opacity: 1;
}

.dockPage {
  position: absolute;
  height: inherit;
  width: inherit;
  z-index: 2;
}

.driftPage {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
}

.transparent {
  opacity: 0;
  z-index: 0;
}

.hidden {
  display: none;
}

/*左右漂移折线图父容器*/
.driftLine {
  height: 20%;
}

.lineChartOfDrift {
  height: 100%;
}

/*漂移界面中间部分*/
.driftVessel {
  height: 40%;
  width: 100%;
}

.vesselCol {
  height: 100%;
}

.vesselAnimation2 {
  height: 100%;
}

.swiperCol {
  height: 100%;
  display: flex;
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
  height: 50%;
  width: 5rem;
  margin: 0 0.6rem;
  padding: 0.5rem 0.4rem;
  align-self: center;
}

/*漂移界面底部(缆绳拉力部分)*/
.driftCable {
  height: 40%;
  width: 100%;
}

/*缆绳拉力图*/
.cable {
  height: 100%;
  width: 100%;
}


.lineChartOfDocking {
  width: 100%;
}

.line-chart-of-dock-angle {
  width: 100%;
}

.vesselAnimation {
  /*width: 100%;*/
  height: 100%;
}

.text-center {
  text-align: center !important;
}

.left-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.left-container > div {
  height: 100%;
  display: flex;
  flex-direction: column;
}


</style>