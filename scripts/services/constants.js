'use strict';
angular.module('justGivingApp')
  .provider('constants', function () {
     // default values
    var defaultValues = {
      dateRegEx:/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
      i18nDictionary:
        {
          justGivingLogoSrc:'content/images/justGiving-Logo.png',
          justGivingLogoAlt:'Just Giving Logo',
          homeNavLink:'Home',
          reportsNavLink:'Report',
          fundraisingNavLink:'Fundraising tools',
          brandsNavLink:'Brands & Settings',
          addPromoEventsLink:'Add and promote events',
          addEventText:'Add a fundraising event',
          aboutTheEvent:'About the event',
          nameOfEvent:'Name of event*',
          startDate:'Start date*',
          endDate:'End date*',
          addEndDate:'Add an end date (if different)',
          eventLocationText:'Village town or city where event begins*',
          openToPublicText:'Is it open to people from other charities?',
          openToPublicYesText:'Yes - anyone can take part',
          openToPublicNoText:'No - it\'s just for people raising money for my charity',
          eventDescription:'Event description',
          requiredFieldsCopy:'* Indicates a required field',
          createEventButtonText:'Create event',
          yourEvents:'Your events',
          promoteLinkText: 'Promote'
        }
    };
    return {
      set: function (constants) {
        angular.extend(defaultValues, constants);
      },
      $get: function () {
        return defaultValues;
      }
    };
  });
