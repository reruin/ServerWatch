import angular from 'angular'
import _ from '../../../../utils/_'
import tpl from './index.html'
import './index.less'

class ChartLite {

  constructor($element) {
    this.$element = $element
    this.tickData = []
    this.config = {

    }
    this.value = 'N/A'
    this.width = 120
    this.height = 20
    this.count = this.width
    this.datas = []
    this.raw = []
    this.num = 1

  }


  $onInit() {


  }

  $onChanges({ data , color }) {
    if(color && color.currentValue){
      this.num = this.color.length
      this.datas = new Array(this.num).fill(0).map((i)=>[])
    }
    
    if (data && data.currentValue) {
      this.update(data.currentValue.value, data.currentValue.raw)
    }
  }

  $onDestroy() {

  }

  $postLink() {
    var canvas = this.$element.find('canvas')[0]
    canvas.width = this.width
    canvas.height = this.height
    this.ctx = canvas.getContext('2d')

    this.ctx.lineWidth = 1

    // canvas.addEventListener('mousemove', (e) => {
    //   this.display(e.layerX || e.offsetX || 0)
    // }, false);

  }

  display(x , y) {
    console.log(x)
    if(x < this.raw.length){
      this.value = this.raw[x]
    }
  }

  draw() {
    let ctx = this.ctx

    let h = this.height, w = this.width

    let fill = this.fill != false

    ctx.clearRect(0, 0, w, h)

    for(var k = 0; k < this.datas.length; k++){
      let data = this.datas[k]

      let leng = data.length

      ctx.beginPath()

      //设置样式
      ctx.strokeStyle = "rgba(" + this.color[k] + ",1)"
      ctx.fillStyle = "rgba(" + this.color[k] + ",.55)"
      for (var i = 0; i < w; i++) {
        let iy = Math.ceil(h - data[i] * h) + .5
        
        if (i < leng) {
          if(i==0){
            ctx.moveTo(i, iy)
          }else{
            ctx.lineTo(i, iy)
          }
        } else {
          break;
        }
      }


      if(fill){
        ctx.lineWidth = 0.1
        ctx.lineTo(leng - 1, h)
        ctx.lineTo(0, h)
        ctx.fill()
      }
      
      ctx.stroke()

      ctx.closePath()
    }
    
  }


  update(d, raw) {
    
    for (var i = 0; i < d.length; i++) {
      this.datas[i].push( d[i] )

      if (this.datas[i].length > this.count) {
        this.datas[i].splice(0, 1)
      }
    }

    this.raw.push(raw)
    if (this.raw.length > this.count) {
      this.raw.splice(0, 1)
    }

    this.value = raw
    this.draw()
  }
}

/*class Chart2 {

  constructor($element) {
    this.$element = $element
    this.count = 30
    this.tickData = []
    this.config = {
      type: 'line',
      data: {
        labels: new Array(this.count).fill(''),
        datasets: [{
          label: '',
          data: this.tickData,
          pointRadius: 0,
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
          backgroundColor: 'rgba(75, 192, 192,0.5)'
        }]
      },
      options: {
        responsive: true,
        legend: { display: false },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: false,
            ticks: {
              min: 0,
              max: 1,
              stepSize: 1
            }
          }]
        }
      }
    }
  }


  $onInit() {}

  $onChanges({ data }) {
    if (data && data.currentValue) {
      this.update(data.currentValue.value)
    }
  }

  $onDestroy(){
    if(this.chart)
      this.chart.destroy()
  }

  $postLink() {
    var canvas = this.$element.find('canvas')[0]
    var ctx = canvas.getContext('2d')
    this.chart = new Line(ctx, this.config)
  }

  update(d) {
    if(d){
      console.log(this.tickData)
      this.tickData[this.tickData.length] = d

      if (this.tickData.length > this.count+1) {
        this.tickData.splice(0,1)
      }
      if(this.chart) this.chart.update()
    }

  }
}*/
ChartLite.$inject = ['$element']

export default {
  name: 'chartLite',
  component: {
    template: tpl,
    bindings: {
      data: '<',
      color: '<',
      fill: '<',
      min:'<',
      max:'<',
    },
    controller: ChartLite
  }
}