<template>
  <div class="home">
    <home-panel class="left">
      <home-module @click.native="showBerthSelect">
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          TERMINAL
        </template>
        <template v-slot:msg>{{  berth.berthName }}</template>
      </home-module>
      <home-module>
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          SYSTEM STATUS
        </template>
        <template v-slot:msg>{{ display.mode }}</template>
      </home-module>
      <home-module>
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          LEFT SENSOR
        </template>
        <template v-slot:msg>
          <div v-if="display.left">
            <span>{{ display.left }}</span>
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
          <div v-if="display.right">
            <span>{{ display.right }}</span>
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
          <span class="start-date" v-if="display.time" v-text="display.time[0]" />
          <span class="start-time" v-if="display.time" v-text="display.time[1]" />
          <span v-else>N/A</span>
        </template>
      </home-module>
      <home-module>
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          ELAPSED TIME
        </template>
        <template v-slot:msg>{{ elapsedTimeStr || "N/A" }}</template>
      </home-module>
    </home-panel>
    <home-panel class="main">
      <vessel-animation class="vesselAnimation" :terminal-svg-name="self.terminalSvgName" :id="`${id}_vessel`" :ref="`${id}_vessel`" 
        :hookCables="hookCables" 
        :distance="(terminal.disL + terminal.disR) / 2"
        :angle="terminal.ange"
        :vessel-svg-name="vesselSvgName" 
        :vessel-berthing-dir="berth.dir" 
        :vessel-width="Number(vessel.width)"
        :vessel-length="Number(vessel.length)"
        :vessel-text="vessel.name"
        :vessel-title="vessel.imoNumber"
        :scale-mark="vesselScaleMark" />
      <el-slider v-model="vesselScale" :min="0" :max="1000" :show-tooltip="false" vertical height="200px" class="vessel-scale-slider" />
      <div class="swiperWrap" v-show="display.mode==='Mooring'">
        <near-drift-line class="swiperDrift" :id="id + '-swpier1'" :ref="id + '-swpier1'" :slideItemOptions="swiperOptions" :value="shipDetailData_get.disL" />
        <near-drift-Line class="swiperDrift" :id="id + '-swpier2'" :ref="id + '-swpier2'" :slideItemOptions="swiperOptions" :value="shipDetailData_get.disR" />
      </div>
    </home-panel>
    <!-- 1 -->
    <!-- <home-panel style="grid-column:1/5;grid-row: 9/11;flex-direction: row;">
      <div class="bottom-chart speedChart" style="width:40%;">
      <line-chart-of-docking class="lineChartOfDocking" :id="id+'-speed'" :ref="id+'-speed'" :dataName="['左速度','右速度']" :chart-data="speedLineChartOfDockingData" />
    </div>
    <div class="bottom-chart vesselAngleChart" style="width:20%;">
      <gauge-chart-of-docking class="gaugeChartOfDocking" :id="id+'-angle'" :ref="id+'-angle'" :chart-data="terminal.angle" />
    </div>
    <div class="bottom-chart distanceChart" style="width:40%;">
      <line-chart-of-docking class="lineChartOfDocking" :id="id+'-distance'" :ref="id+'-distance'" :dataName="['左距离','右距离']" :chart-data="distanceLineChartOfDockingData" />
    </div>
    </home-panel> -->
    <!-- 2 -->
    <home-panel class="bottom-chart speedChart">
      <line-chart-of-docking class="lineChartOfDocking" :padding="true" :dataName="['左速度','右速度']" :chart-data="speedLineChartOfDockingData" @storeEvent="speedEvent" :storeData="{berthId,data:speedLineData[berthId]}" />
    </home-panel>
    <home-panel class="bottom-chart vesselAngleChart">
      <gauge-chart-of-docking class="gaugeChartOfDocking" :chart-data="terminal.ange" />
    </home-panel>
    <home-panel class="bottom-chart distanceChart">
      <line-chart-of-docking class="lineChartOfDocking" :padding="true" :dataName="['左距离','右距离']" :chart-data="distanceLineChartOfDockingData" @storeEvent="distanceEvent" :storeData="{berthId,data:distanceLineData[berthId]}"/>
    </home-panel>
    <!--    <home-menu class="home-menu" @show-management="showManagement"></home-menu>-->

    <!--    泊位选择模态框    -->
    <!-- <el-dialog title="泊位" :visible.sync="dialogTableVisible">
      <el-table :data="berthData">
        <el-table-column property="berthName" label="BERTH" width="200" />
        <el-table-column property="dockingMode" label="MODE" width="200" />
        <el-table-column property="wharfName" label="WHARF" width="200" />
        <el-table-column property label>
          <template slot-scope="scope">
            <el-popconfirm :title="`确定更换到泊位${scope.row.berthName}吗？`" @onConfirm="choiceBerth(scope.$index, scope.row, berthData)">
              <el-button type="text" size="small" slot="reference">CHOICE</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog> -->
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
import {  setBerth, strDockingMode } from "@/util/content";
import { calcDate, dateFormat, } from "@/util/common";
import { mapState, mapGetters ,mapMutations, mapActions} from 'vuex'
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
    //swiper配置(近距离漂移的距离值显示配置)
    //{min, max, precision}
    //min:最小值 max:最大值 precision:精度()
    swiperOptions: {
      type: Object,
      default: () => {
        return { min: -2, max: 2.5, precision: 0.02 };
      }
    },
  },
  beforeDestroy() {
    // 清理全部定时任务
    this.intervalArr.forEach((interval) => {
      clearInterval(interval);
    });
  },
  computed: {
    ...mapState({
      berths: state => state.berth.berths,
      berthStatus: state => state.berth.status,
      vessels: state => state.vessel.vessels,
      terminals: state => state.docking.terminal,
      wind: state => state.env.wind,
      tide: state => state.env.tide,
      activeId: state => state.vessel.activeId,
      speedLineData:state => state.vessel.speedLineData,
      distanceLineData:state => state.vessel.distanceLineData,
    }),
    ...mapGetters(['shipDetailData_get']),
    vesselScaleMark() {
      return 3 * (this.vesselScale / 1000) + 2;
    },
    berth() {
      let berthId = this.berthId;
      let { berths, berthStatus } = this;
      return {
        ...berths[berthId],
        ...berthStatus[berthId]
      } ?? { berthName: "未选择", mode: 0 };
    },
    terminal() {
      return this.terminals[this.berthId] ?? {};
    },
    display() {
      let time = this.berth.time;
      // console.log(this.terminals,this.berthId,this.terminal,111)
      return {
        left: this.terminal.disL?.toFixed(2),
        right: this.terminal.disR?.toFixed(2),
        mode: strDockingMode(this.berth.mode),
        time: time && dateFormat(new Date(time))?.split(" ")
      };
    },
    vessel() {
      let id = this.berth?.vessel;
      let vessel = this.vessels[id];
      if (!vessel && id) {
        this.$store.dispatch('vessel/loadVessel', {id});
      }
      return vessel ?? {width: 50, length: 250};
    },
  },
  watch:{
     terminal({time, disL, disR, spdL, spdR}) {
      this.speedLineChartOfDockingData = [
        [time, spdL],
        [time, spdR],
      ];
      this.distanceLineChartOfDockingData = [
        [time, disL],
        [time, disR],
      ];
    }
  },
  created() {
    //渲染terminal文件
    // console.log(this.shipDetailData_get)
    let obj = {
      1: 'TERMINAL1',
      2: 'TERMINAL2',
      3: 'TERMINAL3',
      4: 'TERMINAL4',
      5: 'TERMINAL5',
    }
    this.self.terminalSvgName = obj[this.activeId];
    this.choiceBerthData(this.activeId)
  },
  mounted() {
    let elapsedTimeInterval = setInterval(() => {
      if (this.berth.time) {
        let {hours: H, minutes: m, seconds: s} = calcDate(
            this.berth.time,
            new Date().getTime()
        );
        this.elapsedTimeStr =
          `${H.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
      }
    }, 1000);
    this.intervalArr.push(elapsedTimeInterval);
  },
  data() {
    return {
      id: "home-viewer",
      dialogTableVisible: false,
      berthData: [],
      intervalArr: [],
      startDockingTime: null,
      elapsedTimeStr: null,
      currentBerth: { berthName: "未选择", dockingMode: "OFF" },
      //显示靠泊界面还是漂移界面  true:靠泊界面  false：漂移界面
      pageVisible: true,
      //船舶svg文件名（不包含.svg后缀）
      vesselSvgName: "OIL_R",
      //左右速度值
      speedLineChartOfDockingData: [],
      //左右距离值
      distanceLineChartOfDockingData: [],
      //漂移界面的折线图的数据
      driftLineChartData: {},
      //缆绳拉力数据
      cableTensionData: [],
      //船舶与码头的距离
      vesselDistance: null,
      vesselScale: 500,
      hookCables: [],
      leftSwiperValue: 0,
      rightSwiperValue: 0,
      //右键菜单的样式
      contextMenuStyle: {
        display: "none",
        left: "",
        top: "600",
      },
      //右键菜单中的选项的可见性 true代表可见 false代表不可见
      menuVisible: {
        start: false, //开启靠泊选项的可见性
        stop: false, //结束靠泊选项的可见性
      },
      // allBerthName: [],
      //开启靠泊的对话框是否显示
      startBerthingDialogVisible: false,
      //结束靠泊的对话框是否显示
      stopBerthingDialogVisible: false,
      //选择的泊位
      berthId: null,
      //选择的泊位名称
      berthName: null,
      // 泊位id-->berthDTO
      allBerth: new Map(),
      //{label,value}
      allBerthName: [],
      dockingWebSocket: undefined,
      self: {
        terminalSvgName: "",
      },
    };
  },
  methods: {  
      ...mapMutations('vessel',[
      'setSpeedLineData',
      'setDistanceLineData'
    ]),
    speedEvent(data=[]){
      this.setSpeedLineData({id:this.berthId,data});
    },
    distanceEvent(data=[]){
      this.setDistanceLineData({id:this.berthId,data});
    },
    showBerthSelect(){
      // if(this.$route.path=="/shipall/shipcontrol"){
      //   this.dialogTableVisible = true;
      // }
    },
    choiceBerthData(id) {
      if (id) {
        this.berthId = id;
        this.$nextTick(() => {
          setBerth(this.berth);
        })
      }
    },
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