import tpl from './index.html'
import angular from 'angular'
import http from '../../utils/http'
import { message } from '../../config/sl'

class Setting {
  //依赖
  constructor(session , $state) {
    this.session = session
    this.$state = $state
    this.data = {
      username : '',
      password : '',
      port : ''
    }
  }

  $onInit(){
    http.get('/api/setting').then((resp) => {
      if(!resp.status){
        this.data = resp.data
        this.origin_port = this.data.port
      }else{
        message.error(resp.message)
      }
    })
  }

  update() {
    http.post('/api/setting' ,this.data).then((resp) => {
      if(!resp.status){
        message.success('修改成功,请重新登录');
        this.session.destory()
        var link = location.protocol + '//' + location.hostname + ':' + resp.data.port + '/signin'
        if(this.origin_port != resp.data.port){
          location.href = link
        }else{
          this.$state.go('signin')
        }
      }else{
        message.error(resp.message)
      }
    })
  }
}

Setting.$inject = ['Session' ,'$state']

export default {
  name:'setting',
  template: tpl,
  controller: Setting
}