<template>
  <div>
    <div class="drift-line">
      <div class="box">
        <!-- <div :class="[slideActiveClass,value>0?'nav-bar1':value<0?'nav-bar2':'']" :style="`transform:scaleY(${percentVal}%)`"></div> -->
        <!-- <div :class="[slideActiveClass,'nav-bar1']" :style="`transform:scaleY(${percentVal}%)`" v-show="value>0"></div>
        <div :class="[slideActiveClass,'nav-bar2']" :style="`transform:scaleY(${percentVal}%)`" v-show="value<0"></div> -->
        <div class="mark" :style="{top:0-5+'%'}">{{rangArr[0].top}}</div>
        <div class="mark" :style="{top:item.height-5+'%'}" v-for="(item,index) in rangArr" :key="index">{{item.botttom}}</div>
        <!-- <div class="mark" :style="{top:slideItemOptions.max/(slideItemOptions.max-slideItemOptions.min)*100+'%'}">0.00</div> -->
        <div :class="['block','block-'+(index+1),item.active?'active':'']" :style="{height:item.percent+'%'}" v-for="(item,index) in rangArr" :key="item.percent"></div>
      </div>
      <!-- <div class="nav-text" :style="{color:slideActiveClass==='swiperActiveAlert'?'#ffa700':slideActiveClass==='swiperActiveWaring'?'#f53527':'#53dd5f'}">{{value}}</div> -->
      <div class="nav-text" :style="{color:slideActiveClass==='swiperActiveAlert'?'#e6a23c':slideActiveClass==='swiperActiveWaring'?'#f56c6c':'#67c23a'}">{{value}}m</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "nearDriftLine",
  props: {
    // //div的id
    // id: {
    //   type: String,
    //   required: true
    // },
    value: {
      type: Number | String,
      default: 0
    },
    //{min,max,precision} 包含最小值，最大值以及精度
    slideItemOptions: {
      type: Object,
      required: true,
      default: { min: -2, max: 2.5, precision: 0.02 }
    },
    //预警范围
    alertValueScope: {
      type: Array,
      default: () => {
        return [[-1.2, -0.5], [1, 1.5]];
      }
    },
    //报警范围
    waringValueScope: {
      type: Array,
      default: () => {
        return [[-2, -1.2], [1.5, 2.5]];
      }
    }
  },
  data() {
    return {
      slideActiveClass: "",
      percentVal: null,
      rangArr: [
        {
          top: 2.5, botttom: 1.5, percent: 22.22, height: 22.22,active:false
        },
        {
          top: 1.5, botttom: 1, percent: 11.11, height: 33.33,active:false
        },
        {
          top: 1, botttom: -0.5, percent: 33.33, height: 66.66,active:false
        },
        {
          top: 0.5, botttom: -1.2, percent: 15.55, height: 82.21,active:false
        },
        {
          top: -1.2, botttom: -2, percent: 17.79, height: 100,active:false
        }
      ],
    }
  },
  computed: {

  },
  watch: {
    value: function (nValue) {
      this.setData(nValue - 0);
    },
  },
  methods: {
    /**
 * value是否在数组范围内
 * @param value
 * @param arrayScope [[范围1的最小值,范围1的最大值],[范围2的最小值,范围2的最大值]...]
 */
    isValueInScope(value, arrayScope) {
      for (let scope of arrayScope) {
        if (value >= scope[0] && value <= scope[1]) {
          return true;
        }
      }
      return false;
    },
    setData(value) {
      //超过最大最小值 则赋为最值
      let { min, max, precision } = this.slideItemOptions;
      if (value > max) {
        value = max;
      } else if (value < min) {
        value = min;
      }
      //所占百分比 2.5时为0%
      this.percentVal=(2.5-value)/4.5;
      let activeIndex=null;
      this.rangArr.map((item,index)=>{
          if(this.percentVal===0){
              activeIndex=0;
          }else if(item.height>=this.percentVal*100 && activeIndex===null){
              activeIndex=index;
          }
          this.$set(this.rangArr[index],'active',false);
      })
      this.$set(this.rangArr[activeIndex],'active',true);
      //根据value值确定是应该显示为正常还是预警或是报警
      let alertValueScope = this.alertValueScope;
      let waringValueScope = this.waringValueScope;
      if (this.isValueInScope(value, alertValueScope)) {
        this.slideActiveClass = "swiperActiveAlert";
      } else if (this.isValueInScope(value, waringValueScope)) {
        this.slideActiveClass = "swiperActiveWaring";
      } else {
        this.slideActiveClass = "swiperActiveNormal";
      }
    },
    /**
 * 清除显示  恢复到初始状态 即显示2.5
 */
    clear() {
      this.setData(2.5)
    },
  },
  mounted() {
    // this.setData(2 - 0);
  }
}
</script>

<style lang="scss">
// $warn: #f53527;
// $normal: #53dd5f;
// $alert: #ffa700;
$warn: #f56c6c;
$normal: #67c23a;
$alert: #e6a23c;
.drift-line {
  width: 100%;
  height: 100%;
  position: relative;
  .box {
    * {
      box-sizing: border-box;
    }
    width: 100%;
    height: 100%;
    background-color: #666;
    // background-image: linear-gradient(red 10%, green 85%, blue 90%);
    transform: scaleX(0.42);
    position: relative;
    // .nav-bar1 {
    //   position: absolute;
    //   transform-origin: left bottom;
    //   top: 0;
    //   bottom: 44.45%;
    //   left: 0;
    //   right: 0;
    //   //   background: #00a1d6;
    //   will-change: transform;
    //   transition: all 1s;
    //   // transform:scaleY(20%)
    // }
    // .nav-bar2 {
    //   position: absolute;
    //   transform-origin: left top;
    //   top: 55.55%;
    //   bottom: 0;
    //   left: 0;
    //   right: 0;
    //   //   background: #00a1d6;
    //   will-change: transform;
    //   transition: all 1s;
    //   // transform:scaleY(20%)
    // }
    .mark {
      position: absolute;
      width: 100%;
      z-index: 2;
      letter-spacing: 0.2rem;
      left: 0;
      // left:120%;
      color: #fff;
      //border-top: 0.1rem dashed #fff;
      font-size: 0.75rem;
      opacity: 0.7;
    }
    .block {
      position: relative;
      transition: .2s;
      opacity: 0.5;
      &.active{
          z-index: 1;
          // transform: scale(1.2);
          opacity: 1;
          border:1px solid #fff;
      }
    }
    .block-1 {
      background-color: $warn;
    }
    .block-2 {
      background-color: $alert;
    }
    .block-3 {
      background-color: $normal;
    }
    .block-4 {
      background-color: $alert;
    }
    .block-5 {
      background-color: $warn;
    }
  }
  .nav-text {
    position: absolute;
    bottom: -3.4rem;
    color: #fff;
    text-align: center;
    width: 100%;
    z-index: 2;
    font-weight: bold;
    font-size: 1.3rem;
  }
  .swiperActiveNormal {
    background-color: $normal;
    font-size: 1rem;
    transform: scale(1);
    opacity: 1;
  }

  .swiperActiveWaring {
    background-color: $warn;
    font-size: 1rem;
    transform: scale(1);
    opacity: 1;
  }

  .swiperActiveAlert {
    background-color: $alert;
    font-size: 1rem;
    transform: scale(1);
    opacity: 1;
  }
}
</style>