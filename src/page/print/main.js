import Vue from 'vue';
import App from "@/page/print/App";
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import '@/assets/css/ele-theme/index.css';
import i18n from "@/i18n";
import printRouter from "@/router/printRouter";

Vue.use(Element);

Vue.config.productionTip = false;

new Vue({
  router:printRouter,
  i18n,
  render: h => h(App)
}).$mount('#app');
