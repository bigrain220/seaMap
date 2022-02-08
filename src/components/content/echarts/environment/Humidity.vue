<template>
  <div :id="id" class="env-humidity">
    <div class="text">

      <span class="title"><i class="icon env-icon icon-w_shidu"></i>大气湿度</span>
      <span class="value">{{ humidityValue }}%</span>
    </div>
    <div class="chart">
      <base-z-render
          :id="innerId"
          :resize="resize"
          :ref="innerId"
      />
      <div class="chart-text">
        <div class="title">大气湿度</div>
        <div class="value">
          <div class="num">{{ humidityValue }}</div>
          <div class="unit">%</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import BaseZRender from "@/components/content/echarts/environment/baseZRender";
import {scaleLinear} from 'd3-scale';

export default {
  name: "Humidity",
  components: {
    BaseZRender
  },
  props: {
    id: {
      type: String,
      default: 'env_humidity',
    }
  },
  data() {
    return {
      humidityValue: 0,//当前湿度值
      beginColor: '#00e4ff',
      middleColor: '#ffa700',
      endColor: '#f53527',
    }
  },
  computed: {
    innerId() {
      return this.id + '_chart';
    },
    zRenderRef() {
      return this.$refs[this.innerId];
    }
  },
  watch: {
    humidityValue(newValue) {
      this.setData(newValue);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const {id, innerId} = this;
      const chartDom = document.querySelector(`#${id} .chart`);
      const {width, height} = chartDom.getBoundingClientRect();
      //以较小的值作为直径
      const radius = width > height ? height / 2 : width / 2;
      //圆心坐标
      const centerPointX = width / 2;
      const centerPointY = height / 2;

      //环形渐变
      const gradientRadius = Math.max(0, radius - 20);
      const lineWidth = 10;
      const {beginColor, middleColor, endColor} = this;
      //0~70在begin和middle中渐变  70~100在middle和end之间渐变
      const colorFun = scaleLinear()
          .domain([0, 70, 100])
          .range([beginColor, middleColor, endColor]);
      this.gradientRing(centerPointX, centerPointY, gradientRadius, lineWidth, colorFun);

      //环形渐变遮罩
      this.zRenderRef.addArc({
        silent: true,
        shape: {
          cx: centerPointX,
          cy: centerPointY,
          r: gradientRadius,
          startAngle: -Math.PI / 2,
          endAngle: -Math.PI / 2,
        },
        style: {
          lineWidth: lineWidth,
          fill: 'none',
          blend: 'destination-in'
        },
        zlevel: 2,
      }, 'ringMask');

      //方块
      this.zRenderRef.addArc({
        silent: true,
        shape: {
          cx: centerPointX,
          cy: centerPointY,
          r: gradientRadius,
          startAngle: -Math.PI / 2,
          endAngle: Math.PI / 2 * 3,
        },
        style: {
          fill: 'none',
          stroke: beginColor,
          lineWidth: lineWidth,
          lineDash: [10, 10],
        },
        zlevel: 1,
      }, 'ringRect');

      //最外层的虚线圆
      this.zRenderRef.addCircle({
        silent: true,
        shape: {
          cx: centerPointX,
          cy: centerPointY,
          r: Math.max(0, radius - 5),
        },
        style: {
          fill: 'none',
          stroke: beginColor,
          lineWidth: 1,
          lineDash: [5, 5],
        }
      }, 'outerDashCircle');

      //内层的实线圆
      const innerRadius = Math.max(0, gradientRadius - 15);
      this.zRenderRef.addCircle({
        silent: true,
        shape: {
          cx: centerPointX,
          cy: centerPointY,
          r: innerRadius,
        },
        style: {
          fill: 'none',
          stroke: beginColor,
          lineWidth: 1,
        }
      }, 'innerCircle');

    },
    /**
     *
     *环形渐变的圆弧
     * @param x 圆心x
     * @param y 圆心y
     * @param radius 半径
     * @param lineWidth 线宽
     * @param colorFun {function} 要求传入1~100 返回颜色
     */
    gradientRing(x, y, radius, lineWidth, colorFun) {
      const PI = Math.PI;
      let start = -PI / 2;
      const unit = PI * 2 / 100;
      for (let i = 1; i <= 100; i++) {
        let end = start + unit;
        let name = 'gradientRing_' + i;
        this.zRenderRef.addArc({
          silent: true,
          shape: {
            cx: x,
            cy: y,
            r: radius,
            startAngle: start,
            endAngle: end,
          },
          style: {
            lineWidth,
            stroke: colorFun(i),
            fill: 'none',
            lineCap: (i === 1 || i === 100) ? 'butt' : 'round',
          },
          zlevel: 2,
        }, name);
        start += unit;
      }
    },
    /**
     * 设置湿度值
     * @param humidityValue
     */
    setData(humidityValue) {
      this.humidityValue = humidityValue;
      const angle = scaleLinear()
          .domain([0, 100])
          .range([-Math.PI / 2, Math.PI / 2 * 3])
          .clamp(true);
      const scaleAngle = angle(humidityValue);
      //遮罩的动画
      this.zRenderRef.animateTo('ringMask', {
        shape: {
          endAngle: scaleAngle,
        }
      });
      //改变文字的颜色
      const {beginColor, middleColor, endColor} = this;
      //0~70在begin和middle中渐变  70~100在middle和end之间渐变
      const colorFun = scaleLinear()
          .domain([0, 70, 100])
          .range([beginColor, middleColor, endColor])
          .clamp(true);
      document.querySelector(`#${this.id} .chart-text .value`).style.color = colorFun(humidityValue);
    },
    /**
     * div尺寸变化时  要重新设置圆心和半径
     */
    resize() {
      const {id, innerId} = this;
      const chartDom = document.querySelector(`#${id} .chart`);
      const {width, height} = chartDom.getBoundingClientRect();
      //以较小的值作为直径
      const radius = width > height ? height / 2 : width / 2;
      //圆心坐标
      const centerPointX = width / 2;
      const centerPointY = height / 2;

      const gradientRadius = Math.max(radius - 20, 0);
      const innerRadius = Math.max(gradientRadius - 15, 0);

      this.zRenderRef.changeAttr('ringMask', 'shape', {
        cx: centerPointX, cy: centerPointY, r: gradientRadius,
      });
      this.zRenderRef.changeAttr('ringRect', 'shape', {
        cx: centerPointX, cy: centerPointY, r: gradientRadius,
      });
      this.zRenderRef.changeAttr('outerDashCircle', 'shape', {
        cx: centerPointX, cy: centerPointY, r: Math.max(radius - 5, 0),
      });
      this.zRenderRef.changeAttr('innerCircle', 'shape', {
        cx: centerPointX, cy: centerPointY, r: innerRadius,
      });
      for (let i = 1; i <= 100; i++) {
        let name = 'gradientRing_' + i;
        this.zRenderRef.changeAttr(name, 'shape', {
          cx: centerPointX, cy: centerPointY, r: gradientRadius,
        });
      }
      this.changeTextSize();
    },
    /**
     * 每次div尺寸变化后 修改文字的大小
     */
    changeTextSize() {
      const {id} = this;
      const container = document.getElementById(id);
      const topText = container.querySelector(".text");
      const icon = container.querySelector(".icon");
      const chartTextTitle = container.querySelector(".chart-text .title");
      const chartTextNum = container.querySelector(".chart-text .value .num");
      const chartTextUnit = container.querySelector(".chart-text .value .unit");
      const {width, height} = container?.getBoundingClientRect();
      topText.style.fontSize = height * 0.06 + 'px';
      icon.style.fontSize = height * 0.06 + 'px';
      chartTextTitle.style.fontSize = height * 0.07 + 'px';
      chartTextNum.style.fontSize = height * 0.12 + 'px';
      chartTextUnit.style.fontSize = height * 0.04 + 'px';
    }
  }
}
</script>

<style scoped>
.env-humidity {
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

.icon {
  /*margin-top: 8px;*/
  font-size: 4vh;
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
  font-size: 5vh;
  color: #77787b;
  text-align: center;
}

.chart-text .value {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: #00e4ff;
}

.chart-text .value .num {
  font-size: 6vh;
}

.chart-text .value .unit {
  margin-bottom: 5px;
  font-size: 1.5vh;
}
</style>