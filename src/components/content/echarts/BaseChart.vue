<template>
  <div class="chart-view"/>
</template>

<script>
import * as echarts from 'echarts';
import {throttle} from 'echarts';
import {deleteObj} from "@/util/content";

export default {
  name: "BaseChart",
  data() {
    return {
      instance: null,
      observer: null,
      activated: true,
      version: null,
    }
  },
  created() {
    this.version = echarts.version;
  },
  mounted() {
    this.instance = echarts.init(this.$el);
    this.observe = new ResizeObserver(throttle(this.resize, 500));
    this.observe.observe(this.$el);
  },
  activated() {
    this.activated = true;
  },
  deactivated() {
    this.activated = false;
  },
  beforeDestroy() {
    this.observer?.disconnect();
    this.instance?.dispose();
    deleteObj(this.$data);
  },
  methods: {
    /**
     * @param option echarts的配置
     */
    setOption(option) {
      this.instance?.setOption(option);
    },
    setSeries(series) {
      this.activated && this.setOption({series})
    },
    resize(entries, observer) {
      if (this.activated) {
        let [{contentRect: {width, height}}] = entries;
        if (width && height) {
          this.instance?.resize();
        }
        this.$emit("resize", {width, height});
      }
    },
    /**
     * 获取echarts的实例
     * @return {*}
     */
    getInstance() {
      return this.instance;
    }
  }
}
</script>

<style scoped>
div.chart-view {
  height: 100%;
  width: 100%
}
</style>
