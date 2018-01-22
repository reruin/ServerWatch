import _ from '../../../utils/_'
import tpl from './index.html'

class Modal {

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

  $onChanges({ngModel , slOptions}){

    if(ngModel && ngModel.currentValue){
      this.current.code = ngModel.currentValue
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
    this.close()
  }
}

Modal.$inject = ['$document']

export default {
  name: 'slModal',
  component: {
    template: tpl,
    bindings: {

    },
    controller: Modal
  }
}