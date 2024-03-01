import * as _ from 'lodash';

// Eingabevalidierungsfunktionen
// nehmen eine String und optional einen Konfigurationsparameter entgegen.
// Geben eine Fehlermeldung zurück, wenn die Einschränkung verletzt wurde.
// ansonsten wird null zurückgegeben.

export function minMax(value, params) {
  const num = Number.parseFloat(value, 10);
  if (params.min !== undefined && params.min > num) {
    return `Darf nicht kleiner als ${params.min} sein`;
  }
  if (params.max !== undefined && params.max < num) {
    return `Darf nicht größer als ${params.max} sein`;
  }
  return null;
}

export function inputLength(value, params) {
  const { length } = value;
  if (params.min !== undefined && params.min > length) {
    return `Darf nicht kürzer als ${params.min} sein`;
  }
  if (params.max !== undefined && params.max < length) {
    return `Darf nicht länger als ${params.max} sein`;
  }
  return null;
}

export function password(value) {
  const missing = [];
  if (!/[a-z]/.test(value)) {
    missing.push('Kleinbuchstaben');
  }
  if (!/[A-Z]/.test(value)) {
    missing.push('Großbuchstaben');
  }
  if (!/\d/.test(value)) {
    missing.push('Zahlen');
  }
  if (!/\W/.test(value)) {
    missing.push('Sonderzeichen');
  }
  if (missing.length === 0) {
    return null;
  }

  return `Muss ${_.join(missing)} enthalten`;
}

export function notEmpty(value) {
  return value !== '' ? null : 'Darf nicht leer sein';
}

export function regex(value, params) {
  return params.test(value) ? null : 'Enstpricht nicht dem erwarteten Muster';
}

// Dekorators

// Dieser Dekorator nimmt einen Validator und wendet ihn auf jedes Element eines Arrays an.
// Bsp.:
//     string => notEmpty
//     string[] => arrayEveryEntry(notEmpty)
export function arrayEveryEntry(validator) {
  return (values, params) => {
    const errors = _.compact(
      values
        .split(',')
        .map(((value) => validator(value.trim(), params)))
        .map((error, i) => error && `${error}(Position ${i})`),
    );
    if (!errors.length) {
      return null;
    }
    return _.join(errors);
  };
}

export function emptyOr(validator) {
  return (value, params) => (value === '' ? null : validator(value, params));
}

export function inEnum(value, params) {
  return params.includes(value) ? null : `valide Eingaben sind: "${_.join(params, '", "')}"`;
}

export function validateEmail(email) {
  // Regulärer Ausdruck zur Überprüfung der E-Mail-Adresse
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Überprüfung, ob die E-Mail-Adresse dem regulären Ausdruck entspricht
  if (emailRegex.test(email)) {
      return null; // Die E-Mail-Adresse ist gültig
  } else {
      return 'Ungültige E-Mail-Adresse'; // Die E-Mail-Adresse ist ungültig
  }
}
