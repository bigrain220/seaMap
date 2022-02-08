<template>
  <div class="environmentEchart self-environmentEchart">
    <div class="container">
      <div class="item weather">
        <div class="item-content">
          <weather :temp="env.temperature" :humidity="env.humidity" :rain="env.rain" :wind="env.wind" :pressure="env.pressure" :visibility="env.visibility" />
        </div>
      </div>
      <div class="item overview">
        <div class="item-content">
          <overview ref="overview" />
        </div>
      </div>
      <div class="item wind">
        <div class="item-content">
          <wind :speed="env.wind.speed" :dir="env.wind.dir" />
        </div>
      </div>
      <div class="item item-l">
        <div class="item-content">
          <tide id="tide" ref="tide" :chartData="tideChartData"/>
        </div>
      </div>
      <div class="item item-l">
        <div class="item-content">
          <wave id="wave" ref="wave" />
        </div>
      </div>
      <div class="item item-l">
        <div class="item-content">
          <water-temperature id="waterTemperature" ref="waterTemperature" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var timer;
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
import { deleteObj, getBerth, getToken, keepDecimal } from "@/util/content";
import { arrayLimit } from "@/util/common";
import { environmentWebsocket, websocketSend } from "@/network/websocketList";
import { getBerthById, getBerthSelect } from "@/network/request-api";

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
  data() {
    return {
      date: new Date(),//当前日期，用于判断是否要清空图表
      environmentWebsocket: null,
      tideValueArray: [],//当天的潮汐值，到第二天清空
      waveValueArray: [],//波浪值，仅保留几个值
      wavePeriodArray: [],//波浪周期，仅保留几个值
      selectBerthDialogVisible: false,//选择泊位的对话框是否显示
      berth: {},
      envIds: '',//环境各模块的id，以逗号分割
      berthNameSelectOptions: null,//选择泊位时下拉框的内容
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
      },
      tideChartData:[]
    }
  },
  mounted() {
    // this.initBerthNameSelectOptions();
    // this.initCurrentBerth();
    // this.environmentWebsocket = environmentWebsocket();
    // this.environmentWebsocket.onmessage = this.onmessage;
    // this.environmentWebsocket.onopen = this.onEnvSocketOpen;

    // -----------self----------
    let wind = {
      "module": "Env",
      "service": "wind1",
      "serviceType": "wind",
      "traceTime": 1620872241000,
      "send": {
        "speed": 19.0,
        "direct": 194.0,
        "flag": "WARN",
        "traceTime": 1620872241000
      },
      "sendClazz": "com.coneall.center.newton.dto.record.WindRecord",
      "flag": "WARN"
    }
    let tide = {
      "module": "Env",
      "service": "tide1",
      "serviceType": "tide",
      "traceTime": 1620872241000,
      "send": {
        "height": 0.0,
        "tendency": "DOWN",
        "tideFlag": "NORMAL",
        "traceTime": 1620872241000
      },
      "sendClazz": "com.coneall.center.newton.dto.record.TideRecord",
      "flag": "NORMAL"
    }
    //大气压
    let pressure = {
      "module": "Env",
      "service": "pressure1",
      "serviceType": "pressure",
      "traceTime": 1620872241000,
      "send": {
        "pressure": 1.013,
        "flag": "WARN",
        "traceTime": 1620872241000
      },
      "sendClazz": "com.coneall.center.newton.dto.record.PressureRecord",
      "flag": "WARN"
    }
    //大气温度
    let temperature = {
      "module": "Env",
      "service": "temperature1",
      "serviceType": "temperature",
      "traceTime": 1620872241000,
      "send": {
        "temperature": 26,
        "flag": "WARN",
        "traceTime": 1620872241000
      },
      "sendClazz": "com.coneall.center.newton.dto.record.TemperatureRecord",
      "flag": "WARN"
    }
    //湿度
    let humidity = {
      "module": "Env",
      "service": "humidity1",
      "serviceType": "humidity",
      "traceTime": 1620872241000,
      "send": {
        "humidity": 75,
        "flag": "WARN",
        "traceTime": 1620872241000
      },
      "sendClazz": "com.coneall.center.newton.dto.record.HumidityRecord",
      "flag": "WARN"
    }
    // 能见度
    let visibility = {
      "module": "Env",
      "service": "visibility1",
      "serviceType": "visibility",
      "traceTime": 1620872241000,
      "send": {
        "viewAble": 36,
        "longViewAble": 79,
        "viewAbleFlag": "NORMAL",
        "longViewAbleFlag": "NORMAL",
        "traceTime": 1620872241000
      },
      "sendClazz": "com.coneall.center.newton.dto.record.VisibilityRecord",
      "flag": "WARN"
    }
    // 降雨
    let rain = {
      "module": "Env",
      "service": "rain1",
      "serviceType": "rain",
      "traceTime": 1620872241000,
      "send": {
        "rainType": 0,
        "rainSum": 1.2,
        "WarnFlag": "NORMAL",
        "traceTime": 1620872241000
      },
      "sendClazz": "com.coneall.center.newton.dto.record.RainRecord",
      "flag": "WARN"
    }
    // 波浪
    let wave = {
      "module": "Env",
      "service": "wave1",
      "serviceType": "wave",
      "traceTime": 1620872241000,
      "send": {
        "signWaveDirection": 116,
        "signWaveHeight": 0.5,
        "signWaveHeightFlag": "NORMAL",
        "signWavePeak": 1.2,
        "signWavePeriod": 1.4,
        "longWaveDirection": 96,
        "longWaveHeight": 0.4,
        "longWaveHeightFlag": "NORMAL",
        "longWavePeak": 0.9,
        "longWavePeriod": 1.2,
        "shortWaveDirection": 206,
        "shortWaveHeight": 0.35,
        "shortWaveHeightFlag": "NORMAL",
        "shortWavePeak": 1.1,
        "shortWavePeriod": 1.6,
        "traceTime": 1620872241000
      },
      "sendClazz": "com.coneall.center.newton.dto.record.WaveRecord",
      "flag": "WARN"
    }
    // 层流和海水温度
    let current = {
      "module": "Env",
      "service": "current1",
      "serviceType": "current",
      "traceTime": 1620872241000,
      "send": {
        "waterTemperature": 26,
        "speed1": 5.5,
        "direction1": 116,
        "speedFlag1": "NORMAL",
        "speed2": 6.3,
        "direction2": 45,
        "speedFlag2": "NORMAL",
        "speed3": 56.1,
        "direction3": 78,
        "speedFlag3": "NORMAL",
        "speed4": 29.2,
        "direction4": 63,
        "speedFlag4": "NORMAL",
        "speed5": 45.7,
        "direction5": 70,
        "speedFlag5": "NORMAL",
        "speed6": 8.5,
        "direction6": 289,
        "speedFlag6": "NORMAL",
        "speed7": 13.2,
        "direction7": 310,
        "speedFlag7": "NORMAL",
        "speed8": 32.4,
        "direction8": 36,
        "speedFlag8": "NORMAL",
        "speed9": 44.1,
        "direction9": 70,
        "speedFlag9": "NORMAL",
        "speed10": 10.4,
        "direction10": 40,
        "speedFlag10": "NORMAL",
        "speed11": 9.9,
        "direction11": 75,
        "speedFlag11": "NORMAL",
        "speed12": 11.7,
        "direction12": 90,
        "speedFlag12": "NORMAL",
        "speed13": 31.1,
        "direction13": 100,
        "speedFlag13": "NORMAL",
        "speed14": 19.7,
        "direction14": 72,
        "speedFlag14": "NORMAL",
        "speed15": 10.4,
        "direction15": 93,
        "speedFlag15": "NORMAL",
        "speed16": 7.6,
        "direction16": 74,
        "speedFlag16": "NORMAL",
        "speed17": 52.9,
        "direction17": 46,
        "speedFlag17": "NORMAL",
        "speed18": 10.5,
        "direction18": 74,
        "speedFlag18": "NORMAL",
        "speed19": 37.5,
        "direction19": 75,
        "speedFlag19": "NORMAL",
        "speed20": 3.9,
        "direction20": 98,
        "speedFlag20": "NORMAL",
        "speed": 9.9,
        "direction": 200,
        "flag": "NORMAL",
        "alert": 13.6,
        "warn": 66.5,
        "traceTime": 1620872241000
      },
      "sendClazz": "com.coneall.center.newton.dto.record.CurrentRecord",
      "flag": "WARN"
    }
    let arr = [wind, tide, pressure, temperature, humidity, visibility, rain, wave,current]
    timer = setInterval(() => {
      arr.map(item => {
        // item.traceTime += 3600000;
        item.traceTime += 1800000;
        switch (item.serviceType) {
          case 'wind':
            item.send.speed += 0.5; item.send.direct += 0.5;
            break;
          case 'tide':
            item.send.height += 0.5;
            break;
          case 'pressure':
            item.send.pressure += 0.5;
            break;
          case 'temperature':
            item.send.temperature += 0.5;
            break;
          case 'humidity':
            item.send.humidity += 0.5;
            break;
          case 'visibility':
            item.send.viewAble += 0.5;
            break;
          case 'rain':
            item.send.rainSum += 0.5;
            break;
          case 'wave':
            item.send.signWaveHeight += 0.5; item.send.signWavePeriod += 0.5;
            break;
            case 'current':
            item.send.waterTemperature += 0.5;
            break;
          default:
            break;
        }
        this.onmessage({ data: JSON.stringify(item) });
      })
    }, 5000);
  },
  beforeDestroy() {
    this.environmentWebsocket.close();
    console.log("websocket已断开连接")
    deleteObj(this.$data);
    clearInterval(timer);
  },
  methods: {

    initCurrentBerth() {
      let berth = getBerth();
      if (berth) {
        this.berth = berth;
        this.envIds = berth.envRefDTOList.map(env => env.id);
      }
    },
    onEnvSocketOpen() {
      this.initCurrentBerth();
      websocketSend(this.environmentWebsocket, `token:${getToken()}`);
      websocketSend(this.environmentWebsocket, `add:${this.envIds}`);
    },
    /**
     * 给组件设置值
     * @param componentRefStr ref字符串
     * @param obj
     */
    setComponentData(componentRefStr, obj) {
      this.$refs[componentRefStr]?.setData(obj);
    },
    onmessage(msg) {
      //格式为 {"serviceType":"visibility","flag":"alter","service":"visib","module":"TestNewton","traceTime":1574736127944,"send":{"longViewAble":22.405,"viewAble":26.536,"longViewAbleFlag":"alter","viewAbleFlag":"alter"}}
      let receivedMsg = JSON.parse(msg.data);
      let serviceType = receivedMsg['serviceType'];
      let traceTime = receivedMsg['traceTime'];
      let message = receivedMsg['send'];
      switch (serviceType) {
        case 'current':
          this.currentHandle(traceTime, message);
          break;
        case 'wind':
          this.windHandle(traceTime, message);
          break;
        case 'wave':
          this.waveHandle(traceTime, message);
          break;
        case 'tide':
          this.tideHandle(traceTime, message);
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
      const obj = { waterTemperatureValue: waterTemperature, currentSpeed, currentDirection };
      this.setComponentData('waterTemperature', obj);
      const speed = keepDecimal(message['speed']);
      const direction = keepDecimal(message['direction']);
      this.setOverview(traceTime, { current: `${speed} \n ${direction}°` })
    },
    /**
     *处理风力风向数据
     */
    windHandle(traceTime, message) {
      let { speed, direct } = message;
      let wind = this.env.wind;
      traceTime = traceTime - 0;
      speed = keepDecimal(speed);
      direct = keepDecimal(direct);
      this.setOverview(traceTime, { windSpeed: speed, windDirection: direct + '°' });
      wind.speed = speed;
      wind.dir = direct;
    },
    /**
     *处理波浪数据
     */
    waveHandle(traceTime, message) {
      let { signWaveHeight, signWavePeriod } = message;
      traceTime = traceTime - 0;
      signWaveHeight = keepDecimal(signWaveHeight);
      signWavePeriod = keepDecimal(signWavePeriod);
      this.waveValueArray = arrayLimit(this.waveValueArray, [traceTime, signWaveHeight], 6);
      this.wavePeriodArray = arrayLimit(this.wavePeriodArray, [traceTime, signWavePeriod], 6);
      const obj = { waveValue: this.waveValueArray, wavePeriod: this.wavePeriodArray }
      const valueObj = { wave: `${signWaveHeight}m\n${signWavePeriod}s` };
      this.setOverview(traceTime, valueObj);
      this.setComponentData('wave', obj);
    },
    /**
     *处理潮汐数据
     */
    tideHandle(traceTime, message) {
      let { height, tendency } = message;
      height = keepDecimal(height);
      const hour = new Date(traceTime - 0).getHours() + '';
      this.tideValueArray = arrayLimit(this.tideValueArray, [hour, height], 24);
      this.setOverview(traceTime, { tide: height });
      // this.setComponentData('tide', { tideValue: this.tideValueArray, tideFlag: tendency });
      // console.log({ tideValue: this.tideValueArray, tideFlag: tendency })
      let data= {time:Date.now(),tendency: ["NONE", "DOWN", "UP"].indexOf(tendency),height:height}
      // console.log(data)
      this.tideChartData=[data];
    },
    /**
     *处理大气压数据
     */
    pressureHandle(traceTime, message) {
      let { pressure } = message;
      pressure = keepDecimal(pressure);
      this.setComponentData('pressure', pressure);
      this.env.pressure = pressure;
      this.setOverview(traceTime, { pressure: pressure });
    },
    /**
     *处理湿度数据
     */
    humidityHandle(traceTime, message) {
      let { humidity } = message;
      humidity = keepDecimal(humidity);
      this.setComponentData('humidity', humidity);
      this.env.humidity = humidity;
      this.setOverview(traceTime, { humidity: humidity });
    },
    /**
     *处理大气温度数据
     */
    temperatureHandle(traceTime, message) {
      let { temperature } = message;
      temperature = keepDecimal(temperature);
      this.env.temperature = temperature;
      this.setOverview(traceTime, { temperature: temperature + '℃' });
    },
    /**
     *处理能见度数据
     */
    visibilityHandle(traceTime, message) {
      let { viewAble } = message;
      viewAble = keepDecimal(viewAble);
      this.setComponentData('visibility', viewAble);
      this.env.visibility = viewAble;
      this.setOverview(traceTime, { visibility: viewAble });
    },
    /**
     *处理降雨数据
     */
    rainHandle(traceTime, message) {
      let { rainSum } = message;
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
        this.$refs['tide'].clearData();
        this.tideValueArray = [];
        //清空波浪组件内的数据
        this.$refs['wave'].clearData();
        this.waveValueArray = [];
        this.wavePeriodArray = [];
      }
      const hour = new Date(traceTime - 0).getHours();
      const overviewObj = { time: hour, valueObj };
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
     * 初始化下拉框的内容
     */
    initBerthNameSelectOptions() {
      let _this = this;
      getBerthSelect().then(data => {
        const keyValues = [];
        for (const item of data) {
          let id = item['value'];
          let berthName = item['text'];
          keyValues.push({ value: id, label: berthName });
        }
        _this.berthNameSelectOptions = keyValues;
      });
    },
    /**
     * 选择具体泊位后点击的 确定 按钮
     *
     * 选择泊位后根据id 去查询该泊位对应的多个环境envId
     * 再将这些envId发送到websocket中，
     */
    clickSelectBerthConfirm() {
      const { berth, selectedBerthId } = this;
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
  /* height: 100%; */
  height: calc(100% - 40px);
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
    '.  . ow ow ow ow'
    '.  . ow ow ow ow'
    '.  .  .  .  . .';
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

.container > .item.wind {
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
/* .self-environmentEchart .cw-other {
  margin-top: 6px !important;
}
.self-environmentEchart .weather-temp {
  font-size: 3em !important;
} */
</style>