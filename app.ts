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

class ValidationRules implements IValidationRules {
  isRequired: boolean;
  isNotNegative: boolean;

  constructor(isRequired: boolean = false, isNotNegative: boolean = true) {
    this.isRequired = isRequired;
    this.isNotNegative = isNotNegative;
  }
}

class SummaryValidationRules extends ValidationRules implements ISummaryValidationRules {
  isEqualToSumOf: Array<IField | ISummaryField>;

  constructor(isRequired: boolean = false, isNotNegative: boolean = true, isEqualToSumOf: Array<IField> = []) {
    super(isRequired, isNotNegative);
    this.isEqualToSumOf = isEqualToSumOf;
  }
}

interface IField {
  name: string;
  value: number;
  unit: Unit;
  type: FieldType;
  barrels: number;
  validationRules: IValidationRules;
  errors: Array<string>;
  showErrors: Function;
  clearErrors: Function;
  element: HTMLDivElement;
}

interface ISummaryField extends IField {
  validationRules: ISummaryValidationRules;
  calculate: Function;
  setValue: Function;
}

class Field implements IField {
  name: string;
  validationRules: IValidationRules;
  errors: Array<string>;
  element: HTMLDivElement;
  txtbox: HTMLInputElement;

  constructor(name: string, validationRules: IValidationRules) {
    this.name = name;
    this.validationRules = validationRules;
    this.init();
  }

  /**
   * Shows the errors.
   */
  showErrors(): void {
    this.element.querySelector('.error').innerHTML = this.errors.join('<br>');
  }

  /**
   * Clears the errors.
   */
  clearErrors(): void {
    this.errors = [];
    this.element.querySelector('.error').innerHTML = '';
  }

  /**
   * Gets the value based on the input.
   */
  get value(): number {
    const hyphenatedName: string = this.getHyphenatedName();
    const txtbox: HTMLInputElement = <HTMLInputElement>document.getElementById(`txt-${hyphenatedName}`);

    return Number(txtbox.value);
  }

  /**
   * Gets the unit based on the selected radio button.
   */
  get unit(): Unit {
    const hyphenatedName: string = this.getHyphenatedName();
    const rb: HTMLInputElement = <HTMLInputElement>document.querySelector(`input[name="${hyphenatedName}-unit"]:checked`);

    return rb ? <Unit>rb.value : null;
  }

  /**
   * Gets the field type based on the selected radio button.
   */
  get type(): FieldType {
    const hyphenatedName: string = this.getHyphenatedName();
    const rb: HTMLInputElement = <HTMLInputElement>document.querySelector(`input[name="${hyphenatedName}-type"]:checked`);

    return rb ? <FieldType>rb.value : null;
  }

  /**
   * Selects the radio button with the corresponding field type.
   * @param {FieldType} fieldType - The type of field.
   */
  set type(fieldType: FieldType) {
    const hyphenatedName: string = this.getHyphenatedName();
    const rb: HTMLInputElement = <HTMLInputElement>document.getElementById(`rb-${hyphenatedName}-type-${fieldType}`);

    rb.checked = true;
  }

  /**
   * Gets the value in barrels.
   * @returns {number} The value in barrels.
   */
  get barrels(): number {
    return this.unit === Unit.Barrel ? this.value : this.value * 7.33;
  }

  /**
   * Initializes the field component.
   */
  private init(): void {
    this.element = document.createElement('div');
    this.element.classList.add('field');

    const range: Range = document.createRange();
    const hyphenatedName = this.getHyphenatedName();
    const template: string = `
      <label for="txt-${hyphenatedName}">
        ${this.name}
        ${this.validationRules.isRequired ? '<abbr title="required">*</abbr>' : ''}
      </label>
      <div>
        <input id="txt-${hyphenatedName}" type="number" min="0">
        <ul class="radio-button-group">
          <li>
            <label for="rb-${hyphenatedName}-unit-barrel">
              <input id="rb-${hyphenatedName}-unit-barrel" type="radio" name="${hyphenatedName}-unit" value="barrel">
              <span>Barrels</span>
            </label>
          </li>
          <li>
            <label for="rb-${hyphenatedName}-unit-metric-ton">
              <input id="rb-${hyphenatedName}-unit-metric-ton" type="radio" name="${hyphenatedName}-unit" value="metric ton">
              <span>Metric Tons</span>
            </label>
          </li>
        </ul>
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

    this.element.appendChild(frag);
  }

  /**
   * Gets the hyphenated name of the field.
   * @returns {string} The hyphenated name.
   */
  getHyphenatedName(): string {
    return this.name.replace(/,/g, '').split(' ').join('-').toLowerCase();
  }
}

class SummaryField extends Field implements ISummaryField {
  validationRules: ISummaryValidationRules;
  
  constructor(name: string, validationRules: ISummaryValidationRules) {
    super(name, validationRules);
  }

  /**
   * Sets the calculated value of the input.
   */
  setValue(): void {
    const hyphenatedName: string = this.getHyphenatedName();
    const txtbox: HTMLInputElement = <HTMLInputElement>document.getElementById(`txt-${hyphenatedName}`);
    const valueType: string = this.validationRules.isEqualToSumOf.some((field: IField | ISummaryField) => field.type === FieldType.Modeled) ? 'modeled' : 'reported';
    const rbUnit: HTMLInputElement = <HTMLInputElement>document.getElementById(`rb-${hyphenatedName}-unit-barrel`);
    const rbType: HTMLInputElement = <HTMLInputElement>document.getElementById(`rb-${hyphenatedName}-type-${valueType}`);

    txtbox.value = this.calculate().toString();
    rbUnit.checked = true;
    rbType.checked = true;
  }

  /**
   * Calculates the value of the field based on its dependencies.
   * @returns {number} The calculated value in barrels.
   */
  calculate(): number {
    const shouldBe = this.validationRules.isEqualToSumOf.reduce((sum: number, field: IField | ISummaryField) => {
      let fieldValue = 0;

      if (field.value > 0 && field.unit && field.type) {
        if (field.type === FieldType.Modeled) {
          this.type = FieldType.Modeled;
        }

        fieldValue = field.barrels;
      }

      return sum + fieldValue;
    }, 0);

    return shouldBe;
  }
}

class App {
  element: HTMLDivElement;
  fields: Array<IField | ISummaryField>;

  constructor(element: HTMLDivElement, fields: Array<IField | ISummaryField>) {
    this.element = element;
    this.fields = fields;
    this.init();
  }

  /**
   * Submits the form.
   */
  submit(): void {
    let hasErrors: boolean = false;

    this.fields.forEach((field: IField | ISummaryField) => {
      field.clearErrors();

      const value = field.value;
      const rules = field.validationRules;

      if (rules.isRequired && value === 0) {
        field.errors.push(`${field.name} is required.`);
        hasErrors = true;
      }

      if (rules.isNotNegative && value < 0) {
        field.errors.push(`${field.name} cannot be negative.`);
        hasErrors = true;
      }

      // Should also have units and type.
      if (value) {
        if (!field.unit) {
          field.errors.push(`${field.name} must have a unit.`);
          hasErrors = true;
        }

        if (!field.type) {
          field.errors.push(`${field.name} must have a type.`);
          hasErrors = true;
        }
      }

      // Summary fields.
      if ((<ISummaryField>field).validationRules.isEqualToSumOf) {
        const summaryField: ISummaryField = <ISummaryField>field;
        const sumOf: Array<IField> = summaryField.validationRules.isEqualToSumOf;
        
        if (sumOf.length) {
          const calculatedType = sumOf.some((fld: IField) => fld.value > 0 && fld.unit && fld.type && fld.type === FieldType.Modeled)
            ? FieldType.Modeled
            : FieldType.Reported;

          if (value === 0) {
            summaryField.setValue();
          } else if (summaryField.calculate() !== summaryField.barrels) { // Check if the input value is equal to the total barrels of referenced fields.
            const errorTemplate = `${summaryField.name} must be equal to the sum of ${sumOf.map((fld: IField) => fld.name).join(', ')} in barrels (1 Metric Ton = 7.33 Barrels)`;

            summaryField.errors.push(errorTemplate);
            hasErrors = true;
          } else if (summaryField.type !== calculatedType) {
            const errorTemplate = summaryField.type === FieldType.Modeled
              ? `${summaryField.name} must be of type "Modeled" when at least one of ${sumOf.map((fld: IField) => fld.name).join(', ')} is "Modeled".`
              : `${summaryField.name} must be of type "Reported" when ${sumOf.map((fld: IField) => fld.name).join(', ')} are "Reported".`;

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
  }

  /**
   * Clears the form.
   */
  clear(): void {
    this.element.querySelectorAll('input[type=number], input[type=radio]').forEach((el: Element) => {
      const input: HTMLInputElement = <HTMLInputElement>el;
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
    this.fields.forEach((field: IField) => field.clearErrors());
  }

  /**
   * Initialize the app component.
   */
  private init(): void {
    const range: Range = document.createRange();
    const template: string = `
      <form>
        <div class="button-container">
          <button type="button" class="btn-submit">Submit</button>
          <button type="button" class="btn-clear">Clear</button>
        </div>
      </form>
    `;
    const frag: DocumentFragment = range.createContextualFragment(template);
    const form: HTMLFormElement = frag.querySelector('form');
    const btnSubmit: HTMLButtonElement = frag.querySelector('.btn-submit');
    const btnClear: HTMLButtonElement = frag.querySelector('.btn-clear');

    this.fields.forEach((field: IField | ISummaryField) => form.insertBefore(field.element, form.childNodes[form.childNodes.length - 2]));
    btnSubmit.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      this.submit();
    });
    btnClear.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      this.clear();
    });
    this.element.appendChild(frag);
  }

  /**
   * Get the summary.
   * @returns {string} - The summary.
   */
  private getSummary(): string {
    return this.fields.map((field: IField | ISummaryField) => {
      return `${field.name}: ${field.barrels} barrels, ${field.type ? field.type : '-'}`;
    }).join('\n');
  }
}

(() => {
  const container: HTMLDivElement = <HTMLDivElement>document.getElementById('app');
  const genericNonNegativeValidationRule = new ValidationRules();
  const proved = new Field('Proved', new ValidationRules(true, true));
  const probable = new Field('Probable', genericNonNegativeValidationRule);
  const provedAndProbable = new SummaryField('Proved and Probable', new SummaryValidationRules(false, true, [proved, probable]));
  const possible = new Field('Possible', genericNonNegativeValidationRule);
  const provedProbableAndPossible = new SummaryField('Proved, Probable, and Possible', new SummaryValidationRules(false, true, [proved, probable, possible]));
  const contingent = new Field('Contingent', genericNonNegativeValidationRule);
  const prospective = new Field('Prospective', genericNonNegativeValidationRule);
  const fields: Array<Field | SummaryField> = [
    proved,
    probable,
    provedAndProbable,
    possible,
    provedProbableAndPossible,
    contingent,
    prospective,
  ];
  const app = new App(container, fields);
})();
