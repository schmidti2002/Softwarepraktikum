import { beforeEach, describe, expect } from '@jest/globals';
import UserEventReporter from '../src/UserEventReporter';

describe('UserEventReporter.js', () => {
  document.body.innerHTML = '<div id="mockContainer"></div>';
  let container = document.getElementById('mockContainer');
  let userEventReporter = new UserEventReporter(container);
  beforeEach(() => {
    document.body.innerHTML = '<div id="mockContainer"></div>';
    container = document.getElementById('mockContainer');
    userEventReporter = new UserEventReporter(container);
  });

  test('success() creates success-Toast', () => {
    userEventReporter.success('TestNachricht');
    expect(container.innerHTML).toBe(
      `<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11"><div class="toast align-items-center bg-success fade show showing" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">TestNachricht</div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div></div><div id="modal-container"></div>`,
    );
  });

  test('info() creates info-Toast', () => {
    userEventReporter.info('TestNachricht');
    expect(container.innerHTML).toBe(
      `<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11"><div class="toast align-items-center bg-light fade show showing" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">TestNachricht</div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div></div><div id="modal-container"></div>`,
    );
  });

  test('warn() creates warn-Toast', () => {
    userEventReporter.warn('TestNachricht');
    expect(container.innerHTML).toBe(
      `<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11"><div class="toast align-items-center bg-warning fade show showing" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">TestNachricht</div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div></div><div id="modal-container"></div>`,
    );
  });

  test('error() creates error-Toast', () => {
    userEventReporter.error('TestNachricht');
    expect(container.innerHTML).toBe(
      `<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11"><div class="toast align-items-center bg-danger fade show showing" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">TestNachricht</div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div></div><div id="modal-container"></div>`,
    );
  });

  test('fatal() creates fatal-Toast', () => {
    userEventReporter.fatal('TestNachricht');
    expect(container.innerHTML).toBe(
      `<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11"></div><div id="modal-container"><div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style="padding-right: 1024px;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Schwerwiegender Fehler</h5>
        </div>
        <div class="modal-body">TestNachricht</div>
        <div class="modal-footer">
          <a href="." class="btn btn-primary">Neu laden</a>
        </div>
      </div>
    </div>
  </div></div>`,
    );
  });
});
