<template>
    <div class="base-zRender">
        <div :id="id" class="chart"></div>
    </div>
</template>

<script>
  import zRender from 'zrender';
  import {deleteObj} from "@/util/content";
  import {throttle} from "echarts";

  export default {
    name: "baseZRender",
    props: {
      id: {
        type: String,
        required: true,
      },
      //元素尺寸变化时要执行的方法
      resize:{
        type: Function,
        required: false,
        default: ()=>{},
      }
    },
    data() {
      return {
        zr: null,
        group: null,
        observe: null,
      }
    },
    mounted() {
      this.init();
      this.resizeObserve();
    },
    beforeDestroy() {
      if (this.zr) {
        this.zr.dispose();
      }
      if (this.observe){
        this.observe.disconnect();
      }
      deleteObj(this.$data);
    },
    methods: {
      init() {
        const dom = document.querySelector(`.base-zRender #${this.id}`);
        this.zr = new zRender.init(dom);
        this.group = new zRender.Group();
        this.zr.add(this.group);
      },
      addCircle(opt, name) {
        const obj = Object.assign(opt, {name});
        this.group.add(new zRender.Circle(obj));
      },
      addArc(opt, name) {
        const obj = Object.assign(opt, {name})
        this.group.add(new zRender.Arc(obj));
      },
      addRect(opt, name){
        const obj = Object.assign(opt, {name})
        this.group.add(new zRender.Rect(obj));
      },
      animateTo(name, opt) {
        this.getElement(name).animateTo(opt);
      },
      changeAttr(name, attrName, opt) {
        this.getElement(name).attr(attrName, opt);
      },
      getElement(name) {
        const element = this.group.childOfName(name);
        if (element) {
          return element;
        } else {
          throw `element name: ${name} is not exist`
        }
      },
      resizeObserve() {
        this.observe = new ResizeObserver(throttle(this.domResize,500));
        //圆的圆心和半径一半都和父元素的长宽相关
        //该dom元素的长宽都为100%  故父元素变化该元素也会变化
        const dom = document.getElementById(this.id);
        this.observe.observe(dom);
      },
      domResize(){
        //重置一下canvas的大小
        this.zr.resize();
        //再执行传入的resize方法
        this.resize();
      },
      getZRender(){
        return this.zr;
      },
      getGroup(){
        return this.group;
      }
    }
  }
</script>

<style scoped>
    .base-zRender {
        width: 100%;
        height: 100%;
    }

    .chart {
        width: 100%;
        height: 100%;
    }
</style>