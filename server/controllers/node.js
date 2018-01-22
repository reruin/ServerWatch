const service = require('./../models/node')
const shortid = require('shortid')
const _ = require('../utils/_')

const getShell = (f)=>{
 return 'wget --no-check-certificate -qO- '+f+' | bash'
}


module.exports = {

  async list(ctx) {
    let result = {
      status: 0,
      message: '',
      data: null,
    }

    let data = await service.getNodesWithoutHistory()
    let now = Date.now()
    data.forEach((i)=>{
      i.online = now - i.time_response < 1000 * 30 
    })
    
    result.data = data

    ctx.body = result

  },

  async queryBase(ctx){
    let result = {
      status: 0,
      message: '',
      data: null,
    }

    let id = ctx.params.id

    let data = await service.getNodeById(id)

    if(data){
      result.data = {
        id : data.id,
        label : data.label ,
        installed : data.installed,
        update_interval:data.update_interval,
        record_interval:data.record_interval,
        record_limit : data.record_limit,
        recordable : data.recordable,
        uninstall_script : getShell(ctx.origin+'/client/uninstall/'+data.id ),
        install_script : getShell(ctx.origin+'/client/install/'+data.id)
      }
    }else{
      result.status = 412
      result.message = '没有匹配的数据'
    }
    
    ctx.body = result
  },

  async queryLatest(ctx){
    let result = {
      status: 0,
      message: '',
      data: null,
    }

    let id = ctx.params.id

    let data = await service.getNodeSnapshotById(id)

    result.data = data
    
    ctx.body = result
  },

  async query(ctx){
    let result = {
      status: 0,
      message: '',
      data: null,
    }

    let id = ctx.params.id

    let data = await service.getNodeById(id)

    if(data){
      if(!data.installed){
        data.script = getShell(ctx.origin+'/client/install/'+data.id)
        delete data.history
      }
      result.data = data
    }else{
      result.status = 412
      result.message = '无数据'
    }

    ctx.body = result
  },

  async update(ctx){
    let result = {
      status: 0,
      message: '成功',
      data: null,
    }
    let id = ctx.params.id

    if(await service.hasNode(id)){
      let id = ctx.params.id
      let form = ctx.request.body

      form.recordable = form.recordable == '1' ? 1 : 0
      if(!form.recordable){
        form.history = []
      }

      let data = await service.updateNodeById(id , form)
      ctx.body = result
    }else{
      result.message = '没有匹配的数据'
      result.status = 412
    }
    
  },

  async create(ctx){
    let result = {
      status: 0,
      message: '成功',
      data: null,
    }

    let form = ctx.request.body

    form.installed = false

    let data = {
      id:shortid.generate(),
      label : form.label,
      ip:'',
      location:'',
      isp:'',
      remark : form.remark,
      online : false,
      installed : false,
      time_response:0,
      time_record:0,
      update_interval:form.update_interval,
      record_interval:form.record_interval,
      record_limit : form.record_limit,
      history:[],
      snapshot:{}
    }

    await service.createNode(data)

    result.data = {
      id : data.id
    }
    ctx.body = result
  },

  async remove(ctx){
    let result = {
      status: 0,
      message: '成功',
      data: null,
    }

    let id = ctx.params.id

    let data = await service.removeNodeById(id)
    if(data){

    }else{
      result.status = 412
      result.message = '删除失败'
    }

    ctx.body = result

  }
}