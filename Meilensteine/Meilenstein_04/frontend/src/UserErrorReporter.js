export default class UserErrorReporter {
  info(msg) {
    console.log(msg);
  }

  warn(msg) {
    alert(`warn: ${msg}`);
  }

  error(msg) {
    alert(`error: ${msg}`);
  }
}
