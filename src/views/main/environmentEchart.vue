<template>
  <div class="environmentEchart"
       @click.left="clickPage"
       @click.right="rightClickMenu">
    <div class="container">
      <div class="item weather">
        <div class="item-content">
          <weather :temp="env.temperature"
                   :humidity="env.humidity"
                   :rain="env.rain"
                   :wind="env.wind"
                   :pressure="env.pressure"
                   :visibility="env.visibility"
          />
        </div>
      </div>
      <div class="item overview">
        <div class="item-content">
          <overview
              ref="overview"
          />
        </div>
      </div>
      <div class="item">
        <div class="item-content">
          <wind :speed="env.wind.speed"
                :dir="env.wind.dir"
          />
        </div>
      </div>
      <div class="item item-l">
        <div class="item-content">
          <tide
              id="tide"
              ref="tide"
              :chart-data="[tide]"
          />
        </div>
      </div>
      <div class="item item-l">
        <div class="item-content">
          <wave
              id="wave"
              ref="wave"/>
        </div>
      </div>
      <div class="item item-l">
        <div class="item-content">
          <water-temperature
              id="waterTemperature"
              ref="waterTemperature"
          />
        </div>
      </div>
      <!--      <div class="item">-->
      <!--        <div class="item-content">-->
      <!--          <humidity-->
      <!--              id="humidity"-->
      <!--              ref="humidity"/>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="item">-->
      <!--        <div class="item-content">-->
      <!--          <temperature-->
      <!--              :temperature="env.temperature"-->
      <!--          />-->
      <!--        </div>-->
      <!--      </div>-->
      <!--            <div class="item">-->
      <!--              <div class="item-content">-->
      <!--                <visibility-->
      <!--                    id="visibility"-->
      <!--                    ref="visibility"-->
      <!--                />-->
      <!--              </div>-->
      <!--            </div>-->
      <!--      <div class="item">-->
      <!--        <div class="item-content">-->
      <!--          <rain-->
      <!--              :rain="env.rain"-->
      <!--          />-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="item">-->
      <!--        <div class="item-content">-->
      <!--          <pressure-->
      <!--              id="pressure"-->
      <!--              ref="pressure"-->
      <!--          />-->
      <!--        </div>-->
      <!--      </div>-->

    </div>
    <!--右键菜单-->
    <div class="context-menu" :style="contextMenuStyle">
      <div class="menu text-center" @click="clickSelectBerth">选择泊位</div>
    </div>

    <el-dialog
        :visible.sync="selectBerthDialogVisible"
        title="选择泊位">
      <el-select v-model="selectedBerthId" placeholder="请选择泊位名称">
        <el-option
            v-for="berth in berths"
            :key="berth.id"
            :label="berth.berthName"
            :value="berth.id"
        />
      </el-select>
      <el-button
          :type="buttonInfo.type"
          @click="clickSelectBerthConfirm"
          :disabled="buttonInfo.disabled">
        {{ buttonInfo.text }}
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import Weather from '@/components/content/ConeallWeather'
import humidity from '@/components/content/echarts/environment/Humidity'
import wind from "@/components/content/echarts/environment/Wind";
import rain from "@/components/content/echarts/environment/Rain";
import temperature from "@/components/content/echarts/environment/Temperature";
import visibility from "@/components/content/echarts/environment/Visibility";
import pressure from "@/components/content/echarts/environment/Pressure";
import waterTemperature from "@/components/content/echarts/environment/WaterTemperature";
import wave from "@/components/content/echarts/environment/Wave";
import tide from "@/components/content/echarts/environment/Tide";
import overview from "@/components/content/echarts/environment/Overview";
import {deleteObj, getBerth, getToken, keepDecimal} from "@/util/content";
import {arrayLimit} from "@/util/common";
import {environmentWebsocket, websocketSend} from "@/network/websocketList";
import {mapState} from "vuex";
import {getBerthById} from "@/network/request-api";

export default {
  name: "environmentEchart",
  components: {
    Weather,
    humidity,
    wind,
    rain,
    temperature,
    visibility,
    pressure,
    waterTemperature,
    wave,
    tide,
    overview,
  },
  computed: {
    ...mapState({
      berths: state => state.berth.berths,
      winds: state => state.env.wind,
      tides: state => state.env.tide,
    }),
    wind() {
      return Object.values(this.winds)[0]
    },
    tide() {
      return Object.values(this.tides)[0]
    }
  },
  data() {
    return {
      date: new Date(),//当前日期，用于判断是否要清空图表
      environmentWebsocket: null,
      tideValueArray: [],//当天的潮汐值，到第二天清空
      waveValueArray: [],//波浪值，仅保留几个值
      wavePeriodArray: [],//波浪周期，仅保留几个值
      //右键菜单的样式
      contextMenuStyle: {
        display: 'none',
        left: '',
        top: '',
      },
      selectBerthDialogVisible: false,//选择泊位的对话框是否显示
      berth: {},
      envIds: '',//环境各模块的id，以逗号分割
      selectedBerthId: null, //当前与后端连接的websocket中的berthId
      buttonInfo: {
        text: '确定',
        disabled: false,
        type: 'primary'
      },
      env: {
        rain: null,
        temperature: null,
        humidity: null,
        wind: {
          speed: null,
          dir: null
        },
        pressure: null,
        visibility: null,
      }
    }
  },
  watch: {
    wind(val) {
      this.windHandle(val);
    },
    tide(val) {
      this.tideHandle(val);
    }
  },
  mounted() {
    this.initCurrentBerth();
  },
  beforeDestroy() {
    this.environmentWebsocket.close();
    console.log("websocket已断开连接")
    deleteObj(this.$data);
  },
  methods: {
    initCurrentBerth() {
      let berth = getBerth();
      if (berth) {
        this.berth = berth;
      }
    },
    /**
     * 给组件设置值
     * @param componentRefStr ref字符串
     * @param obj
     */
    setComponentData(componentRefStr, obj) {
      this.$refs[componentRefStr]?.setData(obj);
    },
    /**
     * @deprecated
     * @param msg
     */
    onmessage(msg) {
      let receivedMsg = JSON.parse(msg.data);
      let serviceType = receivedMsg['serviceType'];
      let traceTime = receivedMsg['traceTime'];
      let message = receivedMsg['send'];
      switch (serviceType) {
        case 'current':
          this.currentHandle(traceTime, message);
          break;
        case 'wave':
          this.waveHandle(traceTime, message);
          break;
        case "pressure":
          this.pressureHandle(traceTime, message);
          break;
        case "humidity":
          this.humidityHandle(traceTime, message);
          break;
        case "temperature":
          this.temperatureHandle(traceTime, message);
          break;
        case "visibility":
          this.visibilityHandle(traceTime, message);
          break;
        case "rain":
          this.rainHandle(traceTime, message);
          break;

      }
    },
    /**
     *处理层流数据
     */
    currentHandle(traceTime, message) {
      const waterTemperature = keepDecimal(message['waterTemperature']);
      const currentSpeed = [];
      const currentDirection = [];
      for (let i = 1; i <= 20; i++) {
        currentSpeed.push([i + '', message['speed' + i]]);
        currentDirection.push([i + '', message['direction' + i]]);
      }
      const obj = {waterTemperatureValue: waterTemperature, currentSpeed, currentDirection};
      this.setComponentData('waterTemperature', obj);
      const speed = keepDecimal(message['speed']);
      const direction = keepDecimal(message['direction']);
      this.setOverview(traceTime, {current: `${speed} \n ${direction}°`})
    },
    /**
     *处理风力风向数据
     */
    windHandle({time, spd, dir, flag},) {
      let wind = this.env.wind;
      this.setOverview(time, {windSpeed: spd, windDirection: dir + '°'});
      wind.speed = spd;
      wind.dir = dir;
    },
    /**
     *处理波浪数据
     */
    waveHandle(traceTime, message) {
      let {signWaveHeight, signWavePeriod} = message;
      traceTime = traceTime - 0;
      signWaveHeight = keepDecimal(signWaveHeight);
      signWavePeriod = keepDecimal(signWavePeriod);
      this.waveValueArray = arrayLimit(this.waveValueArray, [traceTime, signWaveHeight], 6);
      this.wavePeriodArray = arrayLimit(this.wavePeriodArray, [traceTime, signWavePeriod], 6);
      const obj = {waveValue: this.waveValueArray, wavePeriod: this.wavePeriodArray}
      const valueObj = {wave: `${signWaveHeight}m\n${signWavePeriod}s`};
      this.setOverview(traceTime, valueObj);
      this.setComponentData('wave', obj);
    },
    /**
     *处理潮汐数据
     */
    tideHandle({time, height, tendency, flag}) {
      this.setOverview(time, {tide: height});
    },
    /**
     *处理大气压数据
     */
    pressureHandle(traceTime, message) {
      let {pressure} = message;
      pressure = keepDecimal(pressure);
      this.setComponentData('pressure', pressure);
      this.env.pressure = pressure;
      this.setOverview(traceTime, {pressure: pressure});
    },
    /**
     *处理湿度数据
     */
    humidityHandle(traceTime, message) {
      let {humidity} = message;
      humidity = keepDecimal(humidity);
      this.setComponentData('humidity', humidity);
      this.env.humidity = humidity;
      this.setOverview(traceTime, {humidity: humidity});
    },
    /**
     *处理大气温度数据
     */
    temperatureHandle(traceTime, message) {
      let {temperature} = message;
      temperature = keepDecimal(temperature);
      this.env.temperature = temperature;
      this.setOverview(traceTime, {temperature: temperature + '℃'});
    },
    /**
     *处理能见度数据
     */
    visibilityHandle(traceTime, message) {
      let {viewAble} = message;
      viewAble = keepDecimal(viewAble);
      this.setComponentData('visibility', viewAble);
      this.env.visibility = viewAble;
      this.setOverview(traceTime, {visibility: viewAble});
    },
    /**
     *处理降雨数据
     */
    rainHandle(traceTime, message) {
      let {rainSum} = message;
      rainSum = keepDecimal(rainSum);
      this.env.rain = rainSum;
    },
    /**
     * 给overview组件设置(添加)值
     * @param traceTime
     * @param valueObj
     */
    setOverview(traceTime, valueObj) {
      if (this.isNewDay(traceTime)) {
        this.date = new Date(traceTime);
        //清空总览图表的数据
        this.$refs['overview'].clearData();
        //修改总览组件上面的时间显示
        this.$refs['overview'].formatDate(traceTime);
        //清除潮汐组件内的数据
        this.tideValueArray = [];
        //清空波浪组件内的数据
        this.waveValueArray = [];
        this.wavePeriodArray = [];
      }
      const hour = new Date(traceTime - 0).getHours();
      const overviewObj = {time: hour, valueObj};
      this.setComponentData('overview', overviewObj);
    },
    /**
     * 与this.date对比 判断是否是第二天
     */
    isNewDay(traceTime) {
      const date = this.date;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const date00 = new Date(`${year}-${month}-${day}`);
      return traceTime - date00.getTime() >= 24 * 60 * 60 * 1000;
    },
    /**
     * 右键点击弹出菜单
     */
    rightClickMenu(event) {
      //阻止鼠标的默认右键点击事件
      event.preventDefault();
      let X = event.clientX + 'px';
      let Y = event.clientY + 'px';
      this.contextMenuStyle = {
        display: 'block',
        left: X,
        top: Y,
      }
    },
    /**
     * 点击页面时 隐藏右键菜单
     */
    clickPage() {
      this.contextMenuStyle.display = "none";
    },
    /**
     * 点击 选择泊位选项
     */
    clickSelectBerth() {
      this.selectBerthDialogVisible = true;
    },
    /**
     * 选择具体泊位后点击的 确定 按钮
     *
     * 选择泊位后根据id 去查询该泊位对应的多个环境envId
     * 再将这些envId发送到websocket中，
     */
    clickSelectBerthConfirm() {
      const {berth, selectedBerthId} = this;
      const _this = this;
      //判断登录与否
      const token = getToken();
      if (token === null) {
        _this.$message.error("请先登录！！");
        return;
      }
      websocketSend(this.environmentWebsocket, `token:${token}`);
      // 判断是否选择了泊位
      if (berth === null) {
        this.$message.error("请先选择一个泊位!!");
        return;
      }

      if (selectedBerthId !== null && selectedBerthId === berth.id) {
        this.$message.error("选中的泊位与当前已连接的泊位信息相同！！");
        return;
      }
      //首次连接的情况
      if (selectedBerthId === null) {
        //获取对应的envId 通过websocket发送到后端
        getBerthById(berth.id).then(data => {
          const envRefDTOList = data.envRefDTOList;
          const ids = [];
          for (const item of envRefDTOList) {
            ids.push(item["id"]);
          }
          _this.envIds = ids.join(',');
          websocketSend(this.environmentWebsocket, `add:${_this.envIds}`);
          _this.selectedBerthId = berth.id + '';
        });
      }
      //切换泊位的情况
      if (selectedBerthId !== null && selectedBerthId !== berth.id) {
        //先删除之前的envIds
        websocketSend(this.environmentWebsocket, `del:${this.envIds}`);
        //再请求并添加envIds
        getBerthById(selectedBerthId).then(data => {
          _this.berth = data;
          let envRefDTOList = data.envRefDTOList;
          let ids = [];
          for (let item of envRefDTOList) {
            ids.push(item["id"]);
          }
          _this.envIds = ids.join(',');
          websocketSend(this.environmentWebsocket, `add:${_this.envIds}`);
        });
      }
      _this.selectBerthDialogVisible = false;
    },
  },
}
</script>

<style scoped>
.environmentEchart {
  height: 100%;
  width: 100%;
}

.container {
  display: grid;
  grid-gap: 5px;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-auto-rows: 0.5fr;
  grid-auto-flow: row dense;
  grid-template-areas:
      ".  . ow ow ow ow"
      ".  . ow ow ow ow"
      ".  .  .  .  . .";
}

.container > .item {
  position: relative;
  background-color: #2c3036;
}

.container > .item > .item-content {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.container > .item > .item-content > * {
  position: relative;
}

.container > .item.weather {
  grid-column-start: span 2;
}

.container > .item.item-l {
  grid-column-start: span 2;
}

.container > .item.overview {
  grid-area: ow;
  overflow: hidden;
}

/*@media screen and (max-width: 1280px) {*/
/*  .container {*/
/*    grid-template-columns: repeat(6, 1fr);*/
/*    grid-template-rows: repeat(2, 1fr);*/
/*    grid-auto-rows: 0.5fr;*/
/*    grid-template-areas:*/
/*      "ow ow ow ow ow ow"*/
/*      "ow ow ow ow ow ow"*/
/*      !*"s1 s2 s3 s4 s5 s6";*!*/
/*  }*/

/*  .item >>> .chart {*/
/*    display: none;*/
/*  }*/
/*}*/

/*右键菜单*/
.context-menu {
  display: none;
  width: 200px;
  /*height: 50px;*/
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 1px 1px #888, 1px 0 1px #ccc;
  position: fixed; /*自定义菜单相对与body元素进行定位*/
  z-index: 9999;
}

/*右键菜单选项*/
.menu {
  width: 100%;
  height: 50px;
  line-height: 25px;
  /*padding: 0 10px;*/
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu:hover {
  cursor: pointer;
  background-color: purple;
  color: #fff;
}

</style>