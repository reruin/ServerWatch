import tpl from './index.html'
import { message } from '../../../config/sl'
import { _, http , format} from '../../../utils'
import './style.less'


class ServerDetail {
  //依赖
  constructor($state , $stateParams, $element , $timeout) {
    this.$state = $state
    this.$element = $element
    this.$timeout = $timeout

    this.query = {}
    this.id = $stateParams.id

    this.$stateParams = $stateParams
    this.ready = false

    this.data = {}

    this.snapshot = {}
    this._destroy = false

    this.page = {
      installed: true
    }
    this.datas = {
      mem : [] , swap:[], cpu : [] , io : [] , load : [[],[],[]] , nw:[[],[]]
    }
    this.labels = []
    
    this.chart = {
      mem: {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'ram',
            backgroundColor: 'rgba(139,18,174,.3)',
            borderColor: 'rgba(139,18,174,.8)',
            data: this.datas.mem,
            fill: true,
            borderWidth:1,
            pointRadius:0
          },{
            label: 'swap',
            backgroundColor: 'rgba(254,57,18,.3)',
            borderColor: 'rgba(254,57,18,.8)',
            data: this.datas.swap,
            fill: true,
            borderWidth:1,
            pointRadius:0
          }]
        },
        options: {
          responsive: true,
          title: {
            display: false,
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks : {
              title : function(a){
                return _.datetime(parseInt(a[0].xLabel) , 'yyyy-MM-dd hh:mm:ss')
              },
              label:function(a){
                return a.yLabel + ' MB'
              }
            }
            
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
              },
              type: 'time',
              time: {
                format:'YYYY-MM-DD HH:mm'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
              },
              ticks: {
                min: 0,
                max: 1024,
                stepSize : 512,
                userCallback: function(tick) {
                  return tick.toString() + " MB";
                }
              }
            }]
          }
        }
      },
      cpu: {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'CPU',
            backgroundColor: 'rgba(17,125,187,.3)',
            borderColor: 'rgba(17,125,187,.8)',
            data: this.datas.cpu,
            fill: true,
            borderWidth:1,
            pointRadius:0
          }]
        },
        options: {
          responsive: true,
          title: {
            display: false,
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks : {
              title : function(a){
                return _.datetime(parseInt(a[0].xLabel) , 'yyyy-MM-dd hh:mm:ss')
              },
              label:function(a){
                return a.yLabel + ' %'
              }
            }
            
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
              },
              type: 'time',
              time: {
                format:'YYYY-MM-DD HH:mm'
              }
            }],
            yAxes: [{
              display: true,
              ticks: {
                min: 0,
                max: 100,
                stepSize : 20,
                userCallback: function(tick) {
                  return tick.toString() + " %";
                }
              }
            }]
          }
        }
      },
      io : {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'IO',
            backgroundColor: 'rgba(77,166,12,.3)',
            borderColor: 'rgba(77,166,12,.8)',
            data: this.datas.io,
            fill: true,
            borderWidth:1,
            pointRadius:0
          }]
        },
        options: {
          responsive: true,
          title: {
            display: false,
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks : {
              title : function(a){
                return _.datetime(parseInt(a[0].xLabel) , 'yyyy-MM-dd hh:mm:ss')
              },
              label:function(a){
                return a.yLabel + ' %'
              }
            }
            
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
              },
              type: 'time',
              time: {
                format:'YYYY-MM-DD HH:mm'
              }
            }],
            yAxes: [{
              display: true,
              ticks: {
                min: 0,
                max: 100,
                stepSize : 20,
                userCallback: function(tick) {
                  return tick.toString() + " %";
                }
              }
            }]
          }
        }
      },

      load : {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'load1',
            backgroundColor: 'rgba(102,170,0,.3)',
            borderColor: 'rgba(77,166,12,.8)',
            data: this.datas.load[0],
            fill: true,
            borderWidth:1,
            pointRadius:0
          },
          {
            label: 'load5',
            backgroundColor: 'rgba(254,57,18,.3)',
            borderColor: 'rgba(254,57,18,.8)',
            data: this.datas.load[1],
            fill: true,
            borderWidth:1,
            pointRadius:0
          },
          {
            label: 'load15',
            backgroundColor: 'rgba(51,102,204,.3)',
            borderColor: 'rgba(51,102,204,.8)',
            data: this.datas.load[2],
            fill: true,
            borderWidth:1,
            pointRadius:0
          }]
        },
        options: {
          responsive: true,
          title: {
            display: false,
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks : {
              title : function(a){
                return _.datetime(parseInt(a[0].xLabel) , 'yyyy-MM-dd hh:mm:ss')
              }
            }
            
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
              },
              type: 'time',
              time: {
                format:'YYYY-MM-DD HH:mm'
              }
            }],
            yAxes: [{
              display: true,
              ticks: {
                min: 0,
                max: 1,
                stepSize:0.5
              }
            }]
          }
        }
      },

      nw : {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'RX',
            backgroundColor: 'rgba(102,170,0,.3)',
            borderColor: 'rgba(77,166,12,.8)',
            data: this.datas.nw[0],
            fill: true,
            borderWidth:1,
            pointRadius:0
          },
          {
            label: 'TX',
            backgroundColor: 'rgba(254,57,18,.3)',
            borderColor: 'rgba(254,57,18,.8)',
            data: this.datas.nw[1],
            fill: true,
            borderWidth:1,
            pointRadius:0
          }]
        },
        options: {
          responsive: true,
          title: {
            display: false,
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks : {
              title : function(a){
                return _.datetime(parseInt(a[0].xLabel) , 'yyyy-MM-dd hh:mm:ss')
              },
              label:function(a){
                return Math.abs(a.yLabel) + ' KB'
              }
            }
            
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
              },
              type: 'time',
              time: {
                format:'YYYY-MM-DD HH:mm'
              }
            }],
            yAxes: [
              {
                type: "linear",
                display: true,
                position: "left",
                ticks : {
                  userCallback: function(tick) {
                    return Math.abs(tick).toString() + " KB/s";
                  }
                }
              }
            ]
          }
        }
      }


    }

    this.timestamp = 0
  }

  $onInit() {
    return http.get('/api/node/' + this.id).then((resp) => {
      if(resp.status){
        message.error(resp.message , ()=>{
          this.$state.go('app.servers')
        })
      }else{
        this.ready = true
        this.setData(resp.data)
      }
    })
  }

  $onDestroy(){
    this._destroy = true
  }

  init_chart(){
    let mem_max = Math.max(parseInt(this.snapshot.swap_total / 1024 / 1024) , parseInt(this.snapshot.ram_total / 1024 / 1024))
    mem_max = Math.ceil(mem_max / 512) * 512
    let stepSize = mem_max > 512 ? 512 : 256
    this.chart.mem.options.scales.yAxes[0].ticks.max = mem_max
    this.chart.mem.options.scales.yAxes[0].ticks.stepSize = stepSize
    this.chart.load.options.scales.yAxes[0].ticks.max = this.snapshot.cpu_cores

    this.tick()
  }

  tick(){
    return http.get('/api/node/'+this.id+'/latest').then((resp) =>{
      if(!this._destroy){
        this.update(resp.data)
        this.$timeout(()=>{
          this.tick()
        } , 2000)
      }
    })
  }


  setItem(i){
    let t = i.timestamp
    let load = i.load.split(' ').map((i)=>(parseFloat(i)))

    // this.labels.push( i.timestamp )
    this.datas.mem.push( { t: t , y : Math.round( i.ram_usage / 1024 / 1024) })
    this.datas.swap.push(  { t: t , y :Math.round( i.swap_usage / 1024 / 1024) })
    this.datas.cpu.push( { t: t , y :  parseInt( i.load_cpu) })
    this.datas.io.push( { t: t , y :  parseInt( i.load_io) })
    this.datas.load[0].push({t : t , y :load[0]})
    this.datas.load[1].push({t : t , y :load[1]})
    this.datas.load[2].push({t : t , y :load[2]})
    this.datas.nw[0].push({t : t , y :Math.round(parseFloat( i.rx_gap ) / 1024)})
    this.datas.nw[1].push({t : t , y :0-Math.round(parseFloat( i.tx_gap ) / 1024)})
  }

  setData(d){
    if(d.installed){
      d.history.forEach((i)=>{
        this.setItem(i)
      })

      d.snapshot.processes_array = this.format_process ( d.snapshot.processes_array )
      this.data = d
      this.snapshot = this.data.snapshot
      this.$timeout( ()=>{
        this.init_chart()
      } )

    }else{
      this.data = d
    }
    
  }


  format_process(v){
    var arr = v.split(';')
    var ret = []
    arr.forEach((i)=>{
      if(i){
        var item = i.split(' ')
        item[2] = format.byte(parseInt(item[2]*1024))
        ret.push(item)
      }

    })
    return ret
  }

  update(i) {
    this.setItem(i)

    i.processes_array = this.format_process ( i.processes_array )
    i.uptime = format.time(i.uptime)
    this.snapshot = i
    this.timestamp = 0

  }
}

ServerDetail.$inject = ['$state', '$stateParams', '$element' , '$timeout']

export default {
  name: 'serverDetail',
  template: tpl,
  controller: ServerDetail
}