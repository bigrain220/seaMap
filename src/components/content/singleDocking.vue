<template>
  <div
      style="height: 100%;width: inherit;position: relative"
      @click.left="clickPage"
      @click.right="rightClickMenu">
    <el-button class="switchPage" type="primary" icon="el-icon-refresh" @click="switchPage"></el-button>
    <div style="width: 100%; height: 100%;">
      <!--   靠离泊   -->
      <el-row class="dockPage" :class="{transparent:!pageVisible}">
        <el-col :span="12" class="left-container" style="height: inherit">
          <line-chart-of-docking class="lineChartOfDocking" ref="spd" :padding="true"
                                 :dataName="['左速度','右速度']"
                                 :chart-data="speedLineChartOfDockingData"/>
          <line-chart-of-docking class="lineChartOfDocking" ref="dis" :padding="true"
                                 :dataName="['左距离','右距离']"
                                 :chart-data="distanceLineChartOfDockingData"/>
          <gauge-chart-of-docking class="gaugeChartOfDocking"
                                  :padding="true"
                                  :chart-data="vesselAngle"/>
        </el-col>
        <el-col :span="12" style="height: inherit;">
          <vessel-animation class="vesselAnimation"
                            :ref="id+'-vesselDocking1'"
                            :distance="vesselDistance"
                            :angle="vesselAngle"
                            :hookCables="hookCables"
                            :vessel-width="vesselWidth"
                            :vessel-length="vesselLength"
                            :vessel-svg-name="vesselSvgName"
                            :vessel-berthing-dir="vesselBerthingDir"/>
        </el-col>
      </el-row>
      <!--   漂移   -->
      <el-row class="driftPage" :class="{transparent:pageVisible}">
        <el-row class="driftLine">
          <line-chart-of-drift class="lineChartOfDrift"
                               :id="id+'-drift'"
                               :ref="id+'-drift'"
                               :left-and-right-name="['左漂移距离','右漂移距离']"
                               :chart-data="driftLineChartData"/>
        </el-row>
        <el-row class="driftVessel">
          <el-col :span="24" class="swiperCol">
            <vessel-animation class="vesselAnimation2"
                              :id="id+'-vesselDocking2'"
                              :ref="id+'-vesselDocking2'"
                              :distance="vesselDistance"
                              :angle="vesselAngle"
                              :hookCables="hookCables"
                              :vessel-svg-name="vesselSvgName"
                              :vessel-width="vesselWidth"
                              :vessel-length="vesselLength"
                              :vessel-berthing-dir="vesselBerthingDir"/>
          </el-col>
        </el-row>
        <el-row class="driftCable">
          <cable class="cable"
                 :id="id + '-cable'"
                 :ref="id + '-cable'"
                 :options="cableTensionOptions"
                 :data="cableTensionData"
          />
        </el-row>
      </el-row>
    </div>
    <!--右键菜单-->
    <div class="context-menu" :style="contextMenuStyle">
      <div class="menu text-center" @click="clickWatchBerthing">选择或修改泊位</div>
      <div class="menu text-center" :class="{hidden:!menuVisible.start}" @click="clickStartBerthing">开启靠泊</div>
      <div class="menu text-center" :class="{hidden:!menuVisible.stop}" @click="clickStopBerthing">结束靠泊</div>
    </div>

    <!--开启靠泊对话框-->
    <el-dialog
        :visible.sync="startBerthingDialogVisible"
        title="开启靠泊">
      <start-berthing-page
          @confirm="confirmStartBerthing"
          :berth-name="berthName"/>
    </el-dialog>
    <!--结束靠泊对话框-->
    <el-dialog
        :visible.sync="stopBerthingDialogVisible"
        title="结束靠泊">
      确定结束泊位--{{ berthName }}--靠泊
      <template slot="footer">
        <el-button type="danger" @click="confirmStopBerthing">结束靠泊</el-button>
      </template>
    </el-dialog>

    <el-dialog
        :visible.sync="watchBerthingDialogVisible"
        title="泊位选择">
      <el-select
          placeholder="选定一个泊位"
          v-model="berthId"
          no-data-text="未查询到泊位">
        <el-option
            v-for="item in allBerthName"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <el-button type="primary" @click="selectDockingBerth">确定</el-button>
    </el-dialog>

    <div class="berthInfo">
      <div class="info">{{ berthInfo }}</div>
    </div>
  </div>
</template>
<script>
import cable from "@/components/content/echarts/cable";
import vesselAnimation from "@/components/content/vesselAnimation";
import gaugeChartOfDocking from "@/components/content/echarts/gaugeChartOfDocking";
import lineChartOfDocking from "@/components/content/echarts/lineChartOfDocking";
import lineChartOfDrift from "@/components/content/echarts/lineChartOfDrift";
import startBerthingPage from "@/components/content/startBerthing";
import {convertWarnFlag, isEmptyObject} from "@/util/common";
import {getBerthList, startBerthing, stopBerthing} from "@/network/request-api";
import {deleteObj, getBerth} from "@/util/content";
//单一靠泊页面
export default {
  name: "singleDocking",
  components: {
    cable,
    vesselAnimation,
    gaugeChartOfDocking,
    lineChartOfDrift,
    lineChartOfDocking,
    startBerthingPage,
  },
  props: {
    //用于确定唯一的div 无其他意义
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
  },
  data() {
    return {
      //显示靠泊界面还是漂移界面  true:靠泊界面  false：漂移界面
      pageVisible: false,
      //船舶svg文件名（不包含.svg后缀）
      vesselSvgName: 'OIL_R',
      vesselWidth: 0,
      vesselLength: 0,
      vesselBerthingDir: '0',
      //左右速度值
      speedLineChartOfDockingData: [],
      //左右距离值
      distanceLineChartOfDockingData: [],
      //船舶的夹角值
      vesselAngle: 0,
      //漂移界面的折线图的数据
      driftLineChartData: {},
      //缆绳拉力数据
      cableTensionData: [],
      hookCables: [],
      //船舶与码头的距离
      vesselDistance: 0,
      leftSwiperValue: 0,
      rightSwiperValue: 0,
      //右键菜单的样式
      contextMenuStyle: {
        display: 'none',
        left: '',
        top: '600',
      },
      //右键菜单中的选项的可见性 true代表可见 false代表不可见
      menuVisible: {
        start: false,//开启靠泊选项的可见性
        stop: false,//结束靠泊选项的可见性
      },
      // allBerthName: [],
      //开启靠泊的对话框是否显示
      startBerthingDialogVisible: false,
      //结束靠泊的对话框是否显示
      stopBerthingDialogVisible: false,
      //实时靠泊监控的选择对话框是否显示
      watchBerthingDialogVisible: false,
      //选择的泊位
      berthId: null,
      //选择的泊位名称
      berthName: null,
      // 泊位id-->berthDTO
      allBerth: new Map(),
      //{label,value}
      allBerthName: [],
      //当前的状态 OFF:关闭 APPROACH：靠泊 MOORING：漂移 DEPARTURE：离泊
      dockingMode: 'OFF',
    }
  },
  computed: {
    //展示在页面上的提示信息
    berthInfo() {
      const {berthName} = this;
      if (berthName !== null) {
        return berthName;
      }
      return "右键选择泊位";
    },
  },
  watch: {
    dockingMode(newValue) {
      //除了漂移状态外，其他都显示同一个页面
      this.pageVisible = newValue !== 'MOORING';
    }
  },
  mounted() {
    // this.receivedMsgChanged(this.receivedMsg);
    this.catchBerth();

    let berth = getBerth();
    if (!berth) {
      // 缓存中没有 默认泊位
      this.watchBerthingDialogVisible = true;
    } else {
      this.berthId = berth.id;
      this.berthName = berth.berthName;
      this.$emit("selectDockingBerth", berth);

      this.menuVisible = berth.dockingMode === "OFF" ? {start: true, stop: false} : {start: true, stop: false};
    }
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    switchPage() {
      this.pageVisible = !this.pageVisible
    },
    receivedMsgChanged(newValue) {
      let serviceType = newValue['serviceType'];
      let message = newValue['send'];
      if (isEmptyObject(message)) {
        return;
      }
      switch (serviceType) {
        case 'terminal':
          this.handleTerminalData(message);
          break;
        case 'hook-station':
          this.handleHookData(message);
          break;
      }
    },
    handleTerminalData(terminalData) {
      let {
        leftDis, rightDis, traceTime,
        rightSpeed, leftSpeed, angle,
        terminalSession,
      } = terminalData;
      this.vesselLength = terminalSession.vesselLength - 0;
      this.vesselWidth = terminalSession.vesselWidth - 0;
      //从msg中实时更新当前的状态
      this.dockingMode = terminalSession.mode;
      let dockingMode = this.dockingMode + '';
      if (dockingMode === 'OFF') {
        this.menuVisible = {start: true, stop: false};
        return;
      } else {
        this.menuVisible = {start: false, stop: true};

        if (dockingMode === 'APPROACH' || dockingMode === 'DEPARTURE') {
          //处于靠泊或是离泊状态时
          //切换到靠泊或离泊界面
          this.pageVisible = true;
          //靠泊界面折线图
          // let speedData = {};
          // speedData['leftText'] = [traceTime, leftSpeed.toFixed(2)];
          // speedData['rightText'] = [traceTime, rightSpeed.toFixed(2)];
          // this.speedLineChartOfDockingData = speedData;
          // let distanceData = {};
          // distanceData['leftText'] = [traceTime, leftDis.toFixed(2)];
          // distanceData['rightText'] = [traceTime, rightDis.toFixed(2)];
          // this.distanceLineChartOfDockingData = distanceData;
          this.speedLineChartOfDockingData = [
            [traceTime, leftSpeed.toFixed(2)],
            [traceTime, rightSpeed.toFixed(2)],
          ];

          this.distanceLineChartOfDockingData = [
            [traceTime, leftDis.toFixed(2)],
            [traceTime, rightDis.toFixed(2)],
          ];

        } else if (dockingMode === 'MOORING') {
          //处于漂移状态时
          //切换到漂移界面
          this.pageVisible = false;
          //漂移界面的左右距离值
          this.leftSwiperValue = leftDis;
          this.rightSwiperValue = rightDis;
          //漂移界面的折线图的值
          let driftLineDate = {'leftDrift': [], 'rightDrift': []};
          driftLineDate['leftDrift'] = [traceTime, leftDis];
          driftLineDate['rightDrift'] = [traceTime, rightDis];
          this.driftLineChartData = driftLineDate;
        }
        this.vesselAngle = angle;
      }
      //船舶离码头距离  左右距离的平均值
      this.vesselDistance = (leftDis + rightDis) / 2;
    },
    /**
     * @interface hookStationRecord
     * @param {number} value--拉力值
     * @param {String} warn-- 警告标志  NORMAL（正常）、ALERT（预警）、 WARN（报警）
     * @param {String} status--脱缆钩的状态 OPENED，CLOSED等
     */
    /**
     *
     * @param {Object} message 格式为{index,refId,hookStationRecords}
     * @param {number} message.refId  这个用不上
     * @param {number} message.index  第几组脱缆钩，从1开始
     * @param {hookStationRecord[]} message.hookStationRecords
     */
    handleHookData(message) {
      this.cableTensionData = message;
      this.$set(this.hookCables,
          message.index - 1,
          message.hookStationRecords.map((item) => this.convertWarnFlag(item))
      );
    },
    convertWarnFlag(flag) {
      return convertWarnFlag(flag);
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
     * 点击开启靠泊按钮
     */
    clickStartBerthing() {
      this.startBerthingDialogVisible = true;
    },
    /**
     * 点击结束靠泊按钮
     */
    clickStopBerthing() {
      this.stopBerthingDialogVisible = true;
    },
    /**
     * 点击实时监控泊位按钮
     */
    clickWatchBerthing() {
      this.watchBerthingDialogVisible = true;
    },
    /**
     * 确定开始靠泊的事件
     * @param vessel {vesselId,vesselName,vesselSvgName,berthingDir}
     * vessel: 船舶id
     * vesselName: 船舶名称
     * vesselSvgName:船舶svg图文件名(不包含.svg后缀)
     * berthingDir: 靠泊方向 1表示左舷靠泊 0表示右舷靠泊
     */
    confirmStartBerthing(vessel) {
      let _this = this;
      //替换靠泊界面的船舶图片
      this.vesselSvgName = vessel.vesselSvgName;
      //隐藏对话框
      this.startBerthingDialogVisible = false;
      //调用开始靠泊api
      let berthId = _this.berthId;
      if (berthId === null) {
        this.$message.error("请先选择泊位！！");
        return;
      }
      let vesselId = vessel.vesselId;
      let berthingDir = vessel.berthingDir;
      startBerthing(berthId, vesselId, berthingDir).then((data) => {
        let info = `泊位:${berthId},船舶id:${vesselId},方向:${berthingDir}--成功开启靠泊`;
        _this.$message.info(info);
        //把当前泊位状态置为靠泊状态
        _this.dockingMode = "APPROACH";
      }).catch(error => {
        _this.$message.error(error.data.msg);
      });
    },
    /**
     * 确定结束靠泊
     */
    confirmStopBerthing() {
      let _this = this;
      let id = _this.berthId;
      if (id === null) {
        this.$message.error("请先选择泊位！！");
        return;
      }
      stopBerthing(id).then(() => {
        let info = `泊位:${id}--结束靠泊成功`;
        _this.$message.info(info);
        //结束靠泊后 把当前泊位状态置为关闭状态
        _this.dockingMode = "OFF";
        _this.reset();
      }).catch(error => {
        _this.$message.error(error.data.msg);
      });
      _this.stopBerthingDialogVisible = false;
    },
    /**
     * 获取所有泊位名称<br/>
     */
    catchBerth() {
      getBerthList({
        condition: [],
        page: 0,
        size: 10,
      }).then(data => {
        const contents = data.content;
        for (const content of contents) {
          let {berthName, id} = content;
          this.allBerth.set(id, content);
          this.allBerthName.push({label: berthName, value: id});
        }
      });
    },
    /**
     * 选中泊位，把泊位id发射出去
     * 并根据选择的泊位状态来决定右键菜单栏选项的显示情况
     */
    selectDockingBerth() {
      const {berthId, allBerth} = this;
      if (berthId !== null) {
        this.reset();
        const berthDTO = allBerth.get(berthId);
        const {berthName, dockingMode} = berthDTO;
        this.berthName = berthName;
        this.dockingMode = dockingMode;
        this.watchBerthingDialogVisible = false;
        // //等于0表示当前泊位是关闭状态 此时显示 开始靠泊 选项
        // if (dockingMode + '' === 'OFF') {
        //   this.menuVisible.start = true;
        //   this.menuVisible.stop = false;
        // } else {
        //   this.menuVisible.start = false;
        //   this.menuVisible.stop = true;
        // }
        this.$emit("selectDockingBerth", berthDTO);
      } else {
        this.$message.error("请先选择一个泊位");
      }
    },
    /**
     * 将组件中的所有显示 重置
     */
    reset() {
      const id = this.id;
      this.$refs.spd.clear();
      this.$refs.dis.clear();
      this.$refs[`${id}-angle`].reset();
      this.$refs[`${id}-vesselDocking1`].reset();
      this.$refs[`${id}-drift`].clear();
      this.$refs[`${id}-vesselDocking2`].reset();
      this.$refs[`${id}-cable`].clear();
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

.berthInfo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.info {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 9rem;
  opacity: 0.1;
  color: #909399;
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

.gaugeChartOfDocking {
  width: 100%;
}

.vesselAnimation {
  /*width: 100%;*/
  height: 100%;
}

/*右键菜单*/
.context-menu {
  display: none;
  width: 200px;
  /*height: 75px;*/
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 1px 1px #888, 1px 0 1px #ccc;
  position: fixed; /*自定义菜单相对与body元素进行定位*/
  z-index: 9999;
}

/*右键菜单选项*/
.menu {
  width: 100%;
  height: 25px;
  line-height: 25px;
  padding: 0 10px;
}

.menu:hover {
  cursor: pointer;
  background-color: purple;
  color: #fff;
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