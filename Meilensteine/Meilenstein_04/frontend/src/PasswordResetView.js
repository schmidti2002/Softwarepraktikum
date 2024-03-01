import { UserApi } from './api/apis/UserApi.ts';
import InputView from './InputView';
import { notEmpty } from './inputValidators';
import { validateEmail } from './inputValidators';
import View from './View';

export default class PasswordResetView extends View {
    constructor(parentNode, singletonManager) {
      const eventReporter = singletonManager.get('EventReporter');
      super('PasswordResetView', parentNode, eventReporter);
      this.eventReporter = eventReporter;
  
      this.initPromise.then(() => {
        // Eingabemaske für Nutzername und Email erzeugen
        this.inputView = new InputView(
          document.getElementById('password-reset-input'),
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
            name: 'Email',
            field: 'email',
            type: 'email',
            validators: [
              {
                func: validateEmail,
              },
            ],
          },
        ]));
      });
    }

    async onClickResetPassword() {
        if (!this.inputView.validate()) {
          this.eventReporter.info('Nutzername und E-Mail-Adresse werden benötigt.');
          return;
        }
        
        const { username, email } = this.inputView.getValues(); // Werte aus der Eingabemaske abrufen

        try {
            // Benutzer abrufen
            const user = await UserApi.userGet({ username, email });

            // Überprüfen, ob ein Benutzer gefunden wurde
            if (user) {
                // Passwortreset durchführen
                // ToDo: resetPassword für API implementieren
                const resetResponse = await UserApi.resetPassword(user.email);
                if (resetResponse.status === 200) {
                    this.eventReporter.success('Passwortreset erfolgreich. Überprüfen Sie Ihre E-Mail für weitere Anweisungen.');
                } else {
                    this.eventReporter.error('Fehler beim Passwortreset.');
                }
            } else {
                this.eventReporter.error('Benutzer nicht gefunden.');
            }
        } catch (error) {
            this.eventReporter.error('Fehler bei der API-Anfrage: ' + error.message);
        }
    }
}