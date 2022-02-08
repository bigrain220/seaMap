<template>
  <div class="env-visibility" :id="id">
    <div class="text">
      <span class="title"><i class=" icon env-icon icon-yanjing-tianchong"></i>能见度</span>
      <span class="value">{{ value }}KM</span>
    </div>
    <div class="chart">
      <div class="graph"></div>
      <div class="chart-text">
        <div class="title">能见度</div>
        <div class="value">
          <div class="num">
            {{ value }}
          </div>
          <div class="unit">km</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import zRender from 'zrender';
import echarts, {throttle} from 'echarts';
import {scaleLinear} from 'd3-scale';
import {deleteObj} from "@/util/content";

/**
 * 温度、能见度、降雨三个组件的代码都差不多
 * 之后考虑抽象成一个组件
 */
export default {
  name: "Visibility",
  props: {
    id: {
      type: String,
      default: 'env_visibility',
    }
  },
  data() {
    return {
      value: 0,
      eChartsInstance: null,
      beginColor: '#00e4ff',
      middleColor: '#ffa700',
      endColor: '#f53527',
      beginAngle: -(Math.PI + Math.PI / 4),
      endAngle: Math.PI / 4,
      min: 0,
      max: 35,
      observe: null,
    }
  },
  watch: {
    value(newValue) {
      this.setData(newValue);
    }
  },
  mounted() {
    this.init();
    this.resizeObserve();
  },
  beforeDestroy() {
    this.dispose();
  },
  methods: {
    init() {
      const {
        id, min, max, beginAngle, endAngle,
        beginColor, middleColor, endColor
      }
          = this;
      const dom = document.querySelector(`#${id} .graph`);
      const {width, height} = dom.getBoundingClientRect();
      this.eChartsInstance = echarts.init(dom);
      this.zr = this.eChartsInstance.getZr();
      this.zrGroup = new zRender.Group();
      this.zr.add(this.zrGroup);

      //以较小的值作为半径
      const radius = width > height ? height / 2 : width / 2;
      //圆心坐标
      const centerPointX = width / 2;
      const centerPointY = height / 2;
      //分割线长度
      const splitLineLength = 5;
      //环形渐变的半径
      const gradientRadius = radius - 10;

      const gaugeRadius = gradientRadius - 10;
      const option = {
        series: [
          {
            type: 'gauge',
            radius: gaugeRadius,
            startAngle: this.radian2Angle(beginAngle),
            endAngle: this.radian2Angle(endAngle),
            min: min,
            max: max,
            splitNumber: 5,
            splitLine: {
              show: true,
              length: splitLineLength,
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#fff'
              }
            },
            axisLabel: {
              show: true,
              distance: splitLineLength / 2,
              color: '#fff'
            },
            pointer: {
              show: false,
            },
            detail: {
              show: false
            }
          }
        ]
      };
      this.eChartsInstance.setOption(option);

      //环形渐变
      const lineWidth = 10;
      //TODO 颜色的映射应该由预警报警值确定
      const colorLinear = scaleLinear()
          .domain([0, 10, 100])
          .range([endColor, middleColor, beginColor]);
      const angleLinear = scaleLinear()
          .domain([1, 100])
          .range([beginAngle, endAngle]);
      for (let i = 1; i <= 99; ++i) {
        let name = 'gradient_' + i;
        let arc = new zRender.Arc({
          silent: true,
          name,
          shape: {
            cx: centerPointX,
            cy: centerPointY,
            r: gradientRadius,
            startAngle: angleLinear(i),
            endAngle: angleLinear(i + 1),
          },
          style: {
            fill: 'none',
            stroke: colorLinear(i),
            lineWidth: lineWidth,
            lineCap: (i === 1 || i === 99) ? 'butt' : 'round',
          },
          zlevel: 3,
        });
        this.zrGroup.add(arc);
      }

      //环形渐变遮罩
      const gradientMask = new zRender.Arc({
        silent: true,
        name: 'gradientMask',
        shape: {
          cx: centerPointX,
          cy: centerPointY,
          r: gradientRadius,
          startAngle: beginAngle,
          endAngle: beginAngle,
        },
        style: {
          lineWidth: lineWidth,
          blend: 'destination-in',
        },
        zlevel: 3,
      });
      this.zrGroup.add(gradientMask);

      const lineDash = new zRender.Arc({
        silent: true,
        name: 'lineDash',
        shape: {
          cx: centerPointX,
          cy: centerPointY,
          r: gradientRadius,
          startAngle: beginAngle,
          endAngle: endAngle,
        },
        style: {
          lineWidth: lineWidth,
          fill: 'none',
          lineDash: [2, 10],
          stroke: '#fff',
        },
      });
      this.zrGroup.add(lineDash);

    },
    /**
     * zrender中的弧度转化为echarts中的角度
     * echarts中圆心的正右手侧为0度，正上方为90度，正左手侧为180度。
     * zrender中圆心的正右手侧为0度，正下方为90度，正左手侧为180度。
     * @param radian
     */
    radian2Angle(radian) {
      return -radian / (Math.PI * 2) * 360;
    },

    setData(value) {
      const {
        id, min, max, beginAngle, endAngle,
        beginColor, middleColor, endColor
      } = this;
      value = Math.min(Math.max(min, value), max);
      this.value = value;
      const angleLinear = scaleLinear()
          .domain([min, max])
          .range([beginAngle, endAngle]);
      //TODO 此处应该为根据预警报警值进行映射
      const colorLinear = scaleLinear()
          .domain([min, (min + max) / 2, max])
          .range([endColor, middleColor, beginColor]);
      this.zrGroup.childOfName('gradientMask').animateTo({
        shape: {
          endAngle: angleLinear(value),
        },
      });
      document.querySelector(`#${id} .chart .chart-text .value`).style.color = colorLinear(value);
    },

    domResize() {
      const {id} = this;
      const chartDom = document.querySelector(`#${id} .graph`);
      const {width, height} = chartDom.getBoundingClientRect();

      //以较小的值作为半径
      const radius = width > height ? height / 2 : width / 2;
      //圆心坐标
      const centerPointX = width / 2;
      const centerPointY = height / 2;
      //分割线长度
      const splitLineLength = 5;
      //环形渐变的半径
      const gradientRadius = radius - 10;
      //仪表盘半径
      const gaugeRadius = gradientRadius - 10;

      this.eChartsInstance.setOption({
        series: [
          {
            radius: gaugeRadius,
          }
        ]
      });
      this.eChartsInstance.resize();

      //修改渐变圆的圆心和半径
      for (let i = 1; i <= 99; ++i) {
        this.zrGroup.childOfName('gradient_' + i).attr('shape', {
          cx: centerPointX,
          cy: centerPointY,
          r: gradientRadius,
        })
      }
      //修改渐变圆的遮罩圆心和半径
      this.zrGroup.childOfName("gradientMask").attr('shape', {
        cx: centerPointX,
        cy: centerPointY,
        r: gradientRadius,
      });
      //修改渐变圆弧下的刻度线的圆心和半径
      this.zrGroup.childOfName('lineDash').attr('shape', {
        cx: centerPointX,
        cy: centerPointY,
        r: gradientRadius,
      });
      this.fontSizeResize();
    },
    resizeObserve() {
      this.observe = new ResizeObserver(throttle(this.domResize, 500));
      const chartDom = document.querySelector(`#${this.id} .graph`);
      this.observe.observe(chartDom);
    },
    dispose() {
      const {zr, eChartsInstance, observe} = this;
      eChartsInstance.dispose();
      // zr.dispose();
      observe.disconnect();
      deleteObj(this.$data);
    },
    fontSizeResize() {
      const {id} = this;
      const container = document.getElementById(id);
      const {width, height} = container?.getBoundingClientRect();
      const icon = container.querySelector(".text .icon");
      const text = container.querySelector(".text");

      const chartTextTitle = container.querySelector(".chart-text .title");
      const chartTextValueNum = container.querySelector(".chart-text .value .num");
      icon.style.fontSize = height * 0.06 + 'px';
      text.style.fontSize = height * 0.06 + 'px';
      chartTextTitle.style.fontSize = height * 0.07 + 'px';
      chartTextValueNum.style.fontSize = height * 0.12 + 'px';
    }
  }
}
</script>

<style scoped>
.env-visibility {
  width: 100%;
  height: 100%;
}

.text {
  height: 20%;
  width: 100%;
  font-size: 20px;
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
  position: relative;
}

.graph {
  height: 100%;
  width: 100%;
}

.icon {
  /*margin-top: 8px;*/
  font-size: 30px;
}

.text .value {
  margin-left: 10%;
}

.chart-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.chart-text .title {
  font-size: 40px;
  color: #77787b;
  text-align: center;
}

.chart-text .value {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: #fff;
}

.chart-text .num {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  /*color: #fff;*/
  font-size: 60px;
}

.chart-text .unit {
  margin-bottom: 10px;
}
</style>