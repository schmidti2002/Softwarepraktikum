import {
  beforeEach, describe, expect, test,
} from '@jest/globals';
import UserEventReporter from '../src/UserEventReporter';
import { awaitAllAsync } from './testUtils.test';

describe('UserEventReporter.js', () => {
  describe('#spawnToast using functions', () => {
    let container = document.body;
    let userEventReporter = new UserEventReporter(container);
    beforeEach(() => {
      container = document.body;
      userEventReporter = new UserEventReporter(container);
    });

    test('success() creates success-Toast', async () => {
      userEventReporter.success('TestNachricht');
      await awaitAllAsync();
      expect(container.innerHTML).toMatchSnapshot();
    });

    test('info() creates info-Toast', async () => {
      userEventReporter.info('TestNachricht');
      await awaitAllAsync();
      expect(container.innerHTML).toMatchSnapshot();
    });

    test('warn() creates warn-Toast', async () => {
      userEventReporter.warn('TestNachricht');
      await awaitAllAsync();
      expect(container.innerHTML).toMatchSnapshot();
    });

    test('error() creates error-Toast', async () => {
      userEventReporter.error('TestNachricht');
      await awaitAllAsync();
      expect(container.innerHTML).toMatchSnapshot();
    });

    test('multiple calls create multiple-Toast', async () => {
      userEventReporter.error('TestNachricht');
      userEventReporter.info('TestNachricht');
      userEventReporter.warn('TestNachricht');
      await awaitAllAsync();
      expect(container.innerHTML).toMatchSnapshot();
    });

    test('fatal() creates fatal-Toast', async () => {
      userEventReporter.fatal('TestNachricht');
      await awaitAllAsync();
      expect(container.innerHTML).toMatchSnapshot();
    });
  });
});
