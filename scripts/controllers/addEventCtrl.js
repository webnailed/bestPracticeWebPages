'use strict';

angular.module('justGivingApp')
	.controller('addEventCtrl', function ($scope,scopeHelper,$rootScope, constants) {

    $scope.addEvent = function(form) {
    	if (form.$invalid) {
    		form.$setDirty();
    		return;
    	}
      $rootScope.$broadcast('new_event_added', angular.extend({},$scope.event));
      $scope.clearForm();
      form.$setPristine();
    };
    $scope.dateRegEx = constants.dateRegEx;
    $scope.toggleEndDate = function() {
    	if (!$scope.event.addEndDate) {
    		scopeHelper.safeApply($scope,function() {
    			$scope.event.eventEndDate = '';
    		});
    	}
    };
    $scope.clearForm = function() {
    	$scope.event = {
		  	eventOpen:'true',
		  	addEndDate:true
	  	};
    };
    $scope.clearForm();
	});
