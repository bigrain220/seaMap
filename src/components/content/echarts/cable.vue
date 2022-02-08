<template>
  <div>
    <div class="cableTensionChart">
      <div v-for="group in groups" :id="group.groupId" :key="group.groupId"
           :style="{float:'left',height:'100%',width:group.groupWidth }">
        <!--标题-->
        <div class="row" style="height: 10%;width: 100%">
          <div :style="{float: 'left',width: group.gap+'%'}"></div>
          <div class=" text-center cableTitle"
               :style="{height: '100%',float: 'left',width:100-group.gap+'%'}">
            {{ group.title }}
          </div>
        </div>

        <!--x轴的坐标-->
        <div class="row cableXAxisLabel" style="height: 10%;width: 100%;">
          <div :style="{float: 'left', width: group.gap+'%'}"></div>
          <!--因为迭代的是数字 所以index从1开始-->
          <div v-for="index in group.groupBarNum" class="text-center" :key="index"
               :style="{height: '100%',float: 'left',width: group.gap_label+'%'}">
            {{ colName[index - 1] }}
          </div>
        </div>
        <!--柱状图-->
        <div class="row cable-wrapper" style="height: 80%;width: 100%">
          <base-echart :id="group.chartId" class="cableChart"
                       :ref="group.chartId"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseEchart from "@/components/content/echarts/baseEchart";
import {each} from "@/util/common";
import {deleteObj, keepDecimal} from "@/util/content";

export default {
  name: "cable",
  components: {
    baseEchart
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    //格式为[{cableNum:4,alert:40,waring:70}]
    //     其中cableNum为每组脱缆钩中脱缆钩的数量
    //     alert为预警值，waring为报警值
    options: {
      type: Array,
      required: true,
    },
    //展示的数据
    //详细的类型查看setData()方法的注释
    data: {
      required: false
    }
  },
  data() {
    return {
      colName: ['A', 'B', 'C', 'D'],
      //柱子的背景颜色
      barBackgroundColor: 'rgba(0,0,0,0.05)',
      groups: [],
      //把非closed状态转换为一个指定的数，显示状态时再根据这个数显示相应的状态
      //同时这个指定的数也是柱状图的高度，所以数都很小
      hookStatus: ["OPENED", "CLOSED", "RELEASING", "RELEASE\\nFAILED", "OFF"],
      normalColor: '#57e964',
      alertColor: '#93841a',
      waringColor: '#bc0d11',
    }
  },
  computed: {
    //柱子总量
    barNum() {
      let barNum = 0;
      let options = this.options;
      each(options, (index, item) => {
        barNum += item['cableNum'];
      });
      return barNum;
    }
  },
  beforeMount() {
    this.groupSet();
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  watch: {
    data: {
      handler(newValue) {
        this.setChartData(newValue);
      },
      deep: true
    },
    options: {
      handler(newValue) {
        this.groups = [];
        this.groupSet();
        //groups改变后 要等到vue把dom元素重绘后才能进行初始化 否则可能会找不到对应的dom元素
        this.$nextTick(() => {
          this.init();
        });
      },
      deep: true,
    }
  },
  methods: {
    setOption(index, option) {
      let chartId = this.groups[index].chartId;
      this.$refs[chartId][0].setOption(option);
    },
    groupSet() {
      let options = this.options;
      let groups = this.groups;
      let barNum = this.barNum;
      let divId = this.id;
      each(options, function (index, item) {
        let title = (index + 1) + '号脱缆钩';
        //每组的柱子数量
        let groupBarNum = item['cableNum'];
        //每组脱缆钩所占宽度
        let groupWidth = groupBarNum / barNum * 100 + '%';
        let groupId = divId + '-cable-' + (index + 1);
        //标题div距左边的百分比
        let gap = 0;
        let gap_label = (100 - gap) / groupBarNum;
        let chartId = groupId + '-chart';

        let group = {title, groupId, groupWidth, gap, groupBarNum, gap_label, chartId};
        groups.push(group);
      });
    },
    init() {
      let _this = this;
      let {
        groups, options, colName, normalColor,
        waringColor, alertColor,
        barBackgroundColor,
      } = _this;
      each(options, (index, option) => {
        let group = groups[index];
        let alert = option['alert'];
        let waring = option['waring'];
        let {chartId, gap, groupBarNum} = group;
        let chartOption = {
          grid: {left: gap + '%', right: 0, top: 10, bottom: 30},
          xAxis: [
            {type: 'category', data: colName.slice(0, groupBarNum), position: 'top', show: false},
            {type: 'value', min: 0, max: 10, show: false}
          ],
          yAxis: {
            type: 'value',
            min: 0,
            max: 150,
            splitNumber: 6,
            splitLine: {
              show: false,
            },
            // nameTextStyle:{
            //   color: '#dcdcdc'
            // },
            //仅第一组显示y轴
            axisLine: {show: index === 0, color: '#dcdcdc'},
            axisLabel: {show: index === 0, inside: true, color: '#dcdcdc'},
            axisTick: {show: index === 0}
          },
          series: [
            {
              id: chartId, type: 'bar', xAxisIndex: 0, yAxisIndex: 0,
              label: {
                show: true, position: 'bottom', fontSize: 14,
                formatter: ({data: [hook, value, status]}) => status === 1 ? value : this.hookStatus[status],
                rich: {off: {color: 'gray', fontSize: 14},},
                // rotate: -45,
              },
              itemStyle: {
                color: ({data: [hook, value, status]}) => {
                  if (status === 1) {
                    if (value >= waring) {
                      return waringColor;
                    } else if (value >= alert) {
                      return alertColor;
                    } else {
                      return normalColor;
                    }
                  } else {
                    return '#909399';
                  }
                }
              },
              data: [['A', 0, 4], ['B', 0, 4], ['C', 0, 4], ['D', 0, 4]]
            },
            {
              //柱子的背景
              id: chartId + '-background', type: 'bar', xAxisIndex: 0,
              yAxisIndex: 0, barGap: '-100%', silent: true, itemStyle: {color: barBackgroundColor},
              data: [['A', 150], ['B', 150], ['C', 150], ['D', 150]]
            },
            {
              //预警线
              id: chartId + '-alert', type: "line", xAxisIndex: 1,
              yAxisIndex: 0, showSymbol: false, silent: true, itemStyle: {color: alertColor},
              data: [[0, alert], [10, alert]]
            },
            {
              //报警线
              id: chartId + '-waring', type: "line", xAxisIndex: 1,
              yAxisIndex: 0, showSymbol: false, silent: true, itemStyle: {color: waringColor},
              data: [[0, waring], [10, waring]]
            }
          ]
        };
        _this.setOption(index, chartOption);
      });
    },
    /**
     *
     * @param {Object} data 格式为{index,refId,hookStationRecords}
     * @param {number} data.index  第几组脱缆钩，从1开始
     * @param {[number,number][]} data.records
     */
    setChartData(data) {
      let {index, records} = data;
      let {id, colName = [], groups = []} = this;
      if (!groups[index]) {
        console.log(data);
      }
      this.setOption(index, {
        series: {
          id: `${id}-cable-${index + 1}-chart`,
          data: records.map(([value, status], index) => [colName[index], value > 0 ? keepDecimal(value, 1) : 0, status])
        }
      });
    },
    /**
     * 清除显示 把所有都置为OFF
     */
    clear() {
      const options = this.options;
      for (let i = 0; i < options.length; i++) {
        this.setChartData({
          index: i,
          records: new Array(options[i].cableNum).fill([0, 4])
        });
      }
    }
  }
}
</script>

<style scoped>

.text-center {
  /*font-size: 1em;*/
  overflow: hidden;
  text-align: center;
  color: #dcdcdc;
}


.cableChart {
  border-left: 1px #6c6f72 solid;
  border-top: none;
  border-right: 1px #6c6f72 solid;
  border-bottom: none;
  height: 100%;
}


/*缆绳拉力图*/
.cableTensionChart {
  height: 100%;
}

.cableTitle {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  border: #6c6f72 1px solid;
}

.cableXAxisLabel {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  /*border: #00c853 1px solid;*/
  border-style: none solid solid solid;
  border-width: 0 1px 1px 1px;
  border-color: #6c6f72;
}

</style>