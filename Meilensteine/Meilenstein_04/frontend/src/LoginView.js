import { UserApi } from './api/apis/UserApi.ts';
import { Configuration, ResponseError } from './api/runtime.ts';
import InputView from './InputView';
import { notEmpty } from './inputValidators';
import View from './View';
import RegistrationView from './RegistrationView.js';
import PasswordResetView from './PasswordResetView.js';

export default class LoginView extends View {
  #singletonManager;

  constructor(parentNode, singletonManager) {
    const eventReporter = singletonManager.get('EventReporter');
    super('LoginView', parentNode, eventReporter);
    this.eventReporter = eventReporter;
    this.#singletonManager = singletonManager;

    this.initPromise.then(() => {
      // Eingabemaske für Nutzername und Passwort erzeugen
      this.inputView = new InputView(
        document.getElementById('loginview-input'),
        eventReporter,
        () => { },
      );
      this.inputView.initPromise.then(() => this.inputView.loadConfig([
        {
          name: 'Nutzername',
          field: 'username',
          type: 'string',
          validators: [{
            func: notEmpty,
          },
          ],
        },
        {
          name: 'Passwort',
          field: 'password',
          type: 'password',
          validators: [
            {
              func: notEmpty,
            },
          ],
        },
      ]));
    });
  }

  // Loginversuch mit Nutzername und Passwort
  // Lädt Seite neu wenn der Login klappt und zeigt sonst eine Fehlermeldung
  onClickLogin() {
    if (!this.inputView.validate()) {
      this.eventReporter.info('Nutzername und Passwort werden benötigt.');
      return;
    }

    const userApi = new UserApi(new Configuration({
      ...this.inputView.getValues(),
      headers: { 'content-type': 'application/json' },
      basePath: '/api',
    }));

    userApi.userApitokenPost()
      .then(() => {
        window.location.reload(); 
      })
      .catch((err) => {
        if (err instanceof ResponseError && err.response && err.response.status === 401) {
          this.eventReporter.warn('Nutzername und Passwort überprüfen!');
        } else {
          this.eventReporter.error('Login failed!');
        }
      });
  }

  async onClickRegister() {
    const registrationView = new RegistrationView(this.parentNode, this.#singletonManager);
    await registrationView.initPromise;
  }

  async onClickPassword() {
    const passwordView = new PasswordResetView(this.parentNode, this.#singletonManager);
    await passwordView.initPromise;
  }
}
