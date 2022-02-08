<template>
    <div class="history-current">
        <base-echart
                :id="domId"
                :ref="domId"
        />
    </div>
</template>

<script>
  import baseEchart from "@/components/content/echarts/baseEchart";
  import {each, isEmptyObject} from "@/util/common";
  import {deleteObj} from "@/util/content";

  export default {
    name: "historyCurrent",
    components: {
      baseEchart
    },
    props: {
      //层流的历史数据
      //格式为
      //{
      //  日期1:{
      //         speed1:[[时间,值][时间,值]..],speed2:[[时间,值][时间,值]..],...
      //         direction1:[[时间,值][时间,值]..],direction2:[[时间,值][时间,值]..],...
      //        },
      //  日期2：{
      //         speed1:[[]...],...
      //        }
      // }
      chartData:{
        type:Object
      }
    },
    data() {
      return {
        domId: 'historyDataCurrent',
      }
    },
    watch: {
      chartData: function (newValue, oldValue) {
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
        this.$refs[this.domId].setOption(option);
      },
      //初始化chart
      initChart() {
        let speedColor = '#00ff00';
        let directionColor = '#00ffff';
        let option = {
          baseOption: {
            tooltip: {
              trigger: 'axis',
              formatter: function (param) {
                if (!Array.isArray(param)) {
                  //若不是数组 则表示是时间选择轴
                  return param.name;
                }
                let seriesName = param[0].seriesName;
                let time = param[0].axisValueLabel;
                let speed = param[0].value[1];
                let direction = param[1].value[1];
                let result = `时间：${time}<br>
                                                层数：${seriesName}<br>
                                                流速：${speed}cm/s<br>
                                                流向：${direction}°<br>
                                            `;
                return result;
              }
            },
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
              {type: 'value', name: '流速', axisLine: {lineStyle: {color: speedColor}}},
              {type: 'value', name: '流向', axisLine: {lineStyle: {color: directionColor}}},
            ],
            legend: {type: 'scroll', selectedMode: 'single', data: []},
            dataZoom: [{type: 'slider', xAxisIndex: 0, bottom: 80}],
            series: []
          }
        };
        for (let i = 1; i <= 20; i++) {
          let name = '第' + i + '层';
          // option.legend.selected[name] = (i === 1);
          option.baseOption.legend.data.push(name);
          option.baseOption.series.push(
            {yAxisIndex: 0, type: 'line', name: name, id: 'speed' + i, lineStyle: {color: speedColor}},
            {
              yAxisIndex: 1,
              type: 'line',
              name: name,
              id: 'direction' + i,
              lineStyle: {color: directionColor}
            },
          );
        }
        this.setOption(option);
      },
      /**
       *
       * @param data 格式为
       *                  {日期1:{
       *                   speed1:[[时间,值][时间,值]..],speed2:[[时间,值][时间,值]..],...
       *                   direction1:[[时间,值][时间,值]..],direction2:[[时间,值][时间,值]..],...
       *                  },
       *                  日期2：{
       *                    speed1:[[]...],...
       *                  }}
       *
       */
      setChartData(data) {
        let option = {
          baseOption: {
            timeline: {data: []}
          },
          options: []
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
      /**
       * 清除图表内的数据
       */
      clearChartData() {
        let option = {
          baseOption: {
            timeline: {show: false, data: []}
          },
          options: [{series: [{data: []}, {data: []}]}]
        };
        this.setOption(option);
      }
    }
  }
</script>

<style scoped>

</style>
