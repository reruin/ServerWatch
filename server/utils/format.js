const _ = require('./_')

const dep = {
  status: [
    { code: '0', name: '启用' },
    { code: '1', name: '禁用' }
  ]
}

class Format {
  static unescape(obj) {
    for (var i in obj) {
      if (obj[i] && typeof(obj[i]) == 'string') {
        obj[i] = unescape(obj[i]);
      }
    }
    return obj;
  }

  static index(data, key) {
    key = key || '@';
    for (var i = data.length - 1; i >= 0; i--) {
      data[i][key] = i + 1;
    }
  }

  static parseInt(data, deps){
    for (var i = deps.length - 1; i >= 0; i--) {
      data[deps[i]] = parseInt(data[deps[i]])
    }
  }

  static conv(data, deps, fix) {
    if (!data) return data

    fix = '_' + (fix || 'name');

    if (typeof(data) == 'string' || typeof(data) == 'number') {
      var h = _.hash(deps, id, label);
      return h[data];
    }

    var is_obj = false;
    if (_.isArray(data) == false) {
      is_obj = true;
      data = [data];
    }

    if (_.isString(deps)) {
      var t = deps;
      deps = {};
      deps[t] = t;
    }

    for (var j in deps) {
      var key = deps[j];
      var s = dep[key];
      if (s) {
        var h = _.hash(s, 'code', 'name');
        for (var i in data) {
          if (j in data[i]) {
            data[i][j + fix] = h[data[i][j]];
          }
        }
      }

    }
    return is_obj ? data[0] : data;
  }

  static datetime(data , key){
    var isArr = _.isArray(key)
    var process = function(d){
      if(isArr){
        for(var i in key){
          d[key[i]] = _.datetime( d[key[i]],'yyyy-MM-dd hh:mm:ss')
        }
      }else{
        d[key] = _.datetime( d[key],'yyyy-MM-dd hh:mm:ss')
      }
    }

    if(_.isArray(data)){
      for(var i in data){
        process(data[i])
      }
    }
    
    else if(_.isObject(data)){
      process(data)
    }
    
  }

  static string(data , key){
    var isArr = _.isArray(key)
    var process = function(d){
      if(isArr){
        for(var i in key){
          d[key[i]] = String( d[key[i]] )
        }
      }else{
        d[key] = String( d[key] )
      }
    }

    if(_.isArray(data)){
      for(var i in data){
        process(data[i])
      }
    }
    
    else if(_.isObject(data)){
      process(data)
    }
  }

  static trim(data , key){
    var isArr = _.isArray(key)
    var process = function(d){
      if(isArr){
        for(var i in key){
          d[key[i]] = d[key[i]].replace(/['"]/g,'')
        }
      }else{
        d[key] = d[key].replace(/['"]/g,'')
      }
    }

    if(_.isArray(data)){
      for(var i in data){
        process(data[i])
      }
    }
    
    else if(_.isObject(data)){
      process(data)
    }
  }

  static timezone(d){
    var  lt = new Date();
    var d = new Date(lt.getTime()-(lt.getTimezoneOffset()*60000));

    var process = function(d){
      d[key] = _.datetime(d[key],'yyyy-MM-dd hh:mm:ss')
    }
    if(_.isArray(data)){
      for(var i in data){
        data[i][key] = _.datetime(data[i],'yyyy-MM-dd hh:mm:ss')
      }
    }
    else if(_.isObject(data)){
      _.datetime(data , 'yyyy-MM-dd hh:mm:ss')
    }
  }

  static select(data , code , name){
    let g = []
    for(var i in data){
      g.push({code:data[i]['code'] , name:data[i]['name']})
    }
    return g
  }
}

module.exports = Format

