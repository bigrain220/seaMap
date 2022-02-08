<template>
  <div>
    <el-row class="row" :gutter="10">
      <el-col :span="4">
        <el-input disabled v-model="berth.berthName">
          <template slot="prepend">泊 位</template>
        </el-input>
      </el-col>
      <el-col :span="5">
        <el-input disabled v-model="vessel.name">
          <template slot="prepend">船舶名称</template>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-input disabled v-model="startTime">
          <template slot="prepend">起始日期</template>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-input disabled v-model="endTime">
          <template slot="prepend">结束日期</template>
        </el-input>
      </el-col>
      <el-col :span="3">
        <div style="width: 100%;">
          <el-button style="width: 100%;" @click="dialogVisible = true" type="primary">
            选择记录
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible">
      <docking-record-select @recordSelected="recordSelected"/>
    </el-dialog>
  </div>
</template>

<script>
import DockingRecordSelect from "@/components/content/dockingRecordSelect";
import {mapState} from "vuex";
import {dateFormat} from "@/util/common";

export default {
  name: "DockingRecord",
  components: {DockingRecordSelect},
  props: {},
  data() {
    return {
      record: {
        id: null,
        berthId: null,
        vesselId: null,
        timeStart: null,
        timeComplete: null,
      },
      dialogVisible: false,
    }
  },
  computed: {
    ...mapState({
      berths: state => state.berth.berths,
      vessels: state => state.vessel.vessels,
    }),
    vessel() {
      let id = this.record?.vesselId;
      let vessel = this.vessels[id];
      if (id) {
        if (!vessel) {
          this.$store.dispatch('vessel/loadVessel', {id});
        }
        return vessel ?? {width: 50, length: 250, name: "Loading"};
      } else {
        return {name: "未选择"};
      }
    },
    berth() {
      let berthId = this.record?.berthId;
      return this.berths[berthId] ?? {berthName: "未选择", mode: 0};
    },
    startTime() {
      let v = this.record?.timeStart;
      return v ? dateFormat(new Date(v), 'yyyy-MM-dd HH:mm:ss') : ""
    },
    endTime() {
      let v = this.record?.timeComplete;
      return v ? dateFormat(new Date(v), 'yyyy-MM-dd HH:mm:ss') : ""
    }
  },
  methods: {
    recordSelected(record) {
      this.record = record;
      this.dialogVisible = false;
      this.$emit("recordSelected", record, {startTime: this.startTime, endTime: this.endTime});
    }
  }
}
</script>

<style scoped>

</style>