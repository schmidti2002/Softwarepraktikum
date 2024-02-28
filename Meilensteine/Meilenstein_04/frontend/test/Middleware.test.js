import {
  expect, describe, test, jest, beforeEach,
} from '@jest/globals';
import Middleware from '../src/Middleware';
import { mockReload } from './testUtils.test';

describe('Middleware.js', () => {
  const errorFn = jest.fn();
  const middleware = new Middleware({
    error: errorFn,
  });
  beforeEach(() => {
    errorFn.mockClear();
    mockReload();
  });

  test('unauthorized should reload page', () => {
    expect(
      () => middleware.onError({
        response: {
          status: 401,
        },
      }),
    ).toThrowError('reload');

    expect(errorFn).not.toBeCalled();
  });

  test('internal server error should spawn message', () => {
    const url = '/api/user';
    const status = 510;
    middleware.onError({
      url,
      response: {
        status,
      },
    });

    expect(errorFn).toBeCalledTimes(1);

    const param1 = errorFn.mock.calls[0][0];
    expect(param1).toContain(url);
    expect(param1).toContain(status.toString());
  });

  test('other errors should spawn message', () => {
    const url = '/api/user';
    const msg = 'ERR!!!';
    middleware.onError({
      url,
      error: { msg },
    });

    expect(errorFn).toBeCalledTimes(1);

    const param1 = errorFn.mock.calls[0][0];
    expect(param1).toContain(url);
    expect(param1).toContain(msg);
  });
});
