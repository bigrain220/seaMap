import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import i18n from "@/i18n";

import '@/common/font/font.css'
import '@/assets/icon/iconfont.css'
import '@/assets/icon/iconfont'

const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

Vue.use(Element);
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
});
