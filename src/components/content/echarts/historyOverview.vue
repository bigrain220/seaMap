<template>
  <div class="history-overview">
    <base-chart ref="chart"/>
  </div>
</template>

<script>
import BaseChart from "@/components/content/echarts/BaseChart";
import {deleteObj} from "@/util/content";

export default {
  name: "historyOverview",
  components: {BaseChart},
  props: {
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      config: {
        3: {
          name: this.$t('chart.historyExclude.yAxisWindSpeedName'),
          unit: "m/s",
          color: '#009241',
        },
        14: {
          name: this.$t('chart.historyExclude.yAxisTideName'),
          unit: "m",
          color: '#18895d',
        },
      },
      colorObj:{
        wind1:{color:'#cde5ff'},
        wind2:{color:'#6ec71e'},
        wind3:{color:'#f56e6a'},
        tide1:{color:'#4fa8f9' }
      }
    }
  },
  watch: {
    chartData(d) {
      let {info, series} = d;
      let baseOption = this.getBaseOption(info);
      let option = {baseOption, options: []};
      Object.entries(series).forEach(([date, series]) => {
        option.baseOption.timeline.data.push(date);
        option.options.push({series});
      })
      if (Object.keys(series).length < 2) {
        option.baseOption.timeline.data = [];
        option.baseOption.timeline.show = false;
      } else {
        option.baseOption.timeline.show = true;
      }
      this.setOption(option)
    }
  },
  methods: {
    setOption(option) {
      this.$refs.chart.setOption(option);
    },
    getBaseOption(data) {
      let _info = Object.entries(data);

      let legend = {type: 'scroll', data: _info.map(([, {name}]) => name), textStyle: {color: "white"}}
      let indexMap = Array.from(new Set(_info.map(([, {type}]) => type).sort((a, b) => a - b)));
      let series = _info.map(([id, {name, type}]) => {
        return {
          id, name,
          type: 'line',
          // sampling: 'average', smoothMonotone: 'x',
          showSymbol: false, hoverAnimation: false,
          // smooth: true,
          yAxisIndex: indexMap.findIndex(t => t === type),
          color:this.colorObj[name]?.color
        }
      });
      let half = indexMap.length / 2;
      let yAxis = indexMap.map((t, i) => {
        let {name, unit, color} = this.config[t];
        return {
          type: 'value',
          name: `${name} (${unit})`,
          nameRotate: -45,
          position: i >= half ? "right" : "left",
          offset: 25 * (i >= half ? i - half : i),
          axisLine: {lineStyle: {color}},
        }
      })
      return {
        tooltip: {trigger: 'axis'},
        timeline: {
          axisType: 'category',
          show: false,
          data: [],
          controlStyle: {show: false},
          label: {rotate: -45,color:'#eee'}
        },
        xAxis: {
          name: this.$t('chart.historyExclude.time'), type: 'time',
          axisLine: {
            show: true,
            lineStyle: {color: "gray"}
          }
        },
        grid: {bottom: 150},
        dataZoom: [{type: 'slider', xAxisIndex: 0, bottom: 80}],
        yAxis, legend, series,
      };
    }
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
}
</script>

<style scoped>

</style>