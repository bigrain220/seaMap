<template>
  <div :class="{border:borderVisible}" class="line-chart-of-docking">
    <base-echart
        :id="id"
        :ref="id"
    />
  </div>
</template>

<script>
import baseEchart from "@/components/content/echarts/baseEchart";
import {arrayLimit} from "@/util/common";
import {deleteObj} from "@/util/content";
/*漂移界面的折线图*/
export default {
  name: "lineChartOfDocking",
  components: {
    baseEchart
  },
  props: {
    id: {
      type: String,
      required: true
    },
    //折线图的图例名
    leftAndRightName: {
      type: Array,
      required: true
    },
    //图表要显示的值
    chartData: {
      type: Object,
    }
  },
  data() {
    return {
      //折线图上 可以展示的点的数量限制
      maxPointNum: 60,
      numsOfShowDataZoom: 300,//达到多少点后开始显示dataZoom
      isShowDataZoom: false,//是否显示了dataZoom
      dataZoomShowPointsScope: 60 * 1000,//显示dataZoom后，该dataZoom内显示多长时间的数据
      allData: {'leftDrift': [], 'rightDrift': []},
      //没数据时div用边框包裹
      borderVisible: true,
      simulateData: '',//模拟数据
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  watch: {
    chartData(newValue) {
      this.setChartData(newValue);
    }
  },
  methods: {
    setOption(option) {
      this.$refs[this.id].setOption(option);
    },
    init() {
      let options = {
        legend: {
          show: false,
          data: ['leftDrift', 'rightDrift'],
          textStyle: {
            color: '#FFFFFF'
          },
          inactiveColor: '#353941'
        },
        tooltip: {trigger: 'axis'},
        grid: {top: '5%', left: '5%', right: '5%', bottom: '20%'},
        xAxis: {
          type: 'time',
          axisPointer: {
            lineStyle: {
              width: 2,
              color: '#909399',
            },
            handle: {
              show: true,
              icon: 'path://',
            }
          },
          splitLine: {
            lineStyle: {
              color: '#36393e'
            }
          },
          axisLabel: {
            color: '#909399'
          }
        },
        yAxis: {
          name: '漂\n移\n距\n离',
          nameGap: 30,
          nameLocation: 'center',
          nameTextStyle: {
            verticalAlign: 'bottom',
            color: '#909399'
          },

          splitLine: {
            lineStyle: {
              color: '#36393e'
            }
          },
          nameRotate: '0',
          type: 'value',
          axisLabel: {
            formatter: function (param) {
              return param.toFixed(1);
            },
            color: '#dcdcdc'
          }

        },
        series: [
          {
            name: 'leftDrift', type: 'line', itemStyle: {color: '#00f0f0'},
            showSymbol: false, animation: false,
            smooth: 0.3,
            // data: [[1571883118354, 0.2], [1571883119354, 0.4], [1571883128354, 0.8], [1571883138354, 0.6]]
          },
          {
            name: 'rightDrift', type: 'line', itemStyle: {color: '#e4a1a3'},
            showSymbol: false, animation: false,
            smooth: 0.3,
            // data: [[1571883118354, 0.4], [1571883119354, 0.8], [1571883128354, 0.3], [1571883138354, 0.2]]
          }
        ]
      };
      this.setOption(options);
      // this.addChartClickEvent();
    },
    /**
     *
     * @param data 格式为{leftDrift:[时间,值],rightDrift:[时间,值]}
     *             或者为{leftDrift:[[时间,值]...],rightDrift:[[时间,值]...]}
     */
    setChartData(data) {
      //有数据时取消边框
      this.borderVisible = false;

      let {maxPointNum: maxLength, allData, numsOfShowDataZoom, dataZoomShowPointsScope, leftAndRightName: [leftName, rightName]} = this;
      let {leftDrift: leftText, rightDrift: rightText} = data;
      let value = leftText[0] || rightText[0]; 
      
      //若传入的数据是二维数组，则表明传入的是多个点(历史回放时会把所有点一起放到图上)，
      if (Array.isArray(value)) {
        this.setOption({
          series: [
            {name: leftName, data: leftText},
            {name: rightName, data: rightText},
          ]
        });
      } else {
        allData['leftDrift'] = arrayLimit(allData['leftDrift'], data['leftDrift'], maxLength);
        allData['rightDrift'] = arrayLimit(allData['rightDrift'], data['rightDrift'], maxLength);
        let option = {
          legend: {show: true},
          xAxis: {show: true},
          yAxis: {show: true},
          series: [
            {name: 'leftDrift', data: allData['leftDrift']},
            {name: 'rightDrift', data: allData['rightDrift']}
          ]
        };
        this.setOption(option);
      }
    },
    /**
     * 若存在dataZoom 则设置显示区域的开始时间点
     * @param startTime
     */
    setShowAreaStartValue(startTime) {
      if (this.isShowDataZoom) {
        this.setOption({
          dataZoom: [{
            startValue: startTime,
            show: true,
          }]
        });
      }
    },
    /**
     * 设置坐标轴指示器的位置
     * @param time
     */
    setAxisPointerLocation(time) {
      this.setOption({
        xAxis: {axisPointer: {value: time}}
      })
    },
    /**
     * 获取echarts的实例
     * @return {*}
     */
    getEChartsInstance() {
      return this.$refs[this.id].getEChartsInstance();
    },
    /**
     * 给echarts添加点击事件，点击后返回该点对应的x轴的值
     */
    addChartClickEvent() {
      let _this = this;
      let instance = _this.getEChartsInstance();
      instance.getZr().on("click", (params) => {
        const option = instance.getOption();
        //若没有给图表设置值，则点击时得到的是当日的时间戳
        // 故从series中的data是否有值来判断有无给图表设置值
        if (!option.series[0].data) {
          return;
        }
        //把鼠标对应的像素 转换成该像素对应的值
        let point = instance.convertFromPixel({seriesIndex: 0}, [params.event.zrX, params.event.zrY]);
        //得到的是一个保留4位小数的时间戳  如1587719175585.4253
        let time = point[0];
        //对得到的秒数进行四舍五入处理  得到的就是axisPointer指示的值(不一定准确)
        time = Math.round(time / 1000) * 1000;
        _this.$emit("echartsClick", time);
      });
    },
    clear() {
      this.setOption({
        dataZoom: [{show: false}],
        series: [
          {name: 'leftDrift', data: []},
          {name: 'rightDrift', data: []},
        ]
      })
    },
  }
}
</script>

<style scoped>
.border {
  /*border: 1px solid #000000;*/
}
</style>