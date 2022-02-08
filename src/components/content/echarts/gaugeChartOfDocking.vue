<template>
  <div class="gauge-chart-of-docking">
    <base-chart ref="chart"
    />
  </div>
</template>

<script>
import baseEchart from "@/components/content/echarts/baseEchart";
import {deleteObj} from "@/util/content";
import BaseChart from "@/components/content/echarts/BaseChart";
/*靠泊界面的角度图*/
export default {
  name: "gaugeChartOfDocking",
  components: {BaseChart, baseEchart},
  props: {
    //图表要显示的值
    chartData: {
      type: Number,
    },
    id:{
      type:String
    }
  },
  data() {
    return {}
  },
  watch: {
    chartData(newValue) {
      this.setChartData(newValue);
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    setOption(option) {
      this.$refs.chart.setOption(option);
    },
    init() {
      let option = {
        series: [
          {
            type: 'gauge', min: 0, max: 120, splitNumber: 12, radius: '85%',
            axisTick: {
              lineStyle: {
                color: '#6c6f72'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#6c6f72'
              }
            },
            axisLabel: {
              formatter: function (value) {
                let abs = Math.abs(value - 60);
                if (abs === 60 || abs === 30 || abs === 0) {
                  return abs;
                } else {
                  return '';
                }
              },
              distance: -12
            },
            detail: {
              offsetCenter: [0, '80%'],
              formatter: value => Math.abs(value - 60)
            },
            axisLine: {
              lineStyle: {color: [[0.5, '#909399'], [1, '#555656']], width: 10}
            },
            pointer: {width: 4},
            data: [60]
          },

        ]
      };
      this.setOption(option);
    },
    /**
     *
     * @param data 正数为右夹角、负数为左夹角
     */
    setChartData(data) {
      let value = (data + 60).toFixed(0);
      this.setOption({series: [{data: [value]}]})
    },
    /**
     * 置为0
     */
    reset() {
      this.setChartData(0);
    }
  }
}
</script>

<style scoped>

</style>