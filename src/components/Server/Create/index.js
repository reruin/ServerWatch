import tpl from './index.html'
import {message} from '../../../config/sl'
import { _ , http } from '../../../utils'

class ServerCreate {
  //依赖
  constructor($state) {

    this.$state = $state
    this.query = {}
    this.ready = true

    this.data = {
      label : '' , 
      update_interval : 5,
      record_interval : 30,
      record_limit : 4000,
      recordable : '0'
    }

    this.options = {
      update_interval : [
        {code:'2' , 'name':'2秒'},
        {code:'5' , 'name':'5秒'},
        {code:'10' , 'name':'10秒'},
        {code:'15' , 'name':'15秒'},
        {code:'20' , 'name':'20秒'},
        {code:'30' , 'name':'30秒'},
        {code:'*/1 * * * *' , 'name':'1分钟'},
        {code:'*/2 * * * *' , 'name':'2分钟'},
        {code:'*/3 * * * *' , 'name':'3分钟'},
        {code:'*/5 * * * *' , 'name':'5分钟'}
      ]
    }
  }

  $onInit(){
    
  }

  save(){
    this.ready = false

    return http.post('/api/node/create' , this.data).then((resp)=> {
      this.ready = true

      if(resp.status){
        message.warn(resp.message)
      }else{
        this.$state.go('app.server',{'id':resp.data.id})
      }
    })
  }
}

ServerCreate.$inject = ['$state']

export default {
  name:'serverCreate',
  template: tpl,
  controller: ServerCreate
}