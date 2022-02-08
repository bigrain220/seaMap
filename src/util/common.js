export const dateFormat = (date, fmt = "yyyy-MM-dd HH:mm:ss") => {
  let ret;
  let opt = {
    "y+": date.getFullYear().toString(),        // 年
    "M+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "m+": date.getMinutes().toString(),         // 分
    "s+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
    }
  }
  return fmt;
};


/**
 * 如果数组达到了指定长度，则添加新数据时会移除最开始的数据
 * @param array
 * @param data
 * @param length
 */
export const arrayLimit = (array, data, length) => {
  let ll = array.length;
  if (ll < length) {
    array.push(data);
  } else {
    array = [...array.slice(1, ll), data];
  }
  return array;
}

export const isEmptyObject = (obj) => {
  for (let name in obj) {
    return false;
  }
  return true;
};
let class2type = {};

let toString = class2type.toString;

/**
 *
 * @param obj
 * @param callback
 * @deprecated use Object.entries or forEach
 * @returns {*}
 */
export const each = function (obj, callback) {
  if (isArrayLike(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        break;
      }
    }
  } else {
    for (const [key, item] of Object.entries(obj)) {
      if (callback.call(item, key, item) === false) {
        break;
      }
    }
  }
  return obj;
};
/**
 * 确定它的参数是否是一个数字
 * @param obj
 * @return {boolean|boolean}
 */
export const isNumeric = function (obj) {

  // As of jQuery 3.0, isNumeric is limited to
  // strings and numbers (primitives or objects)
  // that can be coerced to finite numbers (gh-2662)
  let type = toType(obj);
  return (type === "number" || type === "string") &&

    // parseFloat NaNs numeric-cast false positives ("")
    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    // subtraction forces infinities to NaN
    !isNaN(obj - parseFloat(obj));
};

function isArrayLike(obj) {

  // Support: real iOS 8.2 only (not reproducible in simulator)
  // `in` check used to prevent JIT error (gh-2145)
  // hasOwn isn't used here due to false negatives
  // regarding Nodelist length in IE
  let length = !!obj && "length" in obj && obj.length,
    type = toType(obj);

  if (isFunction(obj) || isWindow(obj)) {
    return false;
  }

  return type === "array" || length === 0 ||
    typeof length === "number" && length > 0 && (length - 1) in obj;
}

function toType(obj) {
  if (obj == null) {
    return obj + "";
  }

  // Support: Android <=2.3 only (functionish RegExp)
  return typeof obj === "object" || typeof obj === "function" ?
    class2type[toString.call(obj)] || "object" :
    typeof obj;
}

function isFunction(obj) {

  // Support: Chrome <=57, Firefox <=52
  // In some browsers, typeof returns "function" for HTML <object> elements
  // (i.e., `typeof document.createElement( "object" ) === "function"`).
  // We don't want to classify *any* DOM node as a function.
  return typeof obj === "function" && typeof obj.nodeType !== "number";
}

function isWindow(obj) {
  return obj != null && obj === obj.window;
}


/**
 * 计算时间差值
 * @param start 开始时间
 * @param end 结束时间
 */
export const calcDate = function (start, end) {
  let date3 = end - start;   //时间差的毫秒数

  let hours = Math.floor(date3 / (3600 * 1000))
  //计算相差分钟数
  let leave2 = date3 % (3600 * 1000)        //计算小时数后剩余的毫秒数
  let minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数
  let leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  let seconds = Math.round(leave3 / 1000)
  return {hours, minutes, seconds}
}

export const convertWarnFlag = ({warn, status}) => {
  if (status === "CLOSED") {
    switch (warn) {
      case "NORMAL":
        return 1;
      case "ALERT":
        return 2;
      case "WARNING":
        return 3;
      default:
        return 0;
    }
  }
  return 0;
}

export const freeDateFormat =(date, format)=> {
  format = format || 'yyyy-MM-dd hh:mm:ss';
  if (date !== 'Invalid Date') {
    let o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "h+": date.getHours(), //hour
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      "S": date.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length === 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
  return '';

}