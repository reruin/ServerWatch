import tpl from './index.html'
import http from '../../utils/http'

class Signin {
  constructor(session, $state) {
    this.data = {
      username: '',
      password: ''
    }

    this.session = session
    this.$state = $state
  }

  signin() {

    http.post('/api/signin', this.data).then((resp) => {
      if (resp.status) {
        alert(resp.message)
      } else {
        this.session.create(this.data.account, resp.data.token)
        http.setToken(resp.data.token)
        this.$state.go('app.servers')
      }
    })
  }

}

Signin.$inject = ['Session', '$state']

/*
angular.module('layout', [])
    .component('layout', {
        template: tem,
        controller: layoutCtrl,
        controllerAs: 'layoutctrl'
    })
    .name;

*/



export default {
  name : 'signin',
  template: tpl,
  controller : Signin
}