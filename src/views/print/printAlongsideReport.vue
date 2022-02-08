<template>
  <div>
    <div class="print-button" @click="printPage"><span><i class="fa fa-print"></i>打印</span></div>
    <div class="print-body">
      <print-page :landscape="true">
        <!--标题-->
        <div class="title">{{ baseInfo.title }}</div>
        <!--报表信息-->
        <div>
          <div class="location-right">报表日期：{{ baseInfo.generateReportTraceTime }}</div>
          <div class="line"></div>
        </div>
        <!--码头泊位信息-->
        <berth-and-vessel-info
            :berth-info="berthInfo"
            :dock-info="dockInfo"
            :vessel-info="vesselInfo"
        />
        <div class="line"></div>
        <!--统计信息-->
        <div>
          <table border="1" class="table-information">
            <thead>
            <tr class="td-center">
              <td>范围(m)</td>
              <td>最大速度(cm/s)</td>
              <td>角度(°)</td>
              <td>左距离(m)</td>
              <td>右距离(m)</td>
              <td>风速(cm/s)</td>
              <td>风向</td>
              <td>波浪(m)</td>
              <td>流速(m/s)</td>
              <td>流向(m)</td>
              <td>潮汐(m)</td>
              <td>时间</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="rowData in maxSpeedTableData" class="td-center">
              <td>{{ rowData.scope }}</td>
              <td :class="rowData.maxSpeedColor">{{ rowData.maxSpeed }}</td>
              <td :class="rowData.angleColor">{{ rowData.maxSpeedAngle }}</td>
              <td>{{ rowData.maxSpeedDockingBase.leftDis }}</td>
              <td>{{ rowData.maxSpeedDockingBase.rightDis }}</td>
              <td>{{ rowData.maxSpeedDockingBase.windSpeed }}</td>
              <td>{{ rowData.maxSpeedDockingBase.windDirect }}</td>
              <td>{{ rowData.maxSpeedDockingBase.waveHeight }}</td>
              <td>{{ rowData.maxSpeedDockingBase.flowRate }}</td>
              <td>{{ rowData.maxSpeedDockingBase.flowDir }}</td>
              <td>{{ rowData.maxSpeedDockingBase.tideHeight }}</td>
              <td>{{ rowData.maxSpeedDockingBase.time }}</td>
            </tr>
            </tbody>
          </table>
          <div class="splitArea"></div>
          <table border="1" class="table-information">
            <thead>
            <tr class="td-center">
              <td>范围(m)</td>
              <td>最大角度(°)</td>
              <td>速度(cm/s)</td>
              <td>左距离(m)</td>
              <td>右距离(m)</td>
              <td>风速(cm/s)</td>
              <td>风向</td>
              <td>波浪(m)</td>
              <td>流速(m/s)</td>
              <td>流向(m)</td>
              <td>潮汐(m)</td>
              <td>时间</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="rowData in maxAngleTableData" class="td-center">
              <td>{{ rowData.scope }}</td>
              <td :class="rowData.maxAngleColor">{{ rowData.maxAngle }}</td>
              <td :class="rowData.speedColor">{{ rowData.maxAngleSpeed }}</td>
              <td>{{ rowData.maxAngleDockingBase.leftDis }}</td>
              <td>{{ rowData.maxAngleDockingBase.rightDis }}</td>
              <td>{{ rowData.maxAngleDockingBase.windSpeed }}</td>
              <td>{{ rowData.maxAngleDockingBase.windDirect }}</td>
              <td>{{ rowData.maxAngleDockingBase.waveHeight }}</td>
              <td>{{ rowData.maxAngleDockingBase.flowRate }}</td>
              <td>{{ rowData.maxAngleDockingBase.flowDir }}</td>
              <td>{{ rowData.maxAngleDockingBase.tideHeight }}</td>
              <td>{{ rowData.maxAngleDockingBase.time }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <template #footer-center>{{ footerText }}</template>
      </print-page>
      <!--左右距离趋势图-->
      <print-page :landscape="true">
        <app-dep-distance id="appDepDistance" title="靠泊趋势-左右距离" ref="appDepDistance"/>
        <template #footer-center>{{ footerText }}</template>
      </print-page>
      <!--左右距离趋势图-->
      <print-page :landscape="true">
        <app-dep-speed id="appDepSpeed" title="靠泊趋势-左右速度" ref="appDepSpeed"/>
        <template #footer-center>{{ footerText }}</template>
      </print-page>
      <!--角度趋势图-->
      <print-page :landscape="true">
        <app-dep-angle id="appDepAngle" title="靠泊趋势-角度" ref="appDepAngle"/>
        <template #footer-center>{{ footerText }}</template>
      </print-page>
    </div>
  </div>
</template>

<script>
import printPage from "@/components/common/printPage";
import berthAndVesselInfo from "@/components/content/berthAndVesselInfo";
import {dateFormat} from "@/util/common";
import {deleteObj, getAngleColor, getSpeedColor} from "@/util/content";
import AppDepDistance from "@/components/content/echarts/AppDepDistance";
import AppDepSpeed from "@/components/content/echarts/AppDepSpeed";
import AppDepAngle from "@/components/content/echarts/AppDepAngle";

/*靠离泊的报表*/
export default {
  name: 'printAlongsideReport',
  components: {
    printPage,
    berthAndVesselInfo,
    AppDepDistance,
    AppDepSpeed,
    AppDepAngle,
  },
  beforeMount() {
    this.setReportData();
  },
  mounted() {
    this.setDetailDataChart();
  },
  data() {
    return {
      footerText: '上海永乾科技工程有限公司',//页脚
      baseInfo: {
        title: '',
        generateReportTraceTime: '',
      },
      berthInfo: '',
      vesselInfo: '',
      dockInfo: '',
      maxSpeedTableData: '',
      maxAngleTableData: '',
      detailData: '',
    }
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    setReportData() {
      let dom = window.opener.document.getElementById("printData");
      let printData = JSON.parse(dom.innerHTML);
      let {berthInfo, dockInfo, vesselInfo, report, baseInfo, detailData} = printData;
      this.eachObject(berthInfo);
      this.eachObject(dockInfo);
      this.eachObject(vesselInfo);
      this.eachObject(report);
      //把时间戳格式化   给速度和角度添加颜色
      for (const item of report.maxSpeedTableData) {
        let {maxSpeed, maxSpeedAngle, maxSpeedDockingBase: {traceTime}} = item;
        item.maxSpeedColor = getSpeedColor(maxSpeed - 0);
        item.angleColor = getAngleColor(maxSpeedAngle - 0);
        item.maxSpeedDockingBase.time = dateFormat(new Date(traceTime - 0), "yyyy-MM-dd HH:mm:ss");
      }
      for (const item of report.maxAngleTableData) {
        let {maxAngle, maxAngleSpeed, maxAngleDockingBase: {traceTime}} = item;
        item.maxAngleColor = getAngleColor(maxAngle - 0);
        item.speedColor = getSpeedColor(maxAngleSpeed - 0);
        item.maxAngleDockingBase.time = dateFormat(new Date(traceTime - 0), "yyyy-MM-dd HH:mm:ss");
      }


      this.berthInfo = berthInfo;
      this.vesselInfo = vesselInfo;
      this.dockInfo = dockInfo;
      this.maxAngleTableData = report.maxAngleTableData;
      this.maxSpeedTableData = report.maxSpeedTableData;
      this.detailData = detailData;
      let {title, generateReportTraceTime, type} = baseInfo;
      this.baseInfo = {
        title,
        generateReportTraceTime: dateFormat(new Date(generateReportTraceTime - 0), "yyyy/MM/dd")
      }
    },
    setDetailDataChart() {
      const detailData = this.detailData;
      detailData.sort(this.sortByTraceTime);
      let {distance, speed, angles} = this.transform(detailData);

      this.$refs['appDepDistance'].setChartData(distance);
      this.$refs['appDepSpeed'].setChartData(speed);
      this.$refs['appDepAngle'].setChartData(angles);
    },
    /**
     * 把一个空值替换成"-"
     * @param value
     */
    replaceEmptyValue(value) {
      if (!value && ('0' !== value + '')) {
        return "-";
      }
      return value;
    },
    /**
     * 把对象中所有的空值替换成"-"
     * @param object
     */
    eachObject(object) {
      let _this = this;
      for (let key in object) {
        let value = object[key];
        if (typeof (value) === "object") {
          _this.eachObject(value);
        } else {
          object[key] = _this.replaceEmptyValue(value);
        }
      }
    },
    /**
     * 把[{traceTime: 1586849156849, angle: 0.80804, leftSpeed: 30.44141, leftSpeedTendency: 1, leftDis: 4.37255,…}]
     * 转换成{
     *        distance:{leftDis:[["时间戳","值"]...],rightDis:[["时间戳","值"]...]},
     *        speed:{leftSpeed:[["时间戳","值"]...],rightSpeed:[["时间戳","值"]...]},
     *        angle:[["时间戳","值"]...]
     *      }
     * @param detailData
     */
    transform(detailData) {
      let distance = {leftDis: [], rightDis: []};
      let speed = {leftSpeed: [], rightSpeed: []};
      let angles = [];
      for (let item of detailData) {
        let {traceTime, leftDis, rightDis, leftSpeed, rightSpeed, angle} = item;

        distance.leftDis.push([traceTime, leftDis]);
        distance.rightDis.push([traceTime, rightDis]);

        speed.leftSpeed.push([traceTime, leftSpeed]);
        speed.rightSpeed.push([traceTime, rightSpeed]);

        angles.push([traceTime, angle]);
      }
      return {distance, speed, angles};
    },
    /**
     * 按时间排序
     * @param detail1
     * @param detail2
     * @return {number}
     */
    sortByTraceTime(detail1, detail2) {
      return detail1.traceTime - detail2.traceTime;
    },
    printPage() {
      print();
    }
  }
}

</script>

<style scoped>
.location-right {
  display: flex;
  justify-content: flex-end;
}

.title {
  text-align: center;
  font-size: 2rem;
}

table {
  border-collapse: collapse;
}

.line {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 2px;
  -webkit-print-color-adjust: exact;
  background-color: #000;
}

.splitArea {
  width: 100%;
  height: 3rem;
}

.table-information {
  width: 100%;
}

.td-center td {
  vertical-align: middle;
  text-align: center;
}

.red {
  color: red;
}

.green {
  color: #00ff00;
}

.yellow {
  color: yellow;
}

.app-dep-distance {
  height: 100%;
}

.app-dep-speed {
  height: 100%;
}

.app-dep-angle {
  height: 100%;
}

.print-button {
  cursor: pointer;
  position: fixed;
  top: 200px;
  right: 0;
  height: 3rem;
  border-radius: 5px 0 0 5px;
  color: white;
  text-align: center;
  line-height: 3rem;
  font-size: 1.4rem;
  z-index: 9999;
  width: 6rem;
  background: linear-gradient(60deg, #26c6da, #00acc1);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(0, 188, 212, 0.4);
}

@media screen {
  .print-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1cm;
  }
}

@media print {
  .print-button {
    display: none;
  }
}
</style>