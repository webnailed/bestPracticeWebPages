'use strict';
angular.module('justGivingApp',[])
.config(function ($locationProvider) {
    // prevent adding hash onto end of query string
    $locationProvider.html5Mode(true).hashPrefix('!');
  });