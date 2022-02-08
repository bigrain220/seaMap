import request from "@/network/index";

export const login = (userName, passWord) => {
  let url = 'auth/login';
  let param = {username: userName, password: passWord};
  return request.post(url, param)
};

export const logout = () => {
  let url = 'auth/logout';
  return request.get(url);
};

export const refreshToken = () => {
  let url = 'auth/refreshToken';
  return request.post(url);
};

/**
 * 获取历史记录
 * @param startTime  起始的时间戳
 * @param endTime 结束的时间戳
 * @param type 要查询的类型  为空则为全部 可选字段有  wind|wave|temperature|humidity|pressure|current|tide|visibility|rain
 * @return {Promise<AxiosResponse<T>>}
 */
export const getEnvHistory = (startTime, endTime, type) => {
  let url = 'getEnvHistory';
  let data = {start: startTime, end: endTime};
  if (type) {
    data.type = type;
  }
  return request.get(url, data);
};
/**
 * @interface NewtonServiceDTO
 * @param {String} moduleName--模块名
 * @param {String} serviceName--服务名
 * @param {String} serviceType--服务类型 有 COM_PORT、WIND、LASER、HUMIDITY等
 * @param {number} alert--浮点型 预警值
 * @param {number} warn--浮点型  报警值
 * @param {number} status-- 整型  状态
 */
/**
 * 获取各模块的配置情况
 * @return {Promise<AxiosResponse<NewtonServiceDTO>>}
 */
export const getNewton = () => {
  let url = 'getNewton';
  return request.get(url);
};

export const getWarn = (condition) => {
  let url = 'warn/getWarn';
  return request.post(url, condition);
};
/**
 * 获取所有泊位
 * @deprecated 该方法被 Vuex 管理
 * @see /store/berth
 */
export const getBerthList = (condition) => {
  return {};
};

/**
 * @deprecated 该方法被 Vuex 管理
 * @see /store/berth
 */
export const getAllBerth = () => {
  return {};
};

/**
 *  获取对应id的泊位
 * @deprecated 该方法被 Vuex 管理
 * @see /store/berth
 */
export const getBerthById = (id) => {
  return {};
};

/**
 *  获取所有泊位名称及Id
 * @deprecated 该方法被 Vuex 管理
 * @see /store/berth
 */
export const getBerthSelect = () => {
  return {};
};

/**
 * 获取所有船
 * @returns
 */
export const listVessel = () => {
  let url = 'vessels/list';
  return request.get(url);
};

/**
 * 获取所有船 分页
 * @returns
 */
export const vesselPage = (condition) => {
  let url = 'vessels/page';
  return request.post(url, condition);
};

/**
 *  新增一艘船
 * @param vesselObject 对象{imoNumber:'',name:'',vesselsType:'',vesselsTypeStr:'',color:'',remark:'',width:'',length:''}
 */
export const createVessel = (vesselObject) => {
  let url = 'vessels/create';
  return request.post(url, vesselObject)
};

/**
 *更新一艘船
 * @param vesselObject 对象{imoNumber:'',name:'',vesselsType:'',vesselsTypeStr:'',color:'',remark:'',width:'',length:''}
 */
export const updateVessel = (vesselObject) => {
  let url = 'vessels/update';
  return request.put(url, vesselObject)
};
/**
 * 删除一艘船
 * @param id 船舶id
 * @returns {Promise<AxiosResponse<T>>}
 */
export const deleteVessel = (id) => {
  let url = 'vessels/delete/' + id;
  return request.delete(url);
};
/**
 * 获取船舶的所有类型
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getVesselsType = () => {
  let url = 'vessels/getType';
  return request.get(url);
};
/**
 * 开启靠泊
 * @param berthId 泊位id
 * @param vesselId 船舶id
 * @param dockDirection 靠泊方向 0:右舷靠泊  1:左舷靠泊
 */
export const startBerthing = (berthId, vesselId, dockDirection) => {
  let url = 'docking/start';
  let date = new Date().getTime();
  let dockingRecord = {
    berthId: berthId,
    vesselsId: vesselId,
    dockDirection: dockDirection,
    arriveTime: date
  };
  return request.post(url, dockingRecord);
};

/**
 * 结束靠泊
 * @param berthId  泊位id
 */
export const stopBerthing = (berthId) => {
  let url = 'docking/stop';
  let date = new Date().getTime();
  let dockingRecord = {
    berthId,
    departureTime: date
  };
  return request.post(url, dockingRecord);
};
/**
 * 查询靠泊历史
 * @param pageCondition {conditions:{查询条件},page:第几页,size:条数}
 */
export const dockingHistoryList = (pageCondition) => {
  let url = 'docking/page';
  return request.post(url, pageCondition);
};
/**
 * 根据靠泊历史记录id获取靠泊数据
 * @param dockingHistoryId 靠泊记录id
 */
export const getPlayBackHistoryData = (dockingHistoryId) => {
  let url = `docking/playback/${dockingHistoryId}`;
  return request.get(url)
};
/**
 * 靠泊统计报表
 * @param dockingId
 */
export const getApproachStatisticsReport = (dockingId) => {
  let url = `docking/getApproachStatisticsReport/${dockingId}`;
  return request.get(url);
}
/**
 * 离泊统计报表
 * @param dockingId
 */
export const getDepartureStatisticsReport = (dockingId) => {
  let url = `docking/getDepartureStatisticsReport/${dockingId}`;
  return request.get(url);
}
/**
 * 漂移统计报表
 * @param dockingId
 */
export const getMooringStatisticsReport = (dockingId) => {
  let url = `docking/getMooringStatisticsReport/${dockingId}`;
  return request.get(url);
}
/**
 * 漂移详细报表
 * @param dockingId
 * @param pageNum 页码
 */
export const getMooringDetailReport = (dockingId, pageNum) => {
  let url = `docking/getMooringDetailReport/${dockingId}/${pageNum}`;
  return request.get(url);
}
/**
 * 靠泊详细报表
 * @param dockingId
 * @param pageNum 页码
 */
export const getApproachDetailReport = (dockingId, pageNum) => {
  let url = `docking/getApproachDetailReport/${dockingId}/${pageNum}`;
  return request.get(url);
}
/**
 * 离泊详细报表
 * @param dockingId
 * @param pageNum 页码
 */
export const getDepartureDetailReport = (dockingId, pageNum) => {
  let url = `docking/getDepartureDetailReport/${dockingId}/${pageNum}`;
  return request.get(url);
}
/**
 * 漂移详细数据(不分页)
 * 和分页不同的是收到的数据结构不同
 * @param dockingId
 * @return {Promise<AxiosResponse<any>>}
 */
export const getAllMooringDetailReport = (dockingId) => {
  let url = `docking/getMooringDetailReport/${dockingId}`;
  return request.get(url);
}
/**
 * 离泊详细数据(不分页)
 * 和分页不同的是收到的数据结构不同
 * @param dockingId
 * @return {Promise<AxiosResponse<any>>}
 */
export const getAllDepartureDetailReport = (dockingId) => {
  let url = `docking/getDepartureDetailReport/${dockingId}`;
  return request.get(url);
}
/**
 * 靠泊详细数据(不分页)
 * 和分页不同的是收到的数据结构不同
 * @param dockingId
 * @return {Promise<AxiosResponse<any>>}
 */
export const getAllApproachDetailReport = (dockingId) => {
  let url = `docking/getApproachDetailReport/${dockingId}`;
  return request.get(url);
}

/**
 * 用户列表 （分页）
 * @param condition 分页参数
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getUserPage = (condition) => {
  let url = `authority/user/page`;
  return request.post(url, condition);
}


/**
 * 角色列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoleList = () => {
  let url = `authority/roleList`;
  return request.get(url);
}

export const updateUser = (user) => {
  let url = `authority/update/user/${user.id}`;
  return request.post(url, user);
}

export const createUser = (user) => {
  let url = `authority/user`;
  return request.put(url, user);
}

export const deleteUser = (id) => {
  let url = `authority/user/${id}`;
  return request.delete(url);
}

export const createRole = (role) => {
  let url = `authority/role`;
  return request.put(url, role);
}

export const updateRole = (role) => {
  let url = `authority/updateRole`;
  return request.post(url, role);
}

export const deleteRole = (id) => {
  let url = `authority/role/${id}`
  return request.delete(url)

}

// 镇海项目获取环境数据
export const getAllEnvInfoApi = () => {
  let url = `getAllEnvInfo`;
  return request.get(url);
}