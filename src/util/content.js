import {BERTH, USER_DATA} from "@/store/mutations/mutations_type";

export const getToken = () => {
  let data = getUser();
  if (data) {
    return data['token'];
  }
  return null;
};

export const setToken = (userName, token) => {
  localStorage.setItem(USER_DATA, JSON.stringify({user: userName, token: token}));
};

export const removeToken = () => {
  localStorage.removeItem(USER_DATA);
};

export const getUser = () => {
  let data = localStorage.getItem(USER_DATA);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

export const getBerth = () => {
  let berth = localStorage.getItem(BERTH);
  if (berth) {
    return JSON.parse(berth);
  }
  return null;
};

export const setBerth = (berth) => {
  localStorage.setItem(BERTH, JSON.stringify(berth));
}

export const removeBerth = () => {
  localStorage.removeItem(BERTH);
};

export const vesselSets = [
  {name: "邮轮", file: "OIL"},
  {name: "天然气船", file: "LNG"},
  {name: "集装箱船", file: "Carrier"},
  {name: "散货船", file: "Container"}
];

/**
 * @param vesselType{number} 0:邮轮,1:天然气船,2:集装箱船,3:散货船
 */
export function getVesselTypeStrByType(vesselType) {
  return vesselSets[vesselType]?.name;
}

/**
 * 根据类型获取船舶文件(svg图)名称
 *  @param vesselType{number} 0:邮轮,1:天然气船,2:集装箱船,3:散货船
 *  @param dir 靠泊方向  L为左舷靠泊 R为右舷靠泊
 */
export function getVesselFileByType(vesselType, dir = "L") {
  let file = vesselSets[vesselType]?.file;
  return file && `${file}_${dir}`;
}

/**
 * 0:off（关闭）; 1:Approach（靠泊）; 2:Mooring（漂移）; 3:Departure（离泊）
 * @param mode 0，1，2，3
 */
export function strDockingMode(mode) {
  switch (mode) {
    case 1:
      return "Approach";
    case 2:
      return "Mooring";
    case 3:
      return "Departure";
    default:
      return "OFF";
  }
}

/**
 * 1表示左舷靠泊 0表示右舷靠泊
 * @param direction 0,1
 */
export function getDockingDirectionStr(direction) {
  switch (direction + '') {
    case '0':
      return "右舷靠泊";
    case '1':
      return "左舷靠泊";
    default:
  }
}

/**
 * 计算护舷垫挤压值应该显示什么颜色
 * @param value 护舷垫挤压值
 */
export function squeezeValueColor(value) {
  value = value - 0;
  if (value >= 0) {//无挤压
    return "";
  }
  if (value >= -0.5 && value < 0) {
    return 'green';
  } else if (value >= -1 && value < -0.5) {
    return 'yellow';
  } else if (value < -1) {
    return "red";
  }
}

/**
 * 计算漂移量应该显示什么颜色
 * @param value 护舷垫挤压值
 */
export function mooringValueColor(value) {
  value = value - 0;
  if (value >= 0 && value < 1) {
    return 'green';
  } else if (value >= 1 && value < 2) {
    return 'yellow';
  } else if (value >= 2) {
    return "red";
  }
}

/**
 * 左速度或右速度的着色
 * @param speed
 * @return {string}
 */
export function getSpeedColor(speed) {
  let normal = 20, alert = 40, warn = 50;
  speed -= 0;
  if (speed >= 0 && speed <= normal) {
    return "green";
  } else if (speed > normal && speed <= alert) {
    return "yellow";
  } else if (speed > alert) {
    return "red";
  }
}

/**
 * 角度的着色
 * @param angle
 * @return {string}
 */
export function getAngleColor(angle) {
  let normal = 10, alert = 20, warn = 50;
  angle -= 0;
  if (angle >= 0 && angle <= normal) {
    return "green";
  } else if (angle > normal && angle <= alert) {
    return "yellow";
  } else if (angle > alert) {
    return "red";
  }
}

/**
 * 把对象内的所有属性置空
 * Vue组件销毁后 data中的某些对象可能不会被回收 故需要手动置null
 * @param Obj
 */
export function deleteObj(Obj) {
  for (let key in Obj) {
    if (Obj.hasOwnProperty(key)) {
      Obj[key] = null;
    }
  }
}

/**
 * 保留places位小数 默认是2位
 * @param {number} number
 * @param {number} places--整数  保留到第几位小数
 */
export function keepDecimal(number, places = 2) {
  if (typeof (number) !== 'number') {
    throw '参数不是数字类型';
  }
  const n = Math.pow(10, places);
  return Math.floor(number * n) / n;
}