import { v4 as uuidv4 } from 'uuid';
import { UserApi } from './api/apis/UserApi.ts';
import InputView from './InputView';
import {
  notEmpty, validateEmail, password, inputLength, regex,
} from './inputValidators';
import View from './View';

export default class RegistrationView extends View {
  #userApi;

  constructor(parentNode, singletonManager) {
    const eventReporter = singletonManager.get('EventReporter');
    super('RegistrationView', parentNode, eventReporter);
    this.eventReporter = eventReporter;
    this.#userApi = singletonManager.get('UserApi');
    this.initPromise.then(() => {
      // Eingabemaske für Email, Nutzername und Passwort erzeugen
      this.inputView = new InputView(
        document.getElementById('registration'),
        eventReporter,
        () => { },
      );
      this.inputView.initPromise.then(() => this.inputView.loadConfig([
        {
          name: 'Email',
          field: 'email',
          type: 'string',
          validators: [{ func: validateEmail }],
        },
        {
          name: 'Benutzername',
          field: 'username',
          type: 'string',
          validators: [{func: notEmpty }, { func: regex, param: /^[a-zA-Z0-9_]+$/ }],
        },
        {
          name: 'Passwort',
          field: 'passwd',
          type: 'password',
          validators: [{
            func: inputLength,
            param: { min: 8 },
          },
          {
            func: password,
          },
          ],
        },
      ]));
    });
  }

  async onClickRegister() {
    if (!this.inputView.validate()) {
      this.eventReporter.info('Email, Nutzername und Passwort werden benötigt.');
      return;
    }

    const user = this.inputView.getValues(); // Werte aus der Eingabemaske abrufen

    // Registrierung durchführen
    // ToDo: Registierung für API implementieren
    this.#userApi.userPost({ userCreate: { ...user, admin: false, id: uuidv4() } }).then(() => {
      window.location.reload();
    }).catch(() => { this.eventReporter.error('Fehler bei der Registrierung.'); });
  }
}
