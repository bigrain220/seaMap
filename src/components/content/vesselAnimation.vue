<template>
  <div class="docking-wrap" :style="{'--vessel-length': vesselLength,
                                              '--vessel-width': vesselWidth,
                                              '--terminal-length': terminalLength,
                                              '--terminal-width': terminalWidth,
                                              '--scale-height': scaleHeight,
                                              '--scale-mark': scaleMark+'vmin'}">
    <svg class="cable-wrap" ref="cableWrap">
      <defs>
        <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2"/>
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal"/>
        </filter>
      </defs>
    </svg>
    <div class="docking-viewer">
      <div class="vessel-wrap" ref="vesselWrap" v-show="vesselVisible">
        <div class="vessel-title" v-if="vesselTitle" v-text="vesselTitle"/>
        <div class="vessel-text" v-if="vesselText">
          <span v-text="vesselText"/>
        </div>
      </div>
    </div>
    <div class="terminal-wrap" ref="terminalWrap" v-show="terminalShow"></div>
  </div>
</template>

<script>
import axios from "axios"
import vesselsSvg from "@/assets/img";
import {throttle} from "echarts";
import {deleteObj} from "@/util/content";

export default {
  name: "vesselAnimation",
  props: {
    distance: {
      type: Number
    },
    angle: {
      type: Number
    },
    hookCables: {
      type: Array
    },
    //船舶和码头的距离多少时显示船舶
    //即船舶和码头在页面上显示的最远距离
    vesselVisibleDistance: {
      type: Number,
      default: 300
    },
    //船舶和码头的距离多少时开始连线
    distanceOfVesselLineWithTerminal: {
      type: Number,
      default: 2.5
    },
    //船舶svg图的文件名(不包含.svg后缀)
    vesselSvgName: {
      type: String,
      default: "OIL"
    },
    //船舶的靠泊方向  0表示右舷靠泊  1表示左舷靠泊
    vesselDir: {
      type: Number,
      default: 1
    },
    //船宽
    vesselWidth: {
      type: Number,
      default: 50
    },
    //船长
    vesselLength: {
      type: Number,
      default: 250
    },
    //船舶中心 Text
    vesselText: {
      type: String
    },
    //船舶上方 Title
    vesselTitle: {
      type: String
    },
    //码头svg图的文件名(不包含.svg后缀)
    terminalSrc: {
      type: String,
      default: 'TERMINAL'
    },
    //是否显示码头
    terminalShow: {
      type: Boolean,
      default: true,
    },
    //码头长度
    terminalLength: {
      type: Number,
      default: 440
    },
    //码头宽度
    terminalWidth: {
      type: Number,
      default: 60
    },
    //码头两侧钩子数
    terminalHook: {
      type: Array[Number],
      default: () => [5, 5]
    },
    //刻度线长度
    scaleHeight: {
      type: Number,
      default: 30
    },
    //比例尺
    scaleMark: {
      type: Number,
      default: 5
    },
    svgSource: {
      type: Object,
      default: () => vesselsSvg
    }
  },
  data() {
    return {
      //其结构为:[
      //      [{第一组第一根线}],第一组
      //      []第二组
      // ]
      //线的属性有{x1:起始x,y1:起始y,x2:结束x,y2:结束y,status:'线的状态'}
      //线在数组中的位置表明了这根线连到码头的那个位置
      cables: [],
      vesselLocation: {dis: null, ang: null},
      snap: {
        terminal: null,
        vessel: null,
        cable: null,
      },
      //船舶是否显示
      vesselVisible: false,
      vMin: Math.min(window.innerWidth, window.innerHeight) / 100,
      //组件激活状态
      activated: false,
      st: throttle(this.initViewerData, 500, true),
      // stats: new Stats(),
      count: 0,
      startTime: 0
    }
  },
  computed: {
    disAndAng() {
      return {dis: this.distance, ang: this.angle}
    },
    vesselSrc() {
      return `${this.vesselSvgName}_${this.vesselDir ? "L" : "R"}`;
    },
    reportRate() {
      const {startTime: begin, count} = this;
      const now = new Date().getTime();
      return Math.max(Math.round((now - begin) / count / 100) * 100, 500);
    }
  },
  watch: {
    disAndAng: {
      handler(newValue, old) {
        if (Number.isNaN(newValue.dis + newValue.ang)) {
          this.vesselVisible = false;
          return;
        }
        const {activated, vesselVisible, startTime} = this;
        if (activated) {
          if (old && vesselVisible) {
            if (!startTime) {
              this.startTime = new Date().getTime();
            }
            this.animationOfVessel(newValue);
          } else {
            this.setVesselLocation(newValue);
            this.vesselVisible = true;
          }
        } else {
          this.setVesselLocation(newValue);
        }
      },
      deep: true
    },
    svgSource(source) {
      this.loadSvg({vessel: this.vesselSrc, terminal: this.terminalSrc}, source).then(this.initObj);
    },
    vesselSrc(src) {
      this.loadSvg({vessel: src}).then(this.initObj);
    },
    terminalSrc(src) {
      this.loadSvg({terminal: src}).then(this.initObj);
    },
    hookCables(newValue) {
      newValue.forEach((group, i) => this.setHookCableGroup(i, group));
    },
    scaleMark() {
      this.repos();
      this.st();
    },
    vesselVisible(newValue, oldValue) {
      if (!newValue && oldValue) {
        this.clearCables();
      }
    }
  },
  mounted() {
    let _this = this;
    this.loadSvg({
      vessel: this.vesselSrc,
      terminal: this.terminalSrc
    }, this.svgSource).then(_this.initObj);
    window.addEventListener("resize", this.st);
  },
  activated() {
    this.activated = true;
    this.hookCables?.forEach((group, i) => this.setHookCableGroup(i, group));
    this.initViewerData();
    this.count = 0;
    this.startTime = 0;
  },
  deactivated() {
    this.activated = false;
    this.clearCables();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.st);
    this.clearCables();
    deleteObj(this.$data);
  },
  methods: {
    /**
     * 加载svg图
     */
    loadSvg({vessel, terminal} = {}, source = this.svgSource) {
      if (source && !Object.keys(source).length) {
        return Promise.reject("no svg source");
      }
      let v = source[vessel];
      let t = source[terminal];
      return Promise.all([
        v ? axios.get(v) : Promise.resolve(),
        t ? axios.get(t) : Promise.resolve()
      ]);
    },
    /**
     * 初始化一些对象
     * @param svgTexts
     */
    initObj(svgTexts) {
      let _this = this;

      let {0: vesselSvg, 1: terminalSvg} = svgTexts;
      let {vesselWrap, terminalWrap, cableWrap} = _this.$refs;

      let vesselData = vesselSvg?.data;
      let terminalData = terminalSvg?.data;

      //放置 SVG 图 以及 初始化 SVG 对象
      if (vesselData) {
        this.initVesselSVG(vesselData, vesselWrap);
        this.snap.vessel = new Snap(vesselWrap.querySelector("svg"));
      }

      if (terminalData) {
        this.initTerminalSVG(terminalData, terminalWrap);
        this.snap.terminal = new Snap(terminalWrap.querySelector("svg"));
      }

      this.snap.cable = new Snap(cableWrap);
    },
    initTerminalSVG(terminalData, terminalWrap = this.$refs.terminalWrap) {
      if (terminalData && terminalWrap) {
        terminalWrap.innerHTML = terminalData;
      }
    },
    initVesselSVG(vesselData, vesselWrap = this.$refs.vesselWarp) {
      if (vesselData && vesselWrap) {
        let _vessel = document.createElement("div");
        _vessel.innerHTML = vesselData;
        let _current = vesselWrap.querySelector("svg");
        if (_current) {
          vesselWrap.replaceChild(_vessel.querySelector("svg"), _current);
        } else {
          vesselWrap.append(_vessel.querySelector("svg"));
        }
      }
    },
    /**
     * 船舶动画
     * @param location{dis,ang} To Location
     * @param location{dis,ang} From Location
     */
    animationOfVessel({dis: toDis, ang: toAng}, {dis: frDis, ang: frAng} = this.vesselLocation) {
      const count = ++this.count;
      Snap.animate([frDis, frAng], [toDis, toAng], ([dis, ang]) => {
        if (count === this.count) {
          this.status?.begin();
          this.setVesselLocation({dis, ang})
          this.status?.end();
        }
      }, this.reportRate);
    },
    setVesselLocation({dis, ang}) {
      let pixel = dis / this.scaleHeight * this.scaleMark * this.vMin;
      this.vesselTransForm(pixel, ang, dis);
      this.vesselLocation = {dis, ang};
    },
    /**
     * 船舶变换(平移，旋转)
     * @param pixel 船舶距码头的像素距离
     * @param angle 角度
     * @param distance
     */
    vesselTransForm(pixel, angle, distance) {
      let _vesselWrap = this.$refs.vesselWrap;
      if (_vesselWrap) {
        _vesselWrap.style.transform = new Snap.Matrix()
            .translate(0, -pixel)
            .rotate(angle, 0, 0);
        // 窗口激活时、船舶显示时、在规定距离时 缆绳变换
        if (this.activated && this.vesselVisible && this.isAttachment(distance)) {
          this.cablesTransForm(angle);
        }
      }
    },
    /**
     * 往 cables 中添加 HookCable
     * @param groupNum 第几组 从0开始
     * @param gStatus HookCable状态 0: OFF, 1: 正常, 2:预警, 3:报警
     */
    setHookCableGroup(groupNum, gStatus = []) {
      const group = this.cables[groupNum] ||= new Array(gStatus.length).fill(null);

      // 当[新状态]比[旧状态]少时, 移除[旧状态], 比[旧状态]多时, 添加[占位值]
      if (group.length > gStatus.length) {
        group.splice(gStatus.length, group.length - gStatus.length)
            .forEach(g => g?.cable?.remove());
      } else if (group.length < gStatus.length) {
        group.push(...new Array(gStatus.length - group.length));
      }

      group.forEach((cableHook, index) => {
        const status = gStatus[index];
        if (cableHook) {
          const {cable, hook} = cableHook;
          if (status) {
            const attr = {class: `status-${status}`};
            cable.attr(attr)
                .attr({filter: status > 1 ? "url(#f1)" : null});
            hook.attr(attr)
          } else {
            group[index] = null;
            cable.remove();
            hook.attr({class: null});
          }
        } else if (status) {
          const terminalHook = this.getTerminalHookElement(groupNum, index)?.hook;
          if (terminalHook) {
            const hookPoint = this.getRectCenterPoint(terminalHook);
            const {x, y} = this.translateScreenCoordinateToCableSvg(hookPoint);
            const attr = {class: `status-${status}`};
            group[index] = {
              cable: this.snap.cable.paper.line(x, y, x, y)
                  .attr(attr)
                  .attr({filter: status > 1 ? "url(#f1)" : null}),
              hook: terminalHook?.attr(attr)
            }
          } else {
            console.warn(`hook element ${groupNum}:${index} not fount`);
          }
        }
      })
    },
    /**
     * 获取船上连接绳子的点
     * @param {number}   angle 当前船舶角度，计算直线位置需要使用
     * @param {number[]} fraction 份数，按照该分数将船上的路径均分，一般为该侧码头 HookGroup 数量
     * @param {Element}  vesselSnap 当前船舶 Svg 的 Snap 对象
     * @return {[{number,number}]} [{x,y}+]
     */
    getVesselPoint(angle = this.vesselLocation?.ang,
                   fraction = this.terminalHook,
                   vesselSnap = this.snap.vessel) {
      if (vesselSnap) {
        let headPointsDomRect = this.getVesselHeadPoint(fraction[0], vesselSnap);
        let tailPointsDomRect = this.getVesselTailPoint(fraction[1], angle, vesselSnap);
        return this.vesselDir ?
            [...headPointsDomRect, ...tailPointsDomRect] :
            [...tailPointsDomRect, ...headPointsDomRect];
      }
      return null;
    },
    /**
     * 获取船头(船尖)上连接绳子的点
     * @return {[{x,y}]}
     */
    getVesselHeadPoint(fraction, vesselSnap = this.snap.vessel) {
      if (vesselSnap) {
        let domRectXYList = [];
        let M0 = vesselSnap.select("#HookPointH_M0").node.getBoundingClientRect();
        let C1 = vesselSnap.select("#HookPointH_C1").node.getBoundingClientRect();
        let C2 = vesselSnap.select("#HookPointH_C2").node.getBoundingClientRect();
        let C3 = vesselSnap.select("#HookPointH_C3").node.getBoundingClientRect();
        for (let i = 0; i < fraction; i++) {
          domRectXYList.push(this.getDotsAtHeadPath(M0, C1, C2, C3, i / (fraction - 1)));
        }
        return domRectXYList;
      }
    },
    /**
     * 获取船头贝塞尔曲线上的点
     * @param m0 {{x,y}} M0点
     * @param c1 {{x,y}} C1锚
     * @param c2 {{x,y}} C2锚
     * @param c3 {{x,y}} C3锚
     * @param t  {Number} Fraction
     * @return   {{x,y}} Point
     */
    getDotsAtHeadPath(m0, c1, c2, c3, t) {
      let t1 = 1 - t,
          t13 = Math.pow(t1, 3),
          t12 = Math.pow(t1, 2),
          t2 = t * t,
          t3 = t2 * t;
      return {
        x: t13 * m0.x + t12 * 3 * t * c1.x + t1 * 3 * t * t * c2.x + t3 * c3.x,
        y: t13 * m0.y + t12 * 3 * t * c1.y + t1 * 3 * t * t * c2.y + t3 * c3.y
      }
    },
    /**
     * 获取船尾上连接绳子的点
     * @return {[{x,y}]}
     */
    getVesselTailPoint(fraction, angle, vesselSnap = this.snap.vessel) {
      if (vesselSnap) {
        let endNode = vesselSnap.select("#HookPointE").node;
        let domRectXYList = [];
        let tailLineDomRect = endNode.getBoundingClientRect();
        //线段在屏幕上的起点坐标
        let startX = tailLineDomRect.x;
        let startY = tailLineDomRect.y;
        //该线段所在矩形的宽高
        let width = tailLineDomRect.width;
        let height = tailLineDomRect.height;
        //取的点包括起点 故步长实际上是pointNum-1
        let widthStep = width / (fraction - 1);
        let heightStep = height / (fraction - 1);

        // 翻转 => 0~3 代表 1~4 象限
        let quad = (((angle / 90) | 0) % 4) + (angle < 0 ? 3 : 0);

        let turnX = quad === 2 || quad === 1;
        let turnY = quad > 1;

        for (let i = 0; i < fraction; i++) {
          domRectXYList.push({
            x: startX + (turnX ? width - (i * widthStep) : i * widthStep),
            y: startY + (turnY ? height - (i * heightStep) : i * heightStep)
          });
        }
        return domRectXYList;
      }
    },
    /**
     * 获取码头svg图中 station 或者 hook 元素
     * @param {number} group 组号 从0开始
     * @param {number} index 组内序号 从0开始
     * @return {{station: Element, hook: Element}}
     */
    getTerminalHookElement(group, index) {
      let stationElement = this.snap.terminal?.selectAll('g.station')?.[group];
      return {
        station: stationElement,
        hook: (index || index === 0) && stationElement?.selectAll('path')?.[index] || null
      }
    },
    /**
     * 获取 Rect Center Point
     * @param {Element | {node: Element}} element DOMElement / SnapElement
     * @return {{x: number, y: number}} CenterPoint
     */
    getRectCenterPoint(element) {
      let rect = (element instanceof Element ? element : element.node).getBoundingClientRect();
      return {
        x: rect.x + 0.5 * rect.width,
        y: rect.y + 0.5 * rect.height
      };
    },
    /**
     * 把屏幕上的坐标 转换成用于画线的Svg内的坐标
     * @param domRect
     * @return {DOMPoint}
     */
    translateScreenCoordinateToCableSvg(domRect) {
      let _cableWrap = this.$refs.cableWrap;
      // 获取画线的svg的转换矩阵
      let cableScreenCTM = _cableWrap.getScreenCTM()
      let point = _cableWrap.createSVGPoint();
      point.x = domRect.x;
      point.y = domRect.y;
      return point.matrixTransform(cableScreenCTM.inverse());
    },
    /**
     * 缆绳变换(连接 hook 与 vessel)
     */
    cablesTransForm(angle) {
      let vesselPoint = this.getVesselPoint(angle);
      this.cables.forEach((group, i) => {
        group?.filter(l => l).forEach(({cable}) => {
          if (vesselPoint) {
            let {x, y} = this.translateScreenCoordinateToCableSvg(vesselPoint[i]);
            cable.attr({x2: x, y2: y, display: x && y ? null : "none"});
          } else {
            cable.attr({display: "none"});
          }
        })
      });
    },
    /**
     * 重定位缆绳
     */
    reposCables() {
      const vesselPoint = this.getVesselPoint();
      this.cables.forEach((group, i) => {
        group?.filter(g => g).forEach(({cable, hook}) => {
          if (cable && hook) {
            let rect = this.getRectCenterPoint(hook);
            let {x: x1, y: y1} = this.translateScreenCoordinateToCableSvg(rect);
            if (x1 && y1) {
              if (this.activated && this.vesselVisible) {
                let {x: x2, y: y2} = this.translateScreenCoordinateToCableSvg(vesselPoint[i]);
                cable.attr({x1: x1, y1: y1, x2: x2 ?? x1, y2: y2 ?? y1});
              } else {
                cable.attr({x1: x1, y1: y1, x2: x1, y2: y1});
              }
            }
          }
        })
      });
    },
    /**
     * 清除所有的缆绳,但不改变钩子状态
     */
    clearCables() {
      let _cables = this.cables;
      _cables?.splice(0, _cables.length).forEach(group =>
          group.filter(g => g).forEach(({cable}) => cable?.remove())
      );
    },
    /**
     * 判断是否要连线
     * @param distance 距离
     * @return {boolean}
     */
    isAttachment(distance) {
      return distance <= this.distanceOfVesselLineWithTerminal;
    },
    /**
     * 窗口大小变化后重新计算线的位置
     */
    repos() {
      if (this.activated) {
        this.reposCables();
        this.vesselLocation && this.setVesselLocation(this.vesselLocation);
      }
    },
    /**
     *  加装必要的预览数据 如 vMin
     */
    initViewerData() {
      this.vMin = Math.min(window.innerWidth, window.innerHeight) / 100;
      this.repos();
    },
    /**
     * 重置船舶与码头的距离、角度
     * 清除船舶与码头的连线
     */
    reset() {
      this.clearCables();
      this.vesselVisible = false;
      this.vesselLocation = null;
    },
  }
}
</script>

<style scoped>

.docking-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
  height: 100%;
  width: 100%;
  background: repeating-linear-gradient(0deg, transparent, transparent calc(var(--scale-mark) - 1px), #36393e, #36393e calc(var(--scale-mark) + 1px));
}

.cable-wrap {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible !important;
  z-index: 9;
  width: 1px;
  height: 1px;
  filter: drop-shadow(0 0px 1px #4C4C4C);
}

.cable-wrap >>> line {
  stroke: #4c4c4c;
  stroke-width: 2;
}

.cable-wrap >>> line.status-1 {
  stroke: #939393;
}

.cable-wrap >>> line.status-2 {
  stroke: #ffb200;
  stroke-width: 2;
  animation-name: breath;
  animation-duration: 1.5s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.cable-wrap >>> line.status-3 {
  stroke: #ec0c38;
  stroke-width: 2;
  animation-name: breath;
  animation-duration: 1.5s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.terminal-wrap >>> .station > path.status-1 {
  fill: #939393;
}

.terminal-wrap >>> .station > path.status-2 {
  fill: #ffb200;
}

.terminal-wrap >>> .station > path.status-3 {
  fill: #ec0c38;
}

@keyframes breath {
  from {
    opacity: 1
  }
  50% {
    opacity: 0.3
  }
  to {
    opacity: 1
  }
}

.docking-viewer {
  height: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column-reverse;
}

.vessel-wrap {
  width: calc(var(--vessel-length) / var(--scale-height) * var(--scale-mark));
  height: calc(var(--vessel-width) / var(--scale-height) * var(--scale-mark));
  filter: drop-shadow(0 1px 1px #666666);
  align-self: center;
}

/* 跟随 vessel-wrap */
.vessel-wrap >>> svg {
  width: 100%;
  height: 100%;
}

.vessel-wrap > .vessel-title {
  position: absolute;
  top: -1.5em;
  left: 0;
  background: rgba(255, 255, 255, 0.4);
  text-shadow: 0 0 2px #000;
  padding: 0 0.5rem;
}

.vessel-wrap > .vessel-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c0e3f0;
  font-size: 2rem;
  text-shadow: #939393 1px 0 3px, #000 0 1px 3px, #000 -1px 0 3px, #000 0 -1px 3px;
}

.terminal-wrap {
  align-self: center;
  filter: drop-shadow(0 1px 1px #666666);
}

.terminal-wrap >>> svg {
  width: calc(var(--terminal-length) / var(--scale-height) * var(--scale-mark));
  height: calc(var(--terminal-width) / var(--scale-height) * var(--scale-mark));
}

.terminal-wrap >>> .terminal path {
  fill: #555656;
  stroke-width: 0;
}

.terminal-wrap >>> .station path {
  fill: #4e4f52;
  stroke-width: 0;
}
</style>