import angular from 'angular'
import _ from '../utils/_'
import {default as msg} from 'services/message'

class sl {
  constructor(appName , depends){
    this.appName = appName || 'myApp'
    this.app = angular.module(this.appName,depends)
  }

  mod(m){
    m.forEach( (i) => {
      if('service' in i){
        this.app.service(i.name , i.service)
      }
      else if('factory' in i){
        this.app.factory(i.name , i.factory)
      }
      else if('component' in i){
        this.app.component(i.name , i.component)
      }
      else if('run' in i){
        this.app.run(i.run)
      }
    })
  }


  router(m , parentName){

    if(parentName === undefined){
      parentName = ''
    }else{
      parentName += '.'
    }
    
    m.forEach((route)=>{
      let c = route.component
      let stateName = parentName + route.name
      let componentName = c.name

      if(c.controller){
        this.app.component(componentName, {
          controller : c.controller,
          template : c.template
        })
      }

      if(c.dep){
        this.mod(c.dep)
      }

      if(route.path){
        let opts = {
          name : stateName,
          url: route.path
        }

        if(!route.controllerAs){
          opts.controllerAs = '$ctrl'
        }

        //非组件模式运行
        if(route.origin){
          opts.controller = componentName
          opts.template = c.template
        }else{
          let sc = _.separator(componentName)
          opts.template = '<'+sc+'></'+sc+'>'
        }
       
        this.app.config(['$stateProvider','$urlRouterProvider', ($stateProvider,$urlRouterProvider) => {
          $stateProvider.state(opts)
        }])
      }

      if(route.children){
        this.router(route.children , stateName)
      }
    })

    this.app.config(['$locationProvider','$urlRouterProvider', ($locationProvider,$urlRouterProvider) => {
            
      // $urlRouterProvider.otherwise('/404')
      $urlRouterProvider.when('/', '/servers')
      $urlRouterProvider.otherwise('/404')
      $locationProvider
            .html5Mode(true)
            .hashPrefix('!')
    }])

    return this
  }

  start(node){
    angular.bootstrap(document, [this.appName])
    return this
  }

}


export default (...rest) => (new sl(...rest))

// export const message = message

export const message = msg