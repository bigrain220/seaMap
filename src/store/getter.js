
const getters = {
    shipDetailData_get: state => state.docking.terminal[state.vessel.activeId]||{},
}

export default getters;