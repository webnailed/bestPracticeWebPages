window.addEventListener('load', function() {
    // set novalidate attribute to switch off
    var endDatePanel = document.getElementById('endDatePanel'),
        eventEndDate = document.getElementById('eventEndDate'),
        addEndDate = document.getElementById('addEndDate'),
        eventList = document.getElementById('eventList'),
        formObj = document.forms['addEventForm'],
        initialEvents = [
          {
            eventName:'Irish mud Wrestlingccv',
            eventStartDate:'05/09/2011',
            eventEndDate:'10/09/2014',
            eventLocation:'Brighton',
            eventOpen:true,
            eventDescription:'xcxxcx'
          },
          {
            eventName:'Sloth race 2012',
            eventStartDate:'31/12/2014',
            eventEndDate:'04/04/2000',
            eventLocation:'Cambridge',
            eventOpen:true,
            eventDescription:'xcxxcxc'
          }
        ],
        eventItemTemplate = '<li class="l-underlined l-clr"> \
                               <time datetime="{{eventStartDate}}" class="date-board"> \
                                    <div class="date-part-month l-smaller">{{month}}</div> \
                                    <div class="date-part-day">{{day}}</div> \
                                    <div class="date-part-year l-smaller">{{year}}</div> \
                                </time> \
                                <div class="event-details"> \
                                    <p>{{eventName}}</p> \
                                    <p>{{eventLocation}}</p> \
                                    <a class="btn btn-promote" href="#promote" title="Promote">Promote</a> \
                                </div> \
                            </li>';


    var toggleEndDateDom = function(endDatePanel, eventEndDate, checked) {
        if (!endDatePanel || !eventEndDate) {
            return;
        }
        endDatePanel.style.visibility = checked ? 'visible' : 'hidden';
        endDatePanel.setAttribute('aria-hidden',!checked);
        eventEndDate.required = checked;
        eventEndDate.setAttribute('aria-required',checked);
    };

    var extendFn = function(event) {
        if(event.eventStartDate && event.eventStartDate.length > 0) {
            var parsedDate = utilities.splitDate(event.eventStartDate);
            event.day = parsedDate.day;
            event.month = parsedDate.month;
            event.year = parsedDate.year;
        }
        return event;
    };
    if (addEndDate) {
        // reinstate add end date option
        addEndDate.checked = false;
        addEndDate.parentNode.style.display = 'block';
        addEndDate.parentNode.setAttribute('aria-hidden',false);
        toggleEndDateDom(endDatePanel, eventEndDate, false);
        new CheckBoxStateToggler(addEndDate,function(checked) {
          toggleEndDateDom(endDatePanel, eventEndDate, checked);
        });
    }
    var formValidation = new FormValidation({'form':formObj, 'successFn':function() {
        utilities.observable.notify('item-added',{
            eventName:formObj.eventName.value,
            eventCategory:formObj.eventCategory.value,
            eventStartDate:formObj.eventStartDate.value,
            eventEndDate:formObj.eventEndDate.value,
            addEndDate:formObj.addEndDate.value,
            eventLocation:formObj.eventLocation.value,
            eventLocation:formObj.eventLocation.value,
            eventOpen:formObj.eventOpen.value,
            eventDescription:formObj.eventDescription.value
        });
    },'preventPost':true});

    var itemsCollection = new ItemsCollection(initialEvents,extendFn);
     // set Events collections Object to listen to added event event
    utilities.observable.observe('item-added',function(event) {
        itemsCollection.add.call(itemsCollection,event);
        eventList.innerHTML = itemsCollection.renderListHtml(eventItemTemplate);
        formObj.reset();
    });
    if (eventList) {
        eventList.innerHTML = itemsCollection.renderListHtml(eventItemTemplate);
        eventList.style.display = 'block';
    }
}, false);

