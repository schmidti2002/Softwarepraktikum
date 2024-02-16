import {
  expect, describe, test, jest, beforeEach, beforeAll,
} from '@jest/globals';
import LoginView from '../src/LoginView';
import InputView from '../src/InputView';
import { UserApi } from '../api/apis/UserApi.ts';
import SingletonManager from '../src/SingletonManager';
import { awaitAllAsync, delay, mockFetchHtml, mockReload } from './testUtils.test.js';
import { ResponseError } from '../api/runtime.ts';

jest.mock('../src/InputView');
jest.mock('../api/apis/UserApi.ts');

describe('LoginView.js', () => {
  const brockenUsername = '\'); DROP TABLE *;';
  const wrongPasswd = 'lassmichRE1N!';
  const correctPasswd = '🥺👉👈';

  const infoFnMock = jest.fn();
  const warnFnMock = jest.fn();
  const errorFnMock = jest.fn();
  const reloadMock = mockReload();
  const singletonManager = new SingletonManager();

  beforeAll(() => {
    singletonManager.registerConstructor('EventReporter', () => ({
      info: infoFnMock,
      warn: warnFnMock,
      error: errorFnMock,
    }));

    mockFetchHtml('../src/LoginView.html');

    UserApi.mockImplementation((conf) => ({
      userLoginGet: () => {
        if (conf.password === correctPasswd) {
          return Promise.resolve();
        }
        if (conf.username !== brockenUsername) {
          return Promise.reject(new ResponseError({ status: 401 }));
        }
        return Promise.reject(new ResponseError({ status: 500 }));
      },
    }));
  });

  beforeEach(() => {
    infoFnMock.mockClear();
    warnFnMock.mockClear();
    errorFnMock.mockClear();
    reloadMock.mockClear();
  });

  const prepareInputViewMock = (username, password) => InputView.mockImplementationOnce(
    (parent, reporter, callback) => {
      expect(parent).toBeInstanceOf(Element);
      expect(reporter).toBeTruthy();
      expect(typeof callback).toBe('function');
      return {
        initPromise: delay(100),
        loadConfig: () => {},
        getValues: () => ({ username, password }),
        validate: () => username.length > 0 && password.length > 0,
      };
    },
  );

  test('empty fields should trigger info toast', async () => {
    prepareInputViewMock('', '');
    const loginView = new LoginView(document.body, singletonManager);
    await loginView.initPromise;
    loginView.onClickLogin();

    expect(infoFnMock).toBeCalledTimes(1);
    expect(warnFnMock).toBeCalledTimes(0);
    expect(errorFnMock).toBeCalledTimes(0);
  });

  test('wrong credentials should trigger warning toast', async () => {
    prepareInputViewMock('tester', wrongPasswd);
    const loginView = new LoginView(document.body, singletonManager);
    await loginView.initPromise;
    loginView.onClickLogin();

    await awaitAllAsync();

    expect(infoFnMock).toBeCalledTimes(0);
    expect(warnFnMock).toBeCalledTimes(1);
    expect(errorFnMock).toBeCalledTimes(0);
  });

  test('API errors should trigger error toast', async () => {
    prepareInputViewMock(brockenUsername, correctPasswd);
    const loginView = new LoginView(document.body, singletonManager);
    await loginView.initPromise;
    loginView.onClickLogin();

    await awaitAllAsync();

    expect(infoFnMock).toBeCalledTimes(0);
    expect(warnFnMock).toBeCalledTimes(0);
    expect(errorFnMock).toBeCalledTimes(1);
  });

  test('successfull login should reload page', async () => {
    prepareInputViewMock('tester', correctPasswd);
    const loginView = new LoginView(document.body, singletonManager);
    await loginView.initPromise;

    loginView.onClickLogin();
    await awaitAllAsync();
    expect(reloadMock).toBeCalledTimes(1);
  });
});
