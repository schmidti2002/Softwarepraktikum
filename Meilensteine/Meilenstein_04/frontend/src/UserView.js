import InputView from './InputView';
import View from './View';
import {
  emptyOr, inputLength, notEmpty, password, validateEmail,
} from './inputValidators';

export default class UserView extends View {
  #inputView;

  #userApi;

  #userInfo;

  #storeBtn;

  #resetBtn;

  constructor(parentNode, singletonManager) {
    const eventReporter = singletonManager.get('EventReporter');
    super('UserView', parentNode, eventReporter);
    this.#userApi = singletonManager.get('UserApi');
    const userDataRequest = Promise.resolve({
      id: 1, username: 'Bob', email: 'bob@example.com', admin: true,
    });// TODO this.#userApi.userGet();

    this.initPromise.then(async () => {
      this.#resetBtn = document.getElementById('user-editor-reset');
      this.#storeBtn = document.getElementById('user-editor-store');
      this.#userInfo = await userDataRequest;
      this.#inputView = new InputView(
        document.getElementById('user-editor-input'),
        eventReporter,
        (valid, values) => this.#updateButtons(valid, values),
      );
      await this.#inputView.initPromise;
      this.#inputView.loadConfig([
        {
          name: 'Nutzername',
          field: 'username',
          type: 'string',
          prefill: () => this.#userInfo.username,
          validators: [{
            func: notEmpty,
          },
          ],
        },
        {
          name: 'E-Mail',
          field: 'email',
          type: 'string',
          prefill: () => this.#userInfo.email,
          validators: [{
            func: validateEmail,
          },
          ],
        },
        { // in theory changing the password should require the current password
          // this is not currently implemented in our API so enforcing it here doesn't make sense.
          name: 'Neues Passwort',
          field: 'password',
          type: 'password',
          validators: [{
            func: emptyOr(password),
          },
          {
            func: emptyOr(inputLength),
            param: { min: 8 },
          },
          ],
        },
      ]);
    });
  }

  #getChanges(values) {
    return _.pickBy(values, (value, key) => (key === 'password' ? value !== '' : this.#userInfo[key] !== value));
  }

  #updateButtons(valid, values) {
    const hasChanges = !_.isEmpty(this.#getChanges(values));
    this.#storeBtn.disabled = !valid || !hasChanges;
  }

  onClickReset() {
    this.#inputView.resetValues();
  }

  onClickStore() {
    const values = this.#inputView.getValues();
    const changes = this.#getChanges(values);

    this.#userApi.userPut({
      userUpdatePartial: {
        id: this.#userInfo.id,
        ...changes,
      },
    }).then(() => {
      this.eventReporter.success('Nutzer aktualisiert');
    });
  }
}
