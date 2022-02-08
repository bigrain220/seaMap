<template>
    <div class="warnInfoContainer">
        <el-table
                :data="warnList"
                :row-style="rowStyle"
                size="mini">
            <el-table-column
                    v-for="option in tableColOptions"
                    :prop="option.prop"
                    :label="option.label"
                    :key="option.prop"
            />
        </el-table>
        <el-pagination
                :total="totalItemNum"
                :page-size="10"
                @current-change="paginationCurrentPageChanged"
                layout="prev,pager,next,jumper"
        />
    </div>
</template>

<script>
  import {getWarn} from "@/network/request-api";
  import {each, dateFormat} from "@/util/common";
  import {UNREAD_MESSAGE_NUM_CHANGE} from "@/store/mutations/mutations_type";
  import {deleteObj} from "@/util/content";

  export default {
    name: "warnList",
    data() {
      return {
        pageCondition: {
          condition: [],
          page: 0,
          size: 10,
        },
        warnList: [],
        tableColOptions: [
          {prop: 'module', label: 'MODULE'},
          {prop: 'service', label: 'SERVICE'},
          {prop: 'serviceType', label: 'TYPE'},
          {prop: 'flag', label: 'Level'},
          {prop: 'send', label: 'SEND'},
          {prop: 'traceTime', label: 'Time'},
        ],
        //总的信息条数
        totalItemNum: 0,
      }
    },
    mounted() {
      this.getWarnList();
      this.clearUnreadMessageNum();
    },
    beforeDestroy() {
      deleteObj(this.$data);
    },
    methods: {
      getWarnList() {
        let _this = this;
        getWarn(this.pageCondition).then((data) => {
          //data.content 为数组  数组内对象格式如下
          // module: "TESTddd",service: "wind",serviceType: "wind",traceTime: 1584600971081
          //send: "{"speed":81.4,"direct":140.6,"flag":"ALERT"}"
          //sendClazz: null
          //flag: "ALERT

          _this.warnList = [];
          _this.totalItemNum = data.totalElements;
          each(data.content, (index, item) => {
            let obj = {};
            let {module, service, serviceType, traceTime, send, flag} = item;
            obj.module = module;
            obj.service = service;
            obj.serviceType = serviceType;
            obj.traceTime = dateFormat(new Date(traceTime), "yyyy-MM-dd HH:mm:ss");
            obj.send = send;
            obj.flag = flag;
            _this.warnList.push(obj);
          });
        });
      },
      /**
       * 表格中每行的样式
       * @param rowObj  格式{row,rowIndex}
       * @return {{backgroundColor: string, color: string}}
       */
      rowStyle(rowObj) {
        let flag = rowObj.row.flag;
        let styleObj = {backgroundColor: '#fff', color: '#000'};
        switch (flag) {
          case 'ALERT':
            styleObj.backgroundColor = '#ff0';
            styleObj.color = '#000';
            break;
          case 'WARN':
            styleObj.backgroundColor = '#f00';
            styleObj.color = '#fff';
            break;
          default:
        }
        return styleObj
      },
      /**
       * 分页组件 当前页改变事件
       * @param pageNum 改变后的页码
       */
      paginationCurrentPageChanged(pageNum) {
        //TODO 这里直接采用分页 ，当数据量很大时延迟可能会很高
        this.pageCondition.page = pageNum - 1;
        this.getWarnList();
      },
      /**
       * 清空未读消息提示
       */
      clearUnreadMessageNum() {
        this.$store.commit(UNREAD_MESSAGE_NUM_CHANGE, 0);
      }
    }
  }
</script>

<style scoped>
    .warnInfoContainer {
        display: flex;
        flex-direction: column
    }

    .el-pagination {
        margin-left: auto;
    }
</style>