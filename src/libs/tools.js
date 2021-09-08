export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
  let len = Math.min(arr1.length, arr2.length)
  let i = -1
  let res = []
  while (++i < len) {
    const item = arr2[i]
    if (arr1.indexOf(item) > -1) res.push(item)
  }
  return res
}

/**
 * 判断当前变量是不是数组
 * @param param
 * @returns {arg is Array<any>|boolean}
 */
export const isArr = (param) => {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(param)
  } else {
    return Object.prototype.toString.call(param) === '[object Array]'
  }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1)
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export const oneOf = (value, validList) => {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

/**
 * 和PHP一样的时间戳格式化函数
 * @param {string} format 格式
 * @param {int} timestamp 要格式化的时间 默认为当前时间
 * @return {string}   格式化的时间字符串
 */
export const formatDate = (format, timestamp) => {
  let jsDate = ((timestamp) ? new Date(timestamp * 1000) : new Date())
  let pad = function (n, c) {
    if ((n = n + '').length < c) {
      return new Array(++c - n.length).join('0') + n
    } else {
      return n
    }
  }
  let txt_weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let txt_ord_in = { 1: 'st', 2: 'nd', 3: 'rd', 21: 'st', 22: 'nd', 23: 'rd', 31: 'st' }
  let txt_months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let f = {
    d: function () {
      return pad(f.j(), 2)
    },
    D: function () {
      return f.l().substr(0, 3)
    },
    j: function () {
      return jsDate.getDate()
    },
    l: function () {
      return txt_weekdays[f.w()]
    },
    N: function () {
      return f.w() + 1
    },
    S: function () {
      return txt_ord_in[f.j()] ? txt_ord_in[f.j()] : 'th'
    },
    w: function () {
      return jsDate.getDay()
    },
    z: function () {
      return (jsDate - new Date(jsDate.getFullYear() + '/1/1')) / 864e5 >> 0
    },
    W: function () {
      let a = f.z()
      let b = 364 + f.L() - a
      let nd2
      let nd = (new Date(jsDate.getFullYear() + '/1/1').getDay() || 7) - 1
      if (b <= 2 && ((jsDate.getDay() || 7) - 1) <= 2 - b) {
        return 1
      } else {
        if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
          nd2 = new Date(jsDate.getFullYear() - 1 + '/12/31')
          return date('W', Math.round(nd2.getTime() / 1000))
        } else {
          return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0)
        }
      }
    },
    F: function () {
      return txt_months[f.n()]
    },
    m: function () {
      return pad(f.n(), 2)
    },
    M: function () {
      return f.F().substr(0, 3)
    },
    n: function () {
      return jsDate.getMonth() + 1
    },
    t: function () {
      let n
      if ((n = jsDate.getMonth() + 1) === 2) {
        return 28 + f.L()
      } else {
        // eslint-disable-next-line no-mixed-operators
        if (n & 1 && n < 8 || !(n & 1) && n > 7) {
          return 31
        } else {
          return 30
        }
      }
    },
    L: function () {
      let y = f.Y()
      return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0
    },
    Y: function () {
      return jsDate.getFullYear()
    },
    y: function () {
      return (jsDate.getFullYear() + '').slice(2)
    },
    a: function () {
      return jsDate.getHours() > 11 ? 'pm' : 'am'
    },
    A: function () {
      return f.a().toUpperCase()
    },
    B: function () {
      let off = (jsDate.getTimezoneOffset() + 60) * 60
      let theSeconds = (jsDate.getHours() * 3600) + (jsDate.getMinutes() * 60) + jsDate.getSeconds() + off
      let beat = Math.floor(theSeconds / 86.4)
      if (beat > 1000) beat -= 1000
      if (beat < 0) beat += 1000
      if ((String(beat)).length === 1) beat = '00' + beat
      if ((String(beat)).length === 2) beat = '0' + beat
      return beat
    },
    g: function () {
      return jsDate.getHours() % 12 || 12
    },
    G: function () {
      return jsDate.getHours()
    },
    h: function () {
      return pad(f.g(), 2)
    },
    H: function () {
      return pad(jsDate.getHours(), 2)
    },
    i: function () {
      return pad(jsDate.getMinutes(), 2)
    },
    s: function () {
      return pad(jsDate.getSeconds(), 2)
    },
    O: function () {
      let t = pad(Math.abs(jsDate.getTimezoneOffset() / 60 * 100), 4)
      if (jsDate.getTimezoneOffset() > 0) t = '-' + t; else t = '+' + t
      return t
    },
    P: function () {
      let O = f.O()
      return (O.substr(0, 3) + ':' + O.substr(3, 2))
    },
    c: function () {
      return f.Y() + '-' + f.m() + '-' + f.d() + 'T' + f.h() + ':' + f.i() + ':' + f.s() + f.P()
    },
    U: function () {
      return Math.round(jsDate.getTime() / 1000)
    }
  }

  let exp = /[\\]?([a-zA-Z])/g
  return format.replace(exp, function (t, s) {
    let ret = ''
    if (t !== s) {
      ret = s
    } else if (f[s]) {
      ret = f[s]()
    } else {
      ret = s
    }
    return ret
  })
}

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1
  }
  if (isExplorer('MSIE')) return 'IE'
  else if (isExplorer('Firefox')) return 'Firefox'
  else if (isExplorer('Chrome')) return 'Chrome'
  else if (isExplorer('Opera')) return 'Opera'
  else if (isExplorer('Safari')) return 'Safari'
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj
  else {
    let keysArr = Object.keys(obj)
    return keysArr.length
  }
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key])
}
