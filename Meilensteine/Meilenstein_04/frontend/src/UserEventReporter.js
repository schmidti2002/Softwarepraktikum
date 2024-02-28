import { Modal, Toast } from 'bootstrap';

// Zeigt dem Nutzer Infos, Warnungen und Fehlermeldungen
// Die Klasse nutzt absichtlich kein fetch um HTML nachzuladen um möglichst robust zu sein
export default class UserEventReporter {
  #toastContainer;

  #modalContainer;

  #converter;

  constructor(container) {
    try {
    // eslint-disable-next-line no-param-reassign
      container.innerHTML = '<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11"></div>'
        + '<div id="modal-container"></div>';

      [this.#toastContainer] = container.getElementsByClassName('toast-container');

      this.#modalContainer = document.getElementById('modal-container');

      this.#converter = document.createElement('div');
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Fehlerbehandlung konnte nicht initalisiert werden!');
    }
  }

  // kleiner Hack um HTML-Strings in Elemente umzuwandeln
  #strToHtmlElm(str) {
    this.#converter.innerHTML = str;
    return this.#converter.firstChild;
  }

  #spawnToast(bgColorClass, msg, autohide = false) {
    // eslint-disable-next-line operator-linebreak
    const toastHTML =
      `<div class="toast align-items-center ${bgColorClass}" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body"></div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>`;
    const toastElm = this.#strToHtmlElm(toastHTML);
    toastElm.getElementsByClassName('toast-body')[0].textContent = msg;
    this.#toastContainer.appendChild(toastElm);
    const toast = new Toast(toastElm, { autohide });
    toastElm.addEventListener('hidden.bs.toast', () => {
      toast.dispose();
      toastElm.remove();
    });
    toast.show();
  }

  success(msg) {
    this.#spawnToast('bg-success', msg, true);
  }

  info(msg) {
    this.#spawnToast('bg-light', msg, true);
  }

  warn(msg) {
    this.#spawnToast('bg-warning', msg);
  }

  error(msg) {
    this.#spawnToast('bg-danger', msg);
  }

  fatal(msg) {
    // eslint-disable-next-line operator-linebreak
    const modalHTML =
      `<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
  </div>`;
    this.#modalContainer.innerHTML = modalHTML;
    const modalElm = this.#modalContainer.firstChild;
    modalElm.getElementsByClassName('modal-body')[0].textContent = msg;
    const modal = new Modal(modalElm);
    modal.show();
    window.stop();
  }
}
