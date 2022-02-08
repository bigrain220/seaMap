<template>
  <div class="home">
    <home-panel class="left">
      <home-module @click.native="showBerthSelect">
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          TERMINAL
        </template>
        <template v-slot:msg>{{ berth.berthName }}</template>
      </home-module>
      <home-module>
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          STATUS
        </template>
        <template v-slot:msg>{{ display.mode }}</template>
      </home-module>
      <home-module>
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          LEFT
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
          RIGHT
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
          START
        </template>
        <template v-slot:msg>
          <span class="start-date" v-if="display.time" v-text="display.time[0]"/>
          <span class="start-time" v-if="display.time" v-text="display.time[1]"/>
          <span v-else>N/A</span>
        </template>
      </home-module>
      <home-module>
        <template v-slot:title>
          <i class="el-icon-s-home"></i>
          ELAPSED
        </template>
        <template v-slot:msg>{{ elapsedTimeStr || "N/A" }}</template>
      </home-module>
    </home-panel>
    <home-panel class="main">
      <vessel-animation
          class="vesselAnimation"
          :distance="(terminal.disL + terminal.disR) / 2"
          :angle="terminal.ange"
          :hookCables="cable"
          :vessel-svg-name="vessel.img"
          :vessel-dir="berth.dir"
          :vessel-width="Number(vessel.width)"
          :vessel-length="Number(vessel.length)"
          :vessel-text="vessel.name"
          :vessel-title="vessel.imoNumber"
          :scale-mark="vesselScaleMark"
      />
      <el-slider
          v-model="vesselScale"
          :min="0"
          :max="1000"
          :show-tooltip="false"
          vertical
          height="200px"
          class="vessel-scale-slider"
      />
    </home-panel>
    <home-panel class="bottom-chart speedChart">
      <line-chart-of-docking
          class="lineChartOfDocking" :padding="true"
          :dataName="['左速度','右速度']"
          :chart-data="[[terminal.time, terminal.spdL], [terminal.time, terminal.spdR]]"
      />
    </home-panel>
    <home-panel class="bottom-chart vesselAngleChart">
      <gauge-chart-of-docking class="gaugeChartOfDocking" :id="id+'-angle'" :ref="id+'-angle'"
                              :chart-data="terminal.ange"/>
    </home-panel>
    <home-panel class="bottom-chart distanceChart">
      <line-chart-of-docking
          class="lineChartOfDocking" :padding="true"
          :dataName="['左距离','右距离']"
          :chart-data="[[terminal.time, terminal.disL], [terminal.time, terminal.disR]]"
      />
    </home-panel>

    <!--    <home-menu class="home-menu" @show-management="showManagement"></home-menu>-->

    <!--    泊位选择模态框    -->
    <el-dialog title="泊位" :visible.sync="visible.dialogTable">
      <el-table :data="Object.values(berths)">
        <el-table-column property="berthName" label="BERTH" width="200"/>
        <el-table-column property="mode" label="MODE" width="200"/>
        <el-table-column>
          <template slot-scope="scope">
            <el-popconfirm @confirm="choiceBerth(scope.row.id)" :title="`确定更换到泊位${scope.row.berthName}吗？`">
              <el-button type="text" size="small" slot="reference">CHOICE</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import HomePanel from "@/components/content/HomePanel.vue";
import HomeMenu from "@/components/content/HomeMenu";
import HomeModule from "@/components/content/HomeModule";
import vesselAnimation from "@/components/content/vesselAnimation";
import lineChartOfDocking from "@/components/content/echarts/lineChartOfDocking";
import gaugeChartOfDocking from "@/components/content/echarts/gaugeChartOfDocking";
import {getBerth, setBerth, strDockingMode} from "@/util/content";
import {calcDate, dateFormat,} from "@/util/common";
import {mapState} from 'vuex';

export default {
  name: "Home",
  components: {
    HomeModule,
    HomePanel,
    HomeMenu,
    vesselAnimation,
    lineChartOfDocking,
    gaugeChartOfDocking,
  },
  computed: {
    ...mapState({
      berths: state => state.berth.berths,
      berthStatus: state => state.berth.status,
      vessels: state => state.vessel.vessels,
      terminals: state => state.docking.terminal,
      cables: state => state.docking.cables,
      warn: state => state.env.warn,
    }),
    display() {
      let time = this.berth.time;
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
      if (id && !vessel) {
        this.$store.dispatch('vessel/loadVessel', {id});
      }
      return vessel ?? {width: 50, length: 250, name: "Loading"};
    },
    terminal() {
      return this.terminals[this.berthId] ?? {};
    },
    cable() {
      return this.cables[this.berthId] ?? [];
    },
    berth() {
      let berthId = this.berthId;
      let {berths, berthStatus} = this;
      return {
        ...berths[berthId],
        ...berthStatus[berthId]
      } ?? {berthName: "未选择", mode: 0};
    },
    vesselScaleMark() {
      return (3 * this.vesselScale) / 1000 + 5;
    },
  },
  mounted() {
    let elapsedTimeInterval = setInterval(() => {
      if (this.berth.time) {
        let {hours: H, minutes: m, seconds: s} = calcDate(
            this.berth.time,
            new Date().getTime()
        );
        this.elapsedTimeStr = [H,m,s].map(s=>s.toString().padStart(2,"0")).join(":");
      }
    }, 1000);
    this.intervalArr.push(elapsedTimeInterval);
    const berths = Object.keys(this.berths);
    if (berths.length) {
      console.log(`${berths.length} berths loaded`)
      this.choiceBerthData(this.berths[getBerth()?.id] ? getBerth()?.id : berths[0]);
    }
  },
  watch: {
    berths(n, o) {
      const keys = [n, o].map(Object.keys);
      if (keys[0].length && !keys[1].length) {
        console.log(`${keys[0].length} berths loaded`)
        this.choiceBerthData(n[getBerth()?.id] ? getBerth()?.id : keys[0][0]);
      }
    }
  },
  data() {
    return {
      //选择的泊位
      berthId: null,
      visible: {
        dialogTable: false
      },
      vesselScale: 500,
      intervalArr: [],
      elapsedTimeStr: null,
      /**
       * @deprecated
       */
      id: "home-viewer",
    };
  },
  methods: {
    showBerthSelect() {
      this.visible.dialogTable = true;
    },
    choiceBerth(id) {
      this.choiceBerthData(id);
      this.visible.dialogTable = false;
    },
    choiceBerthData(id) {
      this.berthId = id;
      this.$nextTick(() => {
        setBerth(this.berth);
      })
    }
  },
  beforeDestroy() {
    this.intervalArr.forEach(clearInterval);
  },
};
</script>

<style scoped>
.home {
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

@media screen and (max-height: 600px) {
  .left {
    font-size: 10px;
  }
}

@media screen and (max-height: 500px) {
  .left {
    font-size: 8px;
  }

  .left >>> .home-module {
    flex-direction: row;
    justify-content: space-between;
    padding: 0 3%;
  }
}

.left >>> .home-module .msg {
  font-size: 1.5em;
}

.left >>> .home-module .start-date {
  font-size: 1em;
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
</style>