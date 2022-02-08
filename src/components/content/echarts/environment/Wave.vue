<template>
  <div class="env-wave">
    <div class="text">
      <span class="title"><i class=" icon env-icon icon-bolangneng"></i>波浪值</span>
      <span class="value">{{ waveValue }}m</span>
      <span class="value">{{ wavePeriod }}s</span>
    </div>
    <div class="chart">
      <base-chart ref="chart"/>
    </div>
  </div>
</template>

<script>
import BaseChart from "@/components/content/echarts/BaseChart";
import {deleteObj} from "@/util/content";

export default {
  name: "Wave",
  components: {
    BaseChart,
  },
  data() {
    return {
      waveValue: 0,//当前浪高
      wavePeriod: 0,//波浪周期
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
    init() {
      const option = {
        grid: {
          top: 30,
          bottom: 20,
        },
        xAxis: {
          name: '时间',
          nameRotate: 90,
          type: 'time',
          // data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
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
            name: '周期s',
            type: 'value',
            position: 'left',
            axisLabel: {
              color: '#e78724'
            },
            axisLine: {
              lineStyle: {
                color: '#e78724'
              }
            },
            splitLine: {
              show: false,
            }
          },
          {
            name: '波浪值',
            type: 'value',
            min: 0,
            max: 12,
            position: 'right',
            axisLabel: {
              color: '#51e5f7'
            },
            axisLine: {
              lineStyle: {
                color: '#51e5f7'
              }
            },
            splitNumber: 12,
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                opacity: 0.1,
              }
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
        },
        series: [
          {
            name: 'waveValue',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 1,
            lineStyle: {
              color: '#51e5f7',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 1, x2: 0, y2: 0,
                colorStops: [
                  {offset: 0, color: 'rgb(81,229,247,0)'},
                  {offset: 1, color: 'rgb(81,229,247,1)'},
                ]
              }
            },
            // data: [['1', 1], ['5', 3], ['10', 5], ['15', 4]],
            // data: [[1592892325000, 1], [1592892425000, 3], [1592892525000, 5], [1592892625000, 4]],
          },
          {
            name: 'period',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            symbolSize: 8,
            lineStyle: {
              color: '#e78724',
              width: 2,
            },
            // data: [['1', 11], ['2', 15], ['3', 8], ['15', 3]],
            // data: [[1592892325000, 1], [1592892425000, 3], [1592892525000, 5], [1592892625000, 4]],
          }
        ]
      };
      this.setOption(option);
    },
    /**
     *
     * @param waveValue 波浪值 [[],[]..]
     * @param wavePeriod 波浪周期 [[],[]..]
     */
    setData({waveValue, wavePeriod}) {
      const valueLength = waveValue.length;
      const periodLength = wavePeriod.length;
      this.waveValue = waveValue[valueLength - 1][1];
      this.wavePeriod = wavePeriod[periodLength - 1][1];

      const option = {
        series: [
          {
            name: 'waveValue',
            data: waveValue,
          },
          {
            name: 'wavePeriod',
            data: wavePeriod,
          }
        ]
      };
      this.setOption(option);
    },
    /**
     * 清空图表内的数据
     */
    clearData() {
      const option = {
        series: [
          {
            name: 'waveValue',
            data: [],
          },
          {
            name: 'wavePeriod',
            data: [],
          }
        ]
      };
      this.setOption(option);
    }
  }
}
</script>

<style scoped>
.env-wave {
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