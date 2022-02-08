<template>
  <base-chart class="app-dep-angle" ref="chart"/>
</template>

<script>
import BaseChart from "@/components/content/echarts/BaseChart";
/*靠离泊趋势图*/
export default {
  name: "AppDepAngle",
  components: {
    BaseChart,
  },
  props: {
    title: {
      type: String,
      default: "靠泊趋势-角度",
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    setOption(option) {
      this.$refs.chart.setOption(option);
    },
    init() {
      const {title} = this;
      const options = {
        title: {text: title, x: 'center'},
        tooltip: {trigger: 'axis'},
        xAxis: {name: '时间', type: 'time'},
        yAxis: [
          {
            name: '角度', type: 'value', position: 'left',
            min: value => isFinite(value.min) ? Math.min(-Math.ceil(value.max / 10) * 10, Math.floor(value.min / 10) * 10) : -10,
            max: value => isFinite(value.max) ? Math.max(Math.ceil(value.max / 10) * 10, -Math.floor(value.min / 10) * 10) : 10,
          },
        ],
        grid: {
          // left: '2%',right:'2%'
        },
        series: [
          {
            type: 'line', name: '角度', yAxisIndex: 0, showSymbol: false,
            sampling: 'max', smooth: true, smoothMonotone: 'x'
          },
        ]
      };
      this.setOption(options);
    },
    /**
     *
     * @param values [[时间戳,值]...]
     */
    setChartData(values) {
      const series = [
        {name: '角度', data: values},
      ];
      this.setOption({series});
    }
  }
}
</script>

<style scoped>

</style>