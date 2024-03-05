import {
  jest,
} from '@jest/globals';
import fs from 'fs';
import path from 'path';

export function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function mockReload() {
  // window.location.reload unterbricht die Ausführung also muss es der Mock auch tun
  // window.location.reload ist normalerweise nicht änderbar. defineProperty umgeht dies hier.
  const reload = jest.fn(() => { throw new Error('reload'); });
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { reload },
  });

  return reload;
}

export function mockFetchHtml(filepath) {
  const html = fs.readFileSync(path.resolve(__dirname, filepath), 'utf8');
  global.fetch = jest.fn((url) => (
    path.parse(filepath).base === url
      ? Promise.resolve({ text: () => html }) : Promise.reject()));
}

export async function awaitAllAsync() {
  await new Promise(process.nextTick);
}
