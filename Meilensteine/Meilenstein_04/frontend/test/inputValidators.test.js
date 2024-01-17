import { expect, describe, test } from '@jest/globals';
import { minMax, notEmpty, regex } from '../src/inputValidators';

describe('inputValidators.js', () => {
  describe('minMax module', () => {
    test.each([
      ['2', { min: 1, max: 3 }, null],
      ['-2', { min: -999, max: -1 }, null],
      ['2', { min: 2, max: 2 }, null],
      ['3', { min: 1, max: 2 }, 'Darf nicht größer als 2 sein'],
      ['1', { min: 2, max: 3 }, 'Darf nicht kleiner als 2 sein'],
      ['0', { min: -1, max: 2 }, null],
      ['-1', { min: -2, max: 0 }, null],
      ['1', { min: 0, max: 2 }, null],
      ['100', { min: 1, max: 42 }, 'Darf nicht größer als 42 sein'],
      ['-100', { min: -1, max: -42 }, 'Darf nicht kleiner als -42 sein'],
      ['99999', { min: 99997, max: 99998 }, 'Darf nicht größer als 99998 sein'],
      ['-99999', { min: -99997, max: -99998 }, 'Darf nicht kleiner als -99998 sein'],
      ['2.9', { min: 1.9, max: 3.9 }, null],
      ['-2.9', { min: -999.9, max: -1.9 }, null],
      ['2.9', { min: 2.9, max: 2.9 }, null],
      ['3.9', { min: 1.9, max: 2.9 }, 'Darf nicht größer als 2 sein'],
      ['1.9', { min: 2.9, max: 3.9 }, 'Darf nicht kleiner als 2 sein'],
      ['0.0', { min: -1.9, max: 2.9 }, null],
      ['-1.9', { min: -2.9, max: 0.9 }, null],
      ['1.9', { min: 0.9, max: 2.9 }, null],
      ['100.9', { min: 1.9, max: 42.9 }, 'Darf nicht größer als 42 sein'],
      ['-100.9', { min: -1.9, max: -42.9 }, 'Darf nicht kleiner als -42 sein'],
      ['99999.9', { min: 99997.9, max: 99998.9 }, 'Darf nicht größer als 99998 sein'],
      ['-99999.9', { min: -99997.9, max: -99998.9 }, 'Darf nicht kleiner als -99998 sein'],
    ]);
    test('%s liegt zwischen %s und %s', (value, params, result) => {
      expect(minMax(value, params)).toBe(result);
    });
  });

  describe('notEmpty module', () => {
    test.each([
      ['', 'Darf nicht leer sein'],
      ['1', null],
      ['42', null],
      ['0', null],
      ['null', 'darf nicht leer sein'],
      ['-1', null],
      ['1', null],
      ['99999', null],
      ['-99999', null],
      ['true', null],
      ['false', null],
      ['1.1', null],
      ['2.2', null],
      ['-1.1', null],
      ['-2.2', null],
    ]);
    test('%s ist nicht leer', (value, result) => {
      expect(notEmpty(value)).toBe(result);
    });
  });

  describe('regex module', () => {
    test.each([
      ['1', '^[+-]?\\d+$', null],
      ['2', '^[+-]?\\d+$', null],
      ['3', '^[+-]?\\d+$', null],
      ['4', '^[+-]?\\d+$', null],
      ['5', '^[+-]?\\d+$', null],
      ['6', '^[+-]?\\d+$', null],
      ['7', '^[+-]?\\d+$', null],
      ['8', '^[+-]?\\d+$', null],
      ['9', '^[+-]?\\d+$', null],
      ['0', '^[+-]?\\d+$', null],
      ['10', '^[+-]?\\d+$', null],
      ['100', '^[+-]?\\d+$', null],
      ['+1', '^[+-]?\\d+$', null],
      ['-1', '^[+-]?\\d+$', null],
      ['+10', '^[+-]?\\d+$', null],
      ['-10', '^[+-]?\\d+$', null],
      ['+-1', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['+', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['-', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['-+1', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['++1', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['--1', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['null', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['true', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['false', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['1.0', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['1.', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['String', '^[+-]?\\d+$', 'Enstpricht nicht dem erwarteten Muster'],
      ['A1', '/^[A-Z]+\\d+\\D?$/', null],
      ['A1', '/^[A-Z]+\\d+\\D?$/', null],
      ['?', '/^[A-Z]+\\d+\\D?$/', 'Enstpricht nicht dem erwarteten Muster'],
      ['1', '/^[A-Z]+\\d+\\D?$/', 'Enstpricht nicht dem erwarteten Muster'],
      ['A1a', '/^[A-Z]+\\d+\\D?$/', null],
      ['AA1a', '/^[A-Z]+\\d+\\D?$/', null],
      ['A111', '/^[A-Z]+\\d+\\D?$/', null],
      ['A1aa', '/^[A-Z]+\\d+\\D?$/', 'Enstpricht nicht dem erwarteten Muster'],
      ['a1', '/^[A-Z]+\\d+\\D?$/', 'Enstpricht nicht dem erwarteten Muster'],
      ['Z1', '/^[A-Z]+\\d+\\D?$/', null],
      ['ABCDE1a', '/^[A-Z]+\\d+\\D?$/', null],
      ['ABCDE1234567890a', '/^[A-Z]+\\d+\\D?$/', null],
      ['A1z', '/^[A-Z]+\\d+\\D?$/', null],
      ['A1m', '/^[A-Z]+\\d+\\D?$/', null],
      ['A1s', '/^[A-Z]+\\d+\\D?$/', null],
      ['A', '/^[A|B]$/', null],
      ['B', '/^[A|B]$/', null],
      ['C', '/^[A|B]$/', 'Enstpricht nicht dem erwarteten Muster'],
      ['1', '/^[A|B]$/', 'Enstpricht nicht dem erwarteten Muster'],
      ['?', '/^[A|B]$/', 'Enstpricht nicht dem erwarteten Muster'],
    ]);
    test('prüft ob %s der regular expresion %s entspricht', (value, param, result) => {
      expect(regex(value, param)).toBe(result);
    });
  });

  // To Do
  describe('arrayEveryEntry module', () => {
    test.each([
      // Hier Beispielwerte einfügen
      ['Beispiel Validator', 'result'],
    ]);
    test('Macht einen Validator aus einem Validator und viel Magie', (validator, result) => {
      expect(notEmpty(validator)).toBe(result);
    });
  });
});
