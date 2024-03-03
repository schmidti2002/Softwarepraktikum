export default class View {
  constructor(name, parentNode, errorReporter) {
    if (!parentNode) {
      errorReporter.error(`could not init view of type ${name}. No parent node!`);
    }
    this.errorReporter = errorReporter;
    this.initPromise = fetch(`${name}.html`)
      .then((response) => response.text())
      .then((data) => {
        // eslint-disable-next-line no-param-reassign
        parentNode.innerHTML = data;
      });
  }
}
