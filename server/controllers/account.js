const service = require('./../models/account')
const createToken = require('../middleware/koa-auth').create
const config = require('../config')

module.exports = {
  async setting( ctx ){
    let result = {
      message: '',
      data: config.data(),
      status: 0
    }
    
    ctx.body = result
  },

  async update( ctx , next){
    let {username , password , port} = ctx.request.body
    let result = {
      message: '',
      data: null,
      status: 0
    }

    let obj = {}
    if(username) obj.username = username
    if(password) obj.password = password
    if(port) obj.port = port

    if(obj){
      let ret = await config.save(obj)
      if(!ret){
        result.message = '保存失败'
      }else{
        result.data = {port , username}
      }
    }
    ctx.body = result
  },

  async signin( ctx , next){
    let data = ctx.request.body
    let result = {
      message: '',
      data: null,
      status: -1
    }
    let account = config.data()
    if(account.username == data.username && account.password == data.password){
      result.status = 0
      result.data = {
        token : createToken({account:data.username})
      }

    }else{
      result.message = '用户名或密码错误'
    }

    ctx.body = result

  },

}