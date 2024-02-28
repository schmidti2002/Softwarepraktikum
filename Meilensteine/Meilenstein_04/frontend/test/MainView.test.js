import {
  expect, describe, test, beforeEach,
} from '@jest/globals';
import MainView from '../src/MainView';
import SingletonManager from '../src/SingletonManager';
import UserEventReporter from '../src/UserEventReporter';
import { mockFetchHtml } from './testUtils.test';

describe('MainView.test.js', () => {
  mockFetchHtml('../src/MainView.html');
  mockFetchHtml('../src/StartPage.html');
  let mainView;
  document.body.innerHTML = '<dic id="1"></div><div id=2></div>';
  const userEventReporter = new UserEventReporter(document.getElementById('1'));
  const singletonManager = new SingletonManager();
  singletonManager.registerConstructor('EventReporter', () => userEventReporter);
  beforeEach(() => {
    mainView = new MainView(document.getElementById('2'), singletonManager);
  });

  test('setLastLoad puts a item in the local storage(?)', () => {
    mainView.setLastLoad(42);
    expect(localStorage.getItem('lastLoad')).toBe('42');
  });
});
