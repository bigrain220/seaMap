<template>
    <div class="berthInfoContainer">
        <el-table :data="content" :border="true" :fit="true" size="small">
            <el-table-column
                    v-for="option in colOption"
                    :prop="option.prop"
                    :label="option.label"
                    align="center"
                    :key="option.prop"
            />
            <el-table-column
                    label="操作"
                    align="center"
            >
                <template slot-scope="scope">
                    <el-button type="primary" round @click="clickDocking(scope.row)">Docking</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                :total="totalItemNum"
                :page-size="10"
                :hide-on-single-page="true"
                @current-change="paginationCurrentPageChanged"
                layout="prev,pager,next,jumper"
        />
    </div>
</template>

<script>
  import {getBerthList} from "@/network/request-api";
  import {deleteObj} from "@/util/content";

  export default {
    name: "berthInfo",
    data() {
      return {
        content: null, //表格内的内容
        pageCondition: {
          condition: [],
          page: 0,
          size: 10,
        },
        //表格列的配置
        colOption: [
          {prop: 'id', label: '泊位编号'},
          {prop: 'berthName', label: '泊位名'},
          {prop: 'terminalModuleName', label: '模块名'},
          {prop: 'terminalServiceName', label: '服务名'},
          {prop: 'dockCondition', label: '靠泊方向'},
          {prop: 'dockingMode', label: '靠泊状态'},
        ],
        //总的泊位数
        totalItemNum: 0,
      }
    },
    mounted() {
      this.getAllBerth();
    },
    beforeDestroy() {
      deleteObj(this.$data);
    },
    methods: {
      getAllBerth() {
        let _this = this;
        getBerthList(_this.pageCondition).then(response => {
          _this.totalItemNum = response.totalElements;
          _this.content = response.content;
        });
      },
      //docking按钮的点击事件
      clickDocking(row) {
        // console.log(row);
        this.$router.replace("/aside/multiDocking/" + row.id);
      },
      /**
       * 分页组件 当前页改变事件
       * @param pageNum 改变后的页码
       */
      paginationCurrentPageChanged(pageNum) {
        this.pageCondition.page = pageNum - 1;
        this.getAllBerth(this.pageCondition);
      }
    }
  }
</script>

<style scoped>
    .berthInfoContainer {
        display: flex;
        flex-direction: column
    }

    .el-pagination {
        margin-left: auto;
    }
</style>