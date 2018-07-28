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
      if (isRequired === void 0) { isRequired = false; }
      if (isNotNegative === void 0) { isNotNegative = true; }
      this.isRequired = isRequired;
      this.isNotNegative = isNotNegative;
  }
  return ValidationRules;
}());
var SummaryValidationRules = /** @class */ (function (_super) {
  __extends(SummaryValidationRules, _super);
  function SummaryValidationRules(isRequired, isNotNegative, isEqualToSumOf) {
      if (isRequired === void 0) { isRequired = false; }
      if (isNotNegative === void 0) { isNotNegative = true; }
      if (isEqualToSumOf === void 0) { isEqualToSumOf = []; }
      var _this = _super.call(this, isRequired, isNotNegative) || this;
      _this.isEqualToSumOf = isEqualToSumOf;
      return _this;
  }
  return SummaryValidationRules;
}(ValidationRules));
var Field = /** @class */ (function () {
  function Field(name, validationRules) {
      this.name = name;
      this.validationRules = validationRules;
      this.init();
  }
  /**
   * Shows the errors.
   */
  Field.prototype.showErrors = function () {
      this.element.querySelector('.error').innerHTML = this.errors.join('<br>');
  };
  /**
   * Clears the errors.
   */
  Field.prototype.clearErrors = function () {
      this.errors = [];
      this.element.querySelector('.error').innerHTML = '';
  };
  Object.defineProperty(Field.prototype, "value", {
      /**
       * Gets the value based on the input.
       */
      get: function () {
          var hyphenatedName = this.getHyphenatedName();
          var txtbox = document.getElementById("txt-" + hyphenatedName);
          return Number(txtbox.value);
      },
      enumerable: true,
      configurable: true
  });
  Object.defineProperty(Field.prototype, "unit", {
      /**
       * Gets the unit based on the selected radio button.
       */
      get: function () {
          var hyphenatedName = this.getHyphenatedName();
          var rb = document.querySelector("input[name=\"" + hyphenatedName + "-unit\"]:checked");
          return rb ? rb.value : null;
      },
      enumerable: true,
      configurable: true
  });
  Object.defineProperty(Field.prototype, "type", {
      /**
       * Gets the field type based on the selected radio button.
       */
      get: function () {
          var hyphenatedName = this.getHyphenatedName();
          var rb = document.querySelector("input[name=\"" + hyphenatedName + "-type\"]:checked");
          return rb ? rb.value : null;
      },
      /**
       * Selects the radio button with the corresponding field type.
       * @param {FieldType} fieldType - The type of field.
       */
      set: function (fieldType) {
          var hyphenatedName = this.getHyphenatedName();
          var rb = document.getElementById("rb-" + hyphenatedName + "-type-" + fieldType);
          rb.checked = true;
      },
      enumerable: true,
      configurable: true
  });
  Object.defineProperty(Field.prototype, "barrels", {
      /**
       * Gets the value in barrels.
       * @returns {number} The value in barrels.
       */
      get: function () {
          return this.unit === Unit.Barrel ? this.value : this.value * 7.33;
      },
      enumerable: true,
      configurable: true
  });
  /**
   * Initializes the field component.
   */
  Field.prototype.init = function () {
      this.element = document.createElement('div');
      this.element.classList.add('field');
      var range = document.createRange();
      var hyphenatedName = this.getHyphenatedName();
      var template = "\n      <label for=\"txt-" + hyphenatedName + "\">\n        " + this.name + "\n        " + (this.validationRules.isRequired ? '<abbr title="required">*</abbr>' : '') + "\n      </label>\n      <div>\n        <input id=\"txt-" + hyphenatedName + "\" type=\"number\" min=\"0\">\n        <ul class=\"radio-button-group\">\n          <li>\n            <label for=\"rb-" + hyphenatedName + "-unit-barrel\">\n              <input id=\"rb-" + hyphenatedName + "-unit-barrel\" type=\"radio\" name=\"" + hyphenatedName + "-unit\" value=\"barrel\">\n              <span>Barrels</span>\n            </label>\n          </li>\n          <li>\n            <label for=\"rb-" + hyphenatedName + "-unit-metric-ton\">\n              <input id=\"rb-" + hyphenatedName + "-unit-metric-ton\" type=\"radio\" name=\"" + hyphenatedName + "-unit\" value=\"metric ton\">\n              <span>Metric Tons</span>\n            </label>\n          </li>\n        </ul>\n        <ul class=\"radio-button-group\">\n          <li>\n            <label for=\"rb-" + hyphenatedName + "-type-reported\">\n              <input id=\"rb-" + hyphenatedName + "-type-reported\" type=\"radio\" name=\"" + hyphenatedName + "-type\" value=\"reported\">\n              <span>Reported</span>\n            </label>\n          </li>\n          <li>\n            <label for=\"rb-" + hyphenatedName + "-type-modeled\">\n              <input id=\"rb-" + hyphenatedName + "-type-modeled\" type=\"radio\" name=\"" + hyphenatedName + "-type\" value=\"modeled\">\n              <span>Modeled</span>\n            </label>\n          </li>\n        </ul>\n      </div>\n      <p class=\"error\"></p>\n    ";
      var frag = range.createContextualFragment(template);
      this.element.appendChild(frag);
  };
  /**
   * Gets the hyphenated name of the field.
   * @returns {string} The hyphenated name.
   */
  Field.prototype.getHyphenatedName = function () {
      return this.name.replace(/,/g, '').split(' ').join('-').toLowerCase();
  };
  return Field;
}());
var SummaryField = /** @class */ (function (_super) {
  __extends(SummaryField, _super);
  function SummaryField(name, validationRules) {
      return _super.call(this, name, validationRules) || this;
  }
  /**
   * Sets the calculated value of the input.
   */
  SummaryField.prototype.setValue = function () {
      var hyphenatedName = this.getHyphenatedName();
      var txtbox = document.getElementById("txt-" + hyphenatedName);
      var valueType = this.validationRules.isEqualToSumOf.some(function (field) { return field.type === FieldType.Modeled; }) ? 'modeled' : 'reported';
      var rbUnit = document.getElementById("rb-" + hyphenatedName + "-unit-barrel");
      var rbType = document.getElementById("rb-" + hyphenatedName + "-type-" + valueType);
      txtbox.value = this.calculate().toString();
      rbUnit.checked = true;
      rbType.checked = true;
  };
  /**
   * Calculates the value of the field based on its dependencies.
   * @returns {number} The calculated value in barrels.
   */
  SummaryField.prototype.calculate = function () {
      var _this = this;
      var shouldBe = this.validationRules.isEqualToSumOf.reduce(function (sum, field) {
          var fieldValue = 0;
          if (field.value > 0 && field.unit && field.type) {
              if (field.type === FieldType.Modeled) {
                  _this.type = FieldType.Modeled;
              }
              fieldValue = field.barrels;
          }
          return sum + fieldValue;
      }, 0);
      return shouldBe;
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
   * Submits the form.
   */
  App.prototype.submit = function () {
      var hasErrors = false;
      this.fields.forEach(function (field) {
          field.clearErrors();
          var value = field.value;
          var rules = field.validationRules;
          if (rules.isRequired && value === 0) {
              field.errors.push(field.name + " is required.");
              hasErrors = true;
          }
          if (rules.isNotNegative && value < 0) {
              field.errors.push(field.name + " cannot be negative.");
              hasErrors = true;
          }
          // Should also have units and type.
          if (value) {
              if (!field.unit) {
                  field.errors.push(field.name + " must have a unit.");
                  hasErrors = true;
              }
              if (!field.type) {
                  field.errors.push(field.name + " must have a type.");
                  hasErrors = true;
              }
          }
          // Summary fields.
          if (field.validationRules.isEqualToSumOf) {
              var summaryField = field;
              var sumOf = summaryField.validationRules.isEqualToSumOf;
              if (sumOf.length) {
                  var calculatedType = sumOf.some(function (fld) { return fld.value > 0 && fld.unit && fld.type && fld.type === FieldType.Modeled; })
                      ? FieldType.Modeled
                      : FieldType.Reported;
                  if (value === 0) {
                      summaryField.setValue();
                  }
                  else if (summaryField.calculate() !== summaryField.barrels) { // Check if the input value is equal to the total barrels of referenced fields.
                      var errorTemplate = summaryField.name + " must be equal to the sum of " + sumOf.map(function (fld) { return fld.name; }).join(', ') + " in barrels (1 Metric Ton = 7.33 Barrels)";
                      summaryField.errors.push(errorTemplate);
                      hasErrors = true;
                  }
                  else if (summaryField.type !== calculatedType) {
                      var errorTemplate = summaryField.type === FieldType.Modeled
                          ? summaryField.name + " must be of type \"Modeled\" when at least one of " + sumOf.map(function (fld) { return fld.name; }).join(', ') + " is \"Modeled\"."
                          : summaryField.name + " must be of type \"Reported\" when " + sumOf.map(function (fld) { return fld.name; }).join(', ') + " are \"Reported\".";
                      summaryField.errors.push(errorTemplate);
                      hasErrors = true;
                  }
              }
          }
          if (field.errors.length) {
              field.showErrors();
          }
      });
      if (hasErrors) {
          return;
      }
      // Submit form.
      alert(this.getSummary());
  };
  /**
   * Clears the form.
   */
  App.prototype.clear = function () {
      this.element.querySelectorAll('input[type=number], input[type=radio]').forEach(function (el) {
          var input = el;
          switch (input.type) {
              case 'number':
                  input.value = '';
                  break;
              case 'radio':
                  input.checked = false;
                  break;
              default:
          }
      });
      this.fields.forEach(function (field) { return field.clearErrors(); });
  };
  /**
   * Initialize the app component.
   */
  App.prototype.init = function () {
      var _this = this;
      var range = document.createRange();
      var template = "\n      <form>\n        <div class=\"button-container\">\n          <button type=\"button\" class=\"btn-submit\">Submit</button>\n          <button type=\"button\" class=\"btn-clear\">Clear</button>\n        </div>\n      </form>\n    ";
      var frag = range.createContextualFragment(template);
      var form = frag.querySelector('form');
      var btnSubmit = frag.querySelector('.btn-submit');
      var btnClear = frag.querySelector('.btn-clear');
      this.fields.forEach(function (field) { return form.insertBefore(field.element, form.childNodes[form.childNodes.length - 2]); });
      btnSubmit.addEventListener('click', function (e) {
          e.preventDefault();
          _this.submit();
      });
      btnClear.addEventListener('click', function (e) {
          e.preventDefault();
          _this.clear();
      });
      this.element.appendChild(frag);
  };
  /**
   * Get the summary.
   * @returns {string} - The summary.
   */
  App.prototype.getSummary = function () {
      return this.fields.map(function (field) {
          return field.name + ": " + field.barrels + " barrels, " + (field.type ? field.type : '-');
      }).join('\n');
  };
  return App;
}());
(function () {
  var container = document.getElementById('app');
  var genericNonNegativeValidationRule = new ValidationRules();
  var proved = new Field('Proved', new ValidationRules(true, true));
  var probable = new Field('Probable', genericNonNegativeValidationRule);
  var provedAndProbable = new SummaryField('Proved and Probable', new SummaryValidationRules(false, true, [proved, probable]));
  var possible = new Field('Possible', genericNonNegativeValidationRule);
  var provedProbableAndPossible = new SummaryField('Proved, Probable, and Possible', new SummaryValidationRules(false, true, [proved, probable, possible]));
  var contingent = new Field('Contingent', genericNonNegativeValidationRule);
  var prospective = new Field('Prospective', genericNonNegativeValidationRule);
  var fields = [
      proved,
      probable,
      provedAndProbable,
      possible,
      provedProbableAndPossible,
      contingent,
      prospective,
  ];
  var app = new App(container, fields);
})();
