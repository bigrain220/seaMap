import axios from 'axios';
import requestInterceptors from "@/network/requestInterceptors";
import protoRoot from '@/proto/proto';


//默认路径
// const ConfigBaseURL = 'api';
// const ConfigBaseURL = 'https://172.16.23.55:8818/';
// const ConfigBaseURL = 'https://192.168.1.240:8818/';
// const ConfigBaseURL = 'http://172.16.23.55:8080/';

const service = axios.create({
  timeout: 0,//请求超时时间
  // baseURL: ConfigBaseURL,
});

// 设置 post、put 默认 Content-Type
service.defaults.headers.post['Content-Type'] = 'application/json';
service.defaults.headers.put['Content-Type'] = 'application/json';

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    return requestInterceptors(config)
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error)
  }
);


/**
 * X-Protobuf-Message: center.Area
 * X-Protobuf-Schema: src/main/proto/vessel.proto
 */


// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    let {data} = response;
    //返回码处理
    // let {code} = data;
    // switch (code) {
    //     case 200:
    //         return data;
    //     case 401://
    // }
    data = protoHandler(response);//
    return data
  },
  (error) => {
    let info;
    if (error.response) {
      let {status, statusText, data} = error.response;
      info = {
        code: data?.code ?? status,
        msg: data?.msg ?? statusText
      }
    } else {
      info = {
        code: 5000,
        msg: error?.message ?? "Network Error"
      }
    }
    return Promise.reject(info);
  }
);

// 处理proto数据
function protoHandler(response){
  let {data,headers} = response;
  let {responseType}=response.config;
  if(responseType==="blob" && headers['content-type']=== "application/x-protobuf"){
    data = data.arrayBuffer()
        .then(b => new Uint8Array(b))
        .then(b => protoRoot.lookupType(headers['x-protobuf-message']).decode(b))
  }
  return data;
}


/**
 * 创建统一封装过的 axios 实例
 * @return
  //  */
// export default function () {
//     return service
// }
export default service;
