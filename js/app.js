var __extends = (this && this.__extends) || (function () {
  var extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
  return function (d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var Unit;
(function (Unit) {
  Unit["Barrel"] = "barrel";
  Unit["MetricTon"] = "metric ton";
})(Unit || (Unit = {}));
var FieldType;
(function (FieldType) {
  FieldType["Reported"] = "reported";
  FieldType["Modeled"] = "modeled";
})(FieldType || (FieldType = {}));
var ValidationRules = /** @class */ (function () {
  function ValidationRules(isRequired, isNotNegative) {
      this.isRequired = isRequired;
      this.isNotNegative = isNotNegative;
  }
  return ValidationRules;
}());
var SummaryValidationRules = /** @class */ (function (_super) {
  __extends(SummaryValidationRules, _super);
  function SummaryValidationRules(isRequired, isNotNegative, isEqualToSumOf) {
      var _this = _super.call(this, isRequired, isNotNegative) || this;
      _this.isEqualToSumOf = isEqualToSumOf;
      return _this;
  }
  return SummaryValidationRules;
}(ValidationRules));
var Field = /** @class */ (function () {
  function Field(name, validationRules) {
      this.fieldType = null;
      this.unit = Unit.Barrel;
      this.errors = [];
      this.name = name;
      this.validationRules = validationRules;
      this.init();
  }
  /**
   * Initializes the field.
   */
  Field.prototype.init = function () {
      var _this = this;
      var range = document.createRange();
      var hyphenatedName = this.getHyphenatedName();
      var template = "\n      <label for=\"txt-" + hyphenatedName + "\">\n        " + this.name + "\n        " + (this.validationRules.isRequired ? '<abbr title="required">*</abbr>' : '') + "\n      </label>\n      <span class=\"barrels\"></span>\n      <div>\n        <input id=\"txt-" + hyphenatedName + "\" type=\"number\" min=\"0\">\n        <ul class=\"radio-button-group\">\n          <li>\n            <label for=\"rb-" + hyphenatedName + "-type-reported\">\n              <input id=\"rb-" + hyphenatedName + "-type-reported\" type=\"radio\" name=\"" + hyphenatedName + "-type\" value=\"reported\">\n              <span>Reported</span>\n            </label>\n          </li>\n          <li>\n            <label for=\"rb-" + hyphenatedName + "-type-modeled\">\n              <input id=\"rb-" + hyphenatedName + "-type-modeled\" type=\"radio\" name=\"" + hyphenatedName + "-type\" value=\"modeled\">\n              <span>Modeled</span>\n            </label>\n          </li>\n        </ul>\n      </div>\n      <p class=\"error\"></p>\n    ";
      var frag = range.createContextualFragment(template);
      var txtbox = frag.querySelector('input[type=number]');
      var radios = frag.querySelectorAll("input[type=radio]");
      txtbox.addEventListener('input', function (e) {
          var value = e.target.value;
          _this.clearErrors();
          _this.setUpTextboxErrorHandlers(value);
          _this.updateBarrelsField();
          _this.showErrors();
      });
      radios.forEach(function (radio) {
          radio.addEventListener('change', function (e) {
              _this.fieldType = e.target.value;
              var errorIndex = _this.errors.indexOf(_this.name + " must have a type (Reported or Modeled).");
              if (errorIndex >= 0) {
                  _this.errors.splice(errorIndex, 1);
                  _this.showErrors();
              }
          });
      });
      if (this.validationRules.isRequired) {
          this.errors.push(this.name + " is required.");
      }
      this.element = document.createElement('div');
      this.element.classList.add('field');
      this.element.appendChild(frag);
  };
  /**
   * Gets the hyphenated name of the field.
   * @returns {string} The hyphenated name.
   */
  Field.prototype.getHyphenatedName = function () {
      return this.name.replace(/,/g, '').split(' ').join('-').toLowerCase();
  };
  /**
   * Clears the errors.
   */
  Field.prototype.clearErrors = function () {
      this.errors = [];
      this.element.querySelector('.error').innerHTML = '';
  };
  /**
   * Shows the errors.
   */
  Field.prototype.showErrors = function () {
      this.element.querySelector('.error').innerHTML = this.errors.join('<br>');
  };
  /**
   * Sets up the textbox error handlers.
   * @param {string} value - The value of the textbox.
   */
  Field.prototype.setUpTextboxErrorHandlers = function (value) {
      if (this.validationRules.isRequired && value === '') {
          this.errors.push(this.name + " is required.");
      }
      if (this.validationRules.isNotNegative && value < 0) {
          this.errors.push(this.name + " cannot be negative.");
      }
      if (value !== '' && !this.fieldType) {
          this.errors.push(this.name + " must have a type (Reported or Modeled).");
      }
  };
  /**
   * Updates the barrels field text.
   */
  Field.prototype.updateBarrelsField = function () {
      var valueInBarrels = this.element.querySelector('.barrels');
      valueInBarrels.innerHTML = this.barrels > 0 ? "(" + this.barrels + " barrels)" : '';
  };
  /**
   * Clears the field.
   */
  Field.prototype.clear = function () {
      var hyphenatedName = this.getHyphenatedName();
      var txtbox = document.getElementById("txt-" + hyphenatedName);
      var rbReported = document.getElementById("rb-" + hyphenatedName + "-type-reported");
      var rbModeled = document.getElementById("rb-" + hyphenatedName + "-type-modeled");
      txtbox.value = '';
      rbReported.checked = false;
      rbModeled.checked = false;
      this.fieldType = null;
      this.updateBarrelsField();
  };
  Object.defineProperty(Field.prototype, "barrels", {
      /**
       * Gets the value in barrels.
       * @returns {number} The value in barrels.
       */
      get: function () {
          var value = Number(this.value);
          var valueInBarrels = this.unit === Unit.Barrel ? value : value * 7.33;
          return +valueInBarrels.toFixed(1);
      },
      enumerable: true,
      configurable: true
  });
  Object.defineProperty(Field.prototype, "value", {
      /**
       * Gets the value from the textbox.
       * @returns {string} The value of the textbox.
       */
      get: function () {
          var hyphenatedName = this.getHyphenatedName();
          var txtbox = document.getElementById("txt-" + hyphenatedName);
          return txtbox.value;
      },
      enumerable: true,
      configurable: true
  });
  return Field;
}());
var SummaryField = /** @class */ (function (_super) {
  __extends(SummaryField, _super);
  function SummaryField(name, validationRules) {
      var _this = _super.call(this, name, validationRules) || this;
      _this.setUpFieldTypeErrorHandlers();
      return _this;
  }
  /**
   * Add textbox error handlers.
   * @param {string} value - The value of the textbox.
   */
  SummaryField.prototype.setUpTextboxErrorHandlers = function (value) {
      _super.prototype.setUpTextboxErrorHandlers.call(this, value);
      var total = 0;
      var isCalculated = true;
      var rbSelectedType = this.element.querySelector("input[name=" + this.getHyphenatedName() + "-type]:checked");
      this.validationRules.isEqualToSumOf.forEach(function (addend) {
          if (addend.value === '') {
              isCalculated = false;
              return;
          }
          total += Number(addend.value);
      });
      if (isCalculated && total !== Number(value)) {
          this.errors.push(this.name + " must be equal to the total of " + this.validationRules.isEqualToSumOf.map(function (addend) { return addend.name; }).join(', ') + ".");
      }
      if (!isCalculated && total > Number(value)) {
          this.errors.push(this.name + " must be greater than or equal to \n        " + this.validationRules.isEqualToSumOf.filter(function (addend) { return addend.value !== ''; }).map(function (addend) { return addend.name; }).join(',') + ".");
      }
      if (rbSelectedType !== null) {
          this.handleFieldTypeError(rbSelectedType.value);
      }
  };
  /**
   * Adds change listeners to the field type radio buttons.
   */
  SummaryField.prototype.setUpFieldTypeErrorHandlers = function () {
      var _this = this;
      this.element.querySelectorAll('input[type="radio"]').forEach(function (radio) {
          radio.addEventListener('change', function (e) {
              var target = e.target;
              _this.handleFieldTypeError(target.value);
              _this.showErrors();
          });
      });
  };
  /**
   * Calculates the value of the summary field only if all addend fields have values
   * and sets its type (Reported if all addend fields are reported).
   */
  SummaryField.prototype.calculate = function () {
      var value = 0;
      var fieldType = FieldType.Reported;
      var shouldCalculate = true;
      this.validationRules.isEqualToSumOf.forEach(function (field) {
          var textbox = field.element.querySelector('input[type=number]');
          var checked = field.element.querySelector("input[name=" + field.getHyphenatedName() + "-type]:checked");
          if (textbox.value !== '' && checked) {
              value += Number(textbox.value);
              if (checked.value === FieldType.Modeled) {
                  fieldType = FieldType.Modeled;
              }
          }
          else {
              shouldCalculate = false;
          }
      });
      if (shouldCalculate) {
          this.setValue(value, fieldType);
      }
      else {
          this.clear();
      }
  };
  /**
   * Sets the value and type of the field.
   * @param {number} value - The value.
   * @param {string} fieldType - The field type.
   */
  SummaryField.prototype.setValue = function (value, fieldType) {
      var hyphenatedName = this.getHyphenatedName();
      var txtbox = document.getElementById("txt-" + hyphenatedName);
      var rb = document.getElementById("rb-" + hyphenatedName + "-type-" + fieldType);
      var inputEvent = new Event('input');
      var changeEvent = new Event('change');
      txtbox.value = value;
      txtbox.dispatchEvent(inputEvent);
      rb.checked = true;
      rb.dispatchEvent(changeEvent);
      this.fieldType = fieldType;
      this.clearErrors();
      this.updateBarrelsField();
  };
  /**
   * Checks the selected field type for errors.
   * @param {FieldType} fieldType - The selected field type.
   */
  SummaryField.prototype.handleFieldTypeError = function (fieldType) {
      var sumOf = this.validationRules.isEqualToSumOf;
      var typeShouldBe = sumOf.some(function (addend) { return addend.fieldType === FieldType.Modeled; }) ? FieldType.Modeled : FieldType.Reported;
      var modeledError = this.name + " must be of type \"Modeled\" when at least one of " + sumOf.map(function (addend) { return addend.name; }).join(', ') + " is \"Modeled\".";
      var reportedError = this.name + " must be of type \"Reported\" when " + sumOf.map(function (addend) { return addend.name; }).join(', ') + " are \"Reported\".";
      // Clear the modeled/reported errors first.
      var modeledErrorIndex = this.errors.indexOf(modeledError);
      var reportedErrorIndex = this.errors.indexOf(reportedError);
      if (modeledErrorIndex >= 0) {
          this.errors.splice(modeledErrorIndex, 1);
      }
      if (reportedErrorIndex >= 0) {
          this.errors.splice(reportedErrorIndex, 1);
      }
      // Validate.
      if (typeShouldBe !== fieldType) {
          var error = fieldType === FieldType.Reported ? modeledError : reportedError;
          this.errors.push(error);
      }
  };
  return SummaryField;
}(Field));
var App = /** @class */ (function () {
  function App(element, fields) {
      this.element = element;
      this.fields = fields;
      this.init();
  }
  /**
   * Initialize the app component.
   */
  App.prototype.init = function () {
      var _this = this;
      var range = document.createRange();
      var template = "\n      <form>\n        <div class=\"field\">\n          <label for=\"dd-unit\">Unit</label>\n          <select id=\"dd-unit\">\n            <option value=\"barrel\" selected>Barrels</option>\n            <option value=\"metric ton\">Metric Tons</option>\n          </select>\n        </div>\n        <div class=\"button-container\">\n          <button type=\"button\" class=\"btn-submit\">Submit</button>\n          <button type=\"button\" class=\"btn-clear\">Clear</button>\n        </div>\n      </form>\n    ";
      var frag = range.createContextualFragment(template);
      var form = frag.querySelector('form');
      var ddUnit = form.querySelector('#dd-unit');
      var btnSubmit = form.querySelector('.btn-submit');
      var btnClear = form.querySelector('.btn-clear');
      ddUnit.addEventListener('change', function (e) {
          _this.fields.forEach(function (field) {
              field.unit = e.target.value;
              field.updateBarrelsField();
          });
      });
      btnSubmit.addEventListener('click', function (e) { return _this.submit(); });
      btnClear.addEventListener('click', function (e) { return _this.clear(); });
      this.fields.forEach(function (field) {
          field.unit = 'barrel';
          // Add event listeners to addend fields.
          if (field instanceof SummaryField) {
              field.validationRules.isEqualToSumOf.forEach(function (addend) {
                  var textbox = addend.element.querySelector('input[type=number]');
                  var radios = addend.element.querySelectorAll("input[name=" + addend.getHyphenatedName() + "-type]");
                  textbox.addEventListener('input', function (e) { return field.calculate(); });
                  radios.forEach(function (radio) { return radio.addEventListener('change', function (e) { return field.calculate(); }); });
              });
          }
          form.insertBefore(field.element, form.childNodes[form.childNodes.length - 2]);
      });
      this.element.appendChild(frag);
  };
  /**
   * Submits the form.
   */
  App.prototype.submit = function () {
      var hasErrors = this.fields.some(function (field) { return field.errors.length > 0; });
      if (hasErrors) {
          this.fields.forEach(function (field) { return field.showErrors(); });
          return;
      }
      alert(this.getSummary());
  };
  /**
   * Clears the form.
   */
  App.prototype.clear = function () {
      this.fields.forEach(function (field) { return field.clear(); });
  };
  /**
   * Get the summary.
   * @returns {string} - The summary.
   */
  App.prototype.getSummary = function () {
      return this.fields.map(function (field) {
          return field.name + ": " + field.barrels + " barrels, " + (field.fieldType ? field.fieldType : '-');
      }).join('\n');
  };
  return App;
}());
(function () {
  var container = document.getElementById('app');
  var notRequired = new ValidationRules(false, true);
  var proved = new Field('Proved', new ValidationRules(true, true));
  var probable = new Field('Probable', notRequired);
  var provedAndProbable = new SummaryField('Proved and Probable', new SummaryValidationRules(false, true, [proved, probable]));
  var possible = new Field('Possible', notRequired);
  var provedProbableAndPossible = new SummaryField('Proved, Probable, and Possible', new SummaryValidationRules(false, true, [provedAndProbable, possible]));
  var contingent = new Field('Contingent', notRequired);
  var prospective = new Field('Prospective', notRequired);
  var app = new App(container, [
      proved,
      probable,
      provedAndProbable,
      possible,
      provedProbableAndPossible,
      contingent,
      prospective,
  ]);
})();
