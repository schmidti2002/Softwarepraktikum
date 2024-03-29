import { UserApi } from './api/apis/UserApi.ts';
import { CodeStateApi } from './api/apis/CodeStateApi.ts';
import { GraphApi } from './api/apis/GraphApi.ts';
import { HistoryApi } from './api/apis/HistoryApi.ts';
import { ListApi } from './api/apis/ListApi.ts';
import { OtherApi } from './api/apis/OtherApi.ts';
import { SnippetApi } from './api/apis/SnippetApi.ts';
import { SortApi } from './api/apis/SortApi.ts';
import { Configuration, ResponseError } from './api/runtime.ts';
import LoginView from './LoginView';
import MainView from './MainView';
import SingletonManager from './SingletonManager';
import UserEventReporter from './UserEventReporter';
import Middleware from './Middleware';

export default async function entry() {
  const overlayContainer = document.getElementById('overlay-container');
  const userEventReporter = new UserEventReporter(overlayContainer);
  try {
    const singletonManager = new SingletonManager();
    singletonManager.registerConstructor('EventReporter', () => userEventReporter);

    const config = new Configuration({
      headers: { 'content-type': 'application/json' },
      basePath: '/api',
      middleware: [new Middleware(singletonManager.get('EventReporter'))],
    });
    singletonManager.registerConstructor('CodeStateApi', () => new CodeStateApi(config));
    singletonManager.registerConstructor('GraphApi', () => new GraphApi(config));
    singletonManager.registerConstructor('HistoryApi', () => new HistoryApi(config));
    singletonManager.registerConstructor('ListApi', () => new ListApi(config));
    singletonManager.registerConstructor('OtherApi', () => new OtherApi(config));
    singletonManager.registerConstructor('SnippetApi', () => new SnippetApi(config));
    singletonManager.registerConstructor('SortApi', () => new SortApi(config));
    singletonManager.registerConstructor('UserApi', () => new UserApi(config));

    const contentRoot = document.getElementById('content-root');

    // Für den Check ob der Nutzer eingeloggt ist würde die Middleware eine Endlosschleife erzeugen.
    const loginCheckApi = new UserApi(new Configuration({
      headers: { 'content-type': 'application/json' },
      basePath: '/api',
      }));

    return await loginCheckApi.userApitokenGet()
      .then(() => new MainView(contentRoot, singletonManager))
      .catch((err) => {
        if (err instanceof ResponseError && err.response && err.response.status === 401) {
          return new LoginView(contentRoot, singletonManager);
        }
        throw err;
      })
      .then((view) => {
        if (view === undefined) {
          document.body.innerHTML = '<h1>Internal Error</h1>';
        }
      });
  } catch (error) {
    userEventReporter.fatal(`Interner Fehler: ${error.message ? error.message : error}\n`
      + 'Dieser Fehler kann nicht automatisch behoben werden. Bitte lade die Seite neu.');
    throw error;
  }
}
