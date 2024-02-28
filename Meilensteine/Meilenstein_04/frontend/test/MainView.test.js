import {
  expect, describe, test, beforeEach,
} from '@jest/globals';
import MainView from '../src/MainView';
// import SingletonManager from '../src/SingletonManager';

describe('MainView.test.js', () => {
  let mainView;
  beforeEach(() => {
    mainView = new MainView(document.body, {});
  });

  test('setLastLoad puts a item in the local storage(?)', () => {
    mainView.setLastLoad(42);
    expect(mainView.localStorage.getItem('lastLoad')).toBe(42);
  });
});
