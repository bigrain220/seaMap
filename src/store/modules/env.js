import protoRoot from "@/proto/proto";
import {getToken} from "@/util/content";
import Vue from "vue";
// initial state
const state = () => ({
  wind: {},
  tide: {},
  srv: {},
  warn: {},
  envConfig: [
    {
      berth: '2#',
      srv: 2,
      type: 'wind'
    },
    {
      berth: '6#',
      srv: 4,
      type: 'wind'
    },
    {
      berth: '7#',
      srv: 5,
      type: 'wind'
    },
    {
      berth: '',
      srv: '3',
      type: 'tide'
    }
  ],
});

const proto = {
  root: protoRoot.lookupType("center.Push"),
  wind: protoRoot.lookupType("center.Wind"),
  tide: protoRoot.lookupType("center.Tide"),
  warn: protoRoot.lookupType("center.Warning"),
};

// actions
const actions = {
  setup({dispatch, commit}) {
    return Promise.resolve([{id: 2}, {id: 3}, {id: 4}, {id: 5}]);
  },
  onOpen({commit}, {socket, id}) {
    socket.send(`token:${getToken()}`);
    socket.send(`add:${id.join(",")}`);
  },
  onMessage({commit}, {data}) {
    return data
      .arrayBuffer()
      .then((b) => new Uint8Array(b))
      .then((b) => proto.root.decode(b))
      .then((root) => {
        let {time, type, body} = root;
        if (body) {
          switch (type) {
            case 3: {
              let {id, spd, dir} = proto.wind.decode(body);
              // console.log(proto.wind.decode(body))
              commit("setWind", {id, status: {time, spd: spd / 100, dir},});
              break;
            }
            case 14: {
              let {id, height, tendency} = proto.tide.decode(body);
              commit("setTide", {id, status: {time, height: height / 100, tendency},});
              break;
            }
            case 19: {
              let {id, srv, start, filed, flag, state} = proto.warn.decode(body);
              commit("setWarn", {id: srv, status: {id, start, time, filed, flag, state},});
              break;
            }
            default:
              break;
          }
        }
      });
  },
};

// mutations
const mutations = {
  setWind(state, {id, status}) {
    Vue.set(state.wind, id, status);
  },
  setTide(state, {id, status}) {
    Vue.set(state.tide, id, status);
  },
  setWarn(state, {id, status}) {
    Vue.set(state.warn, id, status);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
