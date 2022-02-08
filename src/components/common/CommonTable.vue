<template>
  <div class="common-table">
    <el-table
        :data="data"
        :size="size"
        :row-style="tableStyle"
        :cell-style="tableStyle"
        :header-cell-style="tableStyle"
        height="550">
      <el-table-column
          v-for="(col,index) in columns"
          :label="col.label"
          :prop="col.prop"
          :width="col.width"
          :formatter="col.formatter"
          :key="index"/>

      <!--   需要定长   -->
      <el-table-column
          v-if="operation"
          label="操作"
          min-width="210px"
          width="210px"
      >
        <template slot="header">
          <slot name="header"/>
        </template>
        <template slot-scope="scope">
          <slot name="line" :row="scope.row"/>
        </template>
      </el-table-column>
    </el-table>
    <!--  pager-count 页码最多展示 5  -->
    <el-pagination
        class="pagination"
        :page-size="pageSize"
        layout="prev, pager, next"
        :pager-count="5"
        :total="total"
        :hide-on-single-page="false"
        @current-change="currentPageChange"
        @prev-click="currentPageChange"
        @next-click="currentPageChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "CommonTable",
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    },
    size: {
      type: String,
      default: 'small'
    },
    operation: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      required: true
    },

  },
  methods: {
    currentPageChange(currentPage) {
      this.$emit("changePageNum", currentPage - 1);
    },
    tableStyle() {
      return {
        background: '#2c3036',
        border: '1px solid #4f5560',
      };
    },
  },
  created() {
  },
  data() {
    return {
      currentPage: 1
    }
  }
}
</script>

<style scoped>
.common-table {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #4f5560;
}

.pagination {
  float: right;
  margin-right: -5px;
  margin-top: 5px;
}

.el-pagination >>> * {
  background: #2c3036 !important;
}

.el-pagination >>> .number.active {
  color: #ffffff;
}

.el-pagination >>> .number {
  color: #6c6f72;
}

.el-pagination >>> .el-icon {
  color: #6c6f72;
}

.el-pagination >>> .el-icon:disabled {
  color: #6c6f72;
}

.el-table >>> .el-table__body-wrapper {
  background-color: #2c3036;
  color: #909399;
}

.el-table >>> .el-table--border::after,
.el-table >>> .el-table--group::after,
.el-table::before {
  content: '';
  position: absolute;
  background-color: #4f5560;
  z-index: 1;
}

.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: #4f5560;
}

</style>