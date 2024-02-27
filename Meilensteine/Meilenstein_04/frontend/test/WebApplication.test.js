import {
  expect, describe, test, jest, beforeEach, beforeAll,
} from '@jest/globals';
import fs from 'fs';
import path from 'path';
import UserEventReporter from '../src/UserEventReporter';
import LoginView from '../src/LoginView';
import MainView from '../src/MainView';
import { UserApi } from '../src/api/apis/UserApi.ts';
import { ResponseError } from '../src/api/runtime.ts';
import entry from '../src/WebApplication';
import SingletonManager from '../src/SingletonManager';

jest.mock('../src/Middleware');
jest.mock('../src/UserEventReporter');
jest.mock('../src/LoginView');
jest.mock('../src/MainView');
jest.mock('../src/api/apis/UserApi.ts');

const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
describe('WebApplication.js', () => {
  const fatalFnMock = jest.fn();

  beforeAll(() => {
    UserEventReporter.mockImplementation(() => ({
      fatal: fatalFnMock,
    }));
  });

  beforeEach(() => {
    fatalFnMock.mockClear();

    document.documentElement.innerHTML = html.replaceAll(/<.*html.*>/gi, '');
  });

  const mockUserGetApi = (userGet) => UserApi.mockImplementation(
    () => ({ userGet }),
  );

  test('should create MainView if logged in', async () => {
    mockUserGetApi(() => Promise.resolve());
    const mainViewConstrMock = jest.fn();
    MainView.mockImplementation(mainViewConstrMock);

    await entry();

    expect(fatalFnMock).not.toBeCalled();
    expect(mainViewConstrMock).toBeCalled();
  });
  test('should create LoginView if not logged', async () => {
    mockUserGetApi(() => Promise.reject(new ResponseError({ status: 401 })));
    const loginViewConstrMock = jest.fn();
    LoginView.mockImplementation(loginViewConstrMock);

    await entry();

    expect(fatalFnMock).not.toBeCalled();
    expect(loginViewConstrMock).toBeCalled();
  });

  test('should register all APIs in SingletonManager', async () => {
    mockUserGetApi(() => Promise.resolve());
    const mainViewConstrMock = jest.fn();
    MainView.mockImplementation(mainViewConstrMock);

    await entry();

    const singletonManager = mainViewConstrMock.mock.calls[0][1];
    expect(singletonManager).toBeInstanceOf(SingletonManager);

    const apisIndex = fs.readFileSync(path.resolve(__dirname, '../src/api/apis/index.ts'), 'utf8');
    const foundApis = [...apisIndex.matchAll(/'.\/(.*Api)'/g)];

    expect(foundApis.length).toBeGreaterThan(0);

    foundApis.forEach((foundApi) => {
      const apiName = foundApi[1];
      expect(singletonManager.get(apiName)).toBeTruthy();
    });
  });
});
