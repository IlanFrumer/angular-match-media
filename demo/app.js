var app = angular.module('media',['ngMatchMedia']);

app.config(function(deviceProvider){
  deviceProvider.set('big','(min-width:520px)');
  deviceProvider.init();
})

app.run(function($rootScope, device){
  $rootScope.device = device;
})