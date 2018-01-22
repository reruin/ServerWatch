import tpl from './index.html'
import angular from 'angular'
import http from '../../utils/http'
import header from './Header'

class Layout {
  constructor(session , $state){
    this.full = false
    this.$state = $state
    var token = session.getToken()
    if(token){
      http.setToken(token)
      if(location.pathname == '/'){
        $state.go('app.servers')
      }
    }else{
      $state.go('signin')
    }

  }

  onInit(){
    //this.$state.go('app.Dashboard')
  }

  toggle(){
    this.full = !this.full
  }

  hide(){
    this.full = false
  }
}

Layout.$inject = ['Session','$state'];

export default {
  name : 'layout',
  template : tpl,
  controller : Layout,
  dep:[header]
}
