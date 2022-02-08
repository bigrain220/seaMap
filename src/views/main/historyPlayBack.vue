<template>
  <div class="historyPlayBack">
    <docking-record style="margin-bottom: 5px;" @recordSelected="chooseRecord"></docking-record>
    <el-row :gutter="10">
      <el-col :span="4">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button style="width: 100%;" size="small" :icon="playButton.icon" @click="playButtonClick">
              {{ playButton.label }}
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-select style="width: 100%;" size="small" v-model="speedTimeValue" placeholder="倍速">
              <el-option
                  v-for="option in speedTimeSelectOptions"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="18" :offset="1">
        <el-slider
            class="slider"
            :min="sliderMin"
            :max="sliderMax"
            v-model="sliderValue"
            :format-tooltip="sliderValueFormat"
            @mousemove.native="sliderMousemove"
            @change="sliderChangeEvent"
            :marks="sliderMarks"
        >
          <!--                    @change="sliderChangeEvent"-->
        </el-slider>
        <!--当鼠标移动到滑块上时 用于显示当前所指的时间-->
        <span class="tooltipText" :style="sliderTooltipLocation">{{ sliderTooltip }}</span>
      </el-col>
      <el-col :span="1" style="opacity: 0;height: 100%;">-</el-col>
    </el-row>
    <single-docking-for-history-playback
        class="singleDocking"
        id="playBackDocking"
        ref="singleDocking"
        @echartsClick="echartsClick"
        :cable-tension-options="cableTensionOptions"
        v-loading="loadingVisibility || singleDockingLoading"
        element-loading-text="Loading..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0,0.5)"
    />
  </div>
</template>

<script>
import {getRecords} from "@/api/docking";
import {dateFormat, each} from "@/util/common";
import {deleteObj} from "@/util/content";
import singleDockingForHistoryPlayback from "@/components/content/singleDockingForHistoryPlayback";
import DockingRecord from "@/components/content/DockingRecord";

export default {
  name: "historyPlayBack",
  components: {
    DockingRecord,
    singleDockingForHistoryPlayback,
  },
  data() {
    return {
      pageCondition: {
        condition: [],
        page: 0,
        size: 10,
      },
      record: {},
      //页面上(禁用状态)显示的值
      dockingHistoryId: '',
      //对话框是否展示
      dialogVisible: false,
      //滑块
      sliderValue: 0,
      sliderMin: 0,
      sliderMax: 100,
      //滑块上的时间显示
      sliderTooltip: '',
      sliderMarks: {},//滑块上的标记
      sliderTooltipLocation: {left: '0px', top: '0px'},
      playButton: {
        icon: 'el-icon-video-play',
        label: '播放',
        play: false,//true表示当前正在播放 按钮上显示的是暂停 false表示当前是暂停状态 按钮上显示的是播放
      },
      speedTimeValue: 1,//倍速值
      speedTimeSelectOptions: [
        {value: 1, label: '正常'},
        {value: 2, label: '×2'},
        {value: 4, label: '×4'},
        {value: 8, label: '×8'},
        {value: 16, label: '×16'},
        {value: 32, label: '×32'},
      ],
      //时间戳-->该时间戳对应的数据
      appHistoryData: [],//靠泊阶段的历史数据
      driftHistoryData: [],//漂移阶段的历史数据
      depHistoryData: [],//离泊阶段的历史数据
      //靠泊界面上的loading
      singleDockingLoading: false,
      //定时器
      interval: null,
      currentPhase: 'app',//当前阶段  app--靠泊 drift--漂移 dep--离泊
      loadingVisibility: false,//loading是否显示
      //默认情况下给8组缆绳
      cableTensionOptions: [
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
      ],
    }
  },
  computed: {
    singlePageRef() {
      return this.$refs["singleDocking"];
    },
    time() {
      let record = this.record;
      return {
        start: record.timeStart,
        mooring: record.timeMooring,
        departure: record.timeDeparture,
        complete: record.timeComplete
      }
    }
  },
  watch: {
    sliderValue(val) {
      this.sliderChangeEvent(val);
      const play = this.playButton.play;
      //若当前是自动播放状态 且已经播放完毕 则停止定时器
      if (val === this.sliderMax && play) {
        this.stopInterval();
        this.changeButtonIconAndLabel();
      }
    }
  },
  mounted() {
    //模拟数据
    // this.simulate();
  },
  beforeDestroy() {
    deleteObj(this.$data);
    this.stopInterval();
  },
  methods: {
    /**
     * 点击选择靠泊历史按钮的点击事件
     */
    clickSelectButton() {
      this.dialogVisible = true;
    },
    /**
     * 选择靠泊记录事件
     * @param record
     */
    chooseRecord(record) {
      //选择时把当前页面上的内容清空
      this.reset();
      this.record = record;
      const {start, mooring, departure, complete} = this.time;

      //再重新赋值
      this.dockingHistoryId = record.id;
      this.dialogVisible = false;
      // this.cableTensionOptions = this.generateCableTensionOptions(dockingHistory.berth.cableList?.length);
      //选择一条记录后 把时间的始末赋给slider的最值
      this.sliderMin = this.milliSeconds2Seconds(start);
      this.sliderMax = this.milliSeconds2Seconds(complete);
      this.sliderValue = this.sliderMin;
      //添加标记
      let marks = {};
      marks[Math.floor(mooring / 1000)] = {
        style: {
          color: '#00bdfd',
          'font-size': '10px'
        },
        label: this.$createElement('strong', '开始漂移'),
      };
      marks[Math.floor(departure / 1000)] = {
        style: {
          color: '#00bdfd',
          'font-size': '10px'
        },
        label: this.$createElement('strong', '开始离泊'),
      };
      this.sliderMarks = marks;
      //从后台获取数据 渲染到图表上
      this.getPlayBackHistoryData();
    },
    /**
     * 生成缆绳拉力图的配置
     * @param {number} cableGroupNum --整型  缆绳组数
     */
    generateCableTensionOptions(cableGroupNum) {
      const options = [];
      for (let i = 0; i < cableGroupNum; ++i) {
        //每组缆绳数量固定是4个，
        //TODO 预警值与报警值应该是从后台获取 这里随便给一个
        options.push({cableNum: 4, alert: 50, waring: 75});
      }
      return options;
    },
    /**
     * 滑块的鼠标移动事件
     * @param event
     */
    sliderMousemove(event) {
      let min = this.sliderMin;
      let max = this.sliderMax;
      let slider = event.target;
      //slider的总长度
      let sliderWidth = slider.offsetWidth;
      //slider的起始位置
      let left = slider.offsetLeft;
      //鼠标的X坐标
      let mouseX = event.clientX;
      let mouseY = event.clientY;

      //如果进度条的最大值是100 说明还没有选择某一条靠泊记录  此时不显示
      if (max !== 100) {
        //鼠标当前所在位置在滑块上对应的值(粗略)
        let currentValueOfMouseLocation = (mouseX - left) / sliderWidth * (max - min) + min;
        if (currentValueOfMouseLocation < min) {
          currentValueOfMouseLocation = min;
        } else if (currentValueOfMouseLocation > max) {
          currentValueOfMouseLocation = max
        }
        let timeStamp = currentValueOfMouseLocation.toFixed(0) - 0;
        this.sliderTooltip = this.sliderValueFormat(timeStamp);
        this.sliderTooltipLocation = {left: mouseX + 'px', top: mouseY + 20 + 'px'};
      }
    },
    sliderValueFormat(val) {
      return dateFormat(new Date(val * 1000), 'yyyy-MM-dd HH:mm:ss');
    },
    /**
     * 滑块值改变事件
     * @param val 改变后的值
     */
    sliderChangeEvent(val) {
      const {sliderMin: min, sliderMax: max, singlePageRef,} = this;
      const {mooring, departure} = this.time;
      //max=100表示还没有选择一条记录
      if (max === 100) {
        return;
      }

      let time = val * 1000;
      //该时间点是漂移阶段  切换到漂移界面, 除漂移外就是靠泊和离泊，切换到靠泊界面
      singlePageRef.switchPage(time <= mooring || time > departure);
      this.displayAllDataByTime(val * 1000);
    },
    /**
     * 展示某一时间点的数据情况
     * @param time 时间点(毫秒)
     */
    displayAllDataByTime(time) {
      //设置显示左右距离角度，及该时刻的船舶状态
      const {singlePageRef, appHistoryData, depHistoryData, currentPhase,} = this;
      const {start, complete, mooring, departure} = this.time;
      //超出时间范围
      if (time > (complete + 1000) || time < (start - 1000)) {
        this.$message.error("超出了时间范围！！！");
        console.warn("超出了时间范围！！！", time, `${start}-${complete}`);
        return;
      }

      //靠离泊用的是同一个界面，故每次切换到对应界面时都要先将对应界面的数据赋值过去
      //漂移界面单独一个界面，故不存在这个问题
      if (time < mooring && currentPhase !== 'app') {
        //靠泊阶段  把靠泊数据渲染到图表上
        this.currentPhase = 'app';
        this.singlePageRef.clearDockContent();
        this.setDataToAppOrDepChart(appHistoryData);
      } else if (time >= departure && currentPhase !== 'dep') {
        //离泊阶段 把离泊数据渲染到图表上
        this.currentPhase = 'dep';
        this.singlePageRef.clearDockContent();
        this.setDataToAppOrDepChart(depHistoryData);
      }

      const second = this.milliSeconds2Seconds(time);
      const info = this.getDataByTime(second);
      if (!info) {
        //该时间点没有数据
        console.warn("该时间点没有数据！", time)
        return;
      }
      let {terminal, hooks} = info;
      if (!terminal) {
        return;
      }
      //改变船舶状态
      let {leftDis, rightDis, angle} = terminal;
      singlePageRef.setVessel({
        vesselAngle: angle, vesselDistance: ((leftDis - 0) + (rightDis - 0)) / 2
      })

      //判断该时间点是靠泊、漂移还是离泊
      if (time >= mooring && time < departure) {
        //该时间点是漂移阶段
        //该阶段需显示漂移折线图中的值、左右漂移距离值、缆绳情况、船舶状态
        this.currentPhase = 'drift';
        this.setDataToDriftChart(this.getDriftDataByTime(time, 100));
        //显示左右漂移距离值
        singlePageRef.setDriftSwiperValue({leftValue: leftDis, rightValue: rightDis});
        //缆绳情况
        hooks && singlePageRef.setCableData(hooks);
      } else {
        //除漂移外就是靠泊和离泊，这两个阶段的处理逻辑大部分都是相同的
        //该阶段需要显示靠泊界面左右距离值、左右速度值、角度值、船舶状态
        //左右距离折线图
        singlePageRef.setDockDistanceAxisPointer(time);
        singlePageRef.setDockDistanceDataZoom(time);
        //左右速度折线图
        singlePageRef.setDockSpeedAxisPointer(time);
        singlePageRef.setDockSpeedDataZoom(time);
        //角度折线图
        singlePageRef.setDockAngleAxisPointer(time);
        singlePageRef.setDockAngleDataZoom(time);
      }
    },
    /**
     * 播放按钮的点击事件
     */
    playButtonClick() {
      let _this = this;
      const {sliderMin, sliderMax} = _this;
      if (sliderMin === 0 || sliderMax === 100) {
        this.$message.error("还未选择靠泊记录！！！")
        return;
      }
      let playOrPause = _this.changeButtonIconAndLabel();
      //当前是播放状态 且定时器为null(防止多次点击创建多个定时器)时创建一个定时器
      if (playOrPause) {
        _this.startInterval();
      } else {
        _this.stopInterval();
      }
    },
    /**
     * 改变播放按钮的icon和label
     * @return {Boolean} false表示当前是暂停状态  true表示当前是播放状态
     */
    changeButtonIconAndLabel() {
      let button = this.playButton;
      if (button.icon === 'el-icon-video-pause') {
        this.playButton = {icon: 'el-icon-video-play', label: '播放', play: false};
        return false;
      } else {
        this.playButton = {icon: 'el-icon-video-pause', label: '暂停', play: true};
        return true;
      }
    },
    /**
     * 启动定时器
     */
    startInterval() {
      let _this = this;
      let interval = _this.interval;
      if (!interval) {
        _this.interval = setInterval(() => {
          _this.sliderValue += _this.speedTimeValue;
        }, 1000);
      }
    },
    /**
     * 停止定时器
     */
    stopInterval() {
      clearInterval(this.interval);
      this.interval = null;
    },
    /**
     * 点击了折线图的事件
     * @param time 时间戳(毫秒)
     */
    echartsClick(time) {
      //改变时间进度条的值
      this.sliderValue = (time / 1000).toFixed(0) - 0;
      // this.displayAllDataByTime(time);
    },
    /**
     * 根据时间获取历史数据
     * @param time 时间戳(秒)
     */
    getDataByTime(time) {
      const {appHistoryData, driftHistoryData, depHistoryData} = this;
      const {start, mooring, departure} = this.time;
      const t = time * 1000;
      if (t < mooring) {
        //靠泊阶段
        return appHistoryData[time - this.milliSeconds2Seconds(start)];
      } else if (t < departure) {
        //漂移阶段
        return driftHistoryData[time - this.milliSeconds2Seconds(mooring)];
      } else {
        //离泊阶段
        return depHistoryData[time - this.milliSeconds2Seconds(departure)];
      }
    },
    /**
     * 根据时间戳获取指定时间往前的{num}条数据
     * @param {number} time 时间戳（毫秒）
     * @param {number} num 数据量
     * @return {[]}
     */
    getDriftDataByTime(time, num) {
      const {driftHistoryData} = this;
      const {mooring, departure} = this.time;

      if (time >= departure || time < mooring) {
        throw "该时间点不在漂移时间段内";
      }

      const arrayIndex = this.milliSeconds2Seconds(time - mooring);
      let beginIndex = arrayIndex - num;
      beginIndex = beginIndex > 0 ? beginIndex : 0;
      return driftHistoryData.slice(beginIndex, arrayIndex);
    },
    /**
     *
     * @param time 时间戳(秒)
     * @param data
     */
    setDataByTime(time, data) {
      const {appHistoryData, driftHistoryData, depHistoryData} = this;
      const {start, mooring, departure} = this.time;
      const t = time * 1000;
      if (t < mooring) {
        //靠泊阶段
        appHistoryData[time - this.milliSeconds2Seconds(start)] = data;
      } else if (t < departure) {
        //漂移阶段
        driftHistoryData[time - this.milliSeconds2Seconds(mooring)] = data;
      } else {
        //离泊阶段
        depHistoryData[time - this.milliSeconds2Seconds(departure)] = data;
      }

    },
    /**
     * 把数据渲染到靠离泊界面的图表上
     * @param {Map<key,value>} historyData
     */
    setDataToAppOrDepChart(historyData) {
      const dis = [[], []];
      const speed = [[], []];
      const angles = [];
      for (let value of historyData) {
        if (value) {
          const terminal = value.terminal;
          if (terminal) {
            let {
              traceTime: time,
              leftDis: disL,
              rightDis: disR,
              leftSpeed: spdL,
              rightSpeed: spdR,
              angle
            } = terminal;
            dis[0].push([time, disL]);
            dis[1].push([time, disR]);
            speed[0].push([time, spdL]);
            speed[1].push([time, spdR]);
            angles.push([time, angle]);
          }
        }
      }
      this.singlePageRef.setDockDistance(dis);
      this.singlePageRef.setDockSpeed(speed);
      this.singlePageRef.setDockAngle([angles]);
    },
    /**
     * 把数据渲染到飘移界面的图表上
     * @param {[]} historyData
     */
    setDataToDriftChart(historyData) {
      const disDrift = {leftDrift: [], rightDrift: []};
      for (let value of historyData) {
        if (value) {
          const terminal = value.terminal;
          if (terminal) {
            let {
              traceTime: time,
              leftDis: disL,
              rightDis: disR,
            } = terminal;
            disDrift.leftDrift.push([time, disL]);
            disDrift.rightDrift.push([time, disR]);
          }
        }
      }
      this.singlePageRef.setDriftDistance(disDrift);
    },
    /**
     * 向后台请求历史数据
     */
    getPlayBackHistoryData() {
      const _this = this;
      _this.loadingVisibility = true;
      getRecords(this.dockingHistoryId).then(data => {
        //data格式为 {hook-station:[],terminal:[{traceTime,angle,leftSpeed...}]}
        _this.translateData(data);
        //渲染图表
        _this.setDataToAppOrDepChart(this.appHistoryData);
        _this.loadingVisibility = false;
      });
    },
    /**
     * 把{hook-station:[],terminal:[]}形式
     * 转成 {时间戳(秒):{hook-station:{},terminal:{}}}形式再存到HistoryData中
     * @param data
     */
    translateData(data = {hooks: [], terminal: []}) {
      const _this = this;
      each(data, (type, array) => {
        each(array, (index, item) => {
          let traceTime = item['traceTime'];
          let second = this.milliSeconds2Seconds(traceTime - 0);
          let obj = _this.getDataByTime(second) || {};
          obj[type] = item;
          _this.setDataByTime(second, obj);
        })
      });
    },
    /**
     *把毫秒转成秒
     * @param {number} milliSeconds 毫秒
     */
    milliSeconds2Seconds(milliSeconds) {
      return Math.floor(milliSeconds / 1000);
    },
    /**
     * 清除页面显示
     */
    reset() {
      this.dockingHistoryId = '';
      //对话框是否展示
      this.dialogVisible = false;
      //滑块
      this.sliderValue = 0;
      this.sliderMin = 0;
      this.sliderMax = 100;
      //滑块上的时间显示
      this.sliderTooltip = '';
      this.sliderMarks = {};//滑块上的标记
      this.sliderTooltipLocation = {left: '0px', top: '0px'};
      this.playButton = {
        icon: 'el-icon-video-play',
        label: '播放',
        play: false,//true表示当前正在播放 按钮上显示的是暂停 false表示当前是暂停状态 按钮上显示的是播放
      };
      this.speedTimeValue = 1;//倍速值
      //时间戳-->该时间戳对应的数据
      this.appHistoryData = [];//靠泊阶段的历史数据
      this.driftHistoryData = [];//漂移阶段的历史数据
      this.depHistoryData = [];//离泊阶段的历史数据
      //靠泊界面上的loading
      this.singleDockingLoading = false;
      this.currentPhase = 'app';
      //定时器
      this.stopInterval();
      //把当前页面上的显示的内容清空
      this.singlePageRef.clearContent();
    },
  }
}
</script>

<style scoped>
.historyPlayBack {
  height: 100%;
  display: flex;
  flex-flow: column;
}

/*选择靠泊历史的按钮*/
.el-col-6 {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
}

.singleDocking {
  flex: 1;
}

.sliderArea {
  display: flex;
}

.el-slider {
  flex: 1;
}

.tooltipText {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* 定位 */
  position: fixed;
  z-index: 5;
}

.el-slider:hover + .tooltipText {
  visibility: visible;
}

</style>