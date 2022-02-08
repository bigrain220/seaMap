export default {
  /*侧边栏是否显示   侧边栏和抽屉只会渲染一个*/
  asideVisible: true,
  /*是否显示侧边栏抽屉*/
  navMenuDrawerVisible: false,
  user: {
    role: "normal",
    username: "",
    token: "",
    unreadMessageNum: 0,
    /*可显示的菜单*/
    displayMenu: [
      /*path: url路径  icon:侧边栏菜单的图标  menuVisible:点击该菜单后是否隐藏侧边栏*/
      { path: "environment", icon: "el-icon-document", menuVisible: true },
      { path: "history", icon: "el-icon-menu", menuVisible: true },
      { path: "multiDocking", icon: "el-icon-setting", menuVisible: false },
      //船舶管理
      { path: "vesselManager", icon: "el-icon-setting", menuVisible: true },
      //泊位信息
      { path: "berthInfo", icon: "el-icon-info", menuVisible: true },
      //历史回放
      { path: "playBack", icon: "el-icon-video-play", menuVisible: true },
      //消息列表
      { path: "warnList", icon: "el-icon-warning", menuVisible: true },
      //报表生成
      { path: "report", icon: "el-icon-document", menuVisible: true },
      //详情搜索
      { path: "detail", icon: "el-icon-search", menuVisible: true },
    ],
  },
  berth: {
    id: undefined,
  },
  // dockingMode: {
  //   'OFF': "关闭",
  //   'APPROACH': "靠泊",
  //   'MOORING': "漂移",
  //   'DEPARTURE': '离泊',
  // },
  statusDic: {
    0: { name: "关闭", value: "OFF" },
    1: { name: "靠泊", value: "APPROACH" },
    2: { name: "在港作业", value: "MOORING" },
    3: { name: "离泊", value: "DEPARTURE" },
    OFF: { name: "关闭" },
    APPROACH: { name: "靠泊" },
    MOORING: { name: "在港作业" },
    DEPARTURE: { name: "离泊" },
  },
};
