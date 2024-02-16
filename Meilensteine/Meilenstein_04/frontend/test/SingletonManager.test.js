import {
  expect, describe, test, jest, beforeEach,
} from '@jest/globals';
import SingletonManager from '../src/SingletonManager';

describe('SingletonManager.js', () => {
  let singletonManager;
  beforeEach(() => {
    singletonManager = new SingletonManager();
  });

  test('constructor only called once', () => {
    const constr = jest.fn();
    constr.mockReturnValueOnce(1);
    singletonManager.registerConstructor('test', constr);
    singletonManager.get('test');
    singletonManager.get('test');

    expect(constr).toBeCalledTimes(1);
  });

  test('identical object with every get()', () => {
    const constr = jest.fn();
    const obj = { a: 1 };
    constr.mockReturnValueOnce(obj);
    singletonManager.registerConstructor('test', constr);
    expect(singletonManager.get('test')).toBe(obj);
    expect(singletonManager.get('test')).toBe(obj);
  });

  test('override false on registerContructor()', () => {
    singletonManager.registerConstructor('test', () => 1);
    expect(singletonManager.get('test')).toBe(1);
    singletonManager.registerConstructor('test', () => 2);
    expect(singletonManager.get('test')).toBe(1);
  });

  test('override true on registerContructor()', () => {
    singletonManager.registerConstructor('test', () => 1);
    expect(singletonManager.get('test')).toBe(1);
    singletonManager.registerConstructor('test', () => 2, true);
    expect(singletonManager.get('test')).toBe(2);
  });

  test('unregisted type returns undefined', () => {
    expect(singletonManager.get('test')).toBe(undefined);
  });
});
