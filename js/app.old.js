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
