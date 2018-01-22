import _ from './_'


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
        console.log(d[key])
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
          d[key[i]] = d[key[i]].replace(/'"/g,'')
        }
      }else{
        d[key] = d[key].replace(/'"/g,'')
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
  
  static select(data , code , name){
    let g = []
    for(var i in data){
      g.push({code:data[i][code] , name:data[i][name]})
    }
    return g
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

  static byte(v , t){
    var v = parseFloat(v)
    if(t == 'm'){
        return (v / 1024 / 1024).toFixed(2) + ' MB'
    }else if( t == 'g'){
        return (v / 1024 / 1024 / 1024).toFixed(2) + ' GB'
    }else{
      if( v > 1024 * 1024 * 1024){
        return (v / 1024 / 1024 / 1024).toFixed(2) + ' GB'
      }else if( v > 1024 * 1024 ){
        return (v / 1024 / 1024).toFixed(2) + ' MB'
      }else if(v>1024){
        return (v / 1024 ).toFixed(2) + ' KB'
      }else{
        return '< 1 KB'
      }
    }
  }

  static time(v , t){
    const z = (a) => (a < 10 ? ('0' + a) : a)

    const p = (a) => {
      var h = Math.floor(a / 3600) , 
        m = Math.floor((a - h*3600) / 60),
        s = Math.floor(a % 60)
      return [z(h),z(m),z(s)].join(':')
    }
    
    v = parseInt(v)

    if(!isNaN(v)){
      if(v < 100 * 3600){
        return p(v)
      }else{
        return Math.floor(v / 86400) + ' 天'
      }
    }else{
      return 'N/A'
    }
    
  }
}


export default Format