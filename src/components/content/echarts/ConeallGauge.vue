<template>
  <div class="c-gauge-chart">
    <div class="graph" ref="chart-graph"/>
    <div class="chart-text" :style="{fontSize:`${Math.max(rMin * 0.07,12)}px`}">
      <div class="title" v-text="title"/>
      <div class="value">
        <div class="num" v-text="valueShow" :style="{color:colorLinear(this.valueRing)}"/>
        <div class="unit" v-text="unit"/>
      </div>
    </div>
  </div>
</template>

<script>
import zRender from 'zrender';
import echarts, {throttle} from 'echarts';
import {scaleLinear} from 'd3-scale';
import {deleteObj} from "@/util/content";
import ResizeObserver from "resize-observer-polyfill";

export default {
  name: "gauge",
  props: {
    title: {
      type: String
    },
    value: {
      type: Number
    },
    valueFixed: {
      type: Number
    },
    valueMin: {
      type: Number
    },
    valueMax: {
      type: Number
    },
    unit: {
      type: String
    },
  },
  data() {
    return {
      eChartsInstance: null,
      beginColor: '#00e4ff',
      middleColor: '#ffa700',
      endColor: '#f53527',
      beginAngle: -1.25 * Math.PI,
      endAngle: .25 * Math.PI,
      rect: {height: 0, width: 0},
      observe: new ResizeObserver(throttle(entries => this.rect = entries[0].contentRect, 500)),
    }
  },
  watch: {
    value() {
      const {valueRing} = this;
      //TODO 此处应该为根据预警报警值进行映射
      this.zrGroup.childOfName('gradientMask').animateTo({
        shape: {endAngle: this.angleLinear(valueRing)},
      });
    },
    rect() {
      this.domResize();
    }
  },
  computed: {
    valueShow() {
      const {value, valueFixed} = this;
      if (value) {
        if (!isNaN(valueFixed)) {
          return value.toFixed(valueFixed);
        } else {
          return value >= 100 ? value.toFixed(0) :
              value >= 10 ? value.toFixed(1) : value.toFixed(2);
        }
      }
      return value ?? "N"
    },
    valueRing() {
      const {value, valueMin: min, valueMax: max} = this;
      return Math.min(Math.max(min, value), max);
    },
    ringProps() {
      const {height, width} = this.rect;
      //以较小的值作为半径
      const radius = Math.min(height, width) / 2;
      //环形渐变的半径
      const gradientRadius = Math.max(0, radius - 10);
      //仪表盘半径
      const gaugeRadius = Math.max(0, gradientRadius - 10);
      return {
        x: width / 2,
        y: height / 2,
        gradientRadius,
        gaugeRadius
      }
    },
    angleLinear() {
      const {
        valueMin: min,
        valueMax: max,
        beginAngle: begin,
        endAngle: end
      } = this;
      return scaleLinear().domain([min, max]).range([begin, end]);
    },
    colorLinear() {
      const {
        valueMin: min,
        valueMax: max,
        beginColor: begin,
        middleColor: middle,
        endColor: end
      } = this;
      return scaleLinear().domain([min, (min + max) / 2, max]).range([begin, middle, end]);
    },
    maskColorLinear() {
      const {beginColor: begin, middleColor: middle, endColor: end} = this;
      return scaleLinear().domain([0, 100]).range([begin, middle, end]);
    },
    maskAngleLinear() {
      const {beginAngle: begin, endAngle: end} = this;
      return scaleLinear().domain([1, 100]).range([begin, end]);
    },
    rMin() {
      const {height, width} = this.rect;
      return Math.min(height, width);
    }
  },
  mounted() {
    this.init();
    this.observe.observe(this.$el);
  },
  beforeDestroy() {
    this.dispose();
  },
  methods: {
    init() {
      const {
        valueMin: min, valueMax: max, beginAngle, endAngle
      } = this;

      this.rect = this.$el.getBoundingClientRect();
      this.eChartsInstance = echarts.init(this.$refs["chart-graph"]);
      this.zr = this.eChartsInstance.getZr();
      this.zrGroup = new zRender.Group();
      this.zr.add(this.zrGroup);

      const {x, y, gradientRadius, gaugeRadius} = this.ringProps;
      //分割线长度
      const splitLineLength = 5;

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

      const lineWidth = 10;
      //环形渐变
      this.gradientRing(x, y, gradientRadius, lineWidth);

      //环形渐变遮罩
      const gradientMask = new zRender.Arc({
        silent: true,
        name: 'gradientMask',
        shape: {
          cx: x,
          cy: y,
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
          cx: x,
          cy: y,
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
    /**
     *
     *环形渐变的圆弧
     * @param x 圆心x
     * @param y 圆心y
     * @param radius 半径
     * @param lineWidth 线宽
     */
    gradientRing(x, y, radius, lineWidth) {
      const zrGroup = this.zrGroup,
          colorLinear = this.maskColorLinear,
          angleLinear = this.maskAngleLinear;
      for (let i = 1; i <= 100; ++i) {
        let name = 'gradient_' + i;
        let arc = new zRender.Arc({
          silent: true,
          name,
          shape: {
            cx: x,
            cy: y,
            r: radius,
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
        zrGroup.add(arc);
      }
    },
    gradientMask() {

    },
    domResize() {
      const {x, y, gradientRadius, gaugeRadius} = this.ringProps;

      this.eChartsInstance.setOption({
        series: [
          {radius: gaugeRadius}
        ]
      });
      this.eChartsInstance.resize();

      //修改渐变圆的圆心和半径
      for (let i = 1; i <= 99; ++i) {
        this.zrGroup.childOfName('gradient_' + i).attr('shape', {
          cx: x,
          cy: y,
          r: gradientRadius,
        })
      }
      //修改渐变圆的遮罩圆心和半径
      this.zrGroup.childOfName("gradientMask").attr('shape', {
        cx: x,
        cy: y,
        r: gradientRadius,
      });
      //修改渐变圆弧下的刻度线的圆心和半径
      this.zrGroup.childOfName('lineDash').attr('shape', {
        cx: x,
        cy: y,
        r: gradientRadius,
      });
    },
    dispose() {
      const {zr, eChartsInstance, observe} = this;
      eChartsInstance.dispose();
      // zr.dispose();
      observe.disconnect();
      deleteObj(this.$data);
    }
  }
}
</script>

<style scoped>
.c-gauge-chart {
  width: 100%;
  height: 100%;
}

.graph {
  height: 100%;
  width: 100%;
}

.chart-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.chart-text .title {
  text-align: center;
}

.chart-text .value {
  text-align: center;
  vertical-align: bottom;
}

.chart-text .num {
  justify-content: center;
  font-size: 2em;
  display: inline-block;
}

.chart-text .unit {
  left: 100%;
  display: inline-block;
}
</style>