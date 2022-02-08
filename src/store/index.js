import Vue from 'vue'
import Vuex from 'vuex'
import berth from './modules/berth'
import vessel from './modules/vessel'
import docking from './modules/docking'
import env from './modules/env'
import  timeout from './modules/timeout'
import  map from './modules/map'
import state from "@/store/state";
import rootMutation from "@/store/mutations/mutation";
import getters from "@/store/getter";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  mutations: rootMutation,
  getters,
  modules: {
    berth,
    vessel,
    docking,
    env,
    timeout,
    map
  },
  strict: debug,
})
