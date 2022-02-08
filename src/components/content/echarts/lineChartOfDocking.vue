<template>
  <base-chart ref="chart"/>
</template>

<script>
import BaseChart from "@/components/content/echarts/BaseChart";
import {deleteObj} from "@/util/content";
/*靠泊界面的折线图*/
export default {
  name: "lineChartOfDocking",
  components: {
    BaseChart
  },
  props: {
    //折线图的图例名
    dataName: {
      type: Array,
      required: true
    },
    //图表要显示的值
    chartData: {
      type: Array,
    },
    axisPointerLocation: {
      type: Number || String,
      default: 0,
    },
    max: {
      type: Number,
      default: 10
    },
    min: {
      type: Number,
      default: 0
    },
    splitNumber: {
      type: Number,
      default: 5
    },
    displayNumber: {
      type: Boolean,
      default: false
    },
    range: {
      type: Number,
      default: 60
    },
    padding: {
      type: Boolean,
      default: false
    },
    offset: {
      type: Array,
      default: () => []
    },
    dir: {
      type: Number,
      default: 0
    },
    syncTime: {
      type: Boolean,
      default: true
    },
    storeData:{
      type:Object,
      default: () => {
        return {
          berthId:"",
          data:[]
        }
      }
    }
  },
  data() {
    return {
      numsOfShowDataZoom: 30,//达到多少点后开始显示dataZoom
      isShowDataZoom: false,//是否显示了dataZoom
      dataZoomShowPointsScope: 60_000,//显示dataZoom后，同时显示多长时间的数据(这里是1分钟)
      dataList: [],
    }
  },
  mounted() {
    this.init();
  },
  created(){
    // 判断是否传了需要覆盖dataList的值
    if(this.storeData.berthId && this.storeData.data && this.storeData.data.length>0){
      // console.log(this.storeData.data,'created')
      this.dataList=this.storeData.data;
    }
  },
  beforeDestroy() {
    this.$emit('storeEvent',this.dataList);
    // console.log(this.dataList,'beforeDestory')
    deleteObj(this.$data);
  },
  watch: {
    chartData(newValue) {
      this.setChartData(newValue);
    },
    axisPointerLocation(val) {
      this.setAxisPointerLocation(val);
    }
  },
  methods: {
    setOption(option) {
      this.$refs.chart.setOption(option);
    },
    setSeries(series) {
      this.$refs.chart.setSeries(series);
    },
    init() {
      let option = {
        tooltip: {trigger: 'axis'},
        grid: {bottom: '10em', left: '25em', right: '10em', top: '15em'},
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
            color: '#909399',
            showMaxLabel: true,
            inside: true,
            margin: 4,
            align: 'right',
            formatter: {
              year: '{yyyy}-{MM}-{dd}',
              month: '{MM}-{dd}',
              day: '{MM}-{dd}',
              hour: '{HH}:{mm}:{ss}',
              minute: '{HH}:{mm}:{ss}',
              second: '{HH}:{mm}:{ss}',
              millisecond: '{HH}:{mm}:{ss}',
              none: '{HH}:{mm}:{ss}'
            },
          },
          // splitNumber: -1,
          axisTick: {
            show: false
          },
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#36393e'
            }
          },
          min: value => isFinite(value.min) ? Math.floor(value.min / 5) * 5 : this.min,
          max: value => isFinite(value.max) ? Math.ceil(value.max / 5) * 5 : this.max,
          splitNumber: this.splitNumber,
        },
        legend: {
          data: this.dataName,
          textStyle: {color: '#FFFFFF'},
          inactiveColor: '#353941'
        },
        series: [
          {
            name: this.dataName[0], type: 'line',
            itemStyle: {color: '#00f0f0'}, smooth: 0.3,
            showSymbol: false, hoverAnimation: false,
            data: this.dataList[0]
          },
          {
            name: this.dataName[1], type: 'line',
            itemStyle: {color: '#e4a1a3'}, smooth: 0.3,
            showSymbol: false, hoverAnimation: false,
            data: this.dataList[1]
          },
        ]
      };
      this.setOption(option);
      //添加事件
      this.addChartClickEvent();
    },
    /**
     *
     * @param data 格式为[
     *                    data0,      (label0)
     *                    data1       (label1)
     *                  ]
     *            或者为[
     *                   [data...],   (label0)
     *                   [data...]    (label1)
     *                 ]
     */
    setChartData: function (data) {
      let {
        numsOfShowDataZoom,
        dataZoomShowPointsScope,
      } = this;
      if (!Array.isArray(data)) {
        return;
      }

      //若传入的数据是二维数组，则表明传入的是多个点(历史回放时会把所有点一起放到图上)，
      let multi = data.find(d => Array.isArray(d?.[0]));
      if (multi) {
        if (multi.length >= numsOfShowDataZoom) {
          this.setOption({
            dataZoom: [
              {
                type: 'slider',
                xAxisIndex: 0,
                bottom: 0,
                show: true,
                maxValueSpan: dataZoomShowPointsScope,
                minValueSpan: dataZoomShowPointsScope,
              },
            ]
          });
          this.isShowDataZoom = true;
        }
        this.dataList = data.map(ds => ds.map(d => {
          return {
            name: d[0],
            value: d
          }
        }));
      } else {
        data.forEach((d, i) => {
          if (d != null) {
            let list = this.dataList?.[i];
            if (list?.find(l => d[0] === l?.name)) {
              return;
            }
            let headTime = d[d.length - 1] - this.range * 1000;
            this.dataList[i] = [
              ...list?.filter(l => l.value?.[1] != null && l.name > headTime - 100) ?? [],
              {name: d[0], value: d}
            ];
          }
        });
      }
      this.setSeries(this.syncTime ? this.getSyncSeries() : this.getSeries());
    },
    getSeries(data = this.dataList) {
      this.dir ? data.reverse() : data;
      return data.map((d, i) => {
        let offset = this.offset[i];
        if (offset) {
          d = d.map(o => {
            return o.value[1] != null ?
                {
                  name: o.name,
                  value: [o.value[0], o.value[1] + offset]
                } : o;
          });
        }
        return {data: d}
      });
    },
    getSyncSeries(data = this.dataList) {
      let rangeTime = Math.max(...data.map(d => d?.[d.length - 1]?.name).filter(Number.isFinite)) - this.range * 1000 - 100;
      return this.getSeries(this.padding ? data.map(s => this.paddingSeries(s, rangeTime)) : data);
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
    /**
     * 获取echarts的实例
     * @return {*}
     */
    getEChartsInstance() {
      return this.getInstance();
    },
    /**
     * 获取echarts的实例
     * @return {*}
     */
    getInstance() {
      return this.$refs.chart.getInstance();
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
     * 给echarts添加点击事件，点击后返回该点对应的x轴的值
     */
    addChartClickEvent() {
      let _this = this;
      let instance = _this.getInstance();
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
    /**
     * 设置坐标轴指示器的位置
     * @param time
     */
    setAxisPointerLocation(time) {
      this.setOption({
        xAxis: {
          axisPointer: {
            value: time
          }
        }
      })
    },
    clear() {
      this.dataList = [];
      this.setOption({
        dataZoom: [
          {show: false}
        ],
        series: this.dataName.map((n) => {
          return {name: n, data: null}
        })
      });
    },
  }
}
</script>