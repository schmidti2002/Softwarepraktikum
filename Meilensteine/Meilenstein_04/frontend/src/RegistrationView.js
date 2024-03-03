import { UserApi } from './api/apis/UserApi.ts';
import InputView from './InputView';
import { notEmpty, validateEmail } from './inputValidators';
import View from './View';

export default class RegistrationView extends View {
    constructor(parentNode, singletonManager) {
        const eventReporter = singletonManager.get('EventReporter');
        super('RegistrationView', parentNode, eventReporter);
        this.eventReporter = eventReporter;

        this.initPromise.then(() => {
            // Eingabemaske für Email, Nutzername und Passwort erzeugen
            this.inputView = new InputView(
                document.getElementById('registration'),
                eventReporter,
                () => {},
            );
            this.inputView.initPromise.then(() => this.inputView.loadConfig([
                {
                    name: 'Email',
                    field: 'email',
                    type: 'email',
                    validators: [{ func: validateEmail }], 
                },
                {
                    name: 'Benutzername',
                    field: 'username',
                    type: 'string',
                    validators: [{ func: notEmpty }],
                },
                {
                    name: 'Passwort',
                    field: 'password',
                    type: 'password',
                    validators: [{ func: notEmpty }],
                },
            ]));
        });
    }

    async onClickRegister() {
        if (!this.inputView.validate()) {
            this.eventReporter.info('Email, Nutzername und Passwort werden benötigt.');
            return;
        }

        const { email, username, password } = this.inputView.getValues(); // Werte aus der Eingabemaske abrufen

        try {
            // Registrierung durchführen
            // ToDo: Registierung für API implementieren
            const registrationResponse = await UserApi.userPost({ email, username, password });  

            if (registrationResponse.status === 200) { 
                this.eventReporter.success('Registrierung erfolgreich. Sie können sich jetzt anmelden.');
                // Weiterleiten zu Login-Seite 
                window.location.href = 'LoginView.html'; 
            } else {
                this.eventReporter.error('Fehler bei der Registrierung.');
            }
        } catch (error) {
            this.eventReporter.error('Fehler bei der API-Anfrage: ' + error.message);
        }
    }
}