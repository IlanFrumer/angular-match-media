/*global angular:false */

(function (angular) {

  'use strict';

  angular.module('ngMatchMedia',[])

  .provider('device', ['$compileProvider' , function($compileProvider) {
    return {
      devices : {
        'mobile': '(max-width:480px)',
        'tablet': '(min-width:481px) and (max-width:979px)',
        'laptop': '(min-width:980px) and (max-width:1199px)',
        'desktop': '(min-width:1200px)'
      },
      set: function(device, query){
        this.devices[device] = query;
      },
      init: function(){
        angular.forEach(this.devices , function(query, device){

          var directiveName = 'showOn' +
                              device.charAt(0).toUpperCase() +
                              device.slice(1).toLowerCase();

          $compileProvider.directive( directiveName , ['$window', function ($window) {
            return {
              transclude: 'element',
              priority: 1001,
              terminal: true,
              restrict: 'A',
              link: function (scope, element, attr, ctrl, $transclude) {

                var lastElement = null,
                    mql = $window.matchMedia(query);

                var queryHandler = function(results){

                  if (results.matches) {
                    if(!lastElement) {
                      $transclude(function (clone) {
                        lastElement = clone;
                        element.after(clone);
                      });
                    }
                  } else if(lastElement) {
                    lastElement.remove();
                    lastElement = null;
                  }
                };

                // register for media events
                mql.addListener(queryHandler);

                // initialize
                queryHandler(mql);

                // remove the event listener if the element is destroyed
                element.on('$destroy', function(){
                  mql.removeListener(queryHandler);
                });
              }
            };
          }]);
        });
      },
      $get: function(){
        return this.devices;
      }
    };
  }]);

}(angular));