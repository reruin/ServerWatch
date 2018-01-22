import tpl from './index.html'
import './style.less'

class Spin {

  constructor($document) {
    this.$document = $document
  }

  $onInit(){
    console.log(this.po)
  }

}

Spin.$inject = ['$document']

/*let app = angular.module('SlSpin', [])

app.component('slSpin' , {
  template: tpl,
  bindings: {
    slPosition: '<',
  },
  controller: Spin
})

export default app.name
*/
export default {
  name: 'slSpin',
  component: {
    template: tpl,
    bindings: {
      slPosition: '<',
    },
    controller: Spin
  }
}