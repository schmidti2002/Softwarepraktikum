import * as _ from 'lodash';
import View from './View';

// Diese Klasse ist für die Eingabe von Werten in die Software zuständig
// sie validiert und parst diese nach vorab definierter Konfigurationen 
export default class InputView extends View {
  // Callback bei Eingaben.
  // valid(bool)
  // values(object)
  callback;

  #inputs = [];

  // Callback bei Eingaben.
  // valid(bool)
  // values(object)
  constructor(parentNode, eventReporter, callback) {
    super('InputView', parentNode, eventReporter);
    this.initPromise
      .then(() => {
        this.container = document.getElementById('inputview-container');
      });
    this.callback = callback;
  }

  // Parser für die verschiedenen Inputtypen
  // value(string)
  // return({error: string}|{value: T})

  // parst ein Integer und gibt ihn als {value: Integer} zurück
  static parseInt(value) {
    const wsRemoved = value.trim();
    if (!/^[+-]?\d+$/.test(wsRemoved)) {
      return {
        error: 'Darf nur eine Ganzzahl sein',
      };
    }

    return { value: Number.parseInt(wsRemoved, 10) };
  }

  // parst ein Integer-Array und gibt es als {value: Integer[]} zurück
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

  // parst einen String und gibt in als Objekt zurück
  static parseString(value) {
    return { value };
  }

  // Map der Inputtypen auf ihre HTML type-Attributwerte und ihren Parser
  #types = {
    integer: {
      html: 'number',
      parser: InputView.parseInt,
    },
    'integer[]': {
      html: 'text',
      parser: InputView.parseIntArray,
    },
    string: {
      html: 'text',
      parser: InputView.parseString,
    },
    password: {
      html: 'password',
      parser: InputView.parseString,
    },
  };

  /* Lädt eine Reihe an Inputs und erzeugt deren Elemente und Logik
  *  Format:
  *  {
  *   name: 'Anzahl',           // Anzeige für Nutzer
  *   field: 'foo.bar.count',   // Pfad(!) im values-Objekt
  *   type: 'integer',          // Typ
  *   validators: [{            // Array an Validatoren
  *   func: minMax,             // Ein Validator
  *   param: { min: 0 },        // Parameter des Validators
  * },
  * {
  *   func: notEmpty,
  * },
  * ],
  *},
  */
  loadConfig(inputs) {
    const div = document.createElement('div');
    const errorMissingType = 'Missing type';

    try {
      this.#inputs = inputs.map((input) => {
        if (this.#types[input.type] === undefined) {
          this.eventReporter.fatal(`input type ${input.type} not implemented!`);
          throw new Error(errorMissingType);
        }
        const inputDiv = document.createElement('div');
        inputDiv.classList.add('form-floating');
        inputDiv.classList.add('mb-2');

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
        label.textContent = input.name;

        const errorElm = document.createElement('div');
        errorElm.classList.add('invalid-feedback');

        inputDiv.appendChild(inputElm);
        inputDiv.appendChild(label);
        inputDiv.appendChild(errorElm);
        div.appendChild(inputDiv);

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
      this.callback(this.validate(), this.getValues());
    } catch (error) {
      if (error.message !== errorMissingType) {
        throw error;
      }
    }
  }

  // (de)aktiviert alle Inputs
  setDisabled(disabled) {
    this.#inputs.forEach((input) => {
      // eslint-disable-next-line no-param-reassign
      input.elm.disabled = disabled;
    });
  }

  // Gibt Objekt mit Werten aller Inputs zurück
  getValues() {
    const values = {};
    for (let i = 0; i < this.#inputs.length; i++) {
      const input = this.#inputs[i];
      const result = input.parser(input.elm.value);
      _.set(values, input.field, result.value);
    }
    return values;
  }

  // Validiert einen Input mit allen daran hängenden Validatoren und
  // erzeugt dann den finalen Wert durch Aufruf des Parsers.
  // Zeigt außerdem die Fehlermeldung an falls der Input invalid ist.
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
    input.errorElm.textContent = error;
    if (valid) {
      input.elm.classList.add('is-valid');
      input.elm.classList.remove('is-invalid');
    } else {
      input.elm.classList.add('is-invalid');
      input.elm.classList.remove('is-valid');
    }

    return valid;
  }

  // Validiert alle Inputs und gibt logisches UND der Ergebnisse zurück
  validate() {
    let valid = true;
    this.#inputs.forEach((input) => {
      valid &&= this.#inputValidate(input);
    });
    return valid;
  }
}
