import angular from 'angular'
import { Line } from 'chart.js'

let ng = angular.module('slDirective',[])

ng.directive('onKeyenter', function() {
  return function(scope, element, attrs) {
    element.bind("keyup", function(e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        scope.$apply(attrs.onKeyenter);
      }
    });
  };
})

ng.directive('slDropdown', ['$document', function($document) {
  return {
    restrict: 'A',

    link: function($scope, element, attr) {
      var menu = element.find('.dd-menu'),
        trigger = element.find('.dd-toggle');
      var capture = false;
      trigger.on('click', function(e) {
        capture = true;
        element.toggleClass('open');
      });

      $document.on('click', function(e) {
        if (!capture) {
          element.removeClass('open');
        }
        capture = false;

        //element.removeClass('open');
        /*if( !(element[0].compareDocumentPosition(e.target) & 16) ){
            if(flag)
                element.removeClass('open');
        }*/
      })
    }
  }
}])

ng.directive('slInputContainer', ['$document', function($document) {
  return {
    restrict: 'A',

    link: function($scope, $element, $attr) {
      $element.addClass('sl-input-container');
      let capture = false
      let className = 'focused'
      $element.bind("click", function(e) {
        $element.addClass(className)
        let hit = $element.find('input') || $element.find('textarea')
        if(hit.length) hit[0].focus()
          
        capture = true
      })

      $document.on('click', function(e) {
        if (!capture) {
          $element.removeClass(className);
        }
        capture = false;
      })

      let req = $element.find('input[required]')
      console.log(req)
      if(req){
        $element.addClass('sl-input-required')
      }
    }
  }
}])

ng.directive('slSelect', [function() {
  return {
    restrict: 'A',

    scope:{

    },
    template:'<>',

    link: function($scope, $element, $attr) {

    }
  }
}])

ng.directive('slToggleClass', ['$document', function($document) {
  return {
    restrict: 'A',

    link: function($scope, $element, $attr) {
      let capture = false
      let className = $attr["slToggleClass"]
      $element.bind("click", function(e) {
        $element.addClass(className)
        capture = true;
      })

      $document.on('click', function(e) {
        if (!capture) {
          $element.removeClass(className);
        }
        capture = false;
      })
    }
  }
}])

ng.directive('slAutofocus', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        scope: {
            'slAutofocus': '='
        },
        link: function($scope, $element) {
            $scope.$watch('slAutofocus', function(nv, ov) {
                if (nv) {
                    $timeout(function() {
                        $element[0].focus();
                    });
                }
            });
        }
    }
}])

ng.directive('slProgressLinear', [function() {
  return {
    restrict: 'AE',

    template:'<div class="sl-container sl-mode-query"><div class="sl-dashed"></div><div class="sl-bar sl-bar1"></div><div class="sl-bar sl-bar2"></div></div>',
  }
}])


export default ng.name