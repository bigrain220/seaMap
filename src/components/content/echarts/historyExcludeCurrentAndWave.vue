<template>
  <div id="exclude" class="history-exclude-current-and-wave">
    <base-chart ref="chart"/>
  </div>
</template>

<script>
import BaseChart from "@/components/content/echarts/BaseChart";
import {each, isEmptyObject} from "@/util/common";
import {deleteObj} from "@/util/content";

// const yLines = ;

export default {
  name: "historyExcludeCurrentAndWave",
  components: {
    BaseChart
  },
  props: {
    //除了层流和波浪的历史数据
    //数据格式为  {日期:{windSpeed:[[时间戳,具体值]...],temperature:[[时间戳,具体值]...]}}
    //如：{'2019-07-01':{windSpeed:[[时间戳，值]],...}}
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      domId: 'historyDataExcludeCurrentAndWave',
      chart_yAxis: [
        {
          name: this.$t('chart.historyExclude.yAxisTemperatureName'),
          id: 'temperature',
          type: 'line',
          color: '#fe6e69',
          yPosition: 'left',
          offset: 0
        },
        {
          name: this.$t('chart.historyExclude.yAxisHumidityName'),
          id: 'humidity',
          type: 'line',
          color: '#3bb5f5',
          yPosition: 'left',
          offset: 25
        },
        {
          name: this.$t('chart.historyExclude.yAxisPressureName'),
          id: 'pressure',
          type: 'line',
          color: '#4d4088',
          yPosition: 'left',
          offset: 50
        },
        {
          name: this.$t('chart.historyExclude.yAxisVisibilityName'),
          id: 'visibility',
          type: 'line',
          color: '#bcda00',
          yPosition: 'left',
          offset: 75
        },
        {
          name: this.$t('chart.historyExclude.yAxisWaterTemperatureName'),
          id: 'waterTemperature',
          type: 'line',
          color: '#b5dff8',
          yPosition: 'right',
          offset: 0
        },
        {
          name: this.$t('chart.historyExclude.yAxisTideName'),
          id: 14,
          type: 'line',
          color: '#18895d',
          yPosition: 'right',
          offset: 25
        },
        {
          name: this.$t('chart.historyExclude.yAxisWindSpeedName'),
          id: 3,
          type: 'line',
          color: '#009241',
          yPosition: 'right',
          offset: 50
        },
        {
          name: this.$t('chart.historyExclude.yAxisWindDirectionName'),
          id: 3.1,
          type: 'line',
          color: '#f09f4f',
          yPosition: 'right',
          offset: 75
        }
      ],
    }
  },
  computed: {
    /**
     *返回一个对象，chart_yAxis中出现过的id为true 如:{'wave':true,'tide':true}
     */
    yAxisIds() {
      let ids = {};
      for (let item of this.chart_yAxis) {
        ids[item.id] = true
      }
      return ids;
    }
  },
  watch: {
    chartData(newValue, oldValue) {
      if (!isEmptyObject(newValue)) {
        this.setChartData(newValue);
      }
    }
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    setOption(option) {
      this.$refs.chart.setOption(option);
    },
    /**
     * 给chart添加基本的属性
     */
    initChart() {
      let option = {
        //   legend: {textStyle:{color:"red"}},
        baseOption: {
          tooltip: {trigger: 'axis'},
          timeline: {
            axisType: 'category',
            show: false,
            data: [],
            controlStyle: {show: false},
            label: {rotate: -45}
          },
          xAxis: {
            name: this.$t('chart.historyExclude.time'), type: 'time',
            axisLine: {
              show: true,
              lineStyle: {color: "gray"}
            },
          },
          grid: {bottom: 150},
          dataZoom: [{type: 'slider', xAxisIndex: 0, bottom: 80}],
          yAxis: [],
          legend: {type: 'scroll', data: [], textStyle: {color: "grey"}},
          series: [],
        },
        options: [
          {series: []}
        ]
      };
      this.chart_yAxis.forEach(function (item, index) {
        option.baseOption.yAxis.push({
          type: 'value', name: item['name'], position: item['yPosition'],
          offset: item['offset'], nameRotate: -45,
          axisLine: {lineStyle: {color: item['color']}}
        });
        option.baseOption.series.push({
          id: item['id'],
          name: item['name'],
          yAxisIndex: index,
          type: item['type'],
          lineStyle: {color: item['color']},
          showSymbol: false, hoverAnimation: false, smooth: true
        });
        option.baseOption.legend.data.push(item['name']);
      });
      this.setOption(option);
    },
    /**
     *
     * @param data {日期:{windSpeed:[[时间戳,具体值]...],temperature:[[时间戳,具体值]...]}}
     *         如：{'2019-07-01':{windSpeed:[[时间戳，值]],...}}
     */
    setChartData(data) {
      let yLines = this.chart_yAxis;
      let ids = this.yAxisIds;
      let option = {
        baseOption: {
          timeline: {data: []},
        },
        options: [],
      };
      let timelineNumber = 0;
      each(data, function (date, item) {
        option.baseOption.timeline.data.push(date);
        timelineNumber++;
        let idMapSeries = {};
        let everyDaySeries = {series: []};
        option.options.push(everyDaySeries);
        //假设当天有tide类型的数据  第二天tide数据不存在 echarts会把这两天的数据合并 导致第二天会展示当天的tide数据
        //故先将所有类型的数据置成空 再从传入的数据中赋值 显式指定tide数据为空 这样第二天就只会展示第二天的数据
        // each(yLines, (index, item) => idMapSeries[item.id] = {id: item.id, data: []});
        //进行数据赋值
        each(item, (id, detail) => {
          id = Number(id);
          if (ids[id]) {
            idMapSeries[id] = {id: id, data: detail};
          }
        });
        each(idMapSeries, (key, series) => {
          everyDaySeries.series.push(series);
        })
      });
      if (timelineNumber <= 1) {
        option.baseOption.timeline.data = [];
        option.baseOption.timeline.show = false;
      } else {
        option.baseOption.timeline.show = true;
      }
      this.setOption(option);
    },
    /**
     * 清除图表上的所有数据
     */
    clearChartData() {
      let yLines = this.chart_yAxis;
      let option = {
        baseOption: {
          timeline: {show: false, data: []},
        },
        options: [],
      };
      let series = [];
      //一般来说y轴的数量代表着数据种类的数量
      for (let i = 0; i < yLines.length; i++) {
        series.push({data: []});
      }
      option.options.push({series});
      this.setOption(option);
    }
  }
}
</script>

<style scoped>
/*#exclude{*/
/*    margin-top: 100px;*/
/*}*/

</style>
