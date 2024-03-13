import {
  jest, describe, test, expect, beforeEach, beforeAll,
} from '@jest/globals';
import View from '../src/View';
import { awaitAllAsync } from './testUtils.test';

describe('View.js', () => {
  const fatalFnMock = jest.fn();
  const eventReporter = { fatal: fatalFnMock };
  const validViewName = 'ValidTest';
  const clickListenerName = 'onClickListener';
  const html = `<div>
  <div id="click" data-onclick="${clickListenerName}">
      <div id="inner-click"></div>
  </div>
  <div id="no-click">
      <div id="bad-click" data-onclick="NotAValidFunction"></div>
  </div>
</div>`;

  beforeAll(() => {
    global.fetch = jest.fn((url) => (
      `${validViewName}.html` === url
        ? Promise.resolve({ text: () => html }) : Promise.reject()));
  });

  beforeEach(() => {
    fatalFnMock.mockClear();
  });
  describe('error handling', () => {
    test('no parent', () => {
      expect(() => new View(validViewName, null, eventReporter)).not.toThrow();
      expect(fatalFnMock).toBeCalled();
    });

    test('failed fetch of html document', async () => {
      expect(() => new View('InvalidTest', document.body, eventReporter)).not.toThrow();
      await awaitAllAsync();
      expect(fatalFnMock).toBeCalled();
    });
  });

  describe('click event handling', () => {
    let view;
    beforeEach(async () => {
      view = new View(validViewName, document.body, eventReporter);
      view[clickListenerName] = jest.fn();
      await view.initPromise;
      await awaitAllAsync();
    });
    test('click on clickable element trigger the listener', () => {
      document.getElementById('click').click();
      expect(view[clickListenerName]).toBeCalled();
      expect(fatalFnMock).not.toBeCalled();
    });
    test('click event should bubble', () => {
      document.getElementById('inner-click').click();
      expect(view[clickListenerName]).toBeCalled();
      expect(fatalFnMock).not.toBeCalled();
    });
    test('non clickable elements do nothing', () => {
      document.getElementById('no-click').click();
      expect(view[clickListenerName]).not.toBeCalled();
      expect(fatalFnMock).not.toBeCalled();
    });
    test('missing listeners should generate fatal error', () => {
      document.getElementById('bad-click').click();
      expect(view[clickListenerName]).not.toBeCalled();
      expect(fatalFnMock).toBeCalled();
    });
  });
});
