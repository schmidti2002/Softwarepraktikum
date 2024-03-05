// Basisklasse für eine View.
// Lädt HTML und fügt es unter der ParentNode ein.
// Leidet Klickevents an den enstprechenden Listener weiter.
export default class View {
  constructor(name, parentNode, eventReporter) {
    this.parentNode = parentNode;
    if (!parentNode) {
      eventReporter.fatal(`could not init view of type ${name}. No parent node!`);
      return;
    }
    this.eventReporter = eventReporter;
    this.initPromise = fetch(`${name}.html`)
      .then((response) => response.text())
      .then((data) => {
        // eslint-disable-next-line no-param-reassign
        parentNode.innerHTML = data;
        parentNode.addEventListener('click', (e) => this.#checkClickListeners(e));
      })
      .catch(() => {
        eventReporter.fatal(`could not init view of type ${name}. Could not load ${name}.html!`);
      });
  }

  // geht solange den DOM-Tree vom geklickten Element nach oben durch bis
  // - ein Element einen Klicklistener hat => wird aufgerufen
  // - der ParentContainer der View erreicht ist
  // - die Wurzel des DOM-Tree erreicht ist
  #checkClickListeners(event) {
    let { target } = event;
    let callbackName = null;
    while (target !== null && !target.isEqualNode(this.parentNode) && callbackName === null) {
      callbackName = target.getAttribute('data-onclick');
      target = target.parentElement;
    }
    if (callbackName === null) {
      return;
    }
    if (typeof this[callbackName] === 'function') {
      event.stopPropagation();
      this[callbackName](event);
    } else {
      this.eventReporter.fatal(`No click listener with name ${callbackName} exists on view!`);
    }
  }
}
