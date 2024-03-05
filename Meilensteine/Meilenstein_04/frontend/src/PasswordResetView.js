import InputView from './InputView';
import { notEmpty } from './inputValidators';
import View from './View';

export default class PasswordResetView extends View {
  #userApi;

  constructor(parentNode, singletonManager) {
    const eventReporter = singletonManager.get('EventReporter');
    super('PasswordResetView', parentNode, eventReporter);
    this.eventReporter = eventReporter;
    this.#userApi = singletonManager.get('UserApi');

    this.initPromise.then(() => {
      // Eingabemaske für Nutzername und Email erzeugen
      this.inputView = new InputView(
        document.getElementById('password-reset-input'),
        eventReporter,
        () => { },
      );
      this.inputView.initPromise.then(() => this.inputView.loadConfig([
        {
          name: 'Benutzername',
          field: 'username',
          type: 'string',
          validators: [
            {
              func: notEmpty,
            },
          ],
        },
      ]));
    });
  }

  async onClickPasswordReset() {
    if (!this.inputView.validate()) {
      this.eventReporter.info('Nutzername wird benötigt.');
      return;
    }

    const username = this.inputView.getValues(); // Wert des Benutzernamens abrufen

    this.#userApi.userResetPasswordPost(username).then(() => {
      this.eventReporter.success('Admin wurde informiert.');
    })
      .catch(() => { this.eventReporter.error('Fehler bei der Anfrage des Passwort-Resets.'); });
  }
}
