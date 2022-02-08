import vessel from '../../api/vessel'
import Vue from "vue";

// initial state
const state = () => ({
  vessels: {},
  activeId:null,
  speedLineData:{}, //{id:arrayData}
  distanceLineData:{} //{id:arrayData}
})

// actions
const actions = {
  loadVessel({commit}, {id}) {
    commit('setVessel', {
      id, vessel: {
        width: 50,
        length: 250,
        name: "Loading"
      }
    })
    return vessel.getVessel(id)
      .then(vessel => commit('setVessel', {id, vessel}))
      .catch(() => commit('setVessel', {id, vessel: null}));
  },
  activeIdActions({commit},id){
    commit('setActiveId', id)
  },
}

// mutations
const mutations = {
  setVessel(state, {id, vessel}) {
    Vue.set(state.vessels, id, vessel);
  },
  setActiveId(state,id){
    state.activeId=id;
  },
  setSpeedLineData(state,{id,data}){
    Vue.set(state.speedLineData, id, data);
  },
  setDistanceLineData(state,{id,data}){
    Vue.set(state.distanceLineData, id, data);
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}