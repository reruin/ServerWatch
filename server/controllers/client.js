const service = require('./../models/node')
const fs = require('fs')
const _ = require('../utils/_')
const format = require('../utils/format')
const path = require('path')

const createInterval = (v)=>{
  if(/\*/.test(v)){
    return '("'+v+'")'
  }else{
    return '("* * * * * sleep '+ new Array(Math.floor(60 / v)).fill(0).map((_,j)=>(j * v)).join(';" "* * * * * sleep ') + '")'
  }
}

module.exports = {

  async install(ctx) {

    let id = ctx.params.id

    let interval = 5

    

    if(id){
      let obj = await service.getNodeById(id)
      if(obj){
        let sh = fs.readFileSync(path.join(__dirname, '../shell/install.sh'),'utf-8')

        let host = ctx.origin + '/client/agent/' + id

        let update_interval = obj.update_interval

        sh = sh.replace(/__HOST__/g , host)
              .replace('__TOKEN__',id)
              // .replace('__INTERVAL__','10 20 30 40 50 60')
              .replace('__INTERVAL__',createInterval(update_interval))
        ctx.body = sh
      }else{
        ctx.status = 403
      }
    }else{
      ctx.status = 403
    }
    
  },

  async uninstall(ctx){
    let id = ctx.params.id
    if(id){
      let isValid = await service.hasNode(id)
      if(isValid){
        let sh = fs.readFileSync(path.join(__dirname, '../shell/uninstall.sh'),'utf-8')

        let host = ctx.origin + '/client/remove/' + id

        sh = sh.replace(/__HOST__/g , host)
              .replace('__TOKEN__',id)

        ctx.body = sh
      }else{
        ctx.status = 403
      }
    }else{
      ctx.status = 403
    }
  },

  async agent(ctx){
    let id = ctx.params.id

    if(id){

      let isValid = await service.hasNode(id)

      if(isValid){

        let { data } = ctx.request.body
        let [ip , location , isp ] = ['','','']
        if(data){
          data = _.base64(data);
          [,ip,, location, isp] = data.split(/(?:：|\s{2,})/)
        }

        let sh = fs.readFileSync(path.join(__dirname, '../shell/agent.sh'),'utf-8')

        let host = ctx.origin + '/client/update'

        sh = sh.replace(/__HOST__/g , host)

        service.updateNodeById(id , {
          installed:true , ip , location , isp
        })

        ctx.body = sh

      }else{

      }

    }else{

    }
    
  },

  async update(ctx){
    let {token , data} = ctx.request.body

    let doc = await service.hasNode( token )
    if(doc){
      let ds = data.split(' ')

      let field = ['uptime','sessions','processes','processes_array','file_handles','file_handles_limit','os_kernel','os_name','os_arch','cpu_name','cpu_cores','cpu_freq','ram_total','ram_usage','swap_total','swap_usage','disk_array','disk_total','disk_usage','connections','nic','ipv4','ipv6','rx','tx','rx_gap','tx_gap','load','load_cpu','load_io']

      let snapshot = {} , online = true

      for(let i = 0 ; i<ds.length ; i++){
        if(field[i]){
          snapshot[field[i]] = ds[i] ? _.base64(ds[i]) : ''
        }
      }

      format.parseInt(snapshot , ['cpu_cores','ram_total','ram_usage','swap_total','swap_usage','disk_total','disk_usage','rx','tx','rx_gap','tx_gap','sessions','file_handles','file_handles_limit','connections','processes'])
      snapshot.timestamp = Date.now()
      service.record(token , snapshot)
      
      ctx.body = 'success'
    }else{
      ctx.body = 'miss token'
      ctx.status = 403
    }

  },

  async remove(ctx){
    let id = ctx.params.id

    service.removeNodeById( id )
    
    ctx.body = 'success'

  }
}