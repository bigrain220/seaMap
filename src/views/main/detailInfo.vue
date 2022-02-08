<template>
    <div>
        <el-date-picker
                v-model="startTime"
                type="datetime"
                placeholder="请选择起始时间"
        />
        <el-date-picker
                v-model="endTime"
                type="datetime"
                placeholder="请选择结束时间"
        />
        <el-select v-model="type">
            <el-option
                    v-for="(option,index) in selectOptions"
                    :label="option.label"
                    :value="option.value"
                    :key="index"
            >
            </el-option>
        </el-select>
        <el-button @click="search" type="primary">查询</el-button>

        <el-table
                v-if="isDisplay"
                :data="result"
        >
            <el-table-column
                    v-for="(option,index) in colOptions"
                    :prop="option.prop"
                    :label="option.label"
                    :key="index"
            />
        </el-table>
    </div>
</template>

<script>
  import {getEnvHistory} from "@/network/request-api";
  import {deleteObj} from "@/util/content";
  /*搜索详情信息*/
  export default {
    name: "detailInfo",
    data() {
      return {
        startTime: '',
        endTime: '',
        type: '',
        selectOptions: [
          {label: '风力风向', value: 'wind'},
          {label: '波浪', value: 'wave'},
          {label: '温度', value: 'temperature'},
          {label: '湿度', value: 'humidity'},
          {label: '气压', value: 'pressure'},
          {label: '层流', value: 'current'},
          {label: '潮汐', value: 'tide'},
          {label: '能见度', value: 'visibility'},
          {label: '降雨量', value: 'rain'},
        ],
        result: '',//查询返回的结果
        colOptions: '',//表格中的列名 暂时采用属性名
      }
    },
    computed: {
      /**
       * 是否显示表格  当数据为空时不显示
       */
      isDisplay() {
        return !!this.result;
      }
    },
    beforeDestroy() {
      deleteObj(this.$data);
    },
    methods: {
      search() {
        const {startTime, endTime, type} = this;
        if (!startTime || !endTime) {
          this.$message.error("必须确定起始和结束时间！");
          return;
        }
        if (!type) {
          this.$message.error("必须确定类型！");
          return;
        }
        const _this = this;
        const startTraceTime = startTime.getTime();
        const endTraceTime = endTime.getTime();
        getEnvHistory(startTraceTime, endTraceTime, type).then(data => {
          //data格式为 {tide:[]}
          _this.result = data;
          for (let key in data) {
            _this.result = data[key];
            break;
          }
          const result = _this.result[0];
          const cols = [];
          for (let key in result) {
            cols.push({label: key, prop: key});
          }
          _this.colOptions = cols;
        })
      }
    }
  }
</script>

<style scoped>

</style>