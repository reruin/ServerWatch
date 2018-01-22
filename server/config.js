const fs = require('fs')
const os = require('os')

const config_path = process.cwd() +'/config.json'

var cfg = {
  "username":"admin",
  "password":"admin",
  "port":51221
}

var app , handler


function getIpv4() {
  var ifaces = os.networkInterfaces();
  for (var dev in ifaces) {
      for (var i in ifaces[dev]) {
          var details = ifaces[dev][i];
          if (/^\d+\./.test(details.address)) {
              return details.address;
          }
      }
  }
}


function init(instance){
  app = instance

  fs.exists(config_path, (exists) => {
    if (exists) {
      fs.readFile(config_path, 'utf-8', (err, data) => {
        try{
          cfg = JSON.parse(data)
        }catch(e){

        }
        launcher(cfg)
      })
    }else{
      launcher(cfg)
    }
  })
}

function launcher(cfg){
  handler = app.listen(cfg.port)
  console.log(new Date().toISOString())
  console.log('App is running at http://'+getIpv4()+':'+cfg.port+'/')
}

function data(){
  return cfg
}

async function save(d){
  let str = JSON.stringify( d )

  if(d.port != cfg.port && handler){
    handler.close()
    launcher(d)
  }

  if(str.replace(/[\{\}\s]+/,'') == ''){
    return false
  }

  cfg = d
  return new Promise((resolve, reject) => {
    fs.writeFile(config_path, str, function(err) {
      if (err) {
        console.log(err,'save config error')
      } else {
        console.log('save config success')
      }
      resolve(true)
    })
  })
}


module.exports = {
  init, data, save , launcher
}