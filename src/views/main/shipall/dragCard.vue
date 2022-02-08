<template>
  <div class="drag-card" ref="dragCard"
       :style="{'width':width,'visibility':visible?'visible':'hidden','left':leftInit,'top':topInit,'right':rightInit}"
       @mousedown="dragClick1">
<!--    onselectstart="return false;" 加上可以不让选中文字-->
    <div class="drag-header">
      <!--使用title-slot时要修改样式-->
      <slot name="title">
        <div class="header-title"><span>{{ title }}</span></div>
      </slot>
      <div class="close-btn">
        <span class="el-icon-close close-icon" @click="closeClick"></span>
      </div>
      <div class="drag-dom" style="height:40px;cursor:move;position:relative;z-index: 1;" @mousedown="dragClick2"
           v-if="!dragAll"></div>
    </div>
    <div class="drag-content">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'title'
    },
    width: {
      type: String,
      default: '50%'
    },
    visible: {
      type: Boolean,
      default: false,
    },
    //是否可以点击全部区域拖动
    dragAll: {
      type: Boolean,
      default: true,
    },
    //是否加临界值
    free: {
      type: Boolean,
      default: false,
    },
    //是否自动居中
    autoCenter: {
      type: Boolean,
      default: true,
    },
    //初始化left值
    leftInit: {
      type: String,
      default: " "
    },
    //初始化top值
    topInit: {
      type: String,
      default: " "
    },
    //初始化right值
    rightInit:{
      type: String,
      default: " "
    },
    zIndex:{
      type:Number
    }
  },
  data() {
    return {
      selector: {}
    }
  },
  methods: {
    dragClick1(e) {
      this.dragAll ? this.dragEvent(e, {'selector': '.drag-card'}) : "";
    },
    dragClick2(e) {
      // this.dragAll ? "" : this.dragEvent(e, { 'selector': '.drag-card' });
      !this.dragAll && this.dragEvent(e, {'selector': '.drag-card'});
    },
    dragEvent(e) {
      if(this.zIndex>-1){ //点击提高层级
        this.$emit('update:zIndex', this.zIndex+1);
        this.selector.style.zIndex=this.zIndex;
      }
      // console.log(e)
      e = e || window.event;
      let ref = this.selector;
      const refW = ref.offsetWidth;
      const refH = ref.offsetHeight;
      let disX = e.clientX - ref.offsetLeft;
      let disY = e.clientY - ref.offsetTop;
      //阻止文字拖动
      ref.ondragstart = function () {
        return false;
      };
      document.onmousemove = (e) => {
        e = e || window.event;
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        //临界值判断
        let doc = document.documentElement;
        if (!this.free) {
          if (left < 0) {
            left = 0;
          } else if (left > doc.clientWidth - refW) {
            left = doc.clientWidth - refW;
          }
          if (top < 0) {
            top = 0;
          } else if (top > doc.clientHeight - refH) {
            top = doc.clientHeight - refH;
          }
        }
        ref.style.top = top + "px";
        ref.style.left = left + "px";
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
      //addEventListener解决多个resize冲突
      window.addEventListener('resize', () => this.reset(), false)
    },
    reset() {
      if (this.autoCenter) {
        this.autoCenterEvent(this.selector);
      } else {
        this.selector.style.top = this.leftInit + "px";
        this.selector.style.left = this.topInit + "px";
      }
      // this.selector.style.top = this.leftInit + "px";
      // this.selector.style.left = this.topInit + "px";
      // this.autoCenterEvent(this.selector);
    },
    closeClick() {
      this.$emit('drag-close');
    },
    autoCenterEvent(el) {
      // console.log(el)
      //获取可见窗口大小
      var bodyW = document.documentElement.clientWidth;
      var bodyH = document.documentElement.clientHeight;
      //获取对话框宽、高
      var elW = el.offsetWidth;
      var elH = el.offsetHeight;
      el.style.left = (bodyW - elW) / 2 + 'px';
      el.style.top = (bodyH - elH) / 2 + 'px';
    }
  },
  mounted() {
    this.selector = this.$refs.dragCard;
    this.free ? document.querySelector('body').style.overflow = 'hidden' : "";
    this.reset();
    this.reset();
    window.addEventListener('resize', () => this.reset(), false)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.reset(), false)
  }
}
</script>

<style lang="scss" scoped>
.drag-card {
  position: absolute;
  z-index: 10;

  .drag-header {
    background-color: #2770d4;
    height: 40px;
    line-height: 40px;

    .header-title {
      position: absolute;
      color: #fff;
      height: 40px;
      line-height: 40px;
      z-index: 2;
      margin-left: 12px;
      font-size: 14px;
    }

    .close-btn {
      position: absolute;
      right: 0;
      margin: 0 10px 0 0;
      color: #fff;
      z-index: 9;

      .close-icon {
        font-size: 16px;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;

        //&:hover {
        //  animation: rotate_360 1s;
        //}

        @keyframes rotate_360 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      }
    }
  }

  .drag-content {
    min-height: 160px;
    overflow: hidden;
    background: #eee;
  }
}
</style>