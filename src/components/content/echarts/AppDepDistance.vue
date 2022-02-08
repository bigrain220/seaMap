<template>
  <base-chart class="app-dep-distance" ref="chart"/>
</template>

<script>
import BaseChart from "@/components/content/echarts/BaseChart";
/*靠离泊趋势图，漂移趋势图*/
export default {
  name: "AppDepDistance",
  components: {
    BaseChart,
  },
  props: {
    title: {
      type: String,
      default: "靠泊趋势",
    },
    max: {
      type: Number,
      default: 10,
    },
    min: {
      type: Number,
      default: undefined,
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
        legend: {data: ["左距离", "右距离"], right: "10"},
        tooltip: {trigger: 'axis'},
        xAxis: {name: '时间', type: 'time'},
        yAxis: [
          {
            name: '距离', type: 'value', position: 'left',
            max: value => isFinite(value.max) && isFinite(value.min) ? Math.ceil(Math.max(Math.abs(value.min), value.max) / this.max) * this.max : undefined,
            min: value => this.min && isFinite(value.max) && isFinite(value.min) ? -Math.ceil(Math.max(Math.abs(value.min), value.max) / this.min) * this.min : undefined,
          },
        ],
        grid: {
          // left: '2%',right:'2%'
        },
        series: [
          {
            type: 'line', id: 'leftDis', name: '左距离', yAxisIndex: 0, symbol: 'none',
            sampling: 'average', smooth: true, smoothMonotone: 'x',
          },
          {
            type: 'line', id: 'rightDis', name: '右距离', yAxisIndex: 0, symbol: 'none',
            sampling: 'average', smooth: true, smoothMonotone: 'x',
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
      const {leftDis, rightDis} = values;
      const series = [
        {id: 'leftDis', name: '左距离', data: leftDis},
        {id: 'rightDis', name: '右距离', data: rightDis},
      ];
      this.setOption({series});
    }
  }
}
</script>