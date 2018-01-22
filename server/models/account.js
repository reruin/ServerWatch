const config = require('../config')

const account = {


  async signin( options ) {
    if(config.username == options.username && config.password == options.password){
      return {
        username : config.username,
      }
    }else{
      return null
    }
    
  },

  async update(){
    
  }
}


module.exports = account