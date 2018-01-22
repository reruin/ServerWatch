import angular from 'angular'
import _ from '../../../utils/_'
import tpl from './index.html'

class Table {

  constructor($sce,$compile) {
    this.$sce = $sce
    this.$compile = $compile
    console.log(this)
  }

  $onInit(a) {
    this.columns = this.slTableOptions.columns
    this.options = angular.extend(Table.defaultOptions, this.slTableOptions.options)

    this.data = this.slTableData

    this.process = false

    this.query = angular.extend({ limit : 10 ,  page : 1 }, this.slTableOptions.query)

    
    for(var i = 0 ; i<this.options.limitOptions.length ; i++){
      let v = this.options.limitOptions[i]
      this.options.limitOptions[i] = {id:v , label:v+'条/页'}
    }
    

    console.log(this.options.limitOptions)

    this.filterHtml = '';
    this.filterOption = {}

    this.columns.forEach((i) => {
      let filter = i.filter
      let field = i.field
      if(filter){
        this.filterOption[field] = {
          data: filter.value || '',
          type : filter.type,
          display: 0,
          name : filter.name || i.name,
          def : filter.data,
          key : filter.key || field
        }
        console.log(this.filterOption[field])
        i.filterOption = this.filterOption[field]
      }
    })

    //console.log(this.filterOption)
    //this.filterHtml = this.$sce.trustAsHtml(filter)

    console.log(this.element)

    this.page = {
      total : 0,
      current : 0,
      pageto : 0
    }

    this.update(this.query)
  }

  update(q){

    this.process = true

    this.slTableUpdate({query : q}).then((resp)=>{
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

  parse(row , column){
    //return this.$sce.trustAsHtml('1');//row[column.field]
    let raw_value = row[column.field] || ''
    if(column.html){
      let tpl = _.template(column.html , row)
      return this.$sce.trustAsHtml(tpl)
      // return row[column.field]
    }else{
      return this.$sce.trustAsHtml(raw_value.toString())
    }
  }
  //
  popupFliter(column){
    this.activeFilter = true
    if( column ){
      let field = column.field
      if(field)
        this.filterOption[field].display++
      //!this.filterOption[field].display
    }
  }

  hideFliter(){
    this.activeFilter = false
  }

  search(){
    console.log(this.query)
    let params = {}
    this.columns.forEach((i)=>{
      if(i.filter){

        this.query[i.filterOption.key] = i.filterOption.data
        i.filterOption.display = false
      }
    })

    this.hideFliter()
    
    this.update(this.query)
  }

  changeLimit(){
    this.update(this.query)
  }
}

Table.defaultOptions = {
  enablePageSelect : true,
  enableLimit: true,
  limitOptions: [10, 20, 50],

  enableHead:true
}

Table.$inject = ['$sce','$compile']

export default {
  name: 'slTable',
  component: {
    template: tpl,
    bindings: {
      slTableOptions: '<',
      slTableUpdate:'&'
    },
    controller: Table
  }
}