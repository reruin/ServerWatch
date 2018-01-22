import angular from 'angular'
import format from '../../utils/format'

let ng = angular.module('slFilter', [])

ng.filter("byte", function() {
  return function(input , t) {
    return format.byte(input , t)
  }
})

ng.filter("time", function() {
  return function(input , t) {
    return format.time(input , t)
  }
})


export default ng.name
