export default class Middleware {
  #eventReporter;

  constructor(eventReporter) {
    this.#eventReporter = eventReporter;
  }

  // Wird aufgerufen wenn eine API-Route einen Fehler wirft.
  // Zeigt dem Nutzer die Fehlermeldung an oder lädt die Seite neu sollte er nicht eingelogt sein.
  onError(context) {
    if (context.response) {
      const { status } = context.response;
      if (status === 401) {
        window.location.reload();
      } else if (status >= 500) {
        this.#eventReporter.error(`Interner Server Fehler!\nCode ${status} bei Anfrage ${context.url}`);
        return;
      }
    }
    this.#eventReporter.error(`Fehler: ${JSON.stringify(context.error)} bei Anfrage ${context.url}`);
  }
}
