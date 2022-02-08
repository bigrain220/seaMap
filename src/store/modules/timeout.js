// initial state
const state = () => ({
    now: Date.now(),
    // timeOutObj: {
    //     wind: true,
    //     vessel: true
    // },
    // timeOutId: {
    //     windId: null,
    //     vesselId: null
    // }
})

// actions
const actions = {
    // startTimeOut({state,commit}, obj={}){
    //     commit('setObj',obj);
    //     if(Object.keys(obj).includes('wind')){
    //         clearTimeout(state.timeOutId.windId);
    //         let timer1 = setTimeout(()=>{
    //             commit('setObj', {wind:true});
    //             console.log(111)
    //         },5000)
    //         commit('setTimeOutId', {'windId':timer1});
    //     }
    //     if(Object.keys(obj).includes('vessel')){
    //         clearTimeout(state.timeOutId.vesselId);
    //         let timer2 = setTimeout(()=>{
    //             commit('setObj', {vessel:true});
    //         },30000)
    //         commit('setTimeOutId', {'vesselId':timer2});
    //     }
    // },
    timeStart({commit}){
        setInterval(()=>{
            commit('setNow', Date.now());
        },1000)
    }
}

// mutations
const mutations = {
    // setObj(state, obj = {}) {
    //     state.timeOutObj = Object.assign(state.timeOutObj, obj);
    // },
    // setTimeOutId(state, obj) {
    //     state.timeOutId = Object.assign(state.timeOutId, obj);
    // },
    setNow(state, time) {
        state.now = time;
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}