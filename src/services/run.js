import http from '../utils/http'

const EVENTS = {
  unauthorized  : 'unauthorized '
}

const Run = (session , $rootScope , $state,$timeout) => {
  http.setInterceptor({
    response: function(resp) {
      if (resp.data && resp.data.status == 401) {
        $rootScope.$broadcast(EVENTS.unauthorized, resp)
      }
      //触发scope更新
      $timeout()
      return resp
    }
  })


  $rootScope.$on(EVENTS.unauthorized , function() {
    session.destory()
    $state.go('signin')
  });
}

Run.$inject = ['Session','$rootScope','$state','$timeout']

export default {
  run: Run
}