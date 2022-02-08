<template>
  <div class="login-container">
    <!-- <div class="h-title">镇海炼化管理系统</div> -->
    <div class="left-container">
      <div class="title"><span>镇海炼化管理系统</span></div>
      <div class="input-container">
        <input type="text" name="username" v-model="userName" placeholder="用户名">
        <input type="password" name="password" @keyup.enter="loginClick" v-model="password" placeholder="密码">
      </div>
      <div class="message-container">
        <span>忘记密码</span>
      </div>
    </div>
    <div class="right-container">
      <div class="regist-container">
        <span class="regist">注册</span>
      </div>
      <div class="actoin-container" @click="loginClick">
        <span>提交</span>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "@/network/request-api";
import { deleteObj, setToken } from "@/util/content";

export default {
  name: "loginPage",
  data() {
    return {
      userName: '',
      password: '',
    }
  },
  mounted() {
    let bodyStyle = document.getElementsByTagName("body")[0].style;
    bodyStyle.setProperty("background-image", "linear-gradient(to bottom right, rgb(114, 135, 254), rgb(130, 88, 186))");
    //TODO 检查是否需要登录 若已登录则跳过该界面
  },
  methods: {
    loginClick() {
      let _this = this;
      let userName = this.userName;
      let password = this.password;
      if (!userName || !password) {
        this.$message.error("账户或密码未填");
        return;
      }
      login(userName, password).then((data) => {
        //data里面有{token:,user:{id:,username:,}}
        if (!data) {
          return;
        }
        let userName = data.user.username;
        let token = data.token;
        setToken(userName, token);
        //TODO 后面把这个aside写成灵活的
        _this.$router.replace('/shipall/shippage');
      }
      ).catch((data) => {
        _this.$message.error(data.msg);
      })
    },
  },
  beforeDestroy() {
    let bodyStyle = document.getElementsByTagName("body")[0].style;
    bodyStyle.removeProperty("background-image");
    deleteObj(this.$data);
  }
}
</script>

<style scoped>
/** {*/
/*    padding: 0;*/
/*    margin: 0;*/
/*}*/

html {
  height: 100%;
}

/* rgb(114,135,254)   rgb(130,88,186)
    rgb(59,45,159)
    rgb(95, 76, 194)
    rgb(118,76,163)  rgb(92,103,211)
    rgb(199, 191, 219)
    rgb(237,221,22) */

/*body {*/
/*    background-image: linear-gradient(to bottom right, rgb(114, 135, 254), rgb(130, 88, 186));*/
/*}*/

.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 334px;
  margin: auto;
  border-radius: 15px;
  box-shadow: 0 10px 50px 0 rgb(59, 45, 159);
  background-color: rgb(95, 76, 194);
}
.h-title {
  position: absolute;
  color: #fff;
  text-align: center;
  width: calc(100% - 145px);
  padding: 1rem 0;
  font-size: 2rem;
  font-weight: bold;
}

.left-container {
  display: inline-block;
  width: 330px;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  padding: 60px;
  background-image: linear-gradient(
    to bottom right,
    rgb(118, 76, 163),
    rgb(92, 103, 211)
  );
}

.title {
  color: #fff;
  font-size: 18px;
  font-weight: 200;
  font-size: 2rem;
  font-weight: bold;
}

/*登录文字的下划线*/
.title span {
  /*border-bottom: 3px solid rgb(237, 221, 22);*/
}

.input-container {
  padding: 20px 0;
}

input {
  border: 0;
  background: none;
  outline: 0;
  color: #fff;
  margin: 20px 0;
  display: block;
  width: 100%;
  padding: 5px 0;
  transition: 0.2s;
  border-bottom: 1px solid rgb(199, 191, 219);
}

input:hover {
  border-bottom-color: #fff;
}

::-webkit-input-placeholder {
  color: rgb(199, 191, 219);
}

.message-container {
  font-size: 14px;
  transition: 0.2s;
  color: rgb(199, 191, 219);
  cursor: pointer;
}
.message-container > span {
  opacity: 0;
}
.message-container:hover {
  color: #fff;
}

.right-container {
  width: 145px;
  display: inline-block;
  height: calc(100% - 120px);
  vertical-align: top;
  padding: 60px 0;
}

.regist-container {
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: 200;
}
/*注册文字的下划线*/
.regist-container span {
  border-bottom: 3px solid rgb(237, 221, 22);
  opacity: 0;
}

.actoin-container {
  font-size: 10px;
  color: #fff;
  height: 100%;
  position: relative;
}

.actoin-container span {
  border: 1px solid rgb(237, 221, 22);
  padding: 10px;
  display: inline;
  line-height: 25px;
  border-radius: 25px;
  position: absolute;
  bottom: 10px;
  left: calc(72px - 25px);
  transition: 0.2s;
  cursor: pointer;
}

.actoin-container span:hover {
  background-color: rgb(237, 221, 22);
  color: rgb(95, 76, 194);
}
</style>