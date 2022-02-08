<template>
    <div class="history-wave">
        <base-echart
                :id="domId"
                :ref="domId"
        />
    </div>
</template>

<script>
  import baseEchart from "@/components/content/echarts/baseEchart";
  import {each, isEmptyObject} from "@/util/common";


  export default {
    name: "history-wave",
    components: {
      baseEchart
    },
    props: {
      //波浪的历史数据
      //格式为 {日期:{signWaveHeight:[[时间,值][]...],longWavePeriod:[[时间,值]...]}}
      chartData:{
        type:Object
      }
    },
    data() {
      return {
        domId: 'historyDataWave',
      }
    },
    watch: {
      chartData: function (newValue, oldValue) {
        if (!isEmptyObject(newValue)){
          this.setChartData(newValue);
        }
      }
    },
    mounted() {
      this.initChart();
    },
    methods: {
      setOption(option) {
        this.$refs[this.domId].setOption(option);
      },
      initChart() {
        let height = '#40b4f1';
        let period = '#9c27b0';
        let option = {
          baseOption: {
            tooltip: {trigger: 'axis'},
            timeline: {
              axisType: 'category',
              show: false,
              data: [],
              controlStyle: {show: false},
              label: {rotate: -45}
            },
            grid: {bottom: 150},
            xAxis: {type: 'time',
                    axisLine:{
                     show:true,
                     lineStyle:{color:"gray"}
                }},
            yAxis: [
              {type: 'value', name: '波高', axisLine: {lineStyle: {color: height}}},
              {type: 'value', name: '周期', axisLine: {lineStyle: {color: period}}},
            ],
            legend: {type: 'scroll', selectedMode: 'single', data: ['长波浪', '短波浪', '有效波浪'],textStyle:{color:"orange"}},
            dataZoom: [{type: 'slider', xAxisIndex: 0, bottom: 80}],
            series: [
              {
                id: 'longWaveHeight',
                name: '长波浪',
                yAxisIndex: 0,
                type: 'line',
                data: [],
                lineStyle: {color: height}
              },
              {
                id: 'longWavePeriod',
                name: '长波浪',
                yAxisIndex: 1,
                type: 'line',
                data: [],
                lineStyle: {color: period}
              },
              {
                id: 'shortWaveHeight',
                name: '短波浪',
                yAxisIndex: 0,
                type: 'line',
                data: [],
                lineStyle: {color: height}
              },
              {
                id: 'shortWavePeriod',
                name: '短波浪',
                yAxisIndex: 1,
                type: 'line',
                data: [],
                lineStyle: {color: period}
              },
              {
                id: 'signWaveHeight',
                name: '有效波浪',
                yAxisIndex: 0,
                type: 'line',
                data: [],
                lineStyle: {color: height}
              },
              {
                id: 'signWavePeriod',
                name: '有效波浪',
                yAxisIndex: 1,
                type: 'line',
                data: [],
                lineStyle: {color: period}
              },
            ]
          }
        };
        this.setOption(option);
      },
      /**
       *
       * @param data 格式为{日期:{signWaveHeight:[[时间,值][]...],longWavePeriod:[[时间,值]...]}}
       */
      setChartData(data) {
        let option = {
          baseOption: {
            timeline: {show: false, data: []}
          },
          options: [],
        };
        let timelineNumber = 0;

        each(data, function (date, detail) {
          option.baseOption.timeline.data.push(date);
          timelineNumber++;
          let everyDaySeries = {series: []};
          option.options.push(everyDaySeries);
          each(detail, function (index, item) {
            everyDaySeries.series.push({
              id: index,
              data: item
            });
          });
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
        let option = {
          baseOption: {
            timeline: {show: false, data: []}
          },
          options: [{series: [{data: []}, {data: []}]}],
        };
        this.setOption(option);
      }
    }
  }
</script>

<style scoped>

</style>
