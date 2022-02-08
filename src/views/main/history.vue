<template>
  <div class="history">
    <div class="el-datacontainer">
      <el-date-picker v-model="date"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"/>
      <el-button type="primary" @click="clickSearch" :loading="searchButton.loading" icon="el-icon-search">
        {{ searchButton.message }}
      </el-button>
      <el-cascader v-model="tableType"
                   :options="reportSelect"
                   :props="{expandTrigger:'hover'}"
                   :disabled="!reportSelect.length"
                   clearable/>
      <el-button type="primary" @click="clickGenerateReport"
                 :disabled="!tableType[0] || !reportSelect.length">
        生成报表
      </el-button>
    </div>
    <history-overview class="chart" ref="historyExclude" :chart-data="historyExcludeData"/>
    <!--用于和打印界面传递对象-->
    <div id="printData" style="display: none"></div>
  </div>
</template>

<script>
import HistoryOverview from "@/components/content/echarts/historyOverview";
import {dateFormat, isEmptyObject} from "@/util/common";

import {getEnvHistory} from "@/network/request-api";
import {deleteObj} from "@/util/content";


export default {
  name: "history",
  components: {
    HistoryOverview,
  },
  data() {
    return {
      date: [],
      historyExcludeData: {},//除了波浪和层流外的数据
      searchButton: {loading: false, message: '搜索'},
      tableType: [],//要打印的类型 如：["tide"]  存在级联关系的如：["current","current3"]
      historyData: {},//最后一次搜索得到的结果
      config: {
        3: {
          name: this.$t('chart.historyExclude.yAxisWindSpeedName'),
          unit: "m/s",
          color: '#009241',
        },
        14: {
          name: this.$t('chart.historyExclude.yAxisTideName'),
          unit: "m",
          color: '#18895d',
        },
      }
    }
  },
  mounted() {
    let date = Date.now();
    this.date = [date, date];
  },
  computed: {
    reportSelect() {
      let info = this.historyData.info;
      if (!info) {
        return [];
      }
      let reduce = Object.entries(info)
          .reduce((obj, [id, {name, type}]) => {
            (obj[type] ??= []).push([id, name]);
            return obj;
          }, {});
      return Object.entries(reduce).map(([type, item]) => {
        return {
          label: this.config[type].name,
          value: type,
          children: item.map(([value, label]) => {
            return {label, value}
          })
        }
      });
    }
  },
  methods: {
    //搜索按钮点击事件
    clickSearch() {
      let [start, end] = this.date;
      if (start <= end) {
        this.changeSearchButtonText(true, '搜索');
        this.searchByDate(
            new Date(start).setHours(0, 0, 0, 0),
            new Date(end).setHours(23, 59, 59, 999)
        );
      } else {
        this.$message.error('选择的时间范围有误');
      }
    },
    /**
     * 生成报表按钮点击事件
     */
    clickGenerateReport() {
      let {info, group} = this.historyData;
      if (isEmptyObject(group)) {
        this.$message.error("请先进行搜索");
        return
      }
      let [type, srv] = this.tableType.map(Number);
      let [start, end] = this.date.map(d => dateFormat(new Date(d), "yyyy-MM-dd"));
      let options = {
        option: {
          srv,
          type,
          name: info[srv].name,
          timeScope: start === end ? start : `${start} 至 ${end}`
        },
        data: Object.fromEntries(Object.entries(group).map(([date, items]) => {
          return [date, items.find(i => i.id === srv)?.records];
        })),
      };
      document.getElementById("printData").innerHTML = JSON.stringify(options);
      //这里的路径要和路由中的保持一致
      let routeUrl = this.$router.resolve({path: '/print/printEnvironment'});
      window.open(routeUrl.href, '_blank', `height=${screen.height * 90 / 100},width=990,menubar=no,toolbar=no,personalbar=no,location=no,resizable=no,scrollbars=yes,status=no,chrome=yes,centerscreen=yes,attention=yes,dialog=yes`);
    },

    changeSearchButtonText(isLoading, text) {
      this.searchButton = {
        loading: isLoading,
        message: text
      };
    },
    /**
     * 把获得的历史数据按天进行分组
     * {日期:{wind:[{traceTime:xx,windSpeed:xx...}]}}
     * @param data {wind:[{traceTime:xx,windSpeed:xx...}]}
     */
    groupHistoryData(data) {
      let info = {}, group = {};

      data.forEach(({id, records, ...objects}) => {
        info[id] = {...objects};
        let set = {};
        records.forEach(item => {
          let date = dateFormat(new Date(item.traceTime), 'yyyy-MM-dd');
          set[date]?.push(item) || (group[date] ??= []).push({id, records: (set[date] = [item])})
        })
      })

      //若存在某天只有某一项或几项有历史数据时 可能会出现时间选择轴的时间顺序错乱的情况
      // 对结果按时间进行排序 确保时间选择轴的时间是从小到大的
      return {
        info,
        group: Object.fromEntries(Object.entries(group).sort(([d0], [d1]) => d0.localeCompare(d1)))
      };
    },
    searchByDate(beginDate, endDate) {
      let _this = this;
      //请求数据
      _this.historyExcludeData = {};
      getEnvHistory(beginDate, endDate).then((data) => {
        if (data.length) {
          let {info, group} = _this.groupHistoryData(data);
          //保存搜索结果
          _this.historyData = {info, group};

          let series = Object.fromEntries(Object.entries(group).map(([date, detail]) =>
              [date, detail.map(({id, records}) => {
                return {id, data: this.recordsArray(info[id].type, records)}
              })]
          ));
          _this.historyExcludeData = {info, series};
        }
      }).catch((err) => {
        this.$message.error(err.msg)
      }).finally(() => {
        //最后让加载动画消失
        _this.changeSearchButtonText(false, '搜索');
      });
    },
    recordsArray(type, records) {
      switch (type) {
        case 3:
          return records.map(({traceTime, cur: {speed, direct}}) => [traceTime, speed, direct])
        case "current" :
          return records.map(({traceTime, waterTemperature}) => [traceTime, waterTemperature])
        case 14:
          return records.map(({traceTime, height}) => [traceTime, height])
        case 'visibility':
          return records.map(({traceTime, viewAble}) => [traceTime, viewAble])
        case 'pressure':
          return records.map(({traceTime, pressure}) => [traceTime, pressure])
        case 'temperature':
          return records.map(({traceTime, temperature}) => [traceTime, temperature])
        case 'humidity':
          return records.map(({traceTime, humidity}) => [traceTime, humidity])
        default:
          console.warn(`unknown records type "${type}", records:`, records)
          return [];
      }
    }
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
}
</script>

<style scoped>
.el-datacontainer {
  padding: 25px;
  display: flex;
  gap: 10px;
}

.el-date-editor {
  width: 20%;
}

.el-select {
  width: 150px;
}

.history {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
