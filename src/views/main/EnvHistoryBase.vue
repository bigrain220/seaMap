<template>
  <div style="height: 100%;">
    <div style="height: 60px;">
      <el-date-picker style="margin-right: 10px;"
                      v-model="date"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
      </el-date-picker>

      <el-button type="primary" style="margin-right: 10px;" @click="clickSearch" :loading="searchButton.loading">
        {{ searchButton.message }}
      </el-button>
      <el-cascader style="margin-right: 10px;"
                   v-model="tableType"
                   :options="tableTypeOptions"
                   :props="{expandTrigger: 'hover'}"
                   clearable/>

      <el-button type="primary" @click="clickGenerateReport">生成报表</el-button>
    </div>

    <base-env-history
        :type="'windSpeed'"
        style="height: calc(100% - 60px);"
        ref="baseEnvHistory"
        :chart-data="historyExcludeData"/>

    <!--用于和打印界面传递对象-->
    <div id="printData" style="display: none;"/>
  </div>
</template>

<script>
import {dateFormat, each, isEmptyObject} from "@/util/common";

import {getEnvHistory} from "@/network/request-api";
import {deleteObj} from "@/util/content";
import BaseEnvHistory from "@/components/content/echarts/BaseEnvHistory";


export default {
  name: "EnvHistoryBase",
  components: {
    BaseEnvHistory,
  },
  props: {
    type: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      date: [],
      historyExcludeData: {},//除了波浪和层流外的数据
      historyCurrent: {},//层流的数据
      historyWave: {},//波浪的数据
      searchButton: {
        loading: false,
        message: '搜索'
      },
      tableType: [],//要打印的类型 如：["tide"]  存在级联关系的如：["current","current3"]
      historyData: null,//最后一次搜索得到的结果
    }
  },
  computed: {
    tableTypeOptions() {
      return [
        {label: '风力风向', value: 'wind'},
      ]
    }
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    //搜索按钮点击事件
    clickSearch() {
      let beginDate = this.getStartDate();
      let endDate = this.getEndDate();
      //若起始时间 结束时间不存在 或起始时间大于结束时间
      if (!beginDate || !endDate || beginDate.getTime() - endDate.getTime() > 0) {
        this.$message.error('选择的时间范围有误');
        return;
      }
      this.changeSearchButtonText(true, '加载中...');
      //根据时间范围搜索历史数据 结束日期为当前选的日期再加一天 即起始日期为00：00:00 结束日期为23:59:59
      beginDate = new Date(dateFormat(beginDate, 'yyyy-MM-dd') + " 00:00:00");
      endDate = new Date(dateFormat(endDate, 'yyyy-MM-dd') + " 23:59:59");
      this.searchByDate(beginDate.getTime(), endDate.getTime());
    },
    getStartDate() {
      if (this.date && this.date.length > 0) {
        return new Date(this.date[0]);
      }
      return null
    },
    getEndDate() {
      if (this.date && this.date.length > 0) {
        return new Date(this.date[1]);
      }
      return null;
    },
    /**
     * 生成报表按钮点击事件
     */
    clickGenerateReport() {
      let historyData = this.historyData;
      if (isEmptyObject(historyData)) {
        this.$message.error("请先进行搜索");
        return
      }

      let feature = `height=${screen.height * 90 / 100},width=990,menubar=no,toolbar=no,personalbar=no,location=no,resizable=no,scrollbars=yes,status=no,chrome=yes,centerscreen=yes,attention=yes,dialog=yes`;
      let type = this.tableType[0];
      //这里可能是数字 数字用isEmptyObject判断会是true
      let second = this.tableType[1];
      let options = {option: {type: type}, historyData: historyData};
      if (!isEmptyObject(second)) {
        options.option.secondOption = second;
      }
      let beginDate = this.getStartDate();
      let endDate = this.getEndDate();
      if (beginDate === endDate) {
        options.option['timeScope'] = dateFormat(beginDate, "yyyy-MM-dd");
        // options.option['timeScope'] = beginDate;
      } else {
        options.option['timeScope'] = dateFormat(beginDate, "yyyy-MM-dd") + ' 至 ' + dateFormat(endDate, "yyyy-MM-dd");
        // options.option['timeScope'] = beginDate + ' 至 ' + endDate;
      }
      document.getElementById("printData").innerHTML = JSON.stringify(options);
      //这里的路径要和路由中的保持一致
      let routeUrl = this.$router.resolve({path: '/print/printEnvironment'});
      window.open(routeUrl.href, '_blank', feature);
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
      let _this = this;
      let groupByDate = {};
      each(data, function (type, array) {
        if (!isEmptyObject(array)) {
          each(array, function (index, item) {
            let traceTime = item['traceTime'];
            let formatDate = _this.dateFormatDay(traceTime);
            let day = groupByDate[formatDate];
            if (isEmptyObject(day)) {
              day = groupByDate[formatDate] = {};
            }
            let dataOfType = day[type];
            if (isEmptyObject(dataOfType)) {
              dataOfType = day[type] = [];
            }
            dataOfType.push(item);
          })
        }
      });

      //若存在某天只有某一项或几项有历史数据时 可能会出现时间选择轴的时间顺序错乱的情况
      // 对结果按时间进行排序 确保时间选择轴的时间是从小到大的
      let dateSort = [];
      each(groupByDate, function (date, item) {
        dateSort.push(date);
      });
      dateSort = dateSort.sort();
      let result = {};
      each(dateSort, function (index, date) {
        result[date] = groupByDate[date];
      });
      return result;
    },
    dateFormatDay(timeStamp) {
      let d = new Date(timeStamp);
      return dateFormat(d, 'yyyy-MM-dd');
    },
    searchByDate(beginDate, endDate) {
      let _this = this;
      //先调用子组件的清空方法 清空图表上的值
      _this.clearChartsData();
      //请求数据
      getEnvHistory(beginDate, endDate).then((data) => {
        let group = _this.groupHistoryData(data);
        //保存搜索结果
        _this.historyData = group;
        //让层流和波浪的方法只执行一次
        let currentFlag = 1;
        let waveFlag = 1;
        let dataOfOptionGroupByDate = {};
        each(group, function (date, detail) {
          let dataOfOption = dataOfOptionGroupByDate[date] = {};
          each(detail, function (index, item) {
            // console.log(index, item);
            dataOfOption[index] = _this.addItem(dataOfOption[index]);
            let dataOfOptionElement = dataOfOption[index];

            switch (index) {
              case 'wind':
                dataOfOption['windSpeed'] = _this.addItem(dataOfOption['windSpeed']);
                dataOfOption['windDirection'] = _this.addItem(dataOfOption['windDirection']);
                each(item, function (ind, ite) {
                  let traceTime = ite['traceTime'];
                  dataOfOption['windSpeed'].push([traceTime, ite['speed']]);
                  dataOfOption['windDirection'].push([traceTime, ite['direct']]);
                });
                break;
              case "current":
                if (currentFlag === 1) {
                  _this.handleCurrentData(group);
                  currentFlag = 0;
                }
                dataOfOption['waterTemperature'] = _this.addItem(dataOfOption['waterTemperature']);
                each(item, function (ind, ite) {
                  let traceTime = ite['traceTime'];
                  dataOfOption['waterTemperature'].push([traceTime, ite['waterTemperature']]);
                });
                break;
              case 'tide':
                each(item, function (ind, ite) {
                  let traceTime = ite['traceTime'];
                  dataOfOptionElement.push([traceTime, ite['height']]);
                });
                break;
              case 'visibility':
                each(item, function (ind, ite) {
                  let traceTime = ite['traceTime'];
                  dataOfOptionElement.push([traceTime, ite['viewAble']]);
                });
                break;
              case 'pressure':
                each(item, function (ind, ite) {
                  let traceTime = ite['traceTime'];
                  dataOfOptionElement.push([traceTime, ite['pressure']]);
                });
                break;
              case 'temperature':
                each(item, function (ind, ite) {
                  let traceTime = ite['traceTime'];
                  dataOfOptionElement.push([traceTime, ite['temperature']]);
                });
                break;
              case 'humidity':
                each(item, function (ind, ite) {
                  let traceTime = ite['traceTime'];
                  dataOfOptionElement.push([traceTime, ite['humidity']]);
                });
                break;
              case 'wave':
                if (waveFlag === 1) {
                  _this.handleWaveData(group);
                  waveFlag = 0;
                }
                break;
              default:
                break;
            }
          });
        });
        _this.historyExcludeData = dataOfOptionGroupByDate;
        //最后让加载动画消失`
        _this.changeSearchButtonText(false, '搜索');
      });
    },
    addItem(item) {
      if (isEmptyObject(item)) {
        return item = [];
      }
      return item;
    },
    /**
     * 处理层流的数据
     * @param item {日期:{current:[{时间:{speed1:值}}]}}
     */
    handleCurrentData(item) {
      let currentAllDataGroupByDate = {};
      each(item, function (date, detail) {
        let currentAllData = currentAllDataGroupByDate[date] = {};
        for (let i = 1; i <= 20; i++) {
          currentAllData['speed' + i] = [];
          currentAllData['direction' + i] = [];
        }
        each(detail['current'], function (index, ite) {
          let traceTime = ite['traceTime'];
          for (let i = 1; i <= 20; i++) {
            let speed = ite['speed' + i];
            let direction = ite['direction' + i];
            currentAllData['speed' + i].push([traceTime, speed]);
            currentAllData['direction' + i].push([traceTime, direction]);
          }
        });
      });
      this.historyCurrent = currentAllDataGroupByDate;
    },
    /**
     * 处理波浪的数据
     * @param item
     */
    handleWaveData(item) {
      let dataAll = {};
      each(item, function (date, detail) {
        let data = {
          signWaveHeight: [],
          signWavePeriod: [],
          longWaveHeight: [],
          longWavePeriod: [],
          shortWaveHeight: [],
          shortWavePeriod: []
        };
        dataAll[date] = data;
        each(detail['wave'], function (index, ite) {
          let traceTime = ite['traceTime'];
          data.shortWaveHeight.push([traceTime, ite['shortWaveHeight']]);
          data.shortWavePeriod.push([traceTime, ite['shortWavePeriod']]);
          data.longWaveHeight.push([traceTime, ite['longWaveHeight']]);
          data.longWavePeriod.push([traceTime, ite['longWavePeriod']]);
          data.signWaveHeight.push([traceTime, ite['signWaveHeight']]);
          data.signWavePeriod.push([traceTime, ite['signWavePeriod']]);
        });
      });
      this.historyWave = dataAll;
    },
    /**
     * 清除图表上的值
     */
    clearChartsData() {
      this.$refs['baseEnvHistory'].clearChartData();
    }
  }
}
</script>

<style scoped>
.el-datacontainer {
  margin: auto;
  padding: 25px;
}

.el-date-editor {
  width: 20%;
}

.el-select {
  width: 150px;
}

.history-exclude-current-and-wave {
  width: 100%;
  height: 100%;
}

.history-current, .history-wave {
  height: 100%;
  width: 100%;
}
</style>
