/* Object for calling a callback with a boolean paramter based on when a checkbox has been changed */
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

var FormValidation = function(form) {
    if (!(form && form.tagName && form.tagName === 'FORM')) {
        throw new TypeError('The supplied object is not an html form');
    }
    // switch off native html5 validation
    form.noValidate = true;
    this.form = form;
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
        try {
            console.log(field);
            var valid = true,
                val = field.value,
                type = field.getAttribute('type'),
                isCheckbox = (type === 'checkbox' || type === 'radio'),
                isRequired = !!field.required,
                minLength = field.getAttribute('minLength'),
                maxLength = field.getAttribute('maxLength'),
                pattern = field.getAttribute('pattern');
        } catch(e) {
            console.log(e);
        }
        // disabled fields should not be validated
        if (field.disabled) {
            return valid;
        }
        // value required check
        valid = (!isRequired || (isCheckbox && field.checked) || (!isCheckbox && val !== ""));
        // minLength or maxLength set?
        minLength = parseInt(minLength,10);
        minLength = isNaN(minLength) ? 0 : minLength;
        maxLength = parseInt(maxLength,10);
        maxLength = isNaN(maxLength) ?  Number.POSITIVE_INFINITY : maxLength;
        valid = valid && (isCheckbox || ((!minLength || val.length >= minLength) && (!maxLength || val.length <= maxLength)));
        // test pattern
        if (valid && pattern) {
            var regEx = new RegExp('^' + pattern + '$');
            valid = regEx.test(val);
        }
        return valid;
    };
    proto.renderChange = function(field) {

    };
    proto.validateField= function(field) {
        // set to result of validation function
        console.log('test');
        field.validity = field.validity || {};
        field.validity.valid = this.isValidField(field);
        if(field.validity.valid) {
            removeClassName(field,'input-invalid');
        } else {
            this.valid = false;
            addClassName(field,'input-invalid');;
        }
        this.renderChange(field);
    };
    proto.validate = function(event) {
        var field = {},
            form = this.form;
        this.valid = true;
        for (i = 0, j = form.elements.length; i < j; i++) {
            field = form.elements[i];
            if (!field.nodeName || (field.nodeName !== "INPUT" && field.nodeName !== "TEXTAREA" && field.nodeName !== "SELECT")) {
                continue;
            }
            console.log(i,field);
            this.validateField(field);
            if (!field.blurListenerAdded) {
                field.addEventListener('blur',this.validateField.bind(this,field),false);
                field.blurListenerAdded = true;
            }
        }
        if (!this.valid) {
            if (event.preventDefault) event.preventDefault();
        }
    };
}(FormValidation.prototype));


(function() {
    var formSetup = function() {
        // set novalidate attribute to switch off
        var endDatePanel = document.getElementById('endDatePanel'),
            eventEndDate = document.getElementById('eventEndDate');
        var toggleEndDateDom = function(endDatePanel, eventEndDate, checked) {
            if (!endDatePanel || !eventEndDate) {
                return;
            }
            endDatePanel.style.visibility = checked ? 'visible' : 'hidden';
            endDatePanel.setAttribute('aria-hidden',!checked);
            eventEndDate.required = checked;
            eventEndDate.setAttribute('aria-required',checked);
        };
        var addEndDate = document.getElementById('addEndDate');
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
        var form = document.forms['addEventForm'];
        if (form) {
            var formValidation = new FormValidation(form);
        }
    };

    window.addEventListener('load', formSetup, false);
}());
