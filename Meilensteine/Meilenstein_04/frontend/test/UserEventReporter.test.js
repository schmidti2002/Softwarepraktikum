import {
  beforeEach, describe, expect, test,
} from '@jest/globals';
import UserEventReporter from '../src/UserEventReporter';
import { awaitAllAsync } from './testUtils.test';

describe('UserEventReporter.js', () => {
  describe('#spawnToast using functions', () => {
    document.body.innerHTML = '<div id="mockContainer"></div>';
    let container = document.getElementById('mockContainer');
    let userEventReporter = new UserEventReporter(container);
    beforeEach(() => {
      document.body.innerHTML = '<div id="mockContainer"></div>';
      container = document.getElementById('mockContainer');
      userEventReporter = new UserEventReporter(container);
    });

    test('success() creates success-Toast', async () => {
      userEventReporter.success('TestNachricht');
      await awaitAllAsync();
      expect(container.innerHTML).toBe(
        `<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11"><div class="toast align-items-center bg-success fade show showing" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body"></div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div></div><div id="modal-container"></div>`,
      );
      expect(container.getElementsByClassName('toast-body')[0].innerText).toBe('TestNachricht');
    });

    test('info() creates info-Toast', async () => {
      userEventReporter.info('TestNachricht');
      await awaitAllAsync();
      expect(container.innerHTML).toBe(
        `<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11"><div class="toast align-items-center bg-light fade show showing" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body"></div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div></div><div id="modal-container"></div>`,
      );
    });

    test('warn() creates warn-Toast', async () => {
      userEventReporter.warn('TestNachricht');
      await awaitAllAsync();
      expect(container.innerHTML).toBe(
        `<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11"><div class="toast align-items-center bg-warning fade show showing" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body"></div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div></div><div id="modal-container"></div>`,
      );
      expect(container.getElementsByClassName('toast-body')[0].innerText).toBe('TestNachricht');
    });

    test('error() creates error-Toast', async () => {
      userEventReporter.error('TestNachricht');
      await awaitAllAsync();
      expect(container.innerHTML).toBe(
        `<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11"><div class="toast align-items-center bg-danger fade show showing" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body"></div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div></div><div id="modal-container"></div>`,
      );
      expect(container.getElementsByClassName('toast-body')[0].innerText).toBe('TestNachricht');
    });
  });

  describe('not #spawnToast using functions', () => {
    document.body.innerHTML = '<div id="mockContainer"></div>';
    let container = document.getElementById('mockContainer');
    let userEventReporter = new UserEventReporter(container);
    beforeEach(() => {
      document.body.innerHTML = '<div id="mockContainer"></div>';
      container = document.getElementById('mockContainer');
      userEventReporter = new UserEventReporter(container);
    });
    test('fatal() creates fatal-Toast', async () => {
      userEventReporter.fatal('TestNachricht');
      await awaitAllAsync();
      expect(container.innerHTML).toBe(
        `<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11"></div><div id="modal-container"><div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style="padding-right: 1024px;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Schwerwiegender Fehler</h5>
        </div>
        <div class="modal-body"></div>
        <div class="modal-footer">
          <a href="." class="btn btn-primary">Neu laden</a>
        </div>
      </div>
    </div>
  </div></div>`,
      );
      expect(container.getElementsByClassName('modal-body')[0].innerText).toBe('TestNachricht');
    });
  });
});
