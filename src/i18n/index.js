import VueI18n from 'vue-i18n';
import Vue from "vue";

Vue.use(VueI18n);

import zh from '@/i18n/config/zh';
import en from '@/i18n/config/en';

const i18n = new VueI18n({
  locale: navigator.language || 'en',
  messages: {
    "zh-CN": zh,
    "zh": zh,
    en,
  }
});

export default i18n;
