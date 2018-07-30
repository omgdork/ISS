// const Unit = {
//   Barrel: 'barrel',
//   MetricTon: 'metric ton',
// };

// const FieldType = {
//   Reported: 'reported',
//   Modeled: 'modeled',
// };

// class ValidationRules {
//   constructor(isRequired, isNotNegative) {
//     this.isRequired = isRequired;
//     this.isNotNegative = isNotNegative;
//   }
// }

// class SummaryValidationRules extends ValidationRules {
//   constructor(isRequired, isNotNegative, isEqualToSumOf) {
//     super(isRequired, isNotNegative);
//     this.isEqualToSumOf = isEqualToSumOf;
//   }
// }

// class Field {
//   constructor(name, validationRules) {
//     this.name = name;
//     this.fieldType = null;
//     this.validationRules = validationRules;
//     this.errors = [];
//     this.init();
//   }

//   /**
//    * Initializes the field.
//    */
//   init() {
//     const range = document.createRange();
//     const hyphenatedName = this.getHyphenatedName();
//     const template = `
//       <label for="txt-${hyphenatedName}">
//         ${this.name}
//         ${this.validationRules.isRequired ? '<abbr title="required">*</abbr>' : ''}
//       </label>
//       <span class="barrels"></span>
//       <div>
//         <input id="txt-${hyphenatedName}" type="number" min="0">
//         <ul class="radio-button-group">
//           <li>
//             <label for="rb-${hyphenatedName}-type-reported">
//               <input id="rb-${hyphenatedName}-type-reported" type="radio" name="${hyphenatedName}-type" value="reported">
//               <span>Reported</span>
//             </label>
//           </li>
//           <li>
//             <label for="rb-${hyphenatedName}-type-modeled">
//               <input id="rb-${hyphenatedName}-type-modeled" type="radio" name="${hyphenatedName}-type" value="modeled">
//               <span>Modeled</span>
//             </label>
//           </li>
//         </ul>
//       </div>
//       <p class="error"></p>
//     `;
//     const frag = range.createContextualFragment(template);
//     const txtbox = frag.querySelector('input[type=number]');
//     const radios = frag.querySelectorAll(`input[type=radio]`);

//     txtbox.addEventListener('input', (e) => {
//       const value = e.target.value;
//       this.clearErrors();
//       this.setUpTextboxErrorHandlers(value);
//       this.updateBarrelsField();
//       this.showErrors();
//     });

//     radios.forEach((radio) => {
//       radio.addEventListener('change', (e) => {
//         this.fieldType = e.target.value;

//         const errorIndex = this.errors.indexOf(`${this.name} must have a type (Reported or Modeled).`);
        
//         if (errorIndex >= 0) {
//           this.errors.splice(errorIndex, 1);
//           this.showErrors();
//         }
//       });
//     });

//     if (this.validationRules.isRequired) {
//       this.errors.push(`${this.name} is required.`);
//     }

//     this.element = document.createElement('div');
//     this.element.classList.add('field');
//     this.element.appendChild(frag);
//   }

//   /**
//    * Gets the hyphenated name of the field.
//    * @returns {string} The hyphenated name.
//    */
//   getHyphenatedName() {
//     return this.name.replace(/,/g, '').split(' ').join('-').toLowerCase();
//   }

//   /**
//    * Sets up the textbox error handlers.
//    * @param {string} value - The value of the textbox.
//    */
//   setUpTextboxErrorHandlers(value) {
//     if (this.validationRules.isRequired && value === '') {
//       this.errors.push(`${this.name} is required.`);
//     }

//     if (this.validationRules.isNotNegative && value < 0) {
//       this.errors.push(`${this.name} cannot be negative.`);
//     }

//     if (value !== '' && !this.fieldType) {
//       this.errors.push(`${this.name} must have a type (Reported or Modeled).`);
//     }
//   }

//   /**
//    * Shows the errors.
//    */
//   showErrors() {
//     this.element.querySelector('.error').innerHTML = this.errors.join('<br>');
//   }

//   /**
//    * Clears the errors.
//    */
//   clearErrors() {
//     this.errors = [];
//     this.element.querySelector('.error').innerHTML = '';
//   }

//   /**
//    * Clears the field.
//    */
//   clear() {
//     const hyphenatedName = this.getHyphenatedName();
//     const txtbox = document.getElementById(`txt-${hyphenatedName}`);
//     const rbReported = document.getElementById(`rb-${hyphenatedName}-type-reported`);
//     const rbModeled = document.getElementById(`rb-${hyphenatedName}-type-modeled`);

//     txtbox.value = '';
//     rbReported.checked = false;
//     rbModeled.checked = false;
//     this.fieldType = null;
//     this.updateBarrelsField();
//   }

//   /**
//    * Updates the barrels field text.
//    */
//   updateBarrelsField() {
//     const valueInBarrels = this.element.querySelector('.barrels');

//     valueInBarrels.innerHTML = this.barrels > 0 ? `(${this.barrels} barrels)` : '';
//   }

//   /**
//    * Gets the value in barrels.
//    * @returns {number} The value in barrels.
//    */
//   get barrels() {
//     const valueInBarrels = this.unit === Unit.Barrel ? this.value : this.value * 7.33;

//     return Number(valueInBarrels).toFixed(1);
//   }

//   /**
//    * Gets the value from the textbox.
//    * @returns {string} The value of the textbox.
//    */
//   get value() {
//     const hyphenatedName = this.getHyphenatedName();
//     const txtbox = document.getElementById(`txt-${hyphenatedName}`);

//     return txtbox.value;
//   }
// }

// class SummaryField extends Field {
//   constructor(name, validationRules) {
//     super(name, validationRules);
//     this.setUpFieldTypeErrorHandlers();
//   }

//   /**
//    * Add textbox error handlers.
//    * @param {string} value - The value of the textbox.
//    */
//   setUpTextboxErrorHandlers(value) {
//     super.setUpTextboxErrorHandlers(value);

//     let total = 0;
//     let isCalculated = true;

//     this.validationRules.isEqualToSumOf.forEach((addend) => {
//       if (addend.value === '') {
//         isCalculated = false;
//         return;
//       }

//       total += Number(addend.value);
//     });

//     if (isCalculated && total !== Number(value)) {
//       this.errors.push(`${this.name} must be equal to the total of ${this.validationRules.isEqualToSumOf.map((addend) => addend.name).join(', ')}.`);
//     }

//     if (!isCalculated && total > Number(value)) {
//       this.errors.push(`${this.name} must be greater than or equal to ${this.validationRules.isEqualToSumOf.filter((addend) => addend.value !== '').map((addend) => addend.name).join(',')}.`);
//     }
//   }

//   /**
//    * Adds change listeners to the field type radio buttons.
//    */
//   setUpFieldTypeErrorHandlers() {
//     this.element.querySelectorAll('input[type="radio"]').forEach((radio) => {
//       radio.addEventListener('change', (e) => {
//         const sumOf = this.validationRules.isEqualToSumOf;
//         const typeShouldBe = sumOf.some((addend) => addend.fieldType === FieldType.Modeled) ? FieldType.Modeled : FieldType.Reported;
//         const modeledError = `${this.name} must be of type "Modeled" when at least one of ${sumOf.map((addend) => addend.name).join(', ')} is "Modeled".`;
//         const reportedError = `${this.name} must be of type "Reported" when ${sumOf.map((addend) => addend.name).join(', ')} are "Reported".`;

//         // Clear the modeled/reported errors first.
//         const modeledErrorIndex = this.errors.indexOf(modeledError);
//         const reportedErrorIndex = this.errors.indexOf(reportedError);

//         if (modeledErrorIndex >= 0) {
//           this.errors.splice(modeledErrorIndex, 1);
//         }

//         if (reportedErrorIndex >= 0) {
//           this.errors.splice(reportedErrorIndex, 1);
//         }

//         // Validate.
//         if (typeShouldBe !== e.target.value) {
//           const error = e.target.value === FieldType.Reported ? modeledError : reportedError;

//           this.errors.push(error);
//         }

//         this.showErrors();
//       });
//     });
//   }

//   /**
//    * Calculates the value of the summary field only if all addend fields have values
//    * and sets its type (Reported if all addend fields are reported).
//    */
//   calculate() {
//     let value = 0;
//     let fieldType = FieldType.Reported;
//     let shouldCalculate = true;

//     this.validationRules.isEqualToSumOf.forEach((field) => {
//       const textbox = field.element.querySelector('input[type=number]');
//       const checked = field.element.querySelector(`input[name=${field.getHyphenatedName()}-type]:checked`);

//       if (textbox.value !== '' && checked) {
//         value += Number(textbox.value);

//         if (checked.value === FieldType.Modeled) {
//           fieldType = FieldType.Modeled;
//         }
//       } else {
//         shouldCalculate = false;
//       }
//     });

//     if (shouldCalculate) {
//       this.setValue(value, fieldType);
//     } else {
//       this.clear();
//     }
//   }

//   /**
//    * Sets the value and type of the field.
//    * @param {number} value - The value.
//    * @param {string} fieldType - The field type.
//    */
//   setValue(value, fieldType) {
//     const hyphenatedName = this.getHyphenatedName();
//     const txtbox = document.getElementById(`txt-${hyphenatedName}`);
//     const rb = document.getElementById(`rb-${hyphenatedName}-type-${fieldType}`);

//     txtbox.value = value;
//     rb.checked = true;
//     this.fieldType = fieldType;
//     this.clearErrors();
//     this.updateBarrelsField();
//   }
// }

// class App {
//   constructor(element, fields) {
//     this.element = element;
//     this.fields = fields;
//     this.init();
//   }

//   /**
//    * Initialize the app component.
//    */
//   init() {
//     const range = document.createRange();
//     const template = `
//       <form>
//         <div class="field">
//           <label for="dd-unit">Unit</label>
//           <select id="dd-unit">
//             <option value="barrel" selected>Barrels</option>
//             <option value="metric ton">Metric Tons</option>
//           </select>
//         </div>
//         <div class="button-container">
//           <button type="button" class="btn-submit">Submit</button>
//           <button type="button" class="btn-clear">Clear</button>
//         </div>
//       </form>
//     `;
//     const frag = range.createContextualFragment(template);
//     const form = frag.querySelector('form');
//     const ddUnit = form.querySelector('#dd-unit');
//     const btnSubmit = form.querySelector('.btn-submit');
//     const btnClear = form.querySelector('.btn-clear');

//     ddUnit.addEventListener('change', (e) => {
//       this.fields.forEach((field) => {
//         field.unit = e.target.value;
//         field.updateBarrelsField();
//       });
//     });
//     btnSubmit.addEventListener('click', (e) => this.submit());
//     btnClear.addEventListener('click', (e) => this.clear());

//     this.fields.forEach((field) => {
//       field.unit = 'barrel';

//       // Add event listeners to addend fields.
//       if (field instanceof SummaryField) {
//         field.validationRules.isEqualToSumOf.forEach((addend) => {
//           const textbox = addend.element.querySelector('input[type=number]');
//           const radios = addend.element.querySelectorAll(`input[name=${addend.getHyphenatedName()}-type]`);

//           textbox.addEventListener('input', (e) => field.calculate());
//           radios.forEach((radio) => radio.addEventListener('change', (e) => field.calculate()));
//         });
//       }
      
//       form.insertBefore(field.element, form.childNodes[form.childNodes.length - 2]);
//     });

//     this.element.appendChild(frag);
//   }

//   /**
//    * Submits the form.
//    */
//   submit() {
//     const hasErrors = this.fields.some((field) => field.errors.length > 0);

//     if (hasErrors) {
//       this.fields.forEach((field) => field.showErrors());
//       return;
//     }

//     alert(this.getSummary());
//   }

//   /**
//    * Clears the form.
//    */
//   clear() {
//     this.fields.forEach((field) => field.clear());
//   }

//   /**
//    * Get the summary.
//    * @returns {string} - The summary.
//    */
//   getSummary() {
//     return this.fields.map((field) => {
//       return `${field.name}: ${field.barrels} barrels, ${field.fieldType ? field.fieldType : '-'}`;
//     }).join('\n');
//   }
// }

// (() => {
//   const container = document.getElementById('app');
//   const notRequired = new ValidationRules(false, true);
//   const proved = new Field('Proved', new ValidationRules(true, true));
//   const probable = new Field('Probable', notRequired);
//   const provedAndProbable = new SummaryField('Proved and Probable', new SummaryValidationRules(false, true, [proved, probable]));
//   const possible = new Field('Possible', notRequired);
//   const provedProbableAndPossible = new SummaryField('Proved, Probable, and Possible', new SummaryValidationRules(false, true, [provedAndProbable, possible]));
//   const contingent = new Field('Contingent', notRequired);
//   const prospective = new Field('Prospective', notRequired);
//   const app = new App(container, [
//     proved,
//     probable,
//     provedAndProbable,
//     possible,
//     provedProbableAndPossible,
//     contingent,
//     prospective,
//   ]);
// })();

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
  };
  /**
   * Adds change listeners to the field type radio buttons.
   */
  SummaryField.prototype.setUpFieldTypeErrorHandlers = function () {
      var _this = this;
      this.element.querySelectorAll('input[type="radio"]').forEach(function (radio) {
          radio.addEventListener('change', function (e) {
              var target = e.target;
              var sumOf = _this.validationRules.isEqualToSumOf;
              var typeShouldBe = sumOf.some(function (addend) { return addend.fieldType === FieldType.Modeled; }) ? FieldType.Modeled : FieldType.Reported;
              var modeledError = _this.name + " must be of type \"Modeled\" when at least one of " + sumOf.map(function (addend) { return addend.name; }).join(', ') + " is \"Modeled\".";
              var reportedError = _this.name + " must be of type \"Reported\" when " + sumOf.map(function (addend) { return addend.name; }).join(', ') + " are \"Reported\".";
              // Clear the modeled/reported errors first.
              var modeledErrorIndex = _this.errors.indexOf(modeledError);
              var reportedErrorIndex = _this.errors.indexOf(reportedError);
              if (modeledErrorIndex >= 0) {
                  _this.errors.splice(modeledErrorIndex, 1);
              }
              if (reportedErrorIndex >= 0) {
                  _this.errors.splice(reportedErrorIndex, 1);
              }
              // Validate.
              if (typeShouldBe !== target.value) {
                  var error = target.value === FieldType.Reported ? modeledError : reportedError;
                  _this.errors.push(error);
              }
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
      txtbox.value = value;
      rb.checked = true;
      this.fieldType = fieldType;
      this.clearErrors();
      this.updateBarrelsField();
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
