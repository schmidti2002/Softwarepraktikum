// Alles in dieser Klasse könnte statisch sein, ist es aber absichtlich nicht, um die Übergabe
// einer Instanz in den Konstruktor einer Klasse zu "erzwingen", was es einfacher macht, die
// Singletons in Tests zu mocken

export default class SingletonManager {
  #instances = {};

  #constructors = {};

  registerConstructor(name, constructor, override = false) {
    if (this.#constructors[name] === undefined || override) {
      this.#constructors[name] = constructor;
      this.#instances[name] = undefined;
    }
  }

  get(name) {
    if (this.#instances[name] !== undefined) {
      return this.#instances[name];
    }
    if (this.#constructors[name] === undefined) {
      return undefined;
    }
    const instance = this.#constructors[name]();
    this.#instances[name] = instance;
    return instance;
  }
}
