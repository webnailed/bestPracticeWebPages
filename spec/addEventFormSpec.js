
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
  var formValidation = {};
  var noop = function() {};
  var form = document.createElement("FORM");
  var testField = document.createElement("INPUT");
  var mockedForm = {

  };

  it('Throws a type error if trying to pass anything but a form object to the contructor', function() {
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
  it('Throws a type error if trying to pass anything but a function for the successFn in the contructor', function() {
    expect(function() {
      new FormValidation({'form':form,'successFn':''});
    }).toThrow();
    expect(function() {
      new FormValidation({'form':form,'successFn':{}});
    }).toThrow();
    expect(function() {
      new FormValidation({'form':form,'successFn':[]});
    }).toThrow();
    expect(function() {
      new FormValidation({'form':form,'successFn':1});
    }).toThrow();
  });
  it('Does not throw an error when omitting the successFn parameter', function() {
    expect(function() {
      new FormValidation({'form':form});
    }).not.toThrow();
  });
  it('Attaches passed form object onto the Object via the contructor', function() {
    formValidation = new FormValidation({'form':form});
    expect(formValidation.form).toEqual(form);
  });
  it('Attaches passed success callback onto the Object via the contructor', function() {
    formValidation = new FormValidation({'form':form,'successFn':noop});
    expect(formValidation.successFn).toEqual(noop);
  });
  describe('Validate method tests', function() {
    it("It passes validation for an empty form", function() {
        formValidation = new FormValidation({'form':form});
        formValidation.validate();
        expect(formValidation.valid).toEqual(true);
    });
    it("It attaches blur event listener to field when validating", function() {
        var testField =  document.createElement("INPUT");
        testField.required = true;
        form.appendChild(testField);
        formValidation = new FormValidation({'form':form});
        expect(testField.blurListenerAdded).toBeFalsy();
        formValidation.validate();
        expect(testField.blurListenerAdded).toEqual(true);
    });
  });
  describe('hasValidationAttributes method tests', function() {
    it("It returns false for an input with no attributes", function() {
        var testField =  document.createElement("INPUT");
        formValidation = new FormValidation({'form':form});
        expect(formValidation.hasValidationAttributes(testField)).toEqual(false);
    });
    it("It returns true for an input with validation required", function() {
        var testField =  document.createElement("INPUT");
        formValidation = new FormValidation({'form':form});
        testField.required = true;
        expect(formValidation.hasValidationAttributes(testField)).toEqual(true);
    });
    it("It returns true for an input with required validation", function() {
        var testField =  document.createElement("INPUT");
        formValidation = new FormValidation({'form':form});
        testField.required = true;
        expect(formValidation.hasValidationAttributes(testField)).toEqual(true);
    });
    it("It returns true for an input with maxLength validation", function() {
        var testField =  document.createElement("INPUT");
        formValidation = new FormValidation({'form':form});
        testField.setAttribute('maxLength','10');
        expect(formValidation.hasValidationAttributes(testField)).toEqual(true);
    });
    it("It returns true for an input with pattern validation", function() {
        var testField =  document.createElement("INPUT");
        formValidation = new FormValidation({'form':form});
        testField.setAttribute('pattern','/g');
        expect(formValidation.hasValidationAttributes(testField)).toEqual(true);
    });
  });
  describe('isValidField method tests', function() {
    beforeEach(function() {
      formValidation = new FormValidation({'form':form});
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
    it('It fails validation where current value is greater than maxlength attribute', function() {
        testField.setAttribute('type', 'text');
        testField.setAttribute('value', 'test');
        testField.setAttribute('maxLength', '3');
        expect(formValidation.isValidField(testField)).toEqual(false);
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
    it('It fails validation if the current field value does not match the supplied pattern expression', function() {
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
describe('ItemsCollection tests - ',function() {
  it('throws an error when trying to add anythting but an array or undefined to the contructor', function() {
    expect(function() {new ItemsCollection();}).not.toThrow();
    expect(function() {new ItemsCollection([{test:'test'},{test:'test2'}]);}).not.toThrow();
    expect(function() {new ItemsCollection({});}).toThrow();
    expect(function() {new ItemsCollection('gg');}).toThrow();
    expect(function() {new ItemsCollection(3);}).toThrow();
  });
  it('throws an error when trying to add anythting but an array or undefined to the contructor', function() {
    expect(function() {
        new ItemsCollection([],'s');
      }).toThrow();
      expect(function() {
         new ItemsCollection([],{});
      }).toThrow();
      expect(function() {
         new ItemsCollection([],[]);
      }).toThrow();
      expect(function() {
         new ItemsCollection([],4);
      }).toThrow();
      expect(function() {
         new ItemsCollection([]);
      }).not.toThrow();
      expect(function() {
         new ItemsCollection([],function() {});
      }).not.toThrow();
  });
  it('adds the passed array onto the collection object', function() {
    var arrayTest = [{test:'test'},{test:'test2'}];
    expect(new ItemsCollection(arrayTest).items).toEqual(arrayTest);
  });
  it('sets the items array property to an empty array if no array is passed in the contructor', function() {
    expect(Array.isArray(new ItemsCollection().items)).toEqual(true);
    expect(new ItemsCollection().items.length).toEqual(0);
  });
  it('adds a passed object to the items array', function() {
    var passedObject = {'eventName':'blah'},
        itemsCollection = new ItemsCollection([{test:'test'},{test:'test2'}]);
    expect(itemsCollection.items.length).toEqual(2);
    itemsCollection.add(passedObject);
    expect(itemsCollection.items.length).toEqual(3);
    expect(itemsCollection.items.pop()).toEqual(passedObject);
  });
  describe('renderItemHtml method tests - ',function() {
    it('interpolates the template with data correctly', function() {
      var testItem = {test:'Example1', test2:'Example2'},
          itemsCollection = new ItemsCollection([]);
          templateSampleHtml = '<p>{{test}}</p><span>{{test2}}</span>';
      expect(itemsCollection.renderItemHtml(templateSampleHtml,testItem)).toEqual('<p>Example1</p><span>Example2</span>');
    });
  });
   describe('renderListHtml method tests - ',function() {
    it('generate item lists correctly', function() {
      var testItem = {test:'Example1', test2:'Example2'},
          itemsCollection = new ItemsCollection([{test:'Example1', test2:'Example2'},{test:'Example3', test2:'Example4'}]);
          templateListHtml = '<p>{{test}}</p><span>{{test2}}</span>';
      expect(itemsCollection.renderListHtml(templateSampleHtml,testItem)).toEqual('<p>Example1</p><span>Example2</span><p>Example3</p><span>Example4</span>');
    });
  });
});