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
                () => {}
            );
            this.inputView.initPromise.then(() =>
                this.inputView.loadConfig([
                    {
                        name: 'Nutzername',
                        field: 'username',
                        type: 'string',
                        validators: [
                            {
                                func: notEmpty,
                            },
                        ],
                    },
                ])
            );
        });
    }

    async onClickResetPassword() {
        if (!this.inputView.validate()) {
            this.eventReporter.info('Nutzername wird benötigt.');
            return;
        }
    
        const { username } = this.inputView.getValues(); // Wert des Benutzernamens abrufen
    
        try {
            // Passwortreset durchführen
            // ToDo: resetPassword für API implementieren
            const resetResponse = await UserApi.resetPassword(username);
            
            resetResponse.then(response => {
                if (response.status === 200) {
                    this.eventReporter.success(
                        'Passwortreset erfolgreich. Überprüfen Sie Ihre E-Mail für weitere Anweisungen.'
                    );
                } else {
                    this.eventReporter.error('Fehler beim Passwortreset.');
                }
            }).catch(error => {
                this.eventReporter.error('Fehler beim Passwortreset: ' + error.message);
            });
        } catch (error) {
            this.eventReporter.error('Fehler beim Passwortreset: ' + error.message);
        }
    }
}