import angular from 'angular'
import _ from '../../../utils/_'
import tpl from './index.html'

class Paginate {

  constructor() {
  }

  $onInit(a) {
    this.options = this.slOptions.limitOptions

    this.process = false

    this.query = {
      limit : 10 , page : 1
    }

    if(this.slOptions.limit){
      this.query.limit = this.slOptions.limit
    }
    if(this.slOptions.page){
      this.query.page = this.slOptions.page
    }

    for(var i = 0 ; i<this.options.length ; i++){
      let v = this.options[i]
      this.options[i] = {id:v , label:v+'条/页'}
    }
    

    this.page = {
      total : 0,
      current : 0,
      pageto : 0
    }

    // this.update(this.query)
  }

  update(q){
    this.process = true

    this.slUpdate({query : q}).then((resp)=>{
      this.data = resp.data
      let count = resp.count

      this.page.total = Math.ceil( count / q.limit )
      this.page.current = q.page
      this.query.page = q.page
      this.page.pageto = q.page

      this.process = false

    })
  }

  setPage(){
    let params = angular.copy(this.query)
    params.page = parseInt(this.page.pageto)
    this.update(params)
  }

  next(){
    let params = angular.copy(this.query)
    params.page += 1
    this.update(params)
  }

  prev(){
    let params = angular.copy(this.query)
    params.page -= 1
    this.update(params)
  }

  changeLimit(){
    this.update(this.query)
  }
}

Paginate.$inject = []

export default {
  name: 'slPaginate',
  component: {
    template: tpl,
    bindings: {
      slOptions: '<',
      slUpdate : '&'
    },
    controller: Paginate
  }
}