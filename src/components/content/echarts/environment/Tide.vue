<template>
  <div class="env-tide">
    <div class="text">
      <span class="title"><i class=" icon env-icon icon-chaoxineng"></i>潮汐值</span>
      <span class="value">{{ display.height }}m</span>
      <span class="value">{{ display.tendency }}</span>
    </div>
    <div class="chart">
      <base-chart ref="chart"/>
    </div>
  </div>
</template>

<script>
import {deleteObj} from "@/util/content";
import BaseChart from "@/components/content/echarts/BaseChart";

export default {
  name: "Tide",
  components: {
    BaseChart,
  },
  props: {
    range: {
      type: Number,
      default: 360
    },
    chartData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tendencyText: ["平潮", "落潮", "涨潮"],
      dataList: [],
    }
  },
  computed: {
    display() {
      let data = this.chartData[0];
      return {
        height: data?.height,
        tendency: this.tendencyText[data?.tendency ?? 0]
      }
    }
  },
  watch: {
    chartData(newValue) {
      this.setChartData(newValue);
    },
    dataList(list) {
      this.setSeries(
          list.map(d => this.paddingSeries(d, (d?.[d.length - 1].name - this.range * 1000))).map(data => {
            return {data}
          }))
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    deleteObj(this.$data)
  },
  methods: {
    setOption(option) {
      this.$refs.chart.setOption(option);
    },
    setSeries(series) {
      this.$refs.chart.setSeries(series);
    },
    init() {
      const option = {
        grid: {
          top: 30,
          bottom: 20,
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          name: '时间',
          type: 'time',
          axisLabel: {
            color: '#909399'
          },
          axisLine: {
            lineStyle: {
              color: '#909399'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              opacity: 0.1,
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            position: 'left',
            axisLabel: {
              color: '#00bdfd'
            },
            axisLine: {
              lineStyle: {
                fontSize: 1,
                color: '#00bdfd'
              }
            },
            max: value => isFinite(value.max) && isFinite(value.min) ? Math.ceil(Math.max(Math.abs(value.min), value.max) / 10) * 10 : 30,
            min: value => isFinite(value.max) && isFinite(value.min) ? -Math.ceil(Math.max(Math.abs(value.min), value.max) / 10) * 10 : 0,
            splitNumber: 3,
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                opacity: 0.1,
              }
            }
          },
        ],
        series: [
          {
            name: '潮汐值', type: 'line', symbol: 'none',
            xAxisIndex: 0, yAxisIndex: 0, symbolSize: 8,
            areaStyle: {}, lineStyle: {color: '#51e5f7'}, itemStyle: {color: '#51e5f7'},
          }
        ]
      };
      this.setOption(option);
    },
    setChartData(data) {
      if (data?.[0]) {
        data.forEach(({time, height}, i) => {
          let d = [time, height];
          let list = this.dataList?.[i];
          if (list?.find(l => d[0] === l?.name)) {
            return;
          }
          let headTime = d[d.length - 1] - this.range * 1000;
          this.$set(this.dataList, i, [
            ...list?.filter(l => l.value?.[1] != null && l.name > headTime - 100) ?? [],
            {name: d[0], value: d}
          ])
        });
      }
    },
    paddingSeries(series, start, end = start + (this.range * 1000)) {
      let allow = series?.filter(l => l.value?.[1] != null && l.name > start - 100) ?? [];

      if (allow.length) {
        if (Math.abs(allow[0].name - start) < 100) {
          allow[0].name = allow[0].value[0] = start;
          return allow;
        } else {
          allow = allow.filter(l => l.name >= start);
        }
      }
      if (!allow.find(a => a.name >= end)) {
        allow.push({name: end, value: [end, null]});
      }
      return [{name: start, value: [start, null]}, ...allow];
    },
  }
}
</script>

<style scoped>
.env-tide {
  width: 100%;
  height: 100%;
}

.text {
  height: 20%;
  width: 100%;
  font-size: 10px;
  color: #909399;
  display: table;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.text > * {
  display: table-cell;
  text-align: center;
  padding-top: 10px;
}

.chart {
  height: 80%;
  width: 100%;
}

.text .value {
  margin-left: 10%;
}
</style>