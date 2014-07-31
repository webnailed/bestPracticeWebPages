'use strict';
angular.module('justGivingApp')
  .directive('formSubmit', function () {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        // hide image until it has loaded

        element.bind('submit',function(e) {
          e.preventDefault();

        })




      }
    };
  });