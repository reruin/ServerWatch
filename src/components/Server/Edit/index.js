import tpl from './index.html'
import {message} from '../../../config/sl'
import { _ , http } from '../../../utils'

class ServerEdit {
  //依赖
  constructor($state , $stateParams) {

    this.$state = $state
    this.query = {}
    this.ready = false
    this.id = $stateParams.id

    this.data = {

    }

  }

  $onInit(){
    return http.get('/api/node/' + this.id +'/base' , this.data).then((resp)=> {
      if(resp.status){
        message.error(resp.message , ()=>{
          this.$state.go('app.servers')
        })
      }else{
        this.ready = true
        this.data = resp.data
        this.data.recordable = this.data.recordable ? '1' : '0'
      }
    })
  }


  save(){
    this.ready = false
    return http.post('/api/node/' + this.id , this.data).then((resp)=> {
      this.ready = true
      if(resp.status){
        message.warn(resp.message)
      }else{
        message.success('修改成功')
        
      }
    })
  }
}

ServerEdit.$inject = ['$state' , '$stateParams']

export default {
  name:'serverEdit',
  template: tpl,
  controller: ServerEdit
}