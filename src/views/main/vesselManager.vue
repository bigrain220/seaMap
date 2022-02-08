<template>
  <home-panel style="height: 100%;">
    <div class="vessel">
      <div class="title">船舶信息</div>
      <!--      <el-table-->
      <!--          :data="tableData"-->
      <!--          border-->
      <!--          size="large"-->
      <!--          class="vessel-table"-->
      <!--          :row-style="tableStyle"-->
      <!--          :cell-style="tableStyle"-->
      <!--          :header-cell-style="tableStyle"-->
      <!--      >-->
      <!--        <el-table-column-->
      <!--            v-for="option in colOptions"-->
      <!--            :prop="option.prop"-->
      <!--            :width="option.width"-->
      <!--            :label="option.label"-->
      <!--            :key="option.prop"-->
      <!--            align="center"-->
      <!--        />-->
      <!--        &lt;!&ndash;   需要定长   &ndash;&gt;-->
      <!--        <el-table-column-->
      <!--            label="操作"-->
      <!--            min-width="210px"-->
      <!--            width="210px">-->
      <!--          <template slot="header">-->
      <!--            <el-button size="small" type="primary" @click="openDialogForAddVessel">新增</el-button>-->
      <!--          </template>-->
      <!--          <template slot-scope="scope">-->
      <!--            <el-button @click="viewVessel(scope.row)" size="small">查看</el-button>-->
      <!--            <el-button @click="openDialogForUpdateVessel(scope.row)" size="small">修改</el-button>-->
      <!--            <el-button-->
      <!--                size="small"-->
      <!--                type="danger"-->
      <!--                @click="displayEnsureDialog(scope.row)">删除-->
      <!--            </el-button>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--      </el-table>-->
      <common-table
          @changePageNum="changePage"
          :data="tableData"
          :columns="colOptions"
          :page-size="pageCondition.size"
          :total="total"
          :operation="true"
          :size="'large'">
        <template slot="header">
          <el-button size="small" type="primary" @click="openDialogForAddVessel">新增</el-button>
        </template>
        <template slot="line" slot-scope="row">
          <el-button
              size="small"
              @click="viewVessel(row.row)">查看
          </el-button>
          <el-button
              size="small"
              @click="openDialogForUpdateVessel(row.row)">修改
          </el-button>
          <el-popconfirm title="确认删除船舶信息吗?" style="margin-left: 10px;" @onConfirm="deleteVessel(row.row)">
            <el-button
                size="small"
                type="danger" slot="reference">删除
            </el-button>
          </el-popconfirm>
        </template>
      </common-table>

      <el-dialog :visible.sync="dialog.visible">
        <vessel-detail
            :is-display-button="dialog.footerVisible"
            :vessel-obj="dialog.vesselObj"
            @hidden="hiddenDialog"
            :confirm-button-type="confirmButtonType"
            @vesselInfoChanged="vesselInfoChanged"
            :ref="'vesselDetail'">
        </vessel-detail>
      </el-dialog>

      <!--      <el-dialog :visible.sync="ensureDialogVisible">-->
      <!--        <div slot="footer" class="dialog-footer">-->
      <!--          <el-button @click="ensureDialogVisible = false">取 消</el-button>-->
      <!--          <el-button type="danger" @click="deleteVessel">确 定 删 除</el-button>-->
      <!--        </div>-->
      <!--        <div>确定删除&#45;&#45;{{ readyDeleteVessel }}</div>-->
      <!--      </el-dialog>-->
    </div>
  </home-panel>
</template>

<script>

import {deleteVessel, vesselPage} from "@/network/request-api";
import vesselDetail from "@/components/content/vesselDetail";
import {deleteObj} from "@/util/content";
import HomePanel from "@/components/content/HomePanel";
import CommonTable from "@/components/common/CommonTable";

export default {
  name: "vesselManager",
  components: {
    vesselDetail, HomePanel, CommonTable
  },
  data() {
    return {
      pageCondition: {
        condition: [],
        page: 0,
        size: 10,
      },
      total: 0,
      tableData: [],
      colOptions: [
        {prop: 'imoNumber', label: '船舶编号', width: 150},
        {prop: 'name', label: '船舶名称',},
        {prop: 'length', label: '船舶长度', width: 100},
        {prop: 'width', label: '船舶宽度', width: 100},
        {prop: 'vesselsTypeStr', label: '船舶类型', width: 200},
      ],
      dialog: { //增删改的对话框
        visible: false, //是否显示
        footerVisible: false,//是否显示确定 取消按钮
        vesselObj: null
      },
      ensureDialogVisible: false, //确认删除对话框 是否显示
      readyDeleteVessel: null, //准备删除的船舶对象
      confirmButtonType: 'update' //对话框的确认按钮的类型 有add update
    }
  },
  computed: {},
  mounted() {
    this.changePage(0)
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    tableStyle() {
      return {
        background: '#2c3036',
        border: '1px solid #4f5560',
      };
    },
    getAllVessels() {
      let _this = this;
      vesselPage().then((data) => {
        let tableData = [];
        data.forEach((vesselObj, index) => {
          let obj = {};
          obj['id'] = vesselObj['id'];
          obj['imoNumber'] = vesselObj['imoNumber'];
          obj['name'] = vesselObj['name'];
          obj['length'] = vesselObj['length'];
          obj['width'] = vesselObj['width'];
          obj['vesselsTypeStr'] = vesselObj['vesselsTypeStr'];
          obj['vesselsType'] = vesselObj['vesselsType'] + '';
          obj['color'] = vesselObj['color'];
          obj['remark'] = vesselObj['remark'];

          tableData.push(obj);
        });
        _this.tableData = tableData;
      });
    },
    changePage(page) {
      let _this = this;
      this.pageCondition.page = page;
      vesselPage((this.pageCondition)).then((page) => {
        let {content, number, size, totalElements} = page;
        _this.pageCondition.size = size;
        _this.pageCondition.page = number;
        _this.total = totalElements;
        _this.tableData = content;
      });
    },
    /**
     * 查看船舶详细信息
     * @param row 当前行的数据
     */
    viewVessel(row) {
      this.dialog.vesselObj = row;
      let ref = this.$refs["vesselDetail"];
      if (ref) {
        ref.assignment(row);
      }
      this.dialog.footerVisible = false;
      this.dialog.visible = true;
    }
    ,
    /**
     * 打开对话框以修改船舶信息
     * @param row
     */
    openDialogForUpdateVessel(row) {
      this.dialog.vesselObj = row;
      this.dialog.footerVisible = true;
      this.confirmButtonType = "update";
      this.dialog.visible = true;

    }
    ,
    /**
     * 删除船舶时 弹出确认删除的对话框
     * @param row
     */
    displayEnsureDialog(row) {
      this.ensureDialogVisible = true;
      this.readyDeleteVessel = row.row;
    }
    ,
    /**
     * 点击确认删除按钮后删除船舶
     */
    deleteVessel(row) {
      let _this = this;
      //点击确定后  在确认窗口可见的情况下删除船舶
      deleteVessel(row.id).then(() => {
        //删除成功后 更新表格中的显示 关闭确认窗口
        _this.vesselInfoChanged();
      });
    }
    ,
    /**
     * 弹出对话框以新增船舶
     */
    openDialogForAddVessel() {
      //新增时 默认给一个
      this.dialog.vesselObj = {
        imoNumber: 116,
        name: '新增的船',
        length: 100,
        width: 50,
        vesselsType: "0",
        vesselsTypeStr: '',
        color: '#000',
        remark: ''
      };
      this.dialog.footerVisible = true;
      this.confirmButtonType = "add";
      this.dialog.visible = true;
    }
    ,
    /**
     * 隐藏对话框
     */
    hiddenDialog() {
      this.dialog.visible = false;
    }
    ,
    /**
     * 当改变了船舶信息后 要更新表格中的信息
     */
    vesselInfoChanged() {
      // TODO JXM
      return this.changePage(this.pageCondition.page);
    }

  }
}
</script>

<style scoped>
.vessel {
  padding: 1rem;
}

.vessel .title {
  font-size: 30px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
}

.vessel .vessel-table {
  width: 100%;
  border: 1px solid #4f5560;
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
