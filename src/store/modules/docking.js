import protoRoot from '@/proto/proto';
import {getToken} from "@/util/content";
import Vue from "vue";
// initial state
const state = () => ({
  terminal: {},
  cables: {},
})

const proto = {
  root: protoRoot.lookupType('center.Push'),
  terminal: protoRoot.lookupType('center.Terminal'),
  info: protoRoot.lookupType('center.TerminalInfo'),
};

// actions
const actions = {
  onOpen({commit}, {socket, berths}) {
    socket.send(`token:${getToken()}`);
    socket.send(`add:${berths.map(b => b.id).join(",")}`);
  },
  onMessage({commit}, {data}) {
    data.arrayBuffer()
      .then(b => new Uint8Array(b))
      .then(b => proto.root.decode(b))
      .then(root => {
        let {time, type, body} = root;
        if (body) {
          // console.log(root,'root')
          switch (type) {
            case 6: {
              const {id, L, R, ange} = proto.terminal.decode(body);
              const [disL, disR, spdL, spdR] = [L.dis, R.dis, L.spd, R.spd].map(n => n / 100);
              commit('setTerminal', {
                id, status: {
                  time, disL, disR, spdL, spdR,
                  ange: L && R ? (ange ?? 0) : null,
                }
              })
              break;
            }
            case 18: {
              let {id, mode = 0, vessel, dir} = proto.info.decode(body);
              commit('berth/setStatus', {id, status: {time, mode, vessel, dir}}, {root: true})
              break;
            }
            default:
              break;
          }
        }
      });
  },
}

// mutations
const mutations = {
  setTerminal(state, {id, status}) {
    Vue.set(state.terminal, id, status)
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}