import { useState } from 'react';
import { useEffect } from 'react';

const prefix = 'word4word';

const get = (key) => JSON.parse(localStorage.getItem(prefix + key));
const set = (state, key) =>
  localStorage.setItem(prefix + key, JSON.stringify(state));

export const useStorage = (defaultValue, key = '') => {
  const [state, setState] = useState(get(key) || defaultValue);

  useEffect(() => {
    set(state, key);
  }, [key, state]);

  return [state, setState];
};
