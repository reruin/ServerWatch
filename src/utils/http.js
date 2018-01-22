import axios from 'axios'

var host = '';

var token = ''

function serialize(obj) {
  var arr = [];
  for (var i in obj) {
    arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]))
  }
  return arr.join('&');
}

function url_(u) {
  return host + u
}

function get_(url, data) {
  return request('GET', url, data)
}

function post(url, data, format) {
  return request('POST', url, data, format);
}

function put(url, data) {
  return request('PUT', url, data);
}

function request(type, url, data, format) {

  var req = {
    method: type,
    url: url_(url, data, false)
  }

  var headers = {}
  if (token) {
    headers.Authorization = token;
  }

  if (type == 'GET') {
    req.params = data
  } else {
    req.data = data

    if (format === undefined) format = 'json';

    if (format == 'urlencode') {
      req.data = serialize(data);
      headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    } else if (format == 'xml') {
      headers['Content-Type'] = 'text/xml'
    } else if (format == 'json') {
      headers['Content-Type'] = 'application/json'
    }
  }

  req.headers = headers

  return axios(req).then(function(response) {
    return response.data
  }).catch((error) => {
    const { response } = error
    let msg, statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      msg = data.message || statusText
    } else {
      statusCode = -1
      msg = error.message || 'Network Error'
    }
    return Promise.reject({ status: statusCode, message: msg })
  })
}

function setInterceptor(i) {
  if (i.request) {
    axios.interceptors.request.use(i.request, i.request)
  }
  if (i.response) {
    axios.interceptors.response.use(i.response, i.response)
  }
}

function setToken(v) {
  token = v
}

function setHost(v) {
  host = v
}


export default {
  get: get_,
  post,
  setToken,
  setHost,
  setInterceptor
}