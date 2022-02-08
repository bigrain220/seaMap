<template>
  <home-panel style="height: 100%;">
    <el-tabs v-model="activeNameDefault">
      <el-tab-pane label="靠泊报表" name="docking">
        <div class="report-generation">
          <docking-record class="row" @recordSelected="recordSelected"/>
          <el-row class="row" :gutter="10">
            <el-col :span="15">
              <!--    占位透明度为0    -->
              <div style="opacity:0;">_</div>
            </el-col>
            <el-col :span="6">
              <el-select
                  style="width: 100%"
                  v-model="reportType"
                  placeholder="选择报表类型">
                <el-option
                    v-for="type in reportTypeSelectOption"
                    :label="type.label"
                    :value="type.value"
                    :key="type.value"/>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-button style="width: 100%" @click="clickReportButton" :disabled="!load">生成报表</el-button>
            </el-col>
          </el-row>
          <!--用于把数据传送到子窗口-->
          <div style="display: none" id="printData"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="环境报表" name="env" :class="'env-base-area'">
        <history/>
      </el-tab-pane>
    </el-tabs>
  </home-panel>
</template>

<script>
import dockingRecordSelect from "@/components/content/dockingRecordSelect";
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import {deleteObj} from "@/util/content";
import HomePanel from "@/components/content/HomePanel";
import CommonTable from "@/components/common/CommonTable";
import DockingRecord from "@/components/content/DockingRecord";
import history from "@/views/main/history"
import {mapState} from "vuex";
import {getApproachReport, getDepartureReport, getMooringReport, getRecords} from "@/api/docking";
import AppDepDistance from "@/components/content/echarts/AppDepDistance";

export default {
  name: 'reportGeneration',
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll,
  },
  components: {history, DockingRecord, CommonTable, HomePanel, dockingRecordSelect, AppDepDistance},
  data() {
    return {
      activeNameDefault: 'docking',
      reportType: 1,
      reportTypeSelectOption: [
        {value: 1, label: '靠泊'},
        {value: 2, label: '漂移'},
        {value: 3, label: '离泊'},
      ],
      reportTypeMapWindow: {
        1: '/print/printAlongsideReport',
        2: '/print/printDraftReport',
        3: '/print/printAlongsideReport',
      },
      record: {},
      records: [[], [], []],
      load: false,
    }
  },
  computed: {
    ...mapState({
      berths: state => state.berth.berths,
      vessels: state => state.vessel.vessels,
    }),
    vessel() {
      let id = this.record?.vesselId;
      return this.vessels[id];
    },
    berth() {
      let berthId = this.record?.berthId;
      return this.berths[berthId];
    },
    partRecords() {
      let type = this.reportType;
      return this.records[type - 1];
    }
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    /**
     * 生成报表的按钮点击事件
     */
    async clickReportButton() {
      if (!this.check()) {
        return;
      }
      const {
        reportType,
        record: {
          id: dockingId,
        },
        berth: berthInfo,
        vessel: vesselInfo,
        partRecords: detailData,
      } = this;

      if (reportType === 1) {
        let {generateReportTraceTime, reportDetails, dockingRecord} = await getApproachReport(dockingId)
        let baseInfo = {title: "靠泊报表", type: 1, generateReportTraceTime};
        let dockInfo = this.handleDockInfo(dockingRecord),
            report = this.handleAppOrDepReportInfo(reportDetails);
        const printData = {baseInfo, berthInfo, vesselInfo, dockInfo, report, detailData};
        this.openChildWindow(printData, reportType);
      } else if (reportType === 3) {
        let {generateReportTraceTime, reportDetails, dockingRecord} = await getDepartureReport(dockingId)
        let baseInfo = {title: "离泊报表", type: 3, generateReportTraceTime,};
        let dockInfo = this.handleDockInfo(dockingRecord),
            report = this.handleAppOrDepReportInfo(reportDetails);
        const printData = {baseInfo, berthInfo, vesselInfo, dockInfo, report, detailData};
        this.openChildWindow(printData, reportType);
      } else if (reportType === 2) {
        let {generateReportTraceTime, reportDetails, dockingRecord} = await getMooringReport(dockingId)
        let baseInfo = {title: '漂移报表', generateReportTraceTime};
        let dockInfo = this.handleDockInfo(dockingRecord),
            report = this.handleMooringReportInfo(reportDetails);
        const printData = {baseInfo, berthInfo, vesselInfo, dockInfo, report, detailData};
        this.openChildWindow(printData, reportType);
      }
    },
    openChildWindow(printData, reportType) {
      document.getElementById("printData").innerHTML = JSON.stringify(printData);
      let routeUrl = this.$router.resolve({path: this.reportTypeMapWindow[reportType]});
      window.open(routeUrl.href, '_blank', 'menubar=no,toolbar=no,personalbar=no,location=no,resizable=no,scrollbars=yes,status=no,chrome=yes,centerscreen=yes,attention=yes,dialog=yes')
    },
    /**
     * 选择靠泊记录的事件
     * @param record {{id,dockingHistoryId,berth,vessels,beginDate,endDate,dockDirection,dockDirectionStr}}
     */
    recordSelected(record) {
      this.record = record;
      this.records = [[], [], []];
      this.loadDockingData(record.id).then(() => {
        this.load = true;
      }).catch(() => {
        this.$message.error("加载错误")
        this.load = false;
      });
    },
    /**
     * 从数据中提取出靠泊信息
     * @param data
     * @return {{beginDate, endDate, dockDirection}}
     */
    handleDockInfo(data) {
      let {
        timeStart: beginDate,
        timeComplete: endDate,
        dockDirection,
      } = data;
      return {beginDate, endDate, dockDirection}
    },
    /**
     * 从数据中提取出靠离泊报表信息
     * @param reportDetails
     */
    handleAppOrDepReportInfo(reportDetails) {
      let reports = {
        maxSpeedTableData: [],
        maxAngleTableData: [],
      };
      reportDetails.forEach(({
                               farDistance, nearDistance,
                               maxSpeed, maxSpeedAngle, maxSpeedDockingBase,
                               maxAngle, maxAngleSpeed, maxAngleDockingBase
                             }) => {
        let scope = farDistance + "-" + nearDistance;
        reports.maxSpeedTableData.push({scope, maxSpeed, maxSpeedAngle, maxSpeedDockingBase});
        reports.maxAngleTableData.push({scope, maxAngle, maxAngleSpeed, maxAngleDockingBase});
      })
      return reports;
    },
    /**
     * 从数据中提取出漂移报表信息
     * @param data 虽说是一个数组 但里面只有一个对象
     */
    handleMooringReportInfo([reportDetails]) {
      const {
        maxLeftDis, maxLeftDisEnvBase,
        minLeftDis, minLeftDisEnvBase,
        maxRightDis, maxRightDisEnvBase,
        minRightDis, minRightDisEnvBase
      } = reportDetails;
      //左护舷垫挤压最大值时其他数据
      let {windSpeed, windDirect, waveHeight, tideHeight, traceTime} = minLeftDisEnvBase;
      const baderneLeft = {
        label: '左护舷垫挤压最大值', maxValue: minLeftDis, traceTime,
        windSpeed, windDirect, tideHeight,
        waveHeight, flow: '', flowDir: '',
      };

      //右护舷垫挤压最大值时其他数据
      ({windSpeed, windDirect, waveHeight, tideHeight, traceTime} = minRightDisEnvBase);
      const baderneRight = {
        label: '右护舷垫挤压最大值', maxValue: minRightDis, traceTime,
        windSpeed, windDirect, tideHeight,
        waveHeight, flow: '', flowDir: '',
      };


      //左漂移量最大值时其他数据
      ({windSpeed, windDirect, waveHeight, tideHeight, traceTime} = maxLeftDisEnvBase);
      const draftLeft = {
        label: '左漂移量最大值', maxValue: maxLeftDis, traceTime,
        windSpeed, windDirect, waveHeight,
        tideHeight, flow: '', flowDir: '',
      };

      //右漂移量最大值时其他数据
      ({windSpeed, windDirect, waveHeight, tideHeight, traceTime} = maxRightDisEnvBase);
      const draftRight = {
        label: '右漂移量最大值', maxValue: maxRightDis, traceTime,
        windSpeed, windDirect, tideHeight,
        waveHeight, flow: '', flowDir: '',
      };

      return {baderneLeft, baderneRight, draftLeft, draftRight};
    },
    async loadDockingData(id) {
      let {terminal} = await getRecords(id);
      let {timeStart, timeMooring, timeDeparture, timeComplete} = this.record;
      this.records = [
        terminal.filter(t => t.traceTime >= timeStart && t.traceTime < timeMooring),
        terminal.filter(t => t.traceTime >= timeMooring && t.traceTime < timeDeparture),
        terminal.filter(t => t.traceTime >= timeDeparture && t.traceTime < timeComplete)
      ];
    },
    /**
     * 检查是否选择了对应选项
     * @return Boolean 检查是否通过
     */
    check() {
      let record = this.record;
      if (!record || !record.id) {
        this.$message.error("先选定一条靠泊记录");
        return false;
      }
      let type = this.reportType;
      if (!type) {
        this.$message.error("指定要打印的报表类型");
        return false;
      }
      return true;
    },
  }
}

</script>
<style scoped>
.report-generation {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.row {
  margin-bottom: 10px;
}

.el-table >>> .red {
  color: red;
}

.el-table >>> .green {
  color: #00ff00;
}

.el-table >>> .yellow {
  color: yellow;
}

.el-tabs >>> .el-tabs__nav-wrap::after {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0;
  display: none;
}

.el-tabs >>> .el-tabs__item.is-active, .el-tabs >>> .el-tabs__item:hover {
  color: #ffffff;
}

.el-tabs >>> .el-tabs__item {
  color: #909399;
}

.el-tabs >>> .el-tabs__nav {
  margin-left: 20px;
}

.env-base-area {
  height: 100%;
}

.el-tabs >>> .el-tabs__content {
  height: calc(100% - 55px);
}

.el-tabs {
  height: 100%;
}

</style>
