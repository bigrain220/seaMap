<template>
  <div>
    <div class="print-button" @click="printPage"><span><i class="fa fa-print"></i>打印</span></div>
    <div class="print-body">
      <print-page>
        <!--标题-->
        <div class="title">{{ baseInfo.title }}</div>
        <!--报表信息-->
        <div>
          <div class="location-right">报表日期：{{ baseInfo.generateReportTraceTime }}</div>
        </div>
        <div class="line"></div>
        <!--码头泊位信息-->
        <berth-and-vessel-info
            :vessel-info="vesselInfo"
            :dock-info="dockInfo"
            :berth-info="berthInfo"
        />
        <div class="line"></div>
        <!--统计信息-->
        <div v-for="(item,key) in infos">
          <table border="1">
            <tr>
              <td colspan="3">{{ item.label }}:
                <span :class="item.color">{{ item.maxValue }}</span>
              </td>
              <td colspan="3">时间：{{ item.time }}</td>
            </tr>
            <tr class="td-center">
              <td>风力(m/s)</td>
              <td>风向</td>
              <td>潮汐(m)</td>
              <td>波浪(m)</td>
              <td>水流(m/s)</td>
              <td>水流方向</td>
            </tr>
            <tr class="td-center">
              <td>{{ item.windSpeed }}</td>
              <td>{{ item.windDirect }}</td>
              <td>{{ item.tideHeight }}</td>
              <td>{{ item.waveHeight }}</td>
              <td>{{ item.flow }}</td>
              <td>{{ item.flowDir }}</td>
            </tr>
          </table>
        </div>
        <template #footer-center>{{ footerText }}</template>
      </print-page>
      <print-page :landscape="true">
        <app-dep-distance title="漂移趋势" ref="mooringDistance" :max="3" :min="3"/>
      </print-page>
    </div>
  </div>
</template>

<script>
import printPage from "@/components/common/printPage";
import berthAndVesselInfo from "@/components/content/berthAndVesselInfo";
import {dateFormat} from "@/util/common";
import {deleteObj, mooringValueColor, squeezeValueColor} from "@/util/content";
import AppDepDistance from "@/components/content/echarts/AppDepDistance";
/*打印漂移报表*/
export default {
  name: "printDraftReport",
  components: {
    AppDepDistance,
    printPage,
    berthAndVesselInfo,
  },
  beforeMount() {
    this.setData();
  },
  mounted() {
    this.setDetailDataChart();
  },
  data() {
    return {
      footerText: '上海永乾科技工程有限公司',//页脚
      baseInfo: {},
      berthInfo: '',
      vesselInfo: '',
      dockInfo: '',
      infos: {
        // baderneLeft:{
        //  label: '左护舷垫挤压最大值', maxValue: '-0.07', traceTime:'',color:'green',
        // windSpeed:'', windDirect:'', tideHeight:'',
        // waveHeight:'', flow: '', flowDir: '',
        // },
        // baderneRight:{
        //  label: '右护舷垫挤压最大值', maxValue: '-0.07', traceTime:'',color:'green',
        // windSpeed:'', windDirect:'', tideHeight:'',
        // waveHeight:'', flow: '', flowDir: '',
        // },
        // draftLeft:{
        //  label: '左漂移量最大值', maxValue: '1', traceTime:'',color:'green',
        // windSpeed:'', windDirect:'', tideHeight:'',
        // waveHeight:'', flow: '', flowDir: '',
        // },
        // draftRight:{
        //  label: '右漂移量最大值', maxValue: '2.38', traceTime:'',color:'green',
        // windSpeed:'', windDirect:'', tideHeight:'',
        // waveHeight:'', flow: '', flowDir: '',
        // },
      },
      detailData: null,
    }
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    setData() {
      let dom = window.opener.document.getElementById("printData");
      let printData = JSON.parse(dom.innerHTML);
      let {baseInfo, berthInfo, vesselInfo, dockInfo, report, detailData} = printData;
      this.berthInfo = berthInfo;
      this.vesselInfo = vesselInfo;
      this.dockInfo = dockInfo;
      this.detailData = detailData;

      let {title, generateReportTraceTime} = baseInfo;
      this.baseInfo = {
        title,
        generateReportTraceTime: dateFormat(new Date(generateReportTraceTime - 0), "yyyy/MM/dd")
      }
      //用‘-’代替数据中的空值
      this.eachObject(report);
      const {baderneLeft, baderneRight, draftRight, draftLeft} = report;
      //给漂移距离和挤压值设置颜色
      baderneLeft.color = squeezeValueColor(baderneLeft.maxValue);
      baderneLeft.time = this.dateFormat(baderneLeft.traceTime, "yyyy-MM-dd HH:mm");

      baderneRight.color = squeezeValueColor(baderneRight.maxValue);
      baderneRight.time = this.dateFormat(baderneRight.traceTime, "yyyy-MM-dd HH:mm");

      draftRight.color = mooringValueColor(draftRight.maxValue);
      draftRight.time = this.dateFormat(draftRight.traceTime, "yyyy-MM-dd HH:mm");

      draftLeft.color = mooringValueColor(draftLeft.maxValue);
      draftLeft.time = this.dateFormat(draftLeft.traceTime, "yyyy-MM-dd HH:mm");

      this.infos = report;
    },
    setDetailDataChart() {
      const detailData = this.detailData;
      detailData.sort(this.sortByTraceTime);
      let distance = this.transform(detailData);
      this.$refs.mooringDistance.setChartData(distance);
    },
    dateFormat(time) {
      return dateFormat(new Date(time - 0), "yyyy/MM/dd HH:mm:ss");
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
     *      }
     * @param detailData
     */
    transform(detailData) {
      let distance = {leftDis: [], rightDis: []};
      for (let item of detailData) {
        let {traceTime, leftDis, rightDis} = item;
        distance.leftDis.push([traceTime, leftDis]);
        distance.rightDis.push([traceTime, rightDis]);
      }
      return distance;
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

.el-col {
  height: 9rem;
}

.el-col .el-row {
  height: 25%;
}

.line {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 2px;
  background-color: #000;
}

table {
  border-collapse: collapse;
  width: 100%;
  height: 9rem;
  margin-top: 10px;
  margin-bottom: 10px;
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

td[colspan="3"] {
  width: 50%;
}

td:not([colspan]) {
  width: 16.6667%;
}

.app-dep-distance {
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