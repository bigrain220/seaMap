import {Message} from "element-ui";

let ReconnectingWebSocket = require('@/assets/js/reconnecting-websocket');

// let baseUrl = "wss://172.16.20.241:8818";
// let baseUrl = "wss://192.168.1.240:8818";
// let baseUrl = "ws://192.168.1.240/api";
/////
let baseUrl = "wss://127.0.0.1:8818";

function fillUrl(url) {
  return baseUrl + url;
}

export const environmentWebsocket = function () {
  return new ReconnectingWebSocket(fillUrl("/sub/service"));
}

export const dockingWebSocket = () => {
  return new ReconnectingWebSocket(fillUrl(`/sub/berth`));
};

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