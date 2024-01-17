import * as _ from 'lodash';
import View from './View';

export default class InputView extends View {
  callback; // (valid, values)

  #inputs = [];

  constructor(parentNode, errorReporter, callback) {
    super('InputView', parentNode, errorReporter);
    this.initPromise
      .then(() => {
        this.container = document.getElementById('inputview-container');
      });
    this.callback = callback;
  }

  static parseInt(value) {
    const wsRemoved = value.trim();
    if (!/^[+-]?\d+$/.test(wsRemoved)) {
      return {
        error: 'Darf nur eine Ganzzahl sein',
      };
    }

    return { value: Number.parseInt(wsRemoved, 10) };
  }

  static parseIntArray(value) {
    const arr = [];
    const entries = value.split(',');
    for (let i = 0; i < entries.length; i++) {
      const entry = InputView.parseInt(entries[i]);
      if (entry.error) {
        return {
          error: `${entry.error} (Position ${i})`,
        };
      }
      arr.push(entry.value);
    }
    return { value: arr };
  }

  #types = {
    'integer': {
      html: 'number',
      parser: InputView.parseInt,
    },
    'integer[]': {
      html: 'text',
      parser: InputView.parseIntArray,
    },
  };

  loadConfig(inputs) {
    const div = document.createElement('div');
    console.log(inputs);

    this.#inputs = inputs.map((input) => {
      const inputDiv = document.createElement('div');
      inputDiv.classList.add('form-floating');

      const inputElm = document.createElement('input');
      inputElm.classList.add('form-control');
      const id = `inputview-field-${input.field}`;
      inputElm.id = id;
      inputElm.placeholder = input.name;
      inputElm.type = this.#types[input.type].html;
      if (input.prefill) {
        inputElm.value = input.prefill();
      }

      inputElm.oninput = () => {
        const valid = this.validate();
        this.callback(valid, valid ? this.getValues() : {});
      };

      const label = document.createElement('label');
      label.setAttribute('for', id);
      label.innerText = input.name;

      const errorElm = document.createElement('div');
      errorElm.classList.add('invalid-feedback');

      inputDiv.appendChild(inputElm);
      inputDiv.appendChild(label);
      inputDiv.appendChild(errorElm);
      div.appendChild(inputDiv);
      console.log(inputDiv, div);

      return {
        elm: inputElm,
        errorElm,
        validators: input.validators,
        field: input.field,
        parser: this.#types[input.type].parser,
      };
    });

    this.container.innerHTML = '';
    this.container.appendChild(div);
    this.validate();
  }

  setDisabled(disabled) {
    this.#inputs.forEach((input) => {
      // eslint-disable-next-line no-param-reassign
      input.elm.disabled = disabled;
    });
  }

  getValues() {
    const values = {};
    for (let i = 0; i < this.#inputs.length; i++) {
      const input = this.#inputs[i];
      const result = input.parser(input.elm.value);
      _.set(values, input.field, result.value);
    }
    return values;
  }

  #inputValidate(input) {
    const { value } = input.elm;

    let valid = true;
    let error = '';
    for (let i = 0; i < input.validators.length; i++) {
      const validator = input.validators[i];
      const result = validator.func(value, validator.param);
      if (typeof result === 'string') {
        valid = false;
        error = result;
      }
    }

    const result = input.parser(value);
    if (result.error) {
      valid = false;
      error = result.error;
    }

    // eslint-disable-next-line no-param-reassign
    input.errorElm.innerText = error;
    if (valid) {
      input.elm.classList.add('is-valid');
      input.elm.classList.remove('is-invalid');
    } else {
      input.elm.classList.add('is-invalid');
      input.elm.classList.remove('is-valid');
    }

    return valid;
  }

  validate() {
    let valid = true;
    this.#inputs.forEach((input) => {
      valid &&= this.#inputValidate(input);
    });
    return valid;
  }
}
