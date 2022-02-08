<template>
  <div class="rolemain">
    <div class="title">角色管理</div>
    <common-table
      :data="tableData"
      :columns="colOptions"
      :page-size="pageCondition.size"
      :total="total"
      :operation="true"
      :size="'large'"
    >
      <template slot="header">
        <el-button type="primary" @click="addDialog = true" icon="el-icon-plus">新增</el-button>
      </template>
      <template slot="line" slot-scope="scope">
        <el-button type="small" @click="editDialog(scope.row)" icon="el-icon-edit">修改</el-button>
        <el-popconfirm
          title="确认删除该条数据吗?"
          style="margin-left: 10px;"
          @onConfirm="deleteResult(scope.row)"
        >
          <el-button size="small" type="danger" slot="reference" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>
    </common-table>
    <!-- 新增界面 -->
    <el-dialog title="新增" :visible.sync="addDialog" width="40%" :before-close="handleClose">
      <el-input class="input_style" placeholder="Role" v-model="selectRole">
        <template slot="prepend">新增角色</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nullCancel">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改界面 -->
    <el-dialog title="修改" :visible.sync="updateDialog" width="40%" :before-close="handleClose">
      <el-input class="input_style" placeholder="Role" v-model="selectRole">
        <template slot="prepend">修改角色</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nullCancel">取 消</el-button>
        <el-button type="primary" @click="updateSubmit(roleId)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  createRole,
  deleteRole,
  updateRole,
} from "@/network/request-api";
import { deleteObj } from "@/util/content";
import CommonTable from "@/components/common/CommonTable";

export default {
  name: "roleManage",
  components: {
    CommonTable,
  },
  data() {
    return {
      value: "",
      pageCondition: {
        condition: [],
        page: 0,
        size: 10,
      },
      total: 0,
      title: "角色",
      tableData: [],
      colOptions: [
        { prop: "id", label: "ID" },
        { prop: "roleName", label: "Role" },
      ],
      roleId: 0,
      selectRole: "",
      addDialog: false,
      updateDialog: false,
    };
  },
  computed: {
    //  allRole() {
    //   return this.tableData;
    // },
  },
  wathch: {},
  mounted() {
    let that = this;
    that.allRole();
    that.$nextTick(function(){})
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    /**
     * 查询所有
     */
    allRole() {
      getRoleList().then((roleList) => {
        this.tableData = roleList;
      });
    },

    /**
     * 删除
     */
    deleteResult(row) {
      deleteRole(row.id).then(() => {
        this.$message.success("删除成功");
      });
    },
    /**
     * 打开修改对话框
     */
    editDialog(row) {
      this.updateDialog = true;
      const { id, roleName } = row;
      this.selectRole = roleName;
      this.roleId = id;
    },

    /**
     * 新增提交
     */
    addSubmit() {
      let id =
        Math.max(
          ...this.tableData.map((item) => {
            return item.id;
          })
        ) + 1;
      let roleArray = JSON.parse(JSON.stringify(this.tableData[0]));
      roleArray.id = id;
      createRole(roleArray)
        .then((res) => {
          this.$message.success("新增成功");
        })
        .catch(() => {
          this.$message.error("新增失败");
        });
      this.nullCancel();
    },
    /**
     * 修改提交
     */
    updateSubmit(id) {
      const role = this.tableData.filter((item) => item.id == id)[0];
      if (role) {
        role.roleName = this.selectRole;
        updateRole(role).then(() => {
          this.$message.success("修改成功");
        });
        this.nullCancel();
      }
    },
    /**
     * 关闭对话框
     */
    nullCancel() {
      this.addDialog = false;
      this.updateDialog = false;
      this.selectRole = "";
    },
    /**
     * 关闭确认对话框
     */
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style scoped>
.rolemain {
  padding: 1rem;
}
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
  content: "";
  position: absolute;
  background-color: #4f5560;
  z-index: 1;
}

.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: #4f5560;
}

/* .settingSelect {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
} */
.title {
  font-size: 30px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
}
.el-input {
  width: 35%;
}
.settingSearch {
  width: 10%;
}
.input_style {
  width: 60%;
}
</style>
