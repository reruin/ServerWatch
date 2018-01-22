let json_ = (ctx , code , msg) => {
  let result = {
    status: code,
    message: msg,
    data: null,
  }

  ctx.type = 'application/json'

  ctx.body = result
}

let success = (ctx , cnt) => {
  ctx.type = 'application/json'
  ctx.body = {
    status: 0,
    message: '',
    data: cnt,
  }
}

module.exports = {
  json:json_,
  success
}