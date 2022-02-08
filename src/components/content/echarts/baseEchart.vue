<template>
    <div style="height: 100%; width: 100%">
        <div :id="id" style='height: 100%; width: 100%'></div>
    </div>
</template>

<script>
  import echarts, {throttle} from 'echarts';
  import {deleteObj} from "@/util/content";

  export default {
    name: "baseEchart",
    props: {
      //div的Id 要保证唯一
      id: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        domId: this.id,
        eChartsInstance: null,
        observer:null,//用于监听div的尺寸变化
      }
    },
    mounted() {
      this.eChartsInstance = echarts.init(document.getElementById(this.domId), null, {renderer: 'canvas'});
      this.resizeObserve();
    },
    beforeDestroy() {
      const observer = this.observer;
      if (observer){
        observer.disconnect();
      }
      this.dispose();
      deleteObj(this.$data);
    },
    methods: {
      /**
       * @param option echarts的配置
       */
      setOption(option) {
        this.eChartsInstance.setOption(option);
      },
      eChartsResize() {
        const eChartsInstance = this.eChartsInstance;
        if (eChartsInstance) {
          eChartsInstance.resize();
        }
      },
      //销毁实例
      dispose(){
        const eChartsInstance = this.eChartsInstance;
        if (eChartsInstance) {
          eChartsInstance.dispose();
        }
      },
      resizeObserve() {
        this.observe = new ResizeObserver(throttle(this.domSizeChanged,500));
        const dom = document.getElementById(this.id);
        this.observe.observe(dom);
      },
      domSizeChanged(entries){
        //里面有变化后的对象,不过我们用不上
        const entry = entries[0];
        //只要监测到尺寸变化，就重绘图像
        this.eChartsResize();
      },
      /**
       * 获取echarts的实例
       * @return {*}
       */
      getEChartsInstance(){
        return this.eChartsInstance;
      }
    }
  }
</script>

<style scoped>

</style>
