<template>
  <div class="env-overview">
    <div class="dates">
      <div class="date" v-text="date"/>
    </div>
    <table>
      <thead>
      <tr class="row row-head">
        <td class="col-0">时间</td>
        <td v-for="(hour,cIndex) in hours" class="cell" :class="'col-'+(cIndex+1)" v-text="hour" :key="cIndex"/>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in rows" class="row" :key="row">
        <td class="col-0" v-text="displayText(row)"/>
        <td v-for="(hour,cIndex) in hours" class="cell" :class="'col-'+(cIndex+1)" :key="cIndex"
            v-text="overviewData[row][cIndex] || ''"/>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {deleteObj} from "@/util/content";

/**
 * 总览的表格
 */
export default {
  name: "Overview",
  data() {
    return {
      hours: Array.from({length: 24}, (undef, i) => i.toString().padStart(2, "0")),
      rows: ['windSpeed',
        'windDirection',
        'temperature',
        'pressure',
        'humidity',
        'visibility',
        'tide',
        'wave',
        'current'],
      overviewData: {},
      date: '',
    }
  },
  beforeMount() {
    this.init();
    this.date = this.formatDate()
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    init() {
      const {rows, hours} = this;
      const data = {};
      for (let i = 0; i < rows.length; ++i) {
        const row = rows[i];
        const obj = [];
        for (let j = 0; j < hours.length; ++j) {
          obj.push(null);
        }
        data[row] = obj;
      }
      this.overviewData = data;
    },
    displayText(str) {
      switch (str) {
        case 'windSpeed':
          return '风速';
        case 'windDirection':
          return '风向';
        case 'temperature':
          return '大气温度';
        case 'pressure':
          return '大气压';
        case 'humidity':
          return '大气湿度';
        case 'visibility':
          return '能见度';
        case 'tide':
          return '潮汐值';
        case 'wave':
          return '波浪值';
        case 'current':
          return '水流值';
        default:
          return str;
      }
    },
    /**
     * 给图表上添加值
     * @param time 时间 如0，1，2，3...23
     * @param valueObj {windSpeed,humidity...}
     */
    setData({time, valueObj}) {
      time = time - 0;
      for (let key in valueObj) {
        this.$set(this.overviewData[key], time, valueObj[key]);
      }
    },
    /**
     * 将某一时间点的数据置为null
     * @param time
     */
    removeData(time) {
      time = time - 0;
      for (let key in this.overviewData) {
        this.$set(this.overviewData[key], time, null);
      }
    },
    /**
     * 清空图表内的数据
     */
    clearData() {
      this.init();
    },
    formatDate(tracetime) {

      let date = null;
      if (tracetime) {
        date = new Date(tracetime);
      } else {
        date = new Date();
      }
      const month = date.getMonth();
      const day = date.getDate();
      const dayOfWeekNum = date.getDay();
      let dayOfWeek = "";
      switch (dayOfWeekNum) {
        case 0:
          dayOfWeek = "周日";
          break;
        case 1:
          dayOfWeek = "周一";
          break;
        case 2:
          dayOfWeek = "周二";
          break;
        case 3:
          dayOfWeek = "周三";
          break;
        case 4:
          dayOfWeek = "周四";
          break;
        case 5:
          dayOfWeek = "周五";
          break;
        case 6:
          dayOfWeek = "周六";
          break;
        default:
          dayOfWeek = dayOfWeekNum;
      }
      const result = `${month + 1}-${day}${dayOfWeek}`;
      this.date = result;
      return result;
    }
  }
}
</script>

<style scoped>
.env-overview {
  width: 100%;
  height: 100%;
}

.dates {
  display: flex;
  color: #fff;
  height: 10%;
  justify-content: flex-start;
  align-items: center;
}

.date {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;
  background-color: #dcdcdc;
  color: #000;
  width: 10rem;
}

table {
  height: 90%;
  color: #c4cfd1;
  border-collapse: collapse;
  width: 100%;
  font-size: 12px;
  font-weight: bold;
}

tr {
  /*每行的上边框*/
  border-top: 1px solid #36393f;
}

.col-0 {
  /*第一列添加 右边框*/
  border-right: 1px solid #36393f;
}

thead {
  background-color: #212428;
}

thead > tr {
  padding: 1vh 0;
}

.cell {
  /*确保换行符号生效*/
  white-space: pre;
  text-align: center;
  width: calc(100% / 26);
}

.col-0 {
  text-align: center;
  width: calc(100% / 26 * 2);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>