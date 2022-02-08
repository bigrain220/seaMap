import berth from '../../api/berth'
import Vue from "vue";

// initial state
const state = () => ({
  berths: {},
  status: {},
})

// actions
const actions = {
  setup({dispatch, commit}) {
    return berth.getBerths().then(berths => {
      commit('setBerths', {berths})
      dispatch('loadStatus');
      return berths;
    })
  },
  loadStatus({dispatch, commit, state}, id) {
    if (Number.isFinite(id)) {
      berth.getStatus(id).then(status => commit('setStatus', {id, status}))
    } else if (Array.isArray(id)) {
      id.forEach(i => dispatch('loadStatus', i));
    } else {
      dispatch('loadStatus', Object.keys(state.berths).map(a => Number(a)))
    }
  }
}

// mutations
const mutations = {
  setBerths(state, {berths}) {
    state.berths = berths.reduce((obj, cur) => {
      obj[cur.id] = cur;
      return obj;
    }, {});
  },
  setStatus(state, {id, status}) {
    console.log(`DockingEvent Berth:${id}, `, status)
    Vue.set(state.status, id, status);
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}