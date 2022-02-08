import request from "@/network/index";
import {Message} from "element-ui";


let ReconnectingWebSocket = require('@/assets/js/reconnecting-websocket');

let apiNodeName="/nodeApi"
let apiZhaoName="/seaMapApi"
let apiCaoName="/attentionApi"

const env = process.env.NODE_ENV;
if(env === "production"){
    apiNodeName="";
    apiZhaoName="";
    apiCaoName="";
}


export const loginAPI = (username, password) => {
    return request.post(`${apiZhaoName}/login`, null,{username,password})
};

export const getAllShipApi = () => {
    // return  request.get(`${apiZhaoName}/ais/area`,null,null,{responseType: "blob"});
    return request.get(`${apiNodeName}/ais/area`);
};

export const getAttentionApi = () => {
    return request.get(`${apiNodeName}/focus`,);
};
// mmsi customName
export const setAttentionApi = (data) => {
    return request.put(`${apiZhaoName}/focus`,null,data);
};
// userId mmsi
export const delAttentionApi = (data) => {
    return request.delete(`${apiZhaoName}/focus`,data);
};

export const getSchedulerEventsApi = (data) => {
    return request.get(`${apiNodeName}/schedule`,data);
};

export const getSchedulerResourceApi = (data) => {
    return request.get(`${apiNodeName}/ais/getScheduler1`,data);
};

export const autoSchedulerApi = (data) => {
    return request.post(`${apiZhaoName}/schedule/auto`,data);
};

export const saveSchedulerApi = (data) => {
    return request.post(`${apiZhaoName}/schedule`,data);
};

// vid=1&wid=3&dst=1&start=1640159236000&dock=1640159336000&leave=1640159436000&end=1640159536000
export const saveEventApi = (data) => {
    return request.put(`${apiZhaoName}/schedule`,data);
};

// mmsi=4132212&dis=500
export const getCircleApi = (params) => {
    return request.get(`${apiZhaoName}/ais/track`,params);
};

// id
export const getPathApi = (params) => {
    return request.get(`${apiNodeName}/seaways/getUserSeaways`,params);
};

export const updatePathApi = (data) => {
    return request.post(`${apiZhaoName}/seaways`,data);
};
//id
export const deletePathApi = (params) => {
    return request.delete(`${apiZhaoName}/seaways`,params);
};

// mmsi startTime startTime
export const getTrackApi = (params) => {
    return request.get(`${apiZhaoName}/track`,params);
};

// Websocket
let baseUrl = "ws://172.16.20.39:3030";

export const testWebsocket = function () {
    return new ReconnectingWebSocket(`${baseUrl}/socketTest`);
}
// 使用例子
// const socket = testWebsocket();
// socket.onopen = () => {
//   websocketSend(socket,'一连接我就发到服务去了')
// };
// socket.onmessage = (msg) =>{console.log(msg)}

/**
 * 通过websocket向服务端发送消息
 * @param {WebSocket|ReconnectingWebSocket} websocketObj websocket对象
 * @param message 要发送的消息
 */
export function websocketSend(websocketObj, message) {
    if (websocketObj) {
        const state = websocketObj.readyState;
        switch (state) {
            case WebSocket.CONNECTING:
                Message.error("正在与服务器连接中。请稍后再试");
                break;
            case WebSocket.OPEN:
                websocketObj.send(message);
                break;
            case WebSocket.CLOSING:
                Message.error("连接关闭中。请刷新页面再尝试");
                break;
            case WebSocket.CLOSED:
                Message.error("连接已被关闭！");
                break;
        }
    } else {
        throw 'websocketObj is ' + websocketObj;
    }
}
