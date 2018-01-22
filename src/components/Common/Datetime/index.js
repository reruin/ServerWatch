/**
 * [datetime-picker]
 *
 * date-format: optional, date format e.g. 'yyyy-MM-dd'
 * year: optional, year selected, e.g. 2015
 * month: optional, month selected, e.g. 5
 * day: optiona, day selected, e.g. 31
 * hour: optional, hour selected, 23
 * minute: optional, minute selected, 59
 * date-only: optional, if set, timepicker will be hidden
 * future-only: optional, if set, forces validation errors on dates earlier than now
 * close-on-select:boolean,optional
 * 

<input ng-model="date1" datetime-picker date-only />

<input ng-model="date1" datetime-picker date-only future-only />

<input ng-model="date2" datetime-picker date-format="yyyy-MM-dd" date-only />

<input ng-model="date3" datetime-picker date-format="yyyy-MM-dd HH:mm:ss" />

<input ng-model="date4" datetime-picker hour="23" minute='59'/>

<input ng-model="date5" datetime-picker date-format="yyyy-MM-dd HH:mm:ss" year="2014" month="12" day="31" />


*/
import './style.less'

let app = angular.module('slDatetime', [])

var tpl = [
  '<div class="angularjs-datetime-picker">',
  '  <div class="adp-month">',
  '    <button type="button" class="adp-prev" ng-click="addYear(-1)">&laquo;</button>',
  '    <button type="button" class="adp-prev-m" ng-click="addMonth(-1)">&lsaquo;</button>',
  '    <span title="{{months[mv.month].fullName}}">{{months[mv.month].shortName}}</span> {{mv.year}}',
  '    <button type="button" class="adp-next-m" ng-click="addMonth(1)">&rsaquo;</button>',
  '    <button type="button" class="adp-next" ng-click="addYear(1)">&raquo;</button>',
  '  </div>',
  '  <div class="adp-days" ng-click="setDate($event)">',
  '    <div class="adp-day-of-week" ng-repeat="dayOfWeek in ::daysOfWeek" title="{{dayOfWeek.fullName}}">{{::dayOfWeek.firstLetter}}</div>',
  '    <div class="adp-day" ng-show="mv.leadingDays.length < 7" ng-repeat="day in mv.leadingDays">{{::day}}</div>',
  '    <div class="adp-day selectable" ng-repeat="day in mv.days" ',
  '      today="{{today}}" d2="{{mv.year + \'-\' + (mv.month + 1) + \'-\' + day}}"',
  '      ng-class="{',
  '        selected: (day == selectedDay),',
  '        today: (today == (mv.year + \'-\' + (mv.month + 1) + \'-\' + day)),',
  '        weekend: (mv.leadingDays.length + day)%7 == 1 || (mv.leadingDays.length + day)%7 == 0',
  '      }">',
  '      {{::day}}',
  '    </div>',
  '    <div class="adp-day" ng-show="mv.trailingDays.length < 7" ng-repeat="day in mv.trailingDays">{{::day}}</div>',
  '  </div>',
  '  <div class="adp-days" id="adp-time"> ',
  '    <div><label class="timeLabel">时间:</label> <span class="timeValue">{{("0"+inputHour).slice(-2)}} : {{("0"+inputMinute).slice(-2)}}</span></div>',
  '    <div><label class="hourLabel">时:</label> <input class="hourInput" type="range" min="0" max="23" ng-model="inputHour" ng-change="updateNgModel()" /></div>',
  '    <div><label class="minutesLabel">分:</label> <input class="minutesInput" type="range" min="0" max="59" ng-model="inputMinute"  ng-change="updateNgModel()"/></div> ',
  '  </div> ',
  '</div>'
].join("\n");


var getTimezoneOffset = function(date) {
  (typeof date == 'string') && (date = new Date(date));
  var jan = new Date(date.getFullYear(), 0, 1);
  var jul = new Date(date.getFullYear(), 6, 1);
  var stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  var isDST = date.getTimezoneOffset() < stdTimezoneOffset;
  var offset = isDST ? stdTimezoneOffset - 60 : stdTimezoneOffset;
  var diff = offset >= 0 ? '-' : '+';
  return diff +
    ("0" + (offset / 60)).slice(-2) + ':' +
    ("0" + (offset % 60)).slice(-2);
};


app.factory('DatetimePicker', ['$compile', '$document', '$controller', function($compile, $document, $controller) {
  var datetimePickerCtrl = $controller('DatetimePickerCtrl'); //directive controller
  return {
    open: function(options) {
      datetimePickerCtrl.openDatetimePicker(options);
    },
    close: function() {
      datetimePickerCtrl.closeDatetimePicker();
    }
  };
}]);


app.controller('DatetimePickerCtrl', ['$compile', '$document', function($compile, $document) {
  var datetimePickerEl;
  var _this = this;
  var removeEl = function(el) {
    el && el.remove();
    $document[0].body.removeEventListener('click', _this.closeDatetimePicker);
  };

  this.openDatetimePicker = function(options) {
    this.closeDatetimePicker();
    var div = angular.element('<div datetime-picker-popup ng-cloak></div>');
    options.dateFormat && div.attr('date-format', options.dateFormat);
    options.ngModel && div.attr('ng-model', options.ngModel);
    options.year && div.attr('year', parseInt(options.year));
    options.month && div.attr('month', parseInt(options.month));
    options.day && div.attr('day', parseInt(options.day));
    options.hour && div.attr('hour', parseInt(options.hour));
    options.minute && div.attr('minute', parseInt(options.minute));
    if (options.dateOnly === '' || options.dateOnly === true) {
      div.attr('date-only', 'true');
    }
    if (options.closeOnSelect === 'false') {
      div.attr('close-on-select', 'false');
    }

    var triggerEl = options.triggerEl;
    options.scope = options.scope || angular.element(triggerEl).scope();
    datetimePickerEl = $compile(div)(options.scope)[0];
    datetimePickerEl.triggerEl = options.triggerEl;

    $document[0].body.appendChild(datetimePickerEl);

    //show datetimePicker below triggerEl
    var bcr = triggerEl.getBoundingClientRect();


    options.scope.$apply();

    var datePickerElBcr = datetimePickerEl.getBoundingClientRect();

    datetimePickerEl.style.position = 'absolute';
    if (bcr.width > datePickerElBcr.width) {
      //datetimePickerEl.style.left = (bcr.left + bcr.width - datePickerElBcr.width + window.scrollX) + 'px';
      datetimePickerEl.style.left = (bcr.left + window.scrollX) + 'px';
    } else {
      datetimePickerEl.style.left = (bcr.left + window.scrollX) + 'px';
    }

    if (bcr.top < 300 || window.innerHeight - bcr.bottom > 300) {
      datetimePickerEl.style.top = (bcr.bottom + window.scrollY) + 'px';
    } else {
      datetimePickerEl.style.top = (bcr.top - datePickerElBcr.height + window.scrollY) + 'px';
    }

    $document[0].body.addEventListener('click', this.closeDatetimePicker);
  };

  this.closeDatetimePicker = function(evt) {
    var target = evt && evt.target;
    var popupEl = $document[0].querySelector('div[datetime-picker-popup]');
    if (evt && target) {
      if (target.hasAttribute('datetime-picker')) { // element with datetimePicker behaviour
        // do nothing
      } else if (popupEl && popupEl.contains(target)) { // datetimePicker itself
        // do nothing
      } else {
        removeEl(popupEl);
      }
    } else {
      removeEl(popupEl);
    }
  }
}]);


app.directive('datetimePickerPopup', ['$locale', 'dateFilter', function($locale, dateFilter) {
  var days, months, daysOfWeek, firstDayOfWeek;

  var initVars = function() {
    days = [], months = [];
    daysOfWeek = [], firstDayOfWeek = 0;
    for (var i = 1; i <= 31; i++) {
      days.push(i);
    }

    for (var i = 0; i < 12; i++) { //jshint ignore:line
      months.push({
        fullName: $locale.DATETIME_FORMATS.MONTH[i],
        shortName: $locale.DATETIME_FORMATS.SHORTMONTH[i]
      });
    }

    for (var i = 0; i < 7; i++) { //jshint ignore:line
      var day = $locale.DATETIME_FORMATS.DAY[(i + firstDayOfWeek) % 7];

      daysOfWeek.push({
        fullName: day,
        firstLetter: day.substr(2)
      });
    }
    firstDayOfWeek = 0;
  };

  var getMonthView = function(year, month) {
    if (month > 11) {
      year++;
    } else if (month < 0) {
      year--;
    }
    month = (month + 12) % 12;
    var firstDayOfMonth = new Date(year, month, 1),
      lastDayOfMonth = new Date(year, month + 1, 0),
      lastDayOfPreviousMonth = new Date(year, month, 0),
      daysInMonth = lastDayOfMonth.getDate(),
      daysInLastMonth = lastDayOfPreviousMonth.getDate(),
      dayOfWeek = firstDayOfMonth.getDay(),
      leadingDays = (dayOfWeek - firstDayOfWeek + 7) % 7 || 7, // Ensure there are always leading days to give context
      trailingDays = days.slice(0, 6 * 7 - (leadingDays + daysInMonth));
    if (trailingDays.length > 7) {
      trailingDays = trailingDays.slice(0, trailingDays.length - 7);
    }

    return {
      year: year,
      month: month,
      days: days.slice(0, daysInMonth),
      leadingDays: days.slice(-leadingDays - (31 - daysInLastMonth), daysInLastMonth),
      trailingDays: trailingDays
    };
  };

  var linkFunc = function(scope, element, attrs, ctrl) { //jshint ignore:line
    initVars(); //initialize days, months, daysOfWeek, and firstDayOfWeek;
    var dateFormat = attrs.dateFormat || 'yyyy-MM-dd HH:mm:ss';
    scope.months = months;
    scope.daysOfWeek = daysOfWeek;
    scope.inputHour;
    scope.inputMinute;

    if (scope.dateOnly === true) {
      element[0].querySelector('#adp-time').style.display = 'none';
    }

    scope.$applyAsync(function() {
      ctrl.triggerEl = angular.element(element[0].triggerEl);
      if (attrs.ngModel) { // need to parse date string
        var dateStr = '' + ctrl.triggerEl.scope().$eval(attrs.ngModel);
        if (dateStr) {
          if (!dateStr.match(/[0-9]{2}:/)) { // if no time is given, add 00:00:00 at the end
            dateStr += " 00:00:00";
          }
          dateStr = dateStr.replace(/([0-9]{2}-[0-9]{2})-([0-9]{4})/, '$2-$1'); //mm-dd-yyyy to yyyy-mm-dd
          dateStr = dateStr.replace(/([\/-][0-9]{2,4})\ ([0-9]{2}\:[0-9]{2}\:)/, '$1T$2'); //reformat for FF
          dateStr = dateStr.replace(/EDT|EST|CDT|CST|MDT|PDT|PST|UT|GMT/g, ''); //remove timezone
          dateStr = dateStr.replace(/\s*\(\)\s*/, ''); //remove timezone
          dateStr = dateStr.replace(/[\-\+][0-9]{2}:?[0-9]{2}$/, ''); //remove timezone
          dateStr += getTimezoneOffset(dateStr);
          var d = new Date(dateStr);
          scope.selectedDate = new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
            d.getSeconds()
          );
        }
      }

      if (!scope.selectedDate || isNaN(scope.selectedDate.getTime())) { // no predefined date
        var today = new Date();
        var year = scope.year || today.getFullYear();
        var month = scope.month ? (scope.month - 1) : today.getMonth();
        var day = scope.day || today.getDate();
        var hour = scope.hour || today.getHours();
        var minute = scope.minute || today.getMinutes();
        scope.selectedDate = new Date(year, month, day, hour, minute, 0);
      }
      scope.inputHour = scope.selectedDate.getHours();
      scope.inputMinute = scope.selectedDate.getMinutes();

      // Default to current year and month
      scope.mv = getMonthView(scope.selectedDate.getFullYear(), scope.selectedDate.getMonth());
      scope.today = dateFilter(new Date(), 'yyyy-M-d');
      if (scope.mv.year == scope.selectedDate.getFullYear() && scope.mv.month == scope.selectedDate.getMonth()) {
        scope.selectedDay = scope.selectedDate.getDate();
      } else {
        scope.selectedDay = null;
      }
    });

    scope.addMonth = function(amount) {
      scope.mv = getMonthView(scope.mv.year, scope.mv.month + amount);
    };

    scope.addYear = function(amount){
      scope.mv = getMonthView(scope.mv.year + amount, scope.mv.month);
    }

    scope.setDate = function(evt) {
      var target = angular.element(evt.target)[0];
      if (target.className.indexOf('selectable') !== -1) {
        scope.updateNgModel(parseInt(target.innerHTML));
        if (scope.closeOnSelect !== false) {
          ctrl.closeDatetimePicker();
        }
      }
    };

    scope.updateNgModel = function(day) {
      day = day ? day : scope.selectedDate.getDate();
      scope.selectedDate = new Date(
        scope.mv.year, scope.mv.month, day, scope.inputHour, scope.inputMinute, 0
      );
      scope.selectedDay = scope.selectedDate.getDate();
      if (attrs.ngModel) {
        //console.log('attrs.ngModel',attrs.ngModel);
        var elScope = ctrl.triggerEl.scope(),
          dateValue;
        if (elScope.$eval(attrs.ngModel) && elScope.$eval(attrs.ngModel).constructor.name === 'Date') {
          dateValue = new Date(dateFilter(scope.selectedDate, dateFormat));
        } else {
          dateValue = dateFilter(scope.selectedDate, dateFormat);
        }
        elScope.$eval(attrs.ngModel + '= date', { date: dateValue });
      }
    };

    scope.$on('$destroy', ctrl.closeDatetimePicker);
  };

  return {
    restrict: 'A',
    template: tpl,
    controller: 'DatetimePickerCtrl',
    replace: true,
    scope: {
      year: '=',
      month: '=',
      day: '=',
      hour: '=',
      minute: '=',
      dateOnly: '=',
      closeOnSelect: '='
    },
    link: linkFunc
  };
}]);


app.directive('datetimePicker', ['$parse', 'DatetimePicker', function($parse, DatetimePicker) {
  return {
    // An ngModel is required to get the controller argument
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      // Attach validation watcher
      scope.$watch(attrs.ngModel, function(value) {
        if (!value || value == '') {
          return;
        }
        // The value has already been cleaned by the above code
        var date = new Date(value);
        ctrl.$setValidity('date', !date ? false : true);
        var now = new Date();
        if (attrs.hasOwnProperty('futureOnly')) {
          ctrl.$setValidity('future-only', date < now ? false : true);
        }
      });

      element[0].addEventListener('click', function() {
        DatetimePicker.open({
          triggerEl: element[0],
          dateFormat: attrs.dateFormat,
          ngModel: attrs.ngModel,
          year: attrs.year,
          month: attrs.month,
          day: attrs.day,
          hour: attrs.hour,
          minute: attrs.minute,
          dateOnly: attrs.dateOnly,
          futureOnly: attrs.futureOnly,
          closeOnSelect: attrs.closeOnSelect
        });
      });
    }
  };
}]);

app.directive('datetimeRangePicker', ['$parse', 'DatetimePicker', function($parse, DatetimePicker) {
  return {
    // An ngModel is required to get the controller argument
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      // Attach validation watcher
      scope.$watch(attrs.ngModel, function(value) {
        if (!value || value == '') {
          return;
        }
        var date = new Date(value);
        ctrl.$setValidity('date', !date ? false : true);
        var now = new Date();
        if (attrs.hasOwnProperty('futureOnly')) {
          ctrl.$setValidity('future-only', date < now ? false : true);
        }
      });

      element[0].addEventListener('click', function() {
        DatetimePicker.open({
          triggerEl: element[0],
          dateFormat: attrs.dateFormat,
          ngModel: attrs.ngModel,
          year: attrs.year,
          month: attrs.month,
          day: attrs.day,
          hour: attrs.hour,
          minute: attrs.minute,
          dateOnly: attrs.dateOnly,
          futureOnly: attrs.futureOnly,
          closeOnSelect: attrs.closeOnSelect
        });

      });
    }
  };
}]);

export default app.name