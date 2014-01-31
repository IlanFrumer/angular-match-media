/*global angular:false */

(function (angular) {

  'use strict';

  var $compileProvider;

  angular.module('ngMatchMedia',[])

  .provider('devices', ['$compileProvider' , function(_$compileProvider_) {
    
    // saving a reference to create directives after user configuration
    $compileProvider = _$compileProvider_;
    
    var devices = {
      'mobile': '(max-width:480px)',
      'tablet': '(min-width:481px) and (max-width:979px)',
      'laptop': '(min-width:980px) and (max-width:1199px)',
      'desktop': '(min-width:1200px)'
    };

    return {
      config:{
        showPrefix : 'showOn',
        stylesPrefix: 'media-',
        stylesDirective: 'mediaStyles'
      },
      set: function(device, query){
        devices[device] = query;
      },
      $get: function(){
        return {
          list: devices,
          config: this.config
        };
      }
    };
  }])

  .run(['devices', '$window' , function(devices, $window){

    angular.forEach(devices.list , function(query, device){

      var directiveName = devices.config.showPrefix +
                          device.charAt(0).toUpperCase() +
                          device.slice(1).toLowerCase();

      $compileProvider.directive( directiveName , function () {
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
      });
    });
  }])

  .run(['devices', '$window', function(devices, $window){

    $compileProvider.directive( devices.config.stylesDirective , function () {
      return {
        link: function(scope, element, attrs){

          var destroyCb = [];

          // register an event listerner for each device
          angular.forEach(devices.list, function(query, device){
            
            var mql = $window.matchMedia(query);

            var queryHandler = function(results){
              var action = results.matches ? "addClass" : "removeClass";
              element[action]( devices.config.stylesPrefix + device);
            };

            mql.addListener(queryHandler);

            queryHandler(mql);

            destroyCb.push(function(){
              mql.removeListener(queryHandler);
            });

          });

          // remove all event listeners when the element is destroyed
          element.on('$destroy', function(){
            angular.forEach(destroyCb , function(cb){
              cb();
            });
          });
        }
      };
    });

  }]);

}(angular));