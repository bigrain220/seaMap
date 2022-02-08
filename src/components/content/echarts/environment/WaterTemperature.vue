<template>
  <div class="env-WaterTemperature">
    <div class="text">
      <span class="title"><i class=" icon env-icon icon-liuliang"></i>海水温度</span>
      <span class="value">{{ waterTemperatureValue }}℃</span>
    </div>
    <div class="chart">
      <base-chart ref="chart"/>
    </div>
  </div>
</template>

<script>
import {deleteObj} from "@/util/content";
import BaseChart from "@/components/content/echarts/BaseChart";

/**
 * 海水温度、层流
 */
export default {
  name: "WaterTemperature",
  components: {
    BaseChart
  },
  data() {
    return {
      waterTemperatureValue: 0,//当前海水温度
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
          name: '层流层数',
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
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
            name: '流速m/s',
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
            name: '流向',
            type: 'value',
            min: 0,
            max: 360,
            position: 'right',
            axisLabel: {
              color: '#51e5f7'
            },
            axisLine: {
              lineStyle: {
                color: '#51e5f7'
              }
            },
            splitNumber: 10,
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
          formatter: function (param) {
            const [line, bar] = param;
            const [xAxisValue, lineYAxisValue] = line.value;
            const barYAxisValue = bar.value[1];
            return `层流第${xAxisValue}层<br />
                        流速：${lineYAxisValue}m/s<br />
                        流向：${barYAxisValue}°`;
          }
        },
        series: [
          {
            name: 'speed',
            xAxisIndex: 0,
            yAxisIndex: 0,
            type: 'line',
            symbolSize: 8,
            lineStyle: {
              color: '#e78724',
              width: 2,
            },
            // data: [['1', 1], ['2', 1.5], ['3', 2], ['4', 1]],
          },
          {
            name: 'direction',
            xAxisIndex: 0,
            yAxisIndex: 1,
            type: 'bar',
            itemStyle: {
              color: '#51e5f7',
              barBorderRadius: [15, 15, 0, 0]
            },
            // data: [['1', 100], ['2', 150], ['3', 60], ['4', 290]],
          }
        ]
      };
      this.setOption(option);
    },
    /**
     *
     * @param waterTemperature 海水温度值
     * @param currentSpeed 层流流速 格式为[[层数,流速]...] 如[['1',1.6]]
     * @param currentDirection 层流流向 格式为[[层数,流向]...] 如[['1',260]]
     */
    setData({waterTemperatureValue, currentSpeed, currentDirection}) {
      this.waterTemperatureValue = waterTemperatureValue;
      const option = {
        series: [
          {
            name: 'speed',
            data: currentSpeed,
          },
          {
            name: 'direction',
            data: currentDirection
          }
        ]
      };
      this.setOption(option);
    }
  },
}
</script>

<style scoped>
.env-WaterTemperature {
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