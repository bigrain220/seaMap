<template>
  <div>
    <!--打印按钮-->
    <div class="print-button" @click="printPage"><span><i class="fa fa-print"></i>打印</span></div>
    <!--封面-->
    <div class="print-body">
      <print-page>{{ coverTitle }}</print-page>
      <template v-for="([chart,table],i) in options">
        <print-chart
            :id="chart.id"
            :page-num="chart.pageNum"
            :title="chart.title"
            :defines="chart.defines"
            :chart-data="chart.chartData"/>
        <template v-for="(item,index) in table.tableData">
          <print-page>
            <el-table :data="item" :border="true" size="mini">
              <el-table-column align="center"
                               v-for="header in table.tableHeader" :key="header.label"
                               v-bind="header"/>
            </el-table>
            <template #header-right>{{ table.title }}</template>
            <template #pageNum>{{ table.pageNum + index }}</template>
          </print-page>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import printChart from "@/views/print/printChart";
import printPage from "@/components/common/printPage";
import {dateFormat, isEmptyObject} from "@/util/common";
import {deleteObj} from "@/util/content";

export default {
  name: "print",
  components: {
    printChart,
    printPage
  },
  data() {
    return {
      //封面标题
      coverTitle: '这里是临时封面标题',
      options: [],
      chartDefines: {
        3: [
          {name: '风力 (m/s)', id: 'speed', attr: 'cur.speed', type: 'line', color: '#009241', position: 'left', offset: 0},
          {name: '风向 (°)', id: 'direct', attr: 'cur.direct', type: 'line', color: '#bbbbbb', position: 'right', offset: 0}
        ],
        14: [
          {name: '潮汐', id: 'tide', attr: 'height', type: 'line', color: '#f09f4f', position: 'left', offset: 0}
        ]
      }
    }
  },
  mounted() {
    this.printForms();
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    printForms() {
      let _this = this;
      let printData = this.getHistoryData();
      console.log("printData: ", printData);
      let {option: {srv, type, name, timeScope}, data} = printData;
      let second = printData.option.secondOption;
      //页码  封面占一页
      let pageNum = 1;
      let options = [];
      Object.entries(data).forEach(([date, data], i) => {
        let chartId = 'chart' + i;
        let tableId = 'table' + i;
        //当前日期无数据则跳过该次循环
        if (isEmptyObject(data)) {
          return true;
        }
        let chartOption = {};
        chartOption.id = chartId;
        chartOption.title = date + _this.getChartTitle(type, second);
        chartOption.defines = _this.chartDefines[type];
        chartOption.pageNum = pageNum;
        chartOption.chartData = data;
        //图表占一页
        ++pageNum;
        //每页展示多少行
        let rowLimit = 26;
        let tableOption = {};
        let typeName = _this.getChartTitle(type, second);
        tableOption.title = `${name} - ${typeName} ${date} 详细信息`;
        tableOption.tableHeader = _this.getTableHeaderByType(type, second);
        let result = [];
        for (let i = 0; i < data.length; i += rowLimit) {
          result.push(data.slice(i, i + rowLimit));
        }
        tableOption.tableData = result;
        tableOption.pageNum = pageNum;
        //表格占的页数和 多少行有关
        pageNum += Math.ceil(data.length / rowLimit);
        i++;
        options.push([chartOption, tableOption])
      })

      _this.options = options;
    },
    /**
     * 获取图表标题
     * @param type 类型 如: wind wave tide
     * @param flag 用于标识第几层层流 或 什么波浪
     */
    getChartTitle(type, flag) {
      switch (type) {
        case 3:
          return '风力风向';
        case 'current':
          return '层流-第' + flag + '层';
        case 14:
          return '潮汐';
        case 'visibility':
          return '可见度';
        case 'pressure':
          return '压力';
        case 'temperature':
          return '气温';
        case 'humidity':
          return '湿度';
        case 'wave':
          let lss = '长';
          if (flag === 'short') {
            lss = '短'
          } else if (flag === 'sign') {
            lss = '有效'
          }
          return '波浪-' + lss + '波';
        case 'waterTemperature':
          return '水温';
      }
    },
    /**
     * 获取表格的表头
     * @param type 类型 如: wind wave tide
     * @param flag 用于标识第几层层流 或 什么波浪
     */
    getTableHeaderByType(type, flag) {
      let tableHeader = [];
      switch (type) {
        case 3:
          tableHeader = [
            {prop: 'cur.traceTime', label: '时间', formatter: (_0, _1, v) => dateFormat(new Date(v), "HH:mm")},
            {prop: 'cur.speed', label: '风速'},
            {prop: 'cur.direct', label: '风向'},
            {prop: 'max.traceTime', label: '最大风速时', formatter: (_0, _1, v) => dateFormat(new Date(v), "HH:mm:ss")},
            {prop: 'max.speed', label: '最大风速'},
            {prop: 'max.direct', label: '最大风速向'},
            {prop: 'min.traceTime', label: '最小风速时', formatter: (_0, _1, v) => dateFormat(new Date(v), "HH:mm:ss")},
            {prop: 'min.speed', label: '最小风速'},
            {prop: 'min.direct', label: '最小风速向'},
          ];
          break;
        case 'current':
          tableHeader = [
            {prop: 'traceTime', label: '时间'},
            {prop: 'speed' + flag, label: '第' + flag + '层流速'},
            {prop: 'direction' + flag, label: '第' + flag + '层流向'},
          ];
          break;
        case 14:
          tableHeader = [
            {prop: 'traceTime', label: '时间', formatter: (_0, _1, v) => dateFormat(new Date(v), "HH:mm:ss")},
            {prop: 'height', label: '高度'},
          ];
          break;
        case 'visibility':
          tableHeader = [
            {prop: 'traceTime', label: '时间'},
            {prop: 'viewAble', label: '可见度'},
            {prop: 'maxViewAbleTraceTime', label: '最大可见度时间'},
            {prop: 'maxViewAble', label: '最大可见度'},
            {prop: 'minViewAbleTraceTime', label: '最小可见度时间'},
            {prop: 'minViewAble', label: '最小可见度'},
          ];
          break;
        case 'pressure':
          tableHeader = [
            {prop: 'traceTime', label: '时间'},
            {prop: 'pressure', label: '气压'},
            {prop: 'maxTraceTime', label: '最大气压时间'},
            {prop: 'maxPressure', label: '最大气压'},
            {prop: 'minTraceTime', label: '最小气压时间'},
            {prop: 'minPressure', label: '最小气压'},
          ];
          break;
        case 'temperature':
          tableHeader = [
            {prop: 'traceTime', label: '时间'},
            {prop: 'temperature', label: '温度'},
            {prop: 'maxTraceTime', label: '最高温度时间'},
            {prop: 'maxTemperature', label: '最高温度'},
            {prop: 'minTraceTime', label: '最低温度时间'},
            {prop: 'minTemperature', label: '最低温度'},
          ];
          break;
        case 'humidity':
          tableHeader = [
            {prop: 'traceTime', label: '时间'},
            {prop: 'humidity', label: '湿度'},
            {prop: 'maxTraceTime', label: '最大湿度时间'},
            {prop: 'maxHumidity', label: '最大湿度'},
            {prop: 'minTraceTime', label: '最小湿度时间'},
            {prop: 'minHumidity', label: '最小湿度'},
          ];
          break;
        case 'wave':
          let lss = '长';
          if (flag === 'short') {
            lss = '短'
          } else if (flag === 'sign') {
            lss = '有效'
          }
          tableHeader = [
            {prop: 'traceTime', label: '时间'},
            {prop: flag + 'WaveHeight', label: '波高'},
            {prop: flag + 'WavePeriod', label: '周期'},
          ];
          break;
        case 'waterTemperature':
          tableHeader = [
            {prop: 'traceTime', label: '时间'},
            {prop: 'waterTemperature', label: '水温'},
          ];
          break;
      }
      return tableHeader;
    },
    /**
     * 从父窗口中获取查询的历史信息
     */
    getHistoryData() {
      let dom = window.opener.document.getElementById("printData");
      return JSON.parse(dom.innerHTML);
    },
    printPage() {
      print();
    }
  }
}
</script>

<style scoped>
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