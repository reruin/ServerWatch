import tpl from './index.html'
import {message} from '../../../config/sl'
import { _ , http } from '../../../utils'

class ServerRemove {

  constructor($state , $stateParams) {

    this.$state = $state
    this.query = {}
    this.ready = false
    this.id = $stateParams.id

  }

  $onInit(){
    return http.get('/api/node/'+this.id+'/base').then((resp)=> {

      if(resp.status){
        message.error(resp.message , ()=>{
          this.$state.go('app.servers')
        })
      }else{
        this.ready = true

        this.data = resp.data
        // this.$state.go('app.servers')
      }
    })
  }

  save(){
    this.ready = false

    return http.get('/api/node/'+this.data.id+'/remove').then((resp)=> {
      this.ready = true

      if(resp.status){
        message.warn(resp.message)
      }else{
        alert('移除成功')
        this.$state.go('app.servers')
      }
    })
  }
}

ServerRemove.$inject = ['$state' , '$stateParams']

export default {
  name:'serverRemove',
  template: tpl,
  controller: ServerRemove
}