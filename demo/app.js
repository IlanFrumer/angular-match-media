var app = angular.module('media',['ngMatchMedia']);

app.config(function(devicesProvider){
  devicesProvider.set('big','(min-width:520px)');
})

app.run(function($rootScope, devices){
  $rootScope.devices = devices.list;
})