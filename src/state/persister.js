import { copyObject } from '../util/object.js';

const key = 'root';

// for testing, clear storage on every page reload
window.localStorage.clear();

export const persister = (store) => (next) => (action) => {
  const results = next(action);
  window.localStorage.clear();
  window.localStorage.setItem(
    key,
    JSON.stringify(copyObject(store.getState()))
  );
  return results;
};

export function getInitialState() {
  let results = {};
  const stored = window.localStorage.getItem(key);
  if (stored) {
    try {
      results = JSON.parse(stored);
    } catch (error) {
      console.log(error);
    }
  }
  console.groupCollapsed('load_state_from_storage');
  console.log(results);
  console.groupEnd();
  return results;
}
