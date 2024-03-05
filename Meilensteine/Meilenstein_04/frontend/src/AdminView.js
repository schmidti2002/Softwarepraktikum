import * as _ from 'lodash';
import InputView from './InputView';
import View from './View';
import {
  emptyOr, inEnum, inputLength, notEmpty, password, validateEmail,
} from './inputValidators';

export default class AdminView extends View {
  #userApi;

  #container;

  #eventReporter;

  #users;

  #deleteInput;

  constructor(parentNode, singletonManager) {
    const eventReporter = singletonManager.get('EventReporter');
    super('AdminView', parentNode, eventReporter);
    this.#eventReporter = eventReporter;
    this.#userApi = singletonManager.get('UserApi');
    this.initPromise.then(() => {
      this.#container = document.getElementById('admin-container');
      this.loadUsers();
      const deleteUserBtn = document.getElementById('admin-delete-user-btn');
      const deleteInputElm = document.getElementById('delete-input');
      this.#deleteInput = new InputView(
        deleteInputElm,
        eventReporter,
        (valid, values) => { deleteUserBtn.disabled = !valid || values.delete === ''; },
      );
      this.#deleteInput.initPromise.then(() => {
        this.#deleteInput.loadConfig([{
          name: '$NUTZERNAME$ permanent löschen',
          field: 'delete',
          type: 'string',
          validators: [{
            func: (value) => {
              if (value === '') {
                return null;
              }
              if (!value.endsWith(' permanent löschen')) {
                return 'Eingabe hält sich nicht an Format "$NUTZERNAME$ permanent löschen"';
              }
              const username = value.replace(/ permanent löschen$/, '');
              const user = _.find(Object.values(this.#users), (user) => user.data.username === username);
              if (user === undefined) {
                return 'Nutzer nicht gefunden';
              }
              return null;
            },
          },
          ],
        }]);
      });
    });
  }

  createUserEntry(user) {
    const entryElm = document.createElement('div');
    entryElm.classList.add('accordion-item');
    entryElm.setAttribute('data-user-id', user.id);
    entryElm.innerHTML = `<h2 class="accordion-header">
<button  class="position-relative accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#user-${user.id}" aria-expanded="false" aria-controls="user-${user.id}">
${user.username} ${user.admin ? '👨🏻‍🔧' : ''}<span id="user-${user.id}-marker" class="invisible p-2 bg-danger border border-light rounded-circle">
</span>

</button>
</h2>
<div id="user-${user.id}" class="accordion-collapse collapse" data-bs-parent="#admin-container">
<div id="user-${user.id}-input"></div>
<button data-onclick="onClickReset" class="btn btn-secondary">Reset</button>
<button id="user-${user.id}-store" data-onclick="onClickStore" class="btn btn-secondary">Speichern</button>
</div>
`;
    this.#container.appendChild(entryElm);

    const inputView = new InputView(
      document.getElementById(`user-${user.id}-input`),
      this.#eventReporter,
      (valid, values) => this.#updateUserChange(user.id, valid, values),
    );

    inputView.initPromise.then(() => {
      inputView.loadConfig([
        {
          name: 'Nutzername',
          field: 'username',
          prefill: () => user.username,
          type: 'string',
          validators: [{
            func: notEmpty,
          },
          ],
        },
        {
          name: 'Email',
          field: 'email',
          prefill: () => user.email,
          type: 'string',
          validators: [{
            func: validateEmail,
          },
          ],
        },
        {
          name: 'Neues Passwort oder leer',
          field: 'password',
          type: 'password',
          validators: [
            {
              func: emptyOr(password),
            },
            {
              func: emptyOr(inputLength),
              param: { min: 8 },
            },
          ],
        },
        {
          name: `schreibe "Admin-Rechte ${user.username} ${user.admin ? 'entziehen' : 'erteilen'}"`,
          field: 'admin',
          type: 'admin',
          validators: [{
            func: inEnum,
            param: ['', `Admin-Rechte ${user.username} ${user.admin ? 'entziehen' : 'erteilen'}`],
          }],
        },
      ]);
    });

    return {
      data: user,
      inputView,
    };
  }

  async loadUsers() {
    this.#users = _.chain(await /* this.#userApi.usersGet() */Promise.resolve([
      {
        id: 1, username: 'Bob', email: 'bob@example.com', admin: true,
      },
      {
        id: 2, username: 'Eve', email: 'eve@example.com', admin: false,
      },
    ]))
      .map((user) => this.createUserEntry(user))
      .keyBy((user) => user.data.id)
      .value();
  }

  #getChanges(saved, current) {
    const changes = {};
    let hasChanges = false;
    Object.entries(current).forEach(([key, value]) => {
      if (key === 'password' && value === '' || value === null) {
        return;
      }
      if (saved[key] !== value) {
        changes[key] = value;
        hasChanges = true;
      }
    });

    return hasChanges ? changes : null;
  }

  #updateUserChange(userId, valid, values) {
    if (!this.#users[userId]) {
      return;
    }
    const storeBtn = document.getElementById(`user-${userId}-store`);
    const changes = this.#getChanges(this.#users[userId].data, values);
    const changesReady = valid && changes;
    storeBtn.disabled = !changesReady;
    const marker = document.getElementById(`user-${userId}-marker`);
    if (changesReady) {
      marker.classList.replace('invisible', 'visible');
    } else {
      marker.classList.replace('visible', 'invisible');
    }
  }

  #updateUser(userId) {
    const { inputView } = this.#users[userId];
    if (!inputView.validate()) {
      return;
    }
    const values = inputView.getValues();
    const changes = this.#getChanges(this.#users[userId].data, values);
    if (!changes) {
      return;
    }
    this.#userApi.userUserIdPut({
      userId,
      userUpdatePartial: {
        id: userId,
        ...changes,
      },
    }).then(() => {
      this.#eventReporter.success(`Nutzer ${this.#users[userId].username} aktualisiert`);
    });
  }

  #getUserIdFromClick(event) {
    let { target } = event;
    let userId = null;
    while (target !== null && !target.isEqualNode(this.parentNode) && userId === null) {
      userId = target.getAttribute('data-user-id');
      target = target.parentElement;
    }
    return userId;
  }

  onClickReset(event) {
    const userId = this.#getUserIdFromClick(event);
    this.#users[userId].inputView.resetValues();
  }

  onClickStore(event) {
    const userId = this.#getUserIdFromClick(event);
    this.#updateUser(userId);
  }

  onClickStoreAll() {
    Object.keys(this.#users).forEach((id) => this.#updateUser(id));
  }

  onClickDeleteUser() {
    const deleteString = this.#deleteInput.getValues().delete;
    const username = deleteString.replace(/ permanent löschen$/, '');
    const user = _.find(Object.values(this.#users), (user) => user.data.username === username);
    this.#userApi.userUserIdDelete({ userId: user.data.id }).then(() => {
      this.#eventReporter.success(`Nutzer ${this.#users[userId].username} gelöscht`);
    });
  }
}
