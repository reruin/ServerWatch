import tpl from './index.html'
import './index.less'
import pathToRegexp from 'path-to-regexp'

class Header {
  constructor(Session , $state , $rootScope) {
    this.session = Session
    this.$state = $state
    this.toggleTag = false

    this.menu = [
      {title : '监控列表' ,url:'/servers'},
      {title : '创建监控' ,url:'/server/create'},
      {title : '监控详情' ,url:'/server/:id',hide:true},
      {title : '修改密码' ,url:'/setting/changepwd',hide:true}
    ]


    $rootScope.$on('$locationChangeSuccess', (event, state, params) => {
      this.hitMenu(state.name)
    });

    this.initMenu(this.menu)
    
  }

  $onInit() {
    this.hitMenu(this.$state.current.name)
  }

  initMenu(d) {
    this.hashMenu = {}
    for (var i = 0; i < d.length; i++) {
      this.hashMenu[ i+1 ] = d[i]
    }
  }

  hitMenu(stateName) {
    let url = location.pathname + location.search//this.getFullUrl(stateName)
    let menu = this.menu

    let current
    for(let i in this.hashMenu){
      let item = this.hashMenu[i]
      if (item.url && pathToRegexp(item.url).test(url)) {
        item.selected = true
        current = item
      }else{
        item.selected = false
      }
    }

  }

  toggle(){
    this.toggleTag = !this.toggleTag
  }

  signout(){
    this.session.destory()
    this.$state.go('signin')
    /*this.http.post('/api/user/signout' , this.data).then((resp) =>{
      if(resp.status){
        alert(resp.message)
      }else{
        this.session.create( this.data.account , resp.data.token )
        this.http.setToken(resp.data.token)
        this.$state.go('app')
      }
    })*/
  }
}

Header.$inject = ['Session' , '$state' , '$rootScope'];

export default {
  name: 'slHeader',
  component: {
    template: tpl,
    controller:Header
  }
}