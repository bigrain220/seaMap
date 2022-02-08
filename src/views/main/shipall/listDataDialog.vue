<template>
  <div class="list-data-dialog">
    <div v-for="(item,index) in listArr" :key="index" :class="['list-item',item.id===activeI?'active-list':'']">
      <div class="header">{{item.berthName}} <span>({{statusDic[item.mode] && statusDic[item.mode].name}})</span></div>
      <el-row class="row">
        <el-col :span="3" class="content label">左</el-col>
        <el-col :span="9" class="content text"><b :class="flagObj[item.fDisL]">{{(item.disL==null || item.timeout)?'NA':item.disL}} m</b>（<span :class="flagObj[item.fSpdL]">{{(item.spdL==null|| item.timeout)?'NA':item.spdL}} cm/s</span>）</el-col>
        <el-col :span="3" class="content label">右</el-col>
        <el-col :span="9" class="content text"><b :class="flagObj[item.fDisR]">{{(item.disR==null || item.timeout)?'NA':item.disR}} m</b>（<span :class="flagObj[item.fSpdR]">{{(item.spdR==null|| item.timeout)?'NA':item.spdR}} cm/s</span>）</el-col>
      </el-row>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  props: {
    activeI: {
      type: Number,
      // default: 0
    },
  },
  data() {
    return {
      flagObj: {
        0: "NORMAL",
        1: "ALERT",
        2: "WARN"
      },
    }
  },
  methods: {

  },
  mounted() {

  },
  computed: {
    ...mapState({
      berths: state => state.berth.berths,
      terminals: state => state.docking.terminal,
      status: state => state.berth.status,
      statusDic: state => state.statusDic,
      now:state=> state.timeout.now,
    }),
    listArr: function () {
      // console.log(this.terminals,123)
      let berths = this.berths;
      let arr = Object.keys(berths).reduce((result, target) => {
        const ele = this.terminals[target];
        const statusObj = this.status[target] || {};
        if (ele) {
          result.push(Object.assign({}, ele, berths[target], statusObj))
        } else {
          result.push(Object.assign({}, berths[target], statusObj))
        }
        return result;
      }, [])
      // console.log(arr,666)
      return arr;
    }
  }
}
</script>

<style lang="scss" scoped>
// 1rem=16px
$back-color: #2c3037;
$WARN: #f56c6c;
$NORMAL: #67c23a;
$ALERT: #e6a23c;
.list-data-dialog {
  width: 100%;
  .f-right {
    float: right;
  }
  .list-item {
    width: 100%;
    margin-top: 6px;
    background-color: #fff;
    .header {
      background-color: $back-color;
      text-align: left;
      padding: 0 4px;
      color: #fff;
      height: 1.4rem;
      line-height: 1.4rem;
      font-size: 0.85rem;
      border: 1px solid $back-color;
    }
    .row {
      // height: 22px;
      // line-height: 21px;
      // font-size: 12px;
      height: 1.37rem;
      line-height: 1.31rem;
      font-size: 0.75rem;
      border-left: 1px solid $back-color;
      .content {
        border-right: 1px solid $back-color;
        border-bottom: 1px solid $back-color;
        &.label {
          color: #666;
          height: 100%;
          text-align: center;
        }
        &.text {
          color: $back-color;
          overflow: hidden;
          text-align: right;
          height: 100%;
          padding-right: 10px;
          .WARN {
            color: $WARN;
            font-weight: bold;
          }
          // .NORMAL {
          //   color: $NORMAL;
          // }
          .ALERT {
            color: $ALERT;
            font-weight: bold;
          }
          .unit {
            width: 2.5rem;
            float: right;
            text-align: left;
            font-weight: normal;
          }
        }
      }
    }
  }
  .active-list {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    background-color: #fdf5e6;
    .header {
      background-color: rgb(232, 123, 42);
    }
  }
}
</style>