<template>
  <div v-loading="loading">
    <el-row>
      <el-col :span="18">
        <el-row>
          <el-col :span="12">
            <el-select v-model="filter.berthId" multiple collapse-tags filterable placeholder="请选择泊位">
              <el-option v-for="berth in berths" :key="berth.id" :label="berth.berthName" :value="berth.id"/>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-select v-model="filter.vesselId" multiple collapse-tags filterable placeholder="船舶名称">
              <el-option v-for="vessel in vessels" :key="vessel.id" :label="vessel.name" :value="vessel.id">
                <span style="float: left">{{ vessel.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ vessel.imoNumber }}</span>
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-date-picker v-model="filter.range" type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"/>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-button class="searchButton" @click="loadHistory">搜索</el-button>
      </el-col>
    </el-row>
    <el-table :data="content" empty-text="暂无数据" size="small">
      <el-table-column v-for="col in tableCol" v-bind="col" :key="col.prop"/>
      <el-table-column label="选择记录">
        <template slot-scope="scope">
          <el-button @click="chooseRecord(scope.row)" size="small">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        small
        layout="prev, pager, next"
        @current-change="loadHistory"
        :page-count="totalPages">
    </el-pagination>
  </div>
</template>

<script>
/*靠泊记录选择*/
import {deleteObj} from "@/util/content";
import {mapState} from "vuex";
import {dateFormat} from "@/util/common";
import {getHistory} from "@/api/docking";

export default {
  name: "dockingRecordSelect",
  mounted() {
    this.loadHistory();
  },
  computed: {
    ...mapState({
      berths: state => state.berth.berths,
      vessels: state => state.vessel.vessels,
    }),
  },
  data() {
    return {
      loading: false,
      filter: {
        berthId: [],
        vesselId: [],
        range: [],
      },
      content: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      //表格列名
      tableCol: [
        {prop: 'berthId', label: '泊位名', formatter: (r, c, v) => this.berths[v]?.berthName},
        {
          prop: 'vesselId', label: '船舶名称', formatter: (r, c, v) => {
            let vessel = this.vessels[v];
            if (v && !vessel) {
              this.$store.dispatch('vessel/loadVessel', {id: v});
            }
            return vessel?.name;
          }
        },
        {
          prop: 'timeStart',
          label: '靠泊起始时间',
          formatter: (r, c, v) => v ? dateFormat(new Date(v), 'yyyy-MM-dd HH:mm:ss') : ""
        },
        {
          prop: 'timeComplete',
          label: '靠泊结束时间',
          formatter: (r, c, v) => v ? dateFormat(new Date(v), 'yyyy-MM-dd HH:mm:ss') : ""
        },
      ],
    }
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    loadHistory(page = 1, size = 10) {
      page = Number.isFinite(page) ? (page - 1) : 0;
      let pageCondition = {
        conditions: {
          berthId: this.filter.berthId.join(","),
          vesselId: this.filter.vesselId.join(","),
          timeStart: this.filter.range?.[0]?.getTime(),
          timeComplete: this.filter.range?.[1]?.getTime(),
          dockingMode: "OFF"
        },
        page, size,
      };
      this.loading = true;
      return getHistory(pageCondition).then((data) => {
        this.loading = false;
        let {totalElements, totalPages, content} = data;
        this.content = content;
        this.page = page;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.size = size;
      }).catch((err) => {
        this.loading = false;
        this.$message.error(err.msg)
      })
    },
    /**
     * 点击选择按钮
     * @param dockingHistory
     */
    chooseRecord(dockingHistory) {
      this.$emit("recordSelected", dockingHistory);
    },
  }
}
</script>

<style scoped>

.el-select, .el-date-editor {
  width: 100%;
}

.el-col-6 {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
}

.searchButton {
  height: 100%;
  width: 100%;
}
</style>