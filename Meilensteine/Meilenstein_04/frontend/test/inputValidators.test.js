import {
  expect, describe, test, jest, beforeEach,
} from '@jest/globals';
import {
  minMax, notEmpty, regex, arrayEveryEntry, inputLength, password,
} from '../src/inputValidators';

describe('inputValidators.js', () => {
  describe('minMax validator', () => {
    test.each([
      ['2', { min: 1, max: 3 }, null],
      ['-2', { min: -999, max: -1 }, null],
      ['3', { max: 2 }, 'Darf nicht größer als 2 sein'],
      ['1', { min: 2 }, 'Darf nicht kleiner als 2 sein'],
      ['3.9', { min: 1.9, max: 2.9 }, 'Darf nicht größer als 2.9 sein'],
      ['1.9', { min: 2.9, max: 3.9 }, 'Darf nicht kleiner als 2.9 sein'],
      ['0.0', { min: -1.9, max: 2.9 }, null],
    ])('%s liegt im Bereich %s', (value, params, result) => {
      expect(minMax(value, params)).toBe(result);
    });
  });

  describe('notEmpty validator', () => {
    test.each([
      ['', 'Darf nicht leer sein'],
      ['1', null],
      ['0', null],
      ['null', null],
      ['-1', null],
      ['undefined', null],
      ['true', null],
      ['false', null],
      ['1.1', null],
      ['2.2', null],
      ['-1.1', null],
      ['-2.2', null],
    ])('%s ist nicht leer', (value, result) => {
      expect(notEmpty(value)).toBe(result);
    });
  });

  const numRegex = /^[+-]?\d+$/;
  const abRegex = /^[A|B]$/;

  describe('regex validator', () => {
    test.each([
      ['1', numRegex, null],
      ['10', numRegex, null],
      ['100', numRegex, null],
      ['+1', numRegex, null],
      ['-1', numRegex, null],
      ['+10', numRegex, null],
      ['-10', numRegex, null],
      ['+-1', numRegex, 'Enstpricht nicht dem erwarteten Muster'],
      ['+', numRegex, 'Enstpricht nicht dem erwarteten Muster'],
      ['-', numRegex, 'Enstpricht nicht dem erwarteten Muster'],
      ['-+1', numRegex, 'Enstpricht nicht dem erwarteten Muster'],
      ['++1', numRegex, 'Enstpricht nicht dem erwarteten Muster'],
      ['--1', numRegex, 'Enstpricht nicht dem erwarteten Muster'],
      ['A', abRegex, null],
      ['B', abRegex, null],
      ['C', abRegex, 'Enstpricht nicht dem erwarteten Muster'],
      ['1', abRegex, 'Enstpricht nicht dem erwarteten Muster'],
      ['?', abRegex, 'Enstpricht nicht dem erwarteten Muster'],
    ])('prüft ob %s der regular expresion %s entspricht', (value, param, result) => {
      expect(regex(value, param)).toBe(result);
    });
  });

  describe('inputLength validator', () => {
    test.each([
      ['', { min: 0, max: 3 }, null],
      ['', { }, null],
      ['a', { min: 2 }, 'Darf nicht kürzer als 2 sein'],
      ['abc', { max: 2 }, 'Darf nicht länger als 2 sein'],
    ])('Länge von %s liegt im Bereich %s', (value, params, result) => {
      expect(inputLength(value, params)).toBe(result);
    });
  });

  describe('password validator', () => {
    for (let i = 0; i < 15; i++) {
      let combination = i;
      let passwd = '';
      const errors = [];
      const correct = [];
      if (combination >= 8) {
        combination -= 8;
        passwd += 'a';
        correct.push('Kleinbuchstaben');
      } else {
        errors.push('Kleinbuchstaben');
      }
      if (combination >= 4) {
        combination -= 4;
        passwd += 'G';
        correct.push('Großbuchstaben');
      } else {
        errors.push('Großbuchstaben');
      }
      if (combination >= 2) {
        combination -= 2;
        passwd += '4';
        correct.push('Zahlen');
      } else {
        errors.push('Zahlen');
      }
      if (combination >= 1) {
        passwd += '!';
        correct.push('Sonderzeichen');
      } else {
        errors.push('Sonderzeichen');
      }
      test(`password:${passwd}`, () => {
        const result = password(passwd);
        errors.forEach((err) => expect(result).toContain(err));
        correct.forEach((err) => expect(result).not.toContain(err));
      });
    }

    test('password:aG4!', () => {
      expect(password('aG4!')).toBe(null);
    });
  });

  describe('arrayEveryEntry validator', () => {
    const validator = jest.fn((value) => (value === 'error' ? 'err' : null));

    beforeEach(() => {
      validator.mockClear();
    });

    test('validator is called with all values and params', () => {
      arrayEveryEntry(validator)('1,2,3,a,b,c', 'validatorParams');
      expect(validator.mock.calls.map((call) => call[0])).toEqual(['1', '2', '3', 'a', 'b', 'c']);
      validator.mock.calls.forEach((call) => {
        expect(call[1]).toBe('validatorParams');
      });
    });

    test('whitespaces are trimmed', () => {
      arrayEveryEntry(validator)(' 1,2 ,3   ,a b c ', 'validatorParams');
      expect(validator.mock.calls.map((call) => call[0])).toEqual(['1', '2', '3', 'a b c']);
    });

    test('correct input results in return value null', () => {
      expect(arrayEveryEntry(validator)(' 1,2 ,3   ,a b c ', 'validatorParams')).toBe(null);
      expect(arrayEveryEntry(validator)('')).toBe(null);
      expect(arrayEveryEntry(validator)(',,')).toBe(null);
    });

    test('incorrect input results in error message(s) with index', () => {
      expect(arrayEveryEntry(validator)('error', 'validatorParams')).toBe('err(Position 0)');
      expect(arrayEveryEntry(validator)('1,error')).toBe('err(Position 1)');
      expect(arrayEveryEntry(validator)('error,1,error')).toBe('err(Position 0),err(Position 2)');
    });
  });
});
