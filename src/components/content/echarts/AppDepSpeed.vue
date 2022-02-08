<template>
  <base-chart class="app-dep-speed" ref="chart"/>
</template>

<script>
import BaseChart from "@/components/content/echarts/BaseChart";
/*靠离泊趋势图*/
export default {
  name: "AppDepSpeed",
  components: {
    BaseChart,
  },
  props: {
    title: {
      type: String,
      default: "靠泊趋势-速度",
    },
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
        legend: {data: ["左速度", "右速度"], right: '10',},
        tooltip: {trigger: 'axis'},
        xAxis: {name: '时间', type: 'time'},
        yAxis: [
          {
            name: '速度', type: 'value', position: 'left',
            max: value => isFinite(value.max) && isFinite(value.min) ? Math.ceil(Math.max(Math.abs(value.min), value.max) / 20) * 20 : undefined,
            min: value => isFinite(value.max) && isFinite(value.min) ? -Math.ceil(Math.max(Math.abs(value.min), value.max) / 20) * 20 : undefined,
            interval: 20, axisLabel: {formatter: Math.abs}
          },
        ],
        series: [
          {
            type: 'line', name: '左速度', yAxisIndex: 0,
            sampling: 'max', showSymbol: false, smooth: 0.3, smoothMonotone: 'x'
          },
          {
            type: 'line', name: '右速度', yAxisIndex: 0,
            sampling: 'max', showSymbol: false, smooth: 0.3, smoothMonotone: 'x'
          },
        ]
      };
      this.setOption(options);
    },
    /**
     *
     * @param values {{leftDis:[["时间戳","值"]...],rightDis:[["时间戳","值"]...]}}
     */
    setChartData(values) {
      const {leftSpeed, rightSpeed} = values;
      const series = [
        {name: '左速度', data: leftSpeed},
        {name: '右速度', data: rightSpeed.map(({0: t, 1: v}) => [t, -v])},
      ];
      this.setOption({series});
    }
  }
}
</script>