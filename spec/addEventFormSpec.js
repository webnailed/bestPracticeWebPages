
describe('Checkbox state toggler tests - ',function() {
  var checkboxToggler = {},
      noop = function() {};
      checkbox = document.createElement("INPUT");
  checkbox.setAttribute("type", "checkbox");

  it('Throws a type error when adding anyhting but an html checkbox object', function() {
    expect(function() {
      new CheckBoxStateToggler('', noop);
    }).toThrow();
    expect(function() {
      new CheckBoxStateToggler({}, noop);
    }).toThrow();
    expect(function() {
      new CheckBoxStateToggler([], noop);
    }).toThrow();
    expect(function() {
      new CheckBoxStateToggler(1, noop);
    }).toThrow();
    expect(function() {
      new CheckBoxStateToggler(undefined, noop);
    }).toThrow();
    expect(function() {
      new CheckBoxStateToggler(document.createElement("INPUT"), noop);
    }).toThrow();
  });
  it('Throws a type error when adding a callback parameter which is not a valid function', function() {
    expect(function() {
      new CheckBoxStateToggler(checkbox,'');
    }).toThrow();
    expect(function() {
      new CheckBoxStateToggler(checkbox,{});
    }).toThrow();
    expect(function() {
      new CheckBoxStateToggler(checkbox,[]);
    }).toThrow();
    expect(function() {
      new CheckBoxStateToggler(checkbox,2);
    }).toThrow();
    expect(function() {
      new CheckBoxStateToggler(checkbox,undefined);
    }).toThrow();
  });
  it('Calls the callback function when the changed function is called with correct parameter', function() {
    var dummyCallback = jasmine.createSpy('dummyCallback');
    checkboxToggler = new CheckBoxStateToggler(checkbox,dummyCallback);
    checkboxToggler.changed(true);
    expect(dummyCallback).toHaveBeenCalledWith(true);
    checkboxToggler.changed(false);
    expect(dummyCallback).toHaveBeenCalledWith(false);
  });
   it('Calls the callback function when DOM chnage event is fired', function() {
    var dummyCallback = jasmine.createSpy('dummyCallback');
    checkboxToggler = new CheckBoxStateToggler(checkbox,dummyCallback);
    //document.body.appendChild(checkbox);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent('change', true, true ); // event type,bubbling,cancelable
    checkbox.checked = true;
    checkbox.dispatchEvent(evt);
    expect(dummyCallback).toHaveBeenCalledWith(true);
    checkbox.checked = false;
    checkbox.dispatchEvent(evt);
    expect(dummyCallback).toHaveBeenCalledWith(false);
  });
});
describe('Form validation object tests', function() {
  var formValidation = {},
    noop = function() {};
  var form = document.createElement("FORM");
  var testField = document.createElement("INPUT");
  var mockedForm = {

  };

  it('Throws a type error when adding anyhting but an html checkbox object', function() {
    expect(function() {
      new FormValidation('');
    }).toThrow();
    expect(function() {
      new FormValidation({});
    }).toThrow();
    expect(function() {
      new FormValidation([]);
    }).toThrow();
    expect(function() {
      new FormValidation(1);
    }).toThrow();
    expect(function() {
      new FormValidation(undefined);
    }).toThrow();
    expect(function() {
      new FormValidation(document.createElement("INPUT"), noop);
    }).toThrow();
  });
  it('Attaches passed form object onto the Object via the contructor', function() {
    formValidation = new FormValidation(form);
    expect(formValidation.form).toEqual(form);
  });
  describe('Validate method tests', function() {
    it("It passes validation for an empty form", function() {
        formValidation = new FormValidation(form);
        formValidation.validate();
        expect(formValidation.valid).toEqual(true);
    });
  });
  describe('isValidField  method tests', function() {
    beforeEach(function() {
      formValidation = new FormValidation(form);
      testField = document.createElement("INPUT");
    });
    it('It passes validation if the field is disabled', function() {
        testField.disabled = true;
        expect(formValidation.isValidField(testField)).toEqual(true);
    });
    it('It fails validation if the field is required and the value is empty', function() {
        testField.setAttribute('type', 'text');
        testField.setAttribute('value', '');
        testField.required = true;
        expect(formValidation.isValidField(testField)).toEqual(false);
    });
    it('It passes validation if a checkbox and checked', function() {
        testField.setAttribute('type', 'checkbox');
        testField.checked = true;
        testField.required = true;
        expect(formValidation.isValidField(testField)).toEqual(true);
    });
    it('It passes validation when required but non empty', function() {
        testField.setAttribute('type', 'text');
        testField.setAttribute('value', 'test');
        testField.required = true;
        expect(formValidation.isValidField(testField)).toEqual(true);
    });
    it('It fails validation when required anmd checkbox not checked', function() {
        testField.setAttribute('type', 'checkbox');
        testField.checked = false;
        testField.required = true;
        expect(formValidation.isValidField(testField)).toEqual(false);
    });
    it('It passes validation for a checkbox with minlength set', function() {
        testField.setAttribute('type', 'checkbox');
        testField.setAttribute('minLength', '20');
        expect(formValidation.isValidField(testField)).toEqual(true);
    });
    it('It passes validation for a checkbox with maxlength set', function() {
        testField.setAttribute('type', 'checkbox');
        testField.setAttribute('maxLength', '0');
        expect(formValidation.isValidField(testField)).toEqual(true);
    });
    it('It passes validation where current value is less or equal to maxlength attribute', function() {
        testField.setAttribute('type', 'text');
        testField.setAttribute('value', 'tes');
        testField.setAttribute('maxLength', '4');
        expect(formValidation.isValidField(testField)).toEqual(true);
        testField.setAttribute('value', 'test');
        expect(formValidation.isValidField(testField)).toEqual(true);
    });
    it('It fails validation where current value is less than minlength attribute', function() {
        testField.setAttribute('type', 'text');
        testField.setAttribute('value', 'test');
        testField.setAttribute('minLength', '5');
        expect(formValidation.isValidField(testField)).toEqual(false);
    });
    it('It passes validation where current value is greater or equal to minlength attribute', function() {
        testField.setAttribute('type', 'text');
        testField.setAttribute('value', 'test');
        testField.setAttribute('minLength', '4');
        expect(formValidation.isValidField(testField)).toEqual(true);
        testField.setAttribute('value', 'test1');
        expect(formValidation.isValidField(testField)).toEqual(true);
    });
    it('It fails validation where current value is greater than maxlength attribute', function() {
        testField.setAttribute('type', 'text');
        testField.setAttribute('value', 'test');
        testField.setAttribute('maxLength', '3');
        expect(formValidation.isValidField(testField)).toEqual(false);
    });
    it('It passes validation where current value is greater or equal to minlength attribute and less or equal to maxLngth attribute ', function() {
        testField.setAttribute('type', 'text');
        testField.setAttribute('value', 'test');
        testField.setAttribute('minLength', '4');
        testField.setAttribute('maxLength', '6');
        testField.setAttribute('value', 'test1');
        expect(formValidation.isValidField(testField)).toEqual(true);
    });
    it('It passes validation where supplied minLength is a string', function() {
        testField.setAttribute('type', 'text');
        testField.setAttribute('value', 'test');
        testField.setAttribute('minLength', 'dd');
        expect(formValidation.isValidField(testField)).toEqual(true);
    });
    it('It passes validation where supplied maxLength is a string', function() {
        testField.setAttribute('type', 'text');
        testField.setAttribute('value', 'test');
        testField.setAttribute('maxLength', 'dd');
        expect(formValidation.isValidField(testField)).toEqual(true);
    });
    it('It passes validation if the current field value matches the supplied pattern expression', function() {
        testField.setAttribute('type', 'text');
        testField.setAttribute('pattern', '\\d+(\\.\\d{2})?');
        testField.setAttribute('value', '1.45');
        expect(formValidation.isValidField(testField)).toEqual(true);
        testField.setAttribute('value', '999.11');
        expect(formValidation.isValidField(testField)).toEqual(true);
        testField.setAttribute('value', '1.00');
        expect(formValidation.isValidField(testField)).toEqual(true);
    });
    it('It fails validation if the current field value does not matchthe supplied pattern expression', function() {
        testField.setAttribute('type', 'text');
        testField.setAttribute('pattern', '\\d+(\\.\\d{2})?');
        testField.setAttribute('value', 'bad');
        expect(formValidation.isValidField(testField)).toEqual(false);
        testField.setAttribute('value', '');
        expect(formValidation.isValidField(testField)).toEqual(false);
        testField.setAttribute('value', '1.34f');
        expect(formValidation.isValidField(testField)).toEqual(false);
        testField.setAttribute('value', '1.999');
        expect(formValidation.isValidField(testField)).toEqual(false);
    });
  });
});