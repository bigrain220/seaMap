# webwsmsvue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https:cli.vuejs.org/config/).

## project directory tree
```
webwsmsvue/
├── babel.config.js
├── package-lock.json
├── package.json
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── print.html 打印界面
├── README.md
├── src/
│   ├── App.vue
│   ├── assets/
│   │   ├── audio/
│   │   │   └── alarm.wav 报警音频
│   │   ├── css/
│   │   ├── icon/  引入的外部icon
│   │   │   ├── demo.css
│   │   │   ├── demo_index.html  用法示例
│   │   │   ├── iconfont.css
│   │   │   ├── iconfont.eot
│   │   │   ├── iconfont.js
│   │   │   ├── iconfont.json
│   │   │   ├── iconfont.svg
│   │   │   ├── iconfont.ttf
│   │   │   ├── iconfont.woff
│   │   │   └── iconfont.woff2
│   │   ├── img/
│   │   │   ├── brand/
│   │   │   ├── index.js  导出vessel/里面的svg图
│   │   │   └── vessel/
│   │   └── js/
│   │       └── reconnecting-websocket.js  websocket断线重连
│   ├── common/
│   │   └── font/
│   │       ├── DS-DIGI-1.ttf  类似时钟的字体
│   │       └── font.css
│   ├── components/
│   │   ├── common/ 公共组件
│   │   │   ├── loading.vue 等待的loading
│   │   │   ├── loginPage.vue  登录界面
│   │   │   └── subBadge.vue   显示下标
│   │   │   ├── printPage.vue  打印页面  规定了页眉页脚和内容的位置
│   │   └── content/ 项目相关组件
│   │       ├── berthAndVesselInfo.vue  泊位和船舶信息
│   │       ├── dockingRecordSelect.vue 靠泊记录选择组件
│   │       ├── echarts/
│   │       │   ├── AppDepAngle.vue  靠离泊角度图
│   │       │   ├── AppDepDistance.vue 靠离泊距离图
│   │       │   ├── AppDepSpeed.vue 靠离泊速度
│   │       │   ├── baseEchart.vue  所有用到echarts的公共组件
│   │       │   ├── cable.vue 缆绳
│   │       │   ├── current.vue 层流
│   │       │   ├── environment/  实时环境页面的组件
│   │       │   │   ├── baseZRender.vue  所有用到了zrender的公共组件
│   │       │   │   ├── Humidity.vue  湿度
│   │       │   │   ├── Overview.vue 总览(类似表格的组件)
│   │       │   │   ├── Pressure.vue 气压
│   │       │   │   ├── Rain.vue 雨量
│   │       │   │   ├── Temperature.vue 温度
│   │       │   │   ├── Tide.vue 潮汐
│   │       │   │   ├── Visibility.vue 能见度
│   │       │   │   ├── WaterTemperature.vue 水温
│   │       │   │   ├── Wave.vue 波浪
│   │       │   │   ├── WindDirection.vue 风向
│   │       │   │   └── WindSpeed.vue 风速
│   │       │   ├── gaugeChartOfDocking.vue  靠泊界面角度图
│   │       │   ├── historyCurrent.vue  历史查询页面层流
│   │       │   ├── historyExcludeCurrentAndWave.vue 历史查询页面除层流和波浪的图
│   │       │   ├── historyWave.vue 历史查询页面波浪
│   │       │   ├── lineChartOfDockAngle.vue 靠泊界面的角度图(用在历史回放页面)
│   │       │   ├── lineChartOfDocking.vue 靠泊界面的折线图
│   │       │   ├── lineChartOfDrift.vue 漂移界面的折线图
│   │       │   ├── MooringDetail.vue 漂移界面的趋势图(未使用  可删)
│   │       │   └── wave.vue 环境页面的波浪图
│   │       ├── mainLayout.vue 主要的布局
│   │       ├── singleDocking.vue 单泊位靠泊界面
│   │       ├── singleDockingForHistoryPlayback.vue 给回放页面的用的靠泊界面
│   │       ├── startBerthing.vue 开启靠泊的弹窗
│   │       ├── vesselAnimation.vue 船舶靠泊svg动画
│   │       └── vesselDetail.vue 船舶详细信息的弹窗
│   ├── i18n/  国际化组件
│   │   ├── config/
│   │   │   ├── en.js 英
│   │   │   └── zh.js 中
│   │   └── index.js
│   ├── network/  与网络相关
│   │   ├── index.js  一些请求方式  get\post\put\delete
│   │   ├── request-api.js  包含所有的api
│   │   ├── requestInterceptors.js axios的请求拦截
│   │   ├── require.js axios的封装
│   │   └── websocketList.js 所有用到的websocket
│   ├── page/ 多页面配置
│   │   ├── main/ 主页面入口
│   │   │   ├── App.vue
│   │   │   ├── index.html
│   │   │   └── main.js
│   │   └── print/  打印页面的入口
│   │       ├── App.vue
│   │       ├── main.js
│   │       └── prints.html
│   ├── router/ 路由
│   │   └── index.js 主页面的路由
│   │   └── printRouter.js 打印页面的路由
│   ├── store/  Vuex
│   │   ├── index.js
│   │   ├── mutations/
│   │   │   ├── mutation.js
│   │   │   └── mutations_type.js
│   │   └── state.js 这里配置显示那些菜单，及点击那些菜单后会隐藏侧边栏
│   ├── util/
│   │   ├── common.js 公共的工具
│   │   └── content.js 与业务有关的工具
│   └── views/
│       ├── aside/  侧边栏
│       │   ├── NavMenu.vue 菜单
│       │   └── NavMenuDrawer.vue
│       ├── footer/ 底栏
│       ├── header/  顶栏
│       │   └── topHeader.vue 放置在顶栏的组件
│       ├── main/ 主要区域
│       │   ├── berthInfo.vue  泊位信息页面
│       │   ├── detailInfo.vue  详细信息查询页面(里面没内容，暂时用不上)
│       │   ├── environmentEchart.vue 环境页面
│       │   ├── history.vue 历史数据查询页面
│       │   ├── historyPlayBack.vue 历史回放页面
│       │   ├── multiDocking.vue 多泊位靠泊界面(里面只放了一个泊位)
│       │   ├── reportGeneration.vue报表生成界面
│       │   ├── vesselManager.vue 船舶管理界面
│       │   └── warnList.vue 报警信息页面
│       └── print/  打印界面
│           ├── printAlongsideReport.vue打印靠泊报表
│           ├── printChart.vue 打印图表的界面
│           ├── printDraftReport.vue打印漂移报表
│           ├── printEnvironment.vue打印环境报表
│           └── printTable.vue 打印表格的界面
├── vue.config.js
└── webwsmsvue.iml
```

### Q&A
Q: 为什么要采用多页面？

A：刚开始没考虑到要有打印界面。后来添加这个功能后发现如果是单页面的情况下打开子窗口，子窗口中的侧边栏、顶栏、底栏与主窗口一样一个不少，
然而预览界面根本不需要这些组件，如果再去添加让某些组件不显示功能有点麻烦，干脆就做成多页面了。

### 所用到的第三方js
#### ECharts

如果是新手的话，建议先看一下https://echarts.apache.org/zh/cheat-sheet.html
这里包含了图表上的一些术语

所有文档都可在网站中查询到https://echarts.apache.org/zh/index.html

#### ZRender

ZRender 是二维绘图引擎，它提供 Canvas、SVG、VML 等多种渲染方式。ZRender 也是 ECharts 的渲染器。

官网地址：https://ecomfe.github.io/zrender-doc/public/

项目中的环境页面绝大部分都是用该库实现的，个别是采用echarts和ZRender结合实现的。

#### swiper

官网地址：https://www.swiper.com.cn/api/index.html

项目中用这个做的船舶近距离漂移时显示船舶与码头的距离

#### snapsvg

用来操作svg图的。

官网地址：http://snapsvg.io/

也有中文翻译版的：https://www.zhangxinxu.com/GitHub/demo-Snap.svg/demo/basic/

#### d3-scale
d3库中的一个比例尺组件。在环境页面用的比较多。

文档地址：https://d3js.org.cn/document/d3-scale/#continuous-scales

