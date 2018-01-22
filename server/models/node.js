const dbUtils = require('./../utils/db/lowdb')

// 节点服务
const node = {
  
  async getNodes (page , limit){
    return dbUtils.get('nodes').slice(page * limit , (page+1) * limit).value()
  },
  async getNodesWithoutHistory(){
    return dbUtils.get('nodes').pickout('history').value()
  },

  async createNode (data){
    dbUtils.get('nodes').push(data).write()
  },


  async getNodesCount (){
    return dbUtils.get('nodes').size().value() || 0
  },

  async getNodeById(id){
    return dbUtils.get('nodes').find({id:id}).cloneDeep().value()
  },

  async getNodeSnapshotById(id){
    return dbUtils.get('nodes').find({id:id}).value().snapshot
  },

  async hasNode(id){
    return !!dbUtils.get('nodes').find({id:id}).value()
  },

  async updateNodeById(id , data){
    return dbUtils.get('nodes')
      .find({ id : id})
      .assign(data)
      .write()
  },

  async removeNodeById(id){
    return dbUtils.get('nodes')
    .remove({ id })
    .write()
  },

  async record(id , data){
    let doc = dbUtils.get('nodes')
      .find({ id : id})
      .value()

    if(doc == undefined){
      return 'error'
    }
    
    let { record_interval , record_limit } = doc

    let curTime = Date.now()

    let lastSaveTime = doc.time_record
    

    //一分钟保存一次历史记录
    if(doc.recordable && curTime - lastSaveTime > record_interval * 1000){

      dbUtils.get('nodes')
      .record({ id : id} , 'history' , data , record_limit)
      .write()

      lastSaveTime = curTime
    }


    dbUtils.get('nodes')
      .find({ id : id})
      .assign({snapshot:data , time_record : lastSaveTime, time_response:curTime})
      .write()

  }
}

module.exports = node