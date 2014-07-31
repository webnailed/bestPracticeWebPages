'use strict';
angular.module('justGivingApp')
	.factory('scopeHelper', function () {
	return {
		safeApply: function (scope, fn) {
			var phase = scope.$root.$$phase;
			if(phase === '$apply' || phase === '$digest') {
				if(fn && (angular.isFunction(fn))) {
					fn();
				}
			} else {
				scope.$apply(fn);
			}
		}
	};
});
