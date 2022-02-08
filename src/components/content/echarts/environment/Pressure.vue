<template>
  <div class="env-pressure">
    <div :id="id">
      <div class="text">
        <span class="title"><i class=" icon env-icon icon-qiya"></i>大气压</span>
      </div>
      <div class="chart">
        <base-z-render
            :id="innerId"
            :resize="resize"
            :ref="innerId"
        />
      </div>
      <div class="value">{{ pressureValue }}Pa</div>
    </div>
  </div>
</template>

<script>
import zRender from 'zrender';
import baseZRender from "@/components/content/echarts/environment/baseZRender";
import {scaleLinear} from 'd3-scale'

export default {
  name: "Pressure",
  components: {
    baseZRender,
  },
  props: {
    id: {
      type: String,
      default: 'env_pressure',
    }
  },
  data() {
    return {
      pressureValue: 1020,
      max: 1050,
      min: 950,
      rectNum: 7,//方块个数
      beginColor: '#00e4ff',
      middleColor: '#ffa700',
      endColor: '#f53527',
      inactiveRectLength: 0.7,//正常状态下的方块长度
      rectGap: 10,//方块间的间隔
    }
  },
  computed: {
    innerId() {
      return this.id + '_chart';
    },
    zRenderRef() {
      return this.$refs[this.innerId];
    },
    colorLinear() {
      const {min, max, beginColor, middleColor, endColor} = this;

      return scaleLinear()
          //TODO 颜色渐变要和预警报警值相关
          .domain([min, min + (max - min) * 0.25, min + (max - min) * 0.5, min + (max - min) * 0.75, max])
          .range([endColor, middleColor, beginColor, middleColor, endColor]);
    }
  },
  watch: {
    // pressureValue(newValue, oldValue) {
    //   this.setData(newValue, oldValue);
    // }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {

  },
  methods: {
    init() {
      const {id, inactiveRectLength, rectGap, rectNum, colorLinear, zRenderRef} = this;
      const chartDom = document.querySelector(`#${id} .chart`);
      const {width, height} = chartDom.getBoundingClientRect();
      //方rectGap
      //每个方块高度
      const rectHeight = height / rectNum - rectGap;

      for (let i = 1; i <= rectNum; ++i) {
        //方块左上角点坐标
        const x = width * (1 - inactiveRectLength) / 2;
        const y = height - (rectHeight + rectGap) * i;
        //每个方块对应的最值
        const [minColor, maxColor] = this.rectNumMapValueScope(i);
        //方块内的颜色渐变
        const color = new zRender.LinearGradient(0, 1, 0, 0, [
          {offset: 0, color: colorLinear(minColor)},
          {offset: 1, color: colorLinear(maxColor)},
        ]);
        zRenderRef.addRect({
          silent: true,
          shape: {
            x, y,
            width: width * inactiveRectLength,
            height: rectHeight
          },
          style: {
            fill: color
          }
        }, 'rect_' + i);
      }
      document.querySelector(`#${id} .value`).style.color = colorLinear(this.pressureValue);
    },
    /**
     * 把值映射成第几个方块
     * 方块从1开始
     * @param value
     */
    valueMapRectNum(value) {
      const {rectNum, min, max} = this;
      const range = scaleLinear().domain([min, max]).range([0, rectNum]).clamp(true);
      const num = range(value);
      return num === 0 ? 1 : Math.ceil(num);
    },
    /**
     * 获取第几个方块的最值
     * @param rectNum 第几个方块(从下往上 从1开始)
     * @return 长度为2的数组 第一个数为最小值
     */
    rectNumMapValueScope(rectNum) {
      const {min, max, rectNum: totalRectNum} = this;
      const range = scaleLinear().domain([0, totalRectNum]).range([min, max]);
      return [range(rectNum - 1), range(rectNum)];
    },
    setData(pressureValue) {
      const {id, inactiveRectLength, zRenderRef, pressureValue: oldValue} = this;
      const chartDom = document.querySelector(`#${id} .chart`);
      const {width, height} = chartDom.getBoundingClientRect();

      const oldRectNum = this.valueMapRectNum(oldValue);
      const nowNum = this.valueMapRectNum(pressureValue);
      //如果新旧值对应同一个方块 则不理会
      if (oldRectNum === nowNum) {
        return;
      }
      //先把旧的方块调整到和其他方块等长
      zRenderRef.getElement('rect_' + oldRectNum).animateTo({
        shape: {
          x: width * (1 - inactiveRectLength) / 2,
          width: width * inactiveRectLength,
        }
      });
      //再调整新值对应的方块长度
      zRenderRef.getElement('rect_' + nowNum).animateTo({
        shape: {
          x: 0,
          width: width,
        }
      });
      this.pressureValue = pressureValue;
      document.querySelector(`#${id} .value`).style.color = this.colorLinear(pressureValue);
    },
    resize() {
      // //先把所有元素移除
      const {id, zRenderRef, rectNum, pressureValue} = this;
      const zr = zRenderRef.getZRender();
      const group = zRenderRef.getGroup();
      for (let i = 1; i <= rectNum; ++i) {
        group.remove(zRenderRef.getElement('rect_' + i))
      }

      //再从画
      this.init();

      //再保持最长的那个方块的长度
      const chartDom = document.querySelector(`#${id} .chart`);
      const {width, height} = chartDom.getBoundingClientRect();
      const nowNum = this.valueMapRectNum(pressureValue);
      zRenderRef.changeAttr('rect_' + nowNum, 'shape', {
        x: 0,
        width: width,
      });
      this.fontSizeResize();
    },
    fontSizeResize() {
      const {id} = this;
      const container = document.getElementById(id);
      const {width, height} = container?.getBoundingClientRect();
      const icon = container.querySelector(".text .icon");
      const text = container.querySelector(".text");

      const chartValue = container.querySelector(".value");
      icon.style.fontSize = height * 0.06 + 'px';
      text.style.fontSize = height * 0.06 + 'px';
      chartValue.style.fontSize = height * 0.07 + 'px';
    }
  }
}
</script>

<style scoped>

.env-pressure{
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.env-pressure > div{
  width: 80%;
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
  height: 70%;
  width: 100%;
}

.value {
  height: 10%;
  width: 100%;
  color: #00e4ff;
  text-align: center;
  font-size: 50px;
}

.icon {
  /*margin-top: 8px;*/
  margin-right: 30px;
  font-size: 30px;
}
</style>