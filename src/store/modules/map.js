
const state = () => ({
    compositeLayerPos:-1,
    compositeStylePos:-1,
    faceLayerPos:-1,
    faceStylePos:-1,
    types:{
        status:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        speed:[0,1]
    }
})

// actions
const actions = {

}

// mutations
const mutations = {
    setValToKey(state, {key,value}) {
        state[key] = value;
    },
    setStatusTypes(state, value) {
        state.types.status= value;
    },
    setSpeedTypes(state, value) {
        state.types.speed = value;
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}