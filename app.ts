enum Unit {
  Barrel,
  MetricTon,
}

enum FieldType {
  Reported,
  Modeled,
}

interface IValidation {
  isRequired: boolean;
  isNotNegative: boolean;
  isEqualToSumOf: Array<IField>;
}

class Validation implements IValidation {
  isRequired: boolean;
  isNotNegative: boolean;
  isEqualToSumOf: Array<IField>;

  constructor(isRequired: boolean = false, isNotNegative: boolean = true, isEqualToSumOf: Array<IField> = []) {
    this.isRequired = isRequired;
    this.isNotNegative = isNotNegative;
    this.isEqualToSumOf = isEqualToSumOf;
  }
}

interface IField {
  name: string;
  value: number;
  unit: Unit;
  type: FieldType;
  barrels: number;
}

class Field implements IField {
  name: string;
  value: number;
  unit: Unit;
  type: FieldType;
  validationRules: IValidation;
  element: HTMLDivElement;

  constructor(name: string, validationRules: IValidation) {
    this.name = name;
    this.validationRules = validationRules;
    this.init();
  }

  setError(message: string): void {
    this.element.querySelector('.error').innerHTML = message;
  }

  clearError(): void {
    this.element.querySelector('.error').innerHTML = '';
  }

  get barrels(): number {
    return this.unit === Unit.Barrel ? this.value : this.value * 7.33;
  }

  private init(): void {
    this.element = document.createElement('div');
    this.element.classList.add('field');

    const hyphenatedName = this.name.replace(/,/g, '').split(' ').join('-').toLowerCase();
    const range: Range = document.createRange();
    const template: string = `
      <label for="${hyphenatedName}">
        ${this.name}
        ${this.validationRules.isRequired ? '<abbr title="required">*</abbr>' : ''}
      </label>
      <input id="txt-${hyphenatedName}" type="number">
      <div class="radio-button-group">
        <label for="rb-${hyphenatedName}-reported">
          <input id="rb-${hyphenatedName}-reported" type="radio" name="${hyphenatedName}">
          Reported
        </label>
        <label for="rb-${hyphenatedName}-modeled">
          <input id="rb-${hyphenatedName}-modeled" type="radio" name="${hyphenatedName}">
          Modeled
        </label>
      </div>
      <p class="error"></p>
    `;
    const frag: DocumentFragment = range.createContextualFragment(template);

    this.element.appendChild(frag);
  }
}

class App {
  element: HTMLDivElement;
  fields: Array<Field>;

  constructor(element: HTMLDivElement, fields: Array<Field>) {
    this.element = element;
    this.fields = fields;
    this.init();
  }

  submit(): void {
    
  }

  private init(): void {
    const range: Range = document.createRange();
    const template: string = `
      <form>
        ${this.fields.map((field: Field) => field.element).join('')}
      </form>
    `;
    const frag: DocumentFragment = range.createContextualFragment(template);

    this.element.appendChild(frag);
  }
}

(() => {
  const container: HTMLDivElement = <HTMLDivElement>document.getElementById('app');
  const genericNonNegativeValidationRule = new Validation();
  const proved = new Field('Proved', new Validation(true, true));
  const probable = new Field('Probable', genericNonNegativeValidationRule);
  const provedAndProbable = new Field('Proved and Probable', new Validation(false, true, [proved, probable]));
  const possible = new Field('Possible', genericNonNegativeValidationRule);
  const provedProbableAndPossible = new Field('Proved, Probable, and Possible', new Validation(false, true, [proved, probable, possible]));
  const contingent = new Field('Contingent', genericNonNegativeValidationRule);
  const prospective = new Field('Prospective', genericNonNegativeValidationRule);
  const fields: Array<Field> = [
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
