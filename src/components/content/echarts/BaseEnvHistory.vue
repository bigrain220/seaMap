<template>
  <base-echart
      :id="domId"
      :ref="domId"/>
</template>

<script>
import baseEchart from "@/components/content/echarts/baseEchart";
import {each, isEmptyObject} from "@/util/common";
import {deleteObj} from "@/util/content";

export default {
  name: "BaseEnvHistory",
  components: {
    baseEchart
  },
  props: {
    type: {
      type: String,
      required: true,
      validator(type) {
        return ['temperature', 'humidity', 'pressure', 'visibility', 'waterTemperature', 'tide', 'windSpeed', 'windDirection'].indexOf(type) > -1;
      }
    },
    chartData: {
      type: Object
    }
  },
  computed: {
    chart_yAxis() {
      return this.option.filter(option => option.id === this.type)[0];
    },
    yAxisIds() {
      let ids = {};
      ids[this.type] = true;
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
  data() {
    return {
      domId: 'BaseDataEnvHistory',
      option: [
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
          id: 'tide',
          type: 'line',
          color: '#18895d',
          yPosition: 'right',
          offset: 25
        },
        {
          name: this.$t('chart.historyExclude.yAxisWindSpeedName'),
          id: 'windSpeed',
          type: 'line',
          color: '#009241',
          yPosition: 'right',
          offset: 50
        },
        {
          name: this.$t('chart.historyExclude.yAxisWindDirectionName'),
          id: 'windDirection',
          type: 'line',
          color: '#f09f4f',
          yPosition: 'right',
          offset: 75
        },
      ]
    }
  },
  methods: {
    setOption(option) {
      debugger
      console.log(option)
      this.$refs[this.domId].setOption(option);
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
      let item = this.chart_yAxis;
      option.baseOption.yAxis.push({
        type: 'value', name: item['name'], position: item['yPosition'],
        offset: item['offset'], nameRotate: -45,
        axisLine: {lineStyle: {color: item['color']}}
      });
      option.baseOption.series.push({
        id: item['id'],
        name: item['name'],
        yAxisIndex: 0,
        type: item['type'],
        lineStyle: {color: item['color']}
      });
      option.baseOption.legend.data.push(item['name']);

      this.setOption(option);
    },

    setChartData(data) {
      let yLines = [this.chart_yAxis];
      let ids = this.yAxisIds;
      let option = {
        baseOption: {
          timeline: {data: []},
        },
        options: [],
      };
      let type = this.type;

      let timelineNumber = 0;
      each(data, (date, item) => {
        option.baseOption.timeline.data.push(date);
        timelineNumber++;
        let idMapSeries = {};

        if (type === 'tide') {
          idMapSeries = {'tide': {id: 'tide', data: []}};
        }
        let everyDaySeries = {series: []};
        option.options.push(everyDaySeries);
        //假设当天有tide类型的数据  第二天tide数据不存在 echarts会把这两天的数据合并 导致第二天会展示当天的tide数据
        //故先将所有类型的数据置成空 再从传入的数据中赋值 显式指定tide数据为空 这样第二天就只会展示第二天的数据
        each(yLines, (index, item) => {
          console.log({index, item});
          let id = item['id'];
          idMapSeries[id] = {id: id, data: []};
        });
        //进行数据赋值
        each(item, function (id, detail) {
          console.log({id, detail});

          if (ids[id] && type === id) {
            idMapSeries[id] = {id: id, data: detail};
          }
        });
        each(idMapSeries, (key, series) => {
          console.log({key, series});

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

    clearChartData() {
      let yLines = [this.chart_yAxis];
      debugger
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
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
}
</script>

<style scoped>

</style>