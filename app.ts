enum Unit {
  Barrel = 'barrel',
  MetricTon = 'metric ton',
}

enum FieldType {
  Reported = 'reported',
  Modeled = 'modeled',
}

interface IValidationRules {
  isRequired: boolean;
  isNotNegative: boolean;
}

interface ISummaryValidationRules extends IValidationRules {
  isEqualToSumOf: Array<IField | ISummaryField>;
}

interface IField {
  name: string;
  fieldType: FieldType;
  unit: Unit;
  value: string;
  barrels: number;
  validationRules: IValidationRules;
  errors: Array<string>;
  showErrors: Function;
  clearErrors: Function;
  clear: Function;
  getHyphenatedName: Function;
  updateBarrelsField: Function;
  element: HTMLElement;
}

interface ISummaryField extends IField {
  validationRules: ISummaryValidationRules;
  calculate: Function;
  setValue: Function;
}

class ValidationRules implements IValidationRules {
  isRequired: boolean;
  isNotNegative: boolean;

  constructor(isRequired: boolean, isNotNegative: boolean) {
    this.isRequired = isRequired;
    this.isNotNegative = isNotNegative;
  }
}

class SummaryValidationRules extends ValidationRules implements ISummaryValidationRules {
  isEqualToSumOf: Array<IField | ISummaryField>;

  constructor(isRequired: boolean, isNotNegative: boolean, isEqualToSumOf: Array<IField | ISummaryField>) {
    super(isRequired, isNotNegative);
    this.isEqualToSumOf = isEqualToSumOf;
  }
}

class Field implements IField {
  name: string;
  fieldType: FieldType = null;
  unit: Unit = Unit.Barrel;
  validationRules: IValidationRules;
  errors: Array<string> = [];
  element: HTMLDivElement;

  constructor(name: string, validationRules: IValidationRules) {
    this.name = name;
    this.validationRules = validationRules;
    this.init();
  }

  /**
   * Initializes the field.
   */
  init(): void {
    const range: Range = document.createRange();
    const hyphenatedName: string = this.getHyphenatedName();
    const template: string = `
      <label for="txt-${hyphenatedName}">
        ${this.name}
        ${this.validationRules.isRequired ? '<abbr title="required">*</abbr>' : ''}
      </label>
      <span class="barrels"></span>
      <div>
        <input id="txt-${hyphenatedName}" type="number" min="0">
        <ul class="radio-button-group">
          <li>
            <label for="rb-${hyphenatedName}-type-reported">
              <input id="rb-${hyphenatedName}-type-reported" type="radio" name="${hyphenatedName}-type" value="reported">
              <span>Reported</span>
            </label>
          </li>
          <li>
            <label for="rb-${hyphenatedName}-type-modeled">
              <input id="rb-${hyphenatedName}-type-modeled" type="radio" name="${hyphenatedName}-type" value="modeled">
              <span>Modeled</span>
            </label>
          </li>
        </ul>
      </div>
      <p class="error"></p>
    `;
    const frag: DocumentFragment = range.createContextualFragment(template);
    const txtbox: HTMLInputElement = frag.querySelector('input[type=number]');
    const radios: NodeListOf<HTMLInputElement> = frag.querySelectorAll(`input[type=radio]`);

    txtbox.addEventListener('input', (e: Event) => {
      const value: string = (<HTMLInputElement>e.target).value;
      this.clearErrors();
      this.setUpTextboxErrorHandlers(value);
      this.updateBarrelsField();
      this.showErrors();
    });

    radios.forEach((radio: HTMLInputElement) => {
      radio.addEventListener('change', (e: Event) => {
        this.fieldType = <FieldType>(<HTMLInputElement>e.target).value;

        const errorIndex = this.errors.indexOf(`${this.name} must have a type (Reported or Modeled).`);
        
        if (errorIndex >= 0) {
          this.errors.splice(errorIndex, 1);
          this.showErrors();
        }
      });
    });

    if (this.validationRules.isRequired) {
      this.errors.push(`${this.name} is required.`);
    }

    this.element = document.createElement('div');
    this.element.classList.add('field');
    this.element.appendChild(frag);
  }

  /**
   * Gets the hyphenated name of the field.
   * @returns {string} The hyphenated name.
   */
  getHyphenatedName() {
    return this.name.replace(/,/g, '').split(' ').join('-').toLowerCase();
  }

  /**
   * Clears the errors.
   */
  clearErrors() {
    this.errors = [];
    this.element.querySelector('.error').innerHTML = '';
  }

  /**
   * Shows the errors.
   */
  showErrors() {
    this.element.querySelector('.error').innerHTML = this.errors.join('<br>');
  }

  /**
   * Sets up the textbox error handlers.
   * @param {string} value - The value of the textbox.
   */
  setUpTextboxErrorHandlers(value) {
    if (this.validationRules.isRequired && value === '') {
      this.errors.push(`${this.name} is required.`);
    }

    if (this.validationRules.isNotNegative && value < 0) {
      this.errors.push(`${this.name} cannot be negative.`);
    }

    if (value !== '' && !this.fieldType) {
      this.errors.push(`${this.name} must have a type (Reported or Modeled).`);
    }
  }

  /**
   * Updates the barrels field text.
   */
  updateBarrelsField() {
    const valueInBarrels = this.element.querySelector('.barrels');

    valueInBarrels.innerHTML = this.barrels > 0 ? `(${this.barrels} barrels)` : '';
  }

  /**
   * Clears the field.
   */
  clear() {
    const hyphenatedName: string = this.getHyphenatedName();
    const txtbox: HTMLInputElement = <HTMLInputElement>document.getElementById(`txt-${hyphenatedName}`);
    const rbReported: HTMLInputElement = <HTMLInputElement>document.getElementById(`rb-${hyphenatedName}-type-reported`);
    const rbModeled: HTMLInputElement = <HTMLInputElement>document.getElementById(`rb-${hyphenatedName}-type-modeled`);

    txtbox.value = '';
    rbReported.checked = false;
    rbModeled.checked = false;
    this.fieldType = null;
    this.updateBarrelsField();
  }

  /**
   * Gets the value in barrels.
   * @returns {number} The value in barrels.
   */
  get barrels(): number {
    const value: number = Number(this.value);
    const valueInBarrels: number = this.unit === Unit.Barrel ? value : value * 7.33;

    return +valueInBarrels.toFixed(1);
  }

  /**
   * Gets the value from the textbox.
   * @returns {string} The value of the textbox.
   */
  get value() {
    const hyphenatedName: string = this.getHyphenatedName();
    const txtbox: HTMLInputElement = <HTMLInputElement>document.getElementById(`txt-${hyphenatedName}`);

    return txtbox.value;
  }
}

class SummaryField extends Field implements ISummaryField {
  validationRules: ISummaryValidationRules;

  constructor(name, validationRules) {
    super(name, validationRules);
    this.setUpFieldTypeErrorHandlers();
  }

  /**
   * Add textbox error handlers.
   * @param {string} value - The value of the textbox.
   */
  setUpTextboxErrorHandlers(value): void {
    super.setUpTextboxErrorHandlers(value);

    let total: number = 0;
    let isCalculated: boolean = true;
    let rbSelectedType: HTMLInputElement = this.element.querySelector(`input[name=${this.getHyphenatedName()}-type]:checked`);

    this.validationRules.isEqualToSumOf.forEach((addend: IField | ISummaryField) => {
      if (addend.value === '') {
        isCalculated = false;
        return;
      }

      total += Number(addend.value);
    });

    if (isCalculated && total !== Number(value)) {
      this.errors.push(`${this.name} must be equal to the total of ${this.validationRules.isEqualToSumOf.map((addend: IField | ISummaryField) => addend.name).join(', ')}.`);
    }

    if (!isCalculated && total > Number(value)) {
      this.errors.push(`${this.name} must be greater than or equal to 
        ${this.validationRules.isEqualToSumOf.filter((addend: IField | ISummaryField) => addend.value !== '').map((addend: IField | ISummaryField) => addend.name).join(',')}.`);
    }

    if (rbSelectedType !== null) {
      this.handleFieldTypeError(<FieldType>rbSelectedType.value);
    }
  }

  /**
   * Adds change listeners to the field type radio buttons.
   */
  setUpFieldTypeErrorHandlers(): void {
    this.element.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        this.handleFieldTypeError(<FieldType>target.value);
        this.showErrors();
      });
    });
  }

  /**
   * Calculates the value of the summary field only if all addend fields have values
   * and sets its type (Reported if all addend fields are reported).
   */
  calculate(): void {
    let value: number = 0;
    let fieldType: FieldType = FieldType.Reported;
    let shouldCalculate: boolean = true;

    this.validationRules.isEqualToSumOf.forEach((field: IField | ISummaryField) => {
      const textbox: HTMLInputElement = field.element.querySelector('input[type=number]');
      const checked: HTMLInputElement = field.element.querySelector(`input[name=${field.getHyphenatedName()}-type]:checked`);

      if (textbox.value !== '' && checked) {
        value += Number(textbox.value);

        if (checked.value === FieldType.Modeled) {
          fieldType = FieldType.Modeled;
        }
      } else {
        shouldCalculate = false;
      }
    });

    if (shouldCalculate) {
      this.setValue(value, fieldType);
    } else {
      this.clear();
    }
  }

  /**
   * Sets the value and type of the field.
   * @param {number} value - The value.
   * @param {string} fieldType - The field type.
   */
  setValue(value, fieldType): void {
    const hyphenatedName: string = this.getHyphenatedName();
    const txtbox: HTMLInputElement = <HTMLInputElement>document.getElementById(`txt-${hyphenatedName}`);
    const rb: HTMLInputElement = <HTMLInputElement>document.getElementById(`rb-${hyphenatedName}-type-${fieldType}`);
    const inputEvent: Event = new Event('input');
    const changeEvent: Event = new Event('change');

    txtbox.value = value;
    txtbox.dispatchEvent(inputEvent);
    rb.checked = true;
    rb.dispatchEvent(changeEvent);
    this.fieldType = fieldType;
    this.clearErrors();
    this.updateBarrelsField();
  }

  /**
   * Checks the selected field type for errors.
   * @param {FieldType} fieldType - The selected field type.
   */
  private handleFieldTypeError(fieldType: FieldType): void {
    const sumOf: Array<IField | ISummaryField> = this.validationRules.isEqualToSumOf;
    const typeShouldBe: string = sumOf.some((addend: IField | ISummaryField) => addend.fieldType === FieldType.Modeled) ? FieldType.Modeled : FieldType.Reported;
    const modeledError = `${this.name} must be of type "Modeled" when at least one of ${sumOf.map((addend: IField | ISummaryField) => addend.name).join(', ')} is "Modeled".`;
    const reportedError = `${this.name} must be of type "Reported" when ${sumOf.map((addend: IField | ISummaryField) => addend.name).join(', ')} are "Reported".`;

    // Clear the modeled/reported errors first.
    const modeledErrorIndex: number = this.errors.indexOf(modeledError);
    const reportedErrorIndex: number = this.errors.indexOf(reportedError);

    if (modeledErrorIndex >= 0) {
      this.errors.splice(modeledErrorIndex, 1);
    }

    if (reportedErrorIndex >= 0) {
      this.errors.splice(reportedErrorIndex, 1);
    }

    // Validate.
    if (typeShouldBe !== fieldType) {
      const error: string = fieldType === FieldType.Reported ? modeledError : reportedError;

      this.errors.push(error);
    }
  }
}

class App {
  element: HTMLElement;
  fields: Array<IField | ISummaryField>;

  constructor(element, fields) {
    this.element = element;
    this.fields = fields;
    this.init();
  }

  /**
   * Initialize the app component.
   */
  init(): void {
    const range = document.createRange();
    const template = `
      <form>
        <div class="field">
          <label for="dd-unit">Unit</label>
          <select id="dd-unit">
            <option value="barrel" selected>Barrels</option>
            <option value="metric ton">Metric Tons</option>
          </select>
        </div>
        <div class="button-container">
          <button type="button" class="btn-submit">Submit</button>
          <button type="button" class="btn-clear">Clear</button>
        </div>
      </form>
    `;
    const frag = range.createContextualFragment(template);
    const form = frag.querySelector('form');
    const ddUnit = form.querySelector('#dd-unit');
    const btnSubmit = form.querySelector('.btn-submit');
    const btnClear = form.querySelector('.btn-clear');

    ddUnit.addEventListener('change', (e: Event) => {
      this.fields.forEach((field: IField | ISummaryField) => {
        field.unit = <Unit>(<HTMLInputElement>e.target).value;
        field.updateBarrelsField();
      });
    });
    btnSubmit.addEventListener('click', (e) => this.submit());
    btnClear.addEventListener('click', (e) => this.clear());

    this.fields.forEach((field) => {
      field.unit = <Unit>'barrel';

      // Add event listeners to addend fields.
      if (field instanceof SummaryField) {
        field.validationRules.isEqualToSumOf.forEach((addend) => {
          const textbox = addend.element.querySelector('input[type=number]');
          const radios = addend.element.querySelectorAll(`input[name=${addend.getHyphenatedName()}-type]`);

          textbox.addEventListener('input', (e) => field.calculate());
          radios.forEach((radio) => radio.addEventListener('change', (e) => field.calculate()));
        });
      }
      
      form.insertBefore(field.element, form.childNodes[form.childNodes.length - 2]);
    });

    this.element.appendChild(frag);
  }

  /**
   * Submits the form.
   */
  submit(): void {
    const hasErrors = this.fields.some((field) => field.errors.length > 0);

    if (hasErrors) {
      this.fields.forEach((field) => field.showErrors());
      return;
    }

    alert(this.getSummary());
  }

  /**
   * Clears the form.
   */
  clear(): void {
    this.fields.forEach((field) => field.clear());
  }

  /**
   * Get the summary.
   * @returns {string} - The summary.
   */
  getSummary(): string {
    return this.fields.map((field) => {
      return `${field.name}: ${field.barrels} barrels, ${field.fieldType ? field.fieldType : '-'}`;
    }).join('\n');
  }
}

(() => {
  const container: HTMLDivElement = <HTMLDivElement>document.getElementById('app');
  const notRequired: ValidationRules = new ValidationRules(false, true);
  const proved: Field = new Field('Proved', new ValidationRules(true, true));
  const probable: Field = new Field('Probable', notRequired);
  const provedAndProbable: SummaryField = new SummaryField('Proved and Probable', new SummaryValidationRules(false, true, [proved, probable]));
  const possible: Field = new Field('Possible', notRequired);
  const provedProbableAndPossible: SummaryField = new SummaryField('Proved, Probable, and Possible', new SummaryValidationRules(false, true, [provedAndProbable, possible]));
  const contingent: Field = new Field('Contingent', notRequired);
  const prospective: Field = new Field('Prospective', notRequired);
  const app: App = new App(container, [
    proved,
    probable,
    provedAndProbable,
    possible,
    provedProbableAndPossible,
    contingent,
    prospective,
  ]);
})();
