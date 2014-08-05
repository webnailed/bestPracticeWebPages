/* Object for calling a callback with a boolean paramter based on when a checkbox has been changed */
var utilities = {};
(function() {
    var _observers = function(observable,event) {
        if (!observable.observers) {
            observable.observers = {};
        }
        if (!observable.observers[event]) {
            observable.observers[event] = [];
        }
        return observable.observers[event];
    };
    var observe = function (event, observer) {
        if (typeof observer !== 'function') {
            throw new TypeError('Observer is not a function');
        }
        _observers(this,event).push(observer);
    };

    var hasObserver = function (event,observer) {
        var observers = _observers(this,event);
        for (var i = 0, l = observers.length; i < l;i++) {
            if (observers[i] == observer) {
                return true;
            }
        }
        return false;
    };

    var notify = function (event) {
        var observers = _observers(this,event);
        var args = Array.prototype.slice.call(arguments,1);
        for (var i = 0, l = observers.length; i < l;i++) {
            try {
                observers[i].apply(this,args);
            } catch(e) {}
        }
    };

    utilities.observable = {
        observe:observe,
        hasObserver:hasObserver,
        notify:notify
    };

    var splitDate = function(dateString) {
      var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
          dateParts = dateString.split('/'),
          dateObject = new Date(Date.parse(dateParts[2] + '/' + dateParts[1] + '/' +dateParts[0]));
      return {
        day:dateObject.getDate(),
        month:monthNames[dateObject.getMonth()],
        year:dateObject.getFullYear()
      }
    };
    utilities.splitDate = splitDate;



}())

var CheckBoxStateToggler = function(checkbox, callback) {
    if (!(checkbox && checkbox.type && checkbox.type === 'checkbox')) {
        throw new TypeError('The supplied object is not an html checkbox');
    }
    if (typeof callback != 'function') {
        throw new TypeError('The supplied callback must be of type function');
    }
    this.checkbox = checkbox;
    this.callback = callback;
    this.bindEvent();
};

(function(proto) {
    proto.bindEvent = function() {
        var checkedHandler = this.changed.bind(this)
        this.checkbox.addEventListener('change', function() {
            checkedHandler(this.checked);
        }, false);
    };
    proto.changed = function(checked) {
        this.callback.call(window,checked);
    };
}(CheckBoxStateToggler.prototype));

var FormValidation = function(params) {
    var form = params && params.form,
        successFn = params && params.successFn,
        preventPost = params && params.preventPost || false;
    if (!(form && form.tagName && form.tagName === 'FORM')) {
        throw new TypeError('The supplied object is not an html form');
    }
    if (typeof successFn !== 'function' && typeof successFn !== 'undefined') {
      throw new TypeError('The supplied success callback is not a function');
    }
    // switch off native html5 validation
    form.noValidate = true;
    this.form = form;
    this.successFn = successFn;
    this.preventPost = !!preventPost;
    this.form.addEventListener('submit',this.validate.bind(this),false);
};

(function(proto) {

    var addClassName = function(field,className) {
        var regExpClass = new RegExp('(^|\\s)' + className + '(\\s|$)');
        if(field && !regExpClass.test(field.className)) {
            className = field.className + ' ' + className;
            field.className = className.replace(/^\s+|\s+$/g,'');
        }
    };
    var removeClassName = function(field,className) {
        var regExpClass = new RegExp('(^|\\s)' + className + '(\\s|$)');
        if (field) {
            className = field.className.replace(regExpClass,' ');
            field.className = className.replace(/^\s+|\s+$/g,'');
        }
    };
    proto.isValidField = function(field) {
        var valid = true,
            val = field.value,
            type = field.getAttribute('type'),
            isCheckbox = (type === 'checkbox' || type === 'radio'),
            isRequired = field.required || !!field.getAttribute('aria-required'),
            maxLength = field.getAttribute('maxLength'),
            pattern = field.getAttribute('pattern');
        // disabled fields should not be validated
        if (field.disabled) {
            return valid;
        }
        // value required check
        valid = (!isRequired || (isCheckbox && field.checked) || (!isCheckbox && val !== ""));
        // minLength or maxLength set?
        maxLength = parseInt(maxLength,10);
        maxLength = isNaN(maxLength) ?  Number.POSITIVE_INFINITY : maxLength;
        valid = valid && (isCheckbox || (!maxLength || val.length <= maxLength));
        // test pattern
        if (valid && pattern) {
            var regEx = new RegExp('^' + pattern + '$');
            valid = regEx.test(val);
        }
        return valid;
    };
    proto.renderValidation = function(field) {
        var nextEl = field.nextSibling,
            labelErrorClass = 'input-invalid-label',
            inputErrorClass = 'input-invalid',
            hasErrorLabel = (nextEl && nextEl.className && nextEl.className.indexOf(labelErrorClass) >= 0) ;
        if(field.validity.valid) {
            removeClassName(field,inputErrorClass);
            if (hasErrorLabel) {
                nextEl.parentNode.removeChild(nextEl);
            }
            return;
        }
        addClassName(field,inputErrorClass);
        if (!hasErrorLabel) {
            var errorLabel = document.createElement("LABEL");
            errorLabel.className = labelErrorClass;
            errorLabel.innerHTML = 'Please fill in this field correctly';
            // append error labels after invalid input
            field.parentNode.insertBefore(errorLabel, field.nextSibling);
        }
    };
    proto.hasValidationAttributes = function(field) {
        return (!!field.required || !!field.getAttribute('aria-required') || !!field.getAttribute('maxLength') || !!field.getAttribute('pattern'));
    };
    proto.validateField= function(field) {
        // set to result of validation function
        field.validity = field.validity || {};
        field.validity.valid = this.isValidField(field);
        if (!field.validity.valid) {
            this.valid = false;
        }
        this.renderValidation(field);
    };
    proto.bindBlurEventListener = function(field) {
        if (!field.blurListenerAdded  && this.hasValidationAttributes(field)) {
            field.addEventListener('blur',this.validateField.bind(this,field),false);
            field.blurListenerAdded = true;
        }
    };
    proto.validate = function(event) {
        var field = {},
            form = this.form;
        this.valid = true;
        for (i = 0, j = form.elements.length; i < j; i++) {
            field = form.elements[i];
            // only process form elements whic have validation attached
            if (!field.nodeName || (field.nodeName !== "INPUT" && field.nodeName !== "TEXTAREA" && field.nodeName !== "SELECT") || !this.hasValidationAttributes(field) ) {
                continue;
            }
            this.validateField(field);
            this.bindBlurEventListener(field);
        }
        if ((!this.valid || this.preventPost) && event && event.preventDefault) {
            event.preventDefault();
        }
        if (this.valid && this.successFn) {
            this.successFn();
        }
    };
}(FormValidation.prototype));


/* Item collection for storing an drendering object list informayion */
/* itemsArray(optional) initialise items of array*/
/* extensionFn(optional) extends coillection object to calculate new field or modify exising ones*/
var ItemsCollection = function(itemsArray, extensionFn) {
    itemsArray = itemsArray || [];
    if (!Array.isArray(itemsArray)) {
        throw new TypeError('The supplied items are not of type array');
    }
    if (typeof extensionFn !== 'function' && typeof extensionFn !== 'undefined') {
      throw new TypeError('extensionFn is not a function');
    }
    this.items = itemsArray;
    this.extensionFn = extensionFn;
};

(function(proto) {
    proto.add = function(item) {
        this.items.push(item);
    };
    proto.renderItemHtml = function(itemTemplate,item) {
        var itemHtml = itemTemplate;
        // extend object with calulated propeties
        if (this.extensionFn) {
            item = this.extensionFn(item);
        }
        for (var field in item) {
            if (item.hasOwnProperty(field)) {
                itemHtml = itemHtml.replace('{{' + field.toString() + '}}',item[field.toString()]);
            }
        }
        return itemHtml;
    };
    proto.renderListHtml = function(itemTemplate) {
        var listHtml = '',
            itemCollection = this;
        this.items.forEach(function(item,index) {
            listHtml = listHtml + itemCollection.renderItemHtml.call(itemCollection,itemTemplate,item);
        });
        return listHtml;
    };
}(ItemsCollection.prototype));

