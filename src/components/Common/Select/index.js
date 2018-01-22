import _ from '../../../utils/_'
import tpl from './index.html'
import angular from 'angular'
class Select {

  constructor($document) {
    this.isOpen = false
    this.$document = $document
    this.current = {}

  }

  $onInit(){
    this.change = this.ngChange
  }

  initOptions(){
    
    let current = this.current.code

    for(var i in this.options){
      if(this.options[i].code == current){
        this.current.name = this.options[i].name
      }
    }

    console.log(current)
  }

  $onChanges({slDef , slOptions}){

    if(slDef && slDef.currentValue){
      this.current.code = slDef.currentValue
    }

    if(slOptions && slOptions.currentValue){
      this.options = slOptions.currentValue
      if(!_.isObject( this.options[0] ) ){
        this.options = this.options.map( (i) => ({code:i ,name:i}) )
      }
    }

    if(this.options && this.current.code){
      this.initOptions()
    }

  }

  open(){
    this.isOpen = true
  }

  close(){
    this.isOpen = false
  }

  changeOption(v){
    this.change(v)
    this.current = v
    this.ngModel = v.code
    this.close()
  }
}

Select.$inject = ['$document']

// let app = angular.module('SLSelect', [])

// app.component('slSelect' , {
//   template: tpl,
//   bindings: {
//     ngModel: '=',
//     ngChange:'&',
//     slDef: '<',
//     slOptions:'<'
//   },
//   controller: Select
// })

// export default app.name

export default {
  name: 'slSelect',
  component: {
    template: tpl,
    bindings: {
      ngModel: '=',
      ngChange:'&',
      slDef: '<',
      slOptions:'<'
    },
    controller: Select
  }
}