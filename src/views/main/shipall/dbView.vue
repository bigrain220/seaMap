<template>
  <div class="drag-card" ref="dragCard" :style="{'width':'800px'}">
    <div class="drag-header">
      <!-- <div class="header-title"><span></span></div> -->
      <div class="close-btn">
        <span class="el-icon-full-screen screen-icon icon" @click="screenClick"></span>
        <span class="el-icon-close close-icon icon" @click="closeClick"></span>
      </div>
      <div class="drag-dom" style="height:40px;cursor:move;position:absolute;top:0;right:0;width:100%;z-index:1;" @mousedown="dragEvent"></div>
    </div>
    <div class="drag-content">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="Approach/Departure" name="first">
        </el-tab-pane>
<!--        <el-tab-pane label="MLMS" class="mlms-tab" name="second">-->
<!--        </el-tab-pane>-->
<!--        <el-tab-pane label="ENV" name="third">-->
<!--        </el-tab-pane>-->
      </el-tabs>
      <keep-alive>
        <home v-if="activeName==='first'" ref="home"></home>
        <single-docking v-else-if="activeName==='second'" id="singleDocking2" ref="singleDocking2"></single-docking>
        <environment-echart v-else-if="activeName==='third'"></environment-echart>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    home: () => import("@/views/main/shipall/home"),
    singleDocking: () => import("@/views/main/shipall/singleDocking"),
    environmentEchart: () => import("@/views/main/shipall/environmentEchart"),
  },
  data() {
    return {
      selector: {},
      fullScreen: false,
      activeName: 'first'
    }
  },
  methods: {
    dragEvent(e) {
      // console.log(e)
      e = e || window.event;
      let ref = this.selector;
      const refW = ref.offsetWidth;
      const refH = ref.offsetHeight;
      let disX = e.clientX - ref.offsetLeft;
      let disY = e.clientY - ref.offsetTop;
      //   //阻止文字拖动
      //   ref.ondragstart = function () {
      //     return false;
      //   };
      //   //阻止文字选中
      //   ref.onselectstart = function () {
      //     return false;
      //   };
      document.onmousemove = (e) => {
        e = e || window.event;
        e.preventDefault();
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        //临界值判断
        let doc = document.documentElement;
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
      this.autoCenterEvent(this.selector);
      // this.selector.style.top = this.leftInit + "px";
      // this.selector.style.left = this.topInit + "px";
      // this.autoCenterEvent(this.selector);
    },
    closeClick() {
      this.$emit('beforeClose')
    },
    screenClick() {
      this.fullScreen = !this.fullScreen;
      this.$refs.dragCard.style.width = this.fullScreen ? "100vw" : "800px";
      this.$refs.dragCard.style.height = this.fullScreen ? "100vh" : "600px";
      if (this.fullScreen) {
        this.$refs.dragCard.style.left = 0;
        this.$refs.dragCard.style.top = 0;
        // 放大比列
        this.$refs.home.vesselScale=1000;
      } else {
        this.autoCenterEvent(this.$refs.dragCard)
        // 缩小比列
        this.$refs.home.vesselScale=500;
      }
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
    this.reset();
    window.addEventListener('resize', () => this.reset(), false);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.reset(), false)
  },
}
</script>

<style lang="scss" scoped>
.drag-card {
  position: absolute;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
  background-color: #1a1d1e;
  // background-color: #333;
  z-index: 9;
  height: 600px;
  .drag-header {
    .close-btn {
      position: absolute;
      right: 0;
      margin: 8px 10px 0 0;
      color: #909399;
      z-index: 9;
      .icon {
        font-size: 16px;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
        &:hover {
          // animation: rotate_360 1s;
          color: #409eff;
        }
        // @keyframes rotate_360 {
        //   from {
        //     transform: rotate(0deg);
        //   }
        //   to {
        //     transform: rotate(360deg);
        //   }
        // }
        &.screen-icon {
          font-size: 14px;
          margin-right: 10px;
        }
      }
    }
    .screen-btn {
      position: absolute;
      right: 0;
      margin: 6px 20px 0 0;
      color: #909399;
      z-index: 9;
      .screen-icon {
        font-size: 16px;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      }
    }
  }
  .drag-content {
    height: 100%;
  }
  // ::v-deep.el-tab-pane,
  // ::v-deep.el-tabs {
  //   height: 100% !important;
  // }
  ::v-deep.el-tabs__content {
    height: calc(100% - 39px) !important;
    box-sizing: border-box;
    padding: 0;
  }
  .mlms-tab {
    background-color: #1a1d1e;
  }
  //alive
  ::v-deep.el-tab-pane,
  ::v-deep.el-tabs {
    height: 38px !important;
  }
  .home {
    height: calc(100% - 40px) !important;
    box-sizing: border-box;
    padding: 0;
  }
  .single-docking {
    height: calc(100% - 40px) !important;
    box-sizing: border-box;
    padding: 0;
  }
}
</style>
<style lang="scss">
// //黑色系
// .drag-card {
//   .el-tabs--border-card {
//     border-color: #333;
//   }
//   .drag-content {
//     .el-tabs__content {
//       background-color: #333;
//     }
//   }
// }
</style>