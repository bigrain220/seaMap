<template>
  <print-page :landscape="true" :page="pageNum">
    <base-chart class="chart" ref="chart"/>
  </print-page>
</template>

<script>
import printPage from "@/components/common/printPage";
import BaseChart from "@/components/content/echarts/BaseChart";

export default {
  name: "printChart",
  components: {BaseChart, printPage},
  props: {
    //元素的id
    id: {
      type: String,
      required: true
    },
    //图表标题
    title: {
      type: String,
      required: true
    },
    //起始页码
    pageNum: {
      type: Number,
      default: 1
    },
    defines: {
      type: Array,
      required: true
    },
    //展示在图表上的数据
    chartData: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.init();
    this.setChartData();
  },
  methods: {
    setOption(option) {
      this.$refs.chart.setOption(option);
    },
    init() {
      let title = this.title;
      let yLines = this.defines;
      let option = {
        title: {text: title + '趋势图', x: 'center'},
        xAxis: [{name: '时间', type: 'time'},],
        yAxis: [],
        series: [],
        grid: {left: "5%"},
      };
      yLines.forEach(({id, name, type, offset, position, color}, i) => {
        option.yAxis.push({
          name, position, offset, type: 'value', axisLine: {lineStyle: {color}},
        });
        option.series.push({
          id, name, type,
          xAxisIndex: 0, yAxisIndex: i, lineStyle: {color},
          showSymbol: false, smooth: 0.3, smoothMonotone: 'x',
        });
      });
      this.setOption(option);
    },
    setChartData() {
      let dataOfChart = {};
      this.chartData.forEach(item => {
        this.defines.forEach(({id, attr}) => {
          let data = attr.split(".").reduce((obj, attr) => obj[attr], item);
          (dataOfChart[id] ??= []).push([item.traceTime, data]);
        });
      });
      this.setOption({
        series: Object.entries(dataOfChart).map(([id, data]) => {
          return {id, data}
        })
      });
    }
  }
}
</script>

<style scoped>
.chart {
  height: 600px;
  width: 100%;
}
</style>