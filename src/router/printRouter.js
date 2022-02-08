import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

// const PrintRouter = ()=>import("@/views/print/printRouter");
const PrintEnvironment = ()=>import("@/views/print/printEnvironment");
const PrintAlongsideReport = ()=>import("@/views/print/printAlongsideReport");
const PrintDraftReport = ()=>import("@/views/print/printDraftReport");

const routes = [
  // {
  //   path:'/print'
  // },
  {
    path: '/print/printEnvironment',
    component: PrintEnvironment
  },
  {
    path: '/print/printAlongsideReport',
    component: PrintAlongsideReport
  },
  {
    path: '/print/printDraftReport',
    component: PrintDraftReport
  },
];
//解决 在路由跳转的时候 同一个路由多次添加 不允许的问题
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this,to).catch(err=>err);
};
const VueRouterReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(to) {
  return VueRouterReplace.call(this,to).catch(err=>err);
};

const printRouter = new VueRouter({
  //TODO build时这个mode要采用hash

  mode: 'history',
  // mode: 'hash',
  base: process.env.BASE_URL,
  routes
});

export default printRouter
