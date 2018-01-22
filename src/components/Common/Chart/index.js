import angular from 'angular'
import _ from '../../../utils/_'
import tpl from './index.html'
import './style.less'
import { Line } from 'chart.js'

class Chart {

  constructor($element) {
    this.$element = $element
  }

  init(){

  }

  $onInit() {

  }

  $onChanges({ update }) {
    if (update && update.currentValue) {
      if(this.chart) this.chart.update()
    }
  }


  $onDestroy(){
    if(this.chart){
      this.chart.destroy()
    }
  }

  $postLink() {
    var canvas = this.$element.find('canvas')[0]
    var ctx = canvas.getContext('2d')
    this.chart = new Line(ctx, this.config)
  }
}

Chart.$inject = ['$element']

export default {
  name: 'chart',
  component: {
    template: tpl,
    bindings: {
      config:'=',
      update:'<'
    },
    controller: Chart
  }
}