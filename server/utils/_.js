function hash(data, key, value) {
  var obj = {};
  key = key || 'key';
  for (var i in data) {
    if (data[i][key])
      obj[data[i][key]] = value ? data[i][value] : data[i];
  }
  return obj;
}

function extend(src, dist) {
  for (var i in dist) {
    src[i] = dist[i];
  }
  return src;
}

function fill(src , dist){
  for (var i in src) {
    src[i] = dist[i];
  }
  return src;
}

function pick(src_t, dist_t, conv_t) {

    var ret = [];
    var isarr = isArray(src_t);
    var dist = {};
    conv_t = conv_t || {};

    if (isArray(dist_t)) {
        for (var i in dist_t) {
            dist[dist_t[i]] = undefined;
        }
    }

    var src = !isarr ? [src_t] : src_t;

    for (var j = 0, l = src.length; j < l; j++) {
        var obj = {};
        for (var i in dist) {
            var k = i;
            if (conv_t[i]) k = conv_t[i];
            obj[k] = src[j][i] === null ? dist[i] : src[j][i];
        }
        ret.push(obj);
    }

    return isarr ? ret : ret[0];
}

function isEmptyObject(o) {
  for (var i in o) return false;
  return true;
}

function isValidObject(o) {
  if (isEmptyObject(o)) return false;
  for (var i in o) {
    if (o[i] === undefined) return false;
  }
  return true;
}

function isFunction(v) {
  return "function" === typeof v;
}

function isArray(v) {
  return Object.prototype.toString.call(v) === "[object Array]";
}

function isObject(v) {
  return Object.prototype.toString.call(v) === "[object Object]";
}

function isString(v) {
  return "string" === typeof v;
}

function isDate(v){
  return Object.prototype.toString.call(v) === "[object Date]";
}

function template(str, data) {
  return str.replace(/\{ *([\w_]+) *\}/g, function(str, key) {
    var value = data[key];
    if (value === undefined) {
      console.log('No value provided for variable ' + str);
      value = "{" + key + "}";
    } else if (typeof value === 'function') {
      value = value(data);
    }
    return value;
  })
}

function datetime(date, expr) {
  expr = expr || 'yyyy-MM-dd'
  var a = new Date()
  if(isDate(date)){
    a = date
  }
  else if(isString(date)){
    try{
      a = new Date(date);
    }catch(e){

    }
  }


  var y = a.getFullYear(),
    M = a.getMonth() + 1,
    d = a.getDate(),
    D = a.getDay(),
    h = a.getHours(),
    m = a.getMinutes(),
    s = a.getSeconds();

  function zeroize(v) {
    v = parseInt(v);
    return v < 10 ? "0" + v : v;
  }

  return expr.replace(/(?:s{1,2}|m{1,2}|h{1,2}|d{1,2}|M{1,4}|y{1,4})/g, function(str) {

    switch (str) {
      case 's':
        return s;
      case 'ss':
        return zeroize(s);
      case 'm':
        return m;
      case 'mm':
        return zeroize(m);
      case 'h':
        return h;
      case 'hh':
        return zeroize(h);
      case 'd':
        return d;
      case 'dd':
        return zeroize(d);
      case 'M':
        return M;
      case 'MM':
        return zeroize(M);
      case 'MMMM':
        return ['十二', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一'][m] + '月';
      case 'yy':
        return String(y).substr(2);
      case 'yyyy':
        return y;
      default:
        return str.substr(1, str.length - 2);
    }
  });
}

function base64(a){
  return new Buffer(a,'base64').toString()
}

module.exports = {
  hash,
  extend,
  fill,
  pick,
  isFunction,
  isArray,
  isObject,
  isString,
  template,
  datetime,
  base64
}