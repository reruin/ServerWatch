import angular from 'angular'

import Select from './Select'
import Table from './Table'
import Spin from './Spin'
import Paginate from './Paginate'
import Chart from './Chart'
import ChartLite from './Chart/Lite'

import slDirective from './Directive'
import slFilter from './Filter'
import slDatetime from './Datetime'
import ngLocale from './i10n'

let app = angular.module('Sl', [slDirective , slFilter , slDatetime , ngLocale]);


[Select,Table,Spin,Paginate,Chart,ChartLite].forEach((m)=>{
  app.component(m.name , m.component)
})

export default app.name