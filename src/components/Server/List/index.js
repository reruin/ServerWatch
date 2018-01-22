import tpl from './index.html'
import './style.less'
import { http, format } from '../../../utils'
import { message } from '../../../config/sl'

class ServerList {
  //依赖
  constructor($state, $timeout) {
    this.$state = $state
    this.$timeout = $timeout

    this.table = {
      columns: [{
          name: '主机',
          field: 'sort',
          html: '<i class="state state-{state}"></i><div><h5>{label}</h5><span class="span">{ip}</span></div>'
        },
        { name: '在线时间', field: 'uptime' },
        { name: '负载', field: 'load' },
        { name: '网络', field: 'network' },
        { name: '流量', field: 'bandwidth' }
      ],
      options: {
        limit: 10,
        limitOptions: [10, 20, 50],
        page: 1
      }
    }

    this.process = false

    this.data = []

    this.query = {}

    this.metaReady = false

    this.fetch()

    this.loading = false

    this.page = {
      online_count: 0
    }

    this._destroy = false

  }

  $onDestroy() {
    this._destroy = true
  }

  fetch() {

    return http.get('/api/nodes').then((resp) => {
      if (!this._destroy) {
        this.setData(resp.data)
        this.$timeout(() => {
          this.fetch()
        }, 1000)

        return { data: resp.data, count: resp.count }
      }

    })
  }

  pick(time, value, raw) {
    return { time, value, raw }
  }

  setData(data) {
    if (this.metaReady) {
      this.updateUsage(data)
      this.updateOnline(data)
    } else {
      this._nodes_hash = {}
      for (var i in data) {
        this._nodes_hash[data[i].id] = data[i]
      }
      this.data = data
      this.updateOnline(data)
      this.metaReady = true
    }
  }


  updateUsage(data) {
    for (var i in data) {
      if (!data[i].installed || !data[i].online) continue;

      var time = data[i].time_response
      var cpu_cores = 1 / parseInt(data[i].snapshot.cpu_cores)
      this._nodes_hash[data[i].id].usage = {
        ram: this.pick(time, [Math.round(100 * parseInt(data[i].snapshot.ram_usage) / parseInt(data[i].snapshot.ram_total)) / 100], format.byte(data[i].snapshot.ram_usage) + ' / ' + format.byte(data[i].snapshot.ram_total)),
        cpu: this.pick(time, [Math.round(100 * parseInt(data[i].snapshot.load_cpu)) / 10000], data[i].snapshot.load_cpu + ' %'),
        io: this.pick(time, [Math.round(100 * parseInt(data[i].snapshot.load_io)) / 10000], data[i].snapshot.load_io + ' %'),
        load: this.pick(time, data[i].snapshot.load.split(' ').map((i) => (parseFloat(i) * cpu_cores)), data[i].snapshot.load)
      }

      this._nodes_hash[data[i].id].snapshot = data[i].snapshot;

      data[i].snapshot.net_total = parseInt(data[i].snapshot.tx_gap) + parseInt(data[i].snapshot.rx_gap)
    }
  }

  updateOnline(d) {
    let c = 0,
      rx = 0,
      tx = 0
    d.forEach((i) => {
      i.state = 0
      if (i.online) {
        c++
        rx += parseInt(i.snapshot.rx_gap)
        tx += parseInt(i.snapshot.tx_gap)
        i.uptime = format.time(i.uptime)
        i.state = 1
      }
      if (!i.installed) {
        i.state = -1
      }
    })


    this.page.online_count = c
    this.page.rx_count = rx
    this.page.tx_count = tx
  }

  formatLoad(d) {
    return d.split(' ').map((i) => {
      return parseFloat(i)
    })
  }

  view(d) {
    if (d.installed) {
      this.$state.go('app.server', { id: d.id })
    }
  }

  create() {
    $ctrl.loading = true

    return http.post('/api/node/create', { label: this.page.label }).then((resp) => {
      $ctrl.loading = false
      if (resp.status) {
        message.warn(resp.message)
      } else {
        console.log(resp)
      }
    })
  }
}

ServerList.$inject = ['$state', '$timeout']

export default {
  name: 'serverList',
  template: tpl,
  controller: ServerList
}