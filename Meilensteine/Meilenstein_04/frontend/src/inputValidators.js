import * as _ from 'lodash';

export function minMax(value, params) {
  const num = Number.parseInt(value, 10);
  if (params.min !== undefined && params.min > num) {
    return `Darf nicht kleiner als ${params.min} sein`;
  }
  if (params.max !== undefined && params.max > num) {
    return `Darf nicht kleiner als ${params.max} sein`;
  }
  return null;
}

export function notEmpty(value) {
  return value !== '' ? null : 'Darf nicht leer sein';
}

export function regex(value, params) {
  return params.test(value) ? null : 'Enstpricht nicht dem erwarteten Muster';
}

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
