<template>
  <home-panel class="operator">
    <el-tabs v-model="selectNameDefault">
      <el-tab-pane label="用户管理" name="userManage">
    
    <div class="main">
      <div class="title">{{ title }}</div>
      <div class="table-area">
        <common-table
            @changePageNum="changePage"
            :data="data"
            :columns="columns"
            :page-size="pageCondition.size"
            :total="total"
            :operation="true"
            :size="'large'">
          <template slot="header">
            <el-button size="small" type="primary" @click="createUser">新增</el-button>
          </template>
          <template slot="line" slot-scope="row">
            <el-button
                size="small"
                @click="showUser(row)">查看
            </el-button>
            <el-button
                size="small"
                @click="updateUser(row)">修改
            </el-button>
            <el-popconfirm title="确认删除用户吗?" style="margin-left: 10px;" @onConfirm="deleteUser(row)">
              <el-button
                  size="small"
                  type="danger" slot="reference">删除
              </el-button>
            </el-popconfirm>
          </template>
        </common-table>
      </div>
    </div>
    <el-dialog title="用户信息" :visible="visible" @close="close">
      <el-form :label-position="'right'" label-width="80px">
        <el-form-item label="Name">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="Pass" v-if="showPassword">
          <el-input v-model="user.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="Role">
          <el-select
              v-model="user.roles"
              multiple
              collapse-tags
              placeholder="请选择">
            <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              {{ item.roleName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commitUser" :disabled="disabled">提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    </el-tab-pane>
    <el-tab-pane label="角色管理" name="roleManage" :class="'env-base-area'">
        <div class="roleInterface">
            <roleManage/>
        </div>
      </el-tab-pane>
    
    </el-tabs>

  </home-panel>
</template>

<script>
import CommonTable from "@/components/common/CommonTable";
import {createUser, deleteUser, getRoleList, getUserPage, updateUser} from "@/network/request-api";
import HomePanel from "@/components/content/HomePanel";
import UserModal from "@/components/content/UserModal";
import roleManage from "@/views/main/roleManage"
// import history from "@/views/main/history"

export default {
  name: "Operator",
  components: {UserModal, HomePanel, CommonTable,roleManage},
  methods: {
    changePage(page) {
      this.pageCondition.page = page;
      getUserPage((this.pageCondition)).then((userPage) => {
        let {content, number, size, totalElements} = userPage;
        this.pageCondition.size = size;
        this.pageCondition.page = number;
        this.total = totalElements;
        this.data = content;
      });
    },
    handlerUser(row) {
      let roles = row.row.roles.map(item => item.id);
      return {username: row.row.username, roles, id: row.row.id};
    },

    showUser(row) {
      this.user = this.handlerUser(row);
      this.visible = true;
      this.disabled = true;
    },
    updateUser(row) {
      this.user = this.handlerUser(row);
      this.visible = true;
      this.disabled = false;

    },

    createUser() {
      this.visible = true;
      this.showPassword = true;
      this.disabled = false;
      this.user = {username: '', roles: []}
    },

    close() {
      this.visible = false;
      this.showPassword = false;
      this.disabled = true;
    },
    commitUser() {
      console.log(this.user);
      let userData = this.user;
      userData.roles = userData.roles.map(roleId => {
        return {id: roleId}
      });
      console.log(userData);
      if (this.user.id) {
        updateUser(userData).then(() => {
          this.$message.success("修改成功")
          this.resetAndClose();
        });
      } else {
        createUser(userData).then(() => {
          this.$message.success("创建成功")
          this.resetAndClose();
        });
      }
    },
    deleteUser(row) {
      console.log("删除", row.row.id);
      deleteUser(row.row.id).then(() => {
        this.$message.success("删除成功")
        this.resetAndClose();
      })
    },
    resetAndClose() {
      this.changePage(this.pageCondition.page);
      this.close();
    }
  },
  mounted() {
    this.changePage(this.pageCondition.page);
    getRoleList().then(roleList => {
      this.roleList = roleList;
    })
  },

  data() {
    return {
      selectNameDefault:"userManage",
      pageCondition: {
        condition: [],
        page: 0,
        size: 10,
      },
      data: [],
      columns: [
        {label: "Id", prop: 'id', width: 150},
        {label: "Name", prop: 'username'},
        {
          label: "Role", prop: 'roles', width: 300,
          formatter: (row, column, cellValue) => {
            return cellValue.map(role => role.roleName).join(',');
          }
        },
      ],
      total: 0,
      title: '用户',
      user: {
        username: '',
        roles: []
      },
      visible: false,
      roleList: [],
      disabled: true,
      showPassword: false,
    }
  }
}
</script>

<style scoped>
.operator {
  height: 100%;
}
.operator .main {
  padding: 1rem;
}
.el-tabs >>> .el-tabs__nav-wrap::after {
  background-color: transparent;
  }
.el-tabs /deep/ .el-tabs__item {
  color: #fff;
}
.el-tabs /deep/ .el-tabs__nav {
  margin-left: 20px;
}

.operator {
  height: 100%;
}

.operator .main {
  padding: 1rem;
}

.title {
  font-size: 30px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
}

</style>