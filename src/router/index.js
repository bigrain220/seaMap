import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/views/main/Home";

Vue.use(VueRouter);
const MainHome = () => import("@/components/content/MainHome");
const MainArea = () => import("@/components/content/MainArea");
const MainLayout = () => import('@/components/content/mainLayout');
const VesselManager = () => import('@/views/main/vesselManager');
const EnvironmentEchart = () => import('@/views/main/environmentEchart');
const History = () => import('@/views/main/history');
const MultiDocking = () => import('@/views/main/multiDocking');
const BerthInfo = () => import('@/views/main/berthInfo');
const PlayBack = () => import('@/views/main/historyPlayBack');
const WarnList = () => import('@/views/main/warnList');
const report = () => import('@/views/main/reportGeneration');
const setting = () => import('@/views/main/settingPage')
const DetailInfo = () => import('@/views/main/detailInfo');
const Operator = () => import('@/views/main/Operator');
const Login = () => import('@/components/common/loginPage');

const routes = [
  {
    path: '',
    redirect: '/seamap'
  },
  // {
  //   path: '',
  //   redirect: '/home/ad'
  // },
  {
    path: '/aside/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: 'report'
      },
      {
        path: 'environment',
        component: EnvironmentEchart
      },
      {
        path: 'vesselManager',
        component: VesselManager
      },
      {
        path: 'history',
        component: History
      },
      {
        path: 'multiDocking',
        component: MultiDocking
      },
      {
        path: 'multiDocking/:berthId',
        component: MultiDocking
      },
      {
        path: 'berthInfo',
        component: BerthInfo,
      },
      {
        path: 'playBack',
        component: PlayBack
      },
      {
        path: 'warnList',
        component: WarnList,
      },
      {
        path: 'report',
        component: report,
      },
      {
        path: 'detail',
        component: DetailInfo,
      },
    ]
  },
  {
    path: '/home',
    component: MainHome,
    children: [
      {
        path: '',
        component: MainArea,
        redirect: 'ad',
        children: [
          {
            path: 'ad',
            component: Home,
            meta: {
              keepAlive: true,
            }
          },
          {
            path: 'mlms',
            component: MultiDocking,
            meta: {
              keepAlive: true,
            }
          },
          {
            path: 'env',
            component: EnvironmentEchart,
            meta: {
              keepAlive: true,
            }
          },
          {
            path: 'management',
            component: VesselManager,
          },
          {
            path: 'report',
            component: report,
          },
          {
            path: 'setting',
            component: setting,
          },
          {
            path: 'history',
            component: PlayBack,
          },
          {
            path: 'operator',
            component: Operator,
          },
        ],
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/shipall',
    component: () => import('@/views/main/shipall/shipAll.vue'),
    redirect:"/shipall/shippage",
    children:[
      {
        path: 'shippage',
        component: () => import('@/views/main/shipall/shipPage.vue')
      },
      {
        path: 'shipcontrol',
        component: () => import('@/views/main/shipall/shipControl.vue')
      },
    ]
  },
  {
    path: '/shipdetail',
    component: () => import('@/views/main/shipall/shipDetail.vue')
  },
  {
    path: '/shiplogin',
    component: () => import('@/views/main/shipall/shipLogin.vue')
  },
  {
    path:'/maplogin',
    component:()=>import("@/views/main/seaMap/login.vue")
  },
  {
    path: '/seamap',
    redirect: "/seamap/map",
    component: () => import('@/views/main/seaMap/index.vue'),
    children: [
      {
        path:'map',
        component:()=>import("@/views/main/seaMap/map.vue")
      }
    ]
  },
  {
    //不存在的url 自动回到首页
    path: "*",
    redirect: "/",
  }
];
//解决在路由跳转的时候 同一个路由多次添加 不允许的问题
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err);
};
const VueRouterReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(to) {
  return VueRouterReplace.call(this, to).catch(err => err);
};


const router = new VueRouter({
  //TODO build时这个mode要采用hash
  // mode: 'hash',
  // mode: 'history',
  mode:process.env.NODE_ENV==='production'?'hash':'history',
  base: process.env.BASE_URL,
  routes
});

export default router
