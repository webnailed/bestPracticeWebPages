'use strict';
angular.module('justGivingApp')
  .filter('i18n', function (constants) {
    return function(input) {
      if (!angular.isString(input)) {
        return input;
      }
      return constants.i18nDictionary[input] || '?'+input+'?';
    };
  });
