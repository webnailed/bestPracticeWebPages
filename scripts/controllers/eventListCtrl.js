'use strict';

angular.module('justGivingApp')
  .controller('eventListCtrl', function ($scope) {
    $scope.events = [
      {
        eventName:'Irish mud Wrestling',
        eventStartDate:'05/09/2011',
        eventEndDate:'10/04/2014',
        eventLocation:'Brighton',
        eventOpen:true,
        eventDescription:''
      },
      {
        eventName:'Sloth race 2012',
        eventStartDate:'31/12/2014',
        eventEndDate:'04/04/2000',
        eventLocation:'Cambridge',
        eventOpen:true,
        eventDescription:''
      }
    ];
    $scope.splitDate = function(dateString) {
      var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
          dateParts = dateString.split('/'),
          dateObject = new Date(Date.parse(dateParts[2] + '/' + dateParts[1] + '/' +dateParts[0]));
      return {
        day:dateObject.getDate(),
        month:monthNames[dateObject.getMonth()],
        year:dateObject.getFullYear()
      }
    };

    $scope.$on('new_event_added', function(event, newEvent) {
      $scope.events.push(newEvent);
    });

  });