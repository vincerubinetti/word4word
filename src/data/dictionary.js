import axios from 'axios';
import { store } from '../index.js';

import { Word } from './word.js';
import { setLoadProgress } from '../state/actions.js';

import standardDictionary from './standard-dictionary.txt';
import specialDictionary from './special-dictionary.txt';
import pairs3 from './pairs3.dat';
import pairs4 from './pairs4.dat';
import pairs5 from './pairs5.dat';
import pairs6 from './pairs6.dat';
import pairs7 from './pairs7.dat';
import pairs8 from './pairs8.dat';
import pairs9 from './pairs9.dat';
import pairs10 from './pairs10.dat';
import pairs11 from './pairs11.dat';
import pairs12 from './pairs12.dat';
import pairs13 from './pairs13.dat';
import pairs14 from './pairs14.dat';
import pairs15 from './pairs15.dat';
import pairs16 from './pairs16.dat';
import pairs17 from './pairs17.dat';
import pairs18 from './pairs18.dat';
import pairs19 from './pairs19.dat';
import pairs20 from './pairs20.dat';
import pairs21 from './pairs21.dat';

export class Dictionary {
  constructor() {
    fetchDictionaries().then((dictionaries) => this.init(dictionaries));
    fetchPairs();
  }

  init(dictionaries) {
    this.standard = dictionaries.standard
      .split('\n')
      .map((word) => word.trim())
      .filter((word) => word)
      .map((word, index) => new Word(word, index));
    this.special = dictionaries.special
      .split('\n')
      .map((word) => word.trim())
      .filter((word) => word)
      .map((word, index) => new Word(word, index));
    this.linkStandard();
  }

  linkStandard() {
    for (let a = 0; a < this.standard.length; a++) {
      for (let b = 0; b < this.standard.length; b++) {
        if (a > b) {
          if (this.standard[a].oneDifferent(this.standard[b])) {
            this.standard[a].link(this.standard[b]);
            this.standard[b].link(this.standard[a]);
          }
        }
      }
    }
  }
}

async function fetchDictionaries() {
  const standard = (await axios.get(standardDictionary)).data;
  const special = (await axios.get(specialDictionary)).data;
  return { standard: standard, special: special };
}

async function fetchPairs() {
  const options = {
    responseType: 'arraybuffer',
    onDownloadProgress: (event) =>
      store.dispatch(
        setLoadProgress({
          id: event.currentTarget.responseURL,
          loaded: event.loaded,
          total: event.total
        })
      )
  };
  const pairs = await Promise.all([
    axios.get(pairs3, options).data,
    axios.get(pairs4, options).data,
    axios.get(pairs5, options).data,
    axios.get(pairs6, options).data,
    axios.get(pairs7, options).data,
    axios.get(pairs8, options).data,
    axios.get(pairs9, options).data,
    axios.get(pairs10, options).data,
    axios.get(pairs11, options).data,
    axios.get(pairs12, options).data,
    axios.get(pairs13, options).data,
    axios.get(pairs14, options).data,
    axios.get(pairs15, options).data,
    axios.get(pairs16, options).data,
    axios.get(pairs17, options).data,
    axios.get(pairs18, options).data,
    axios.get(pairs19, options).data,
    axios.get(pairs20, options).data,
    axios.get(pairs21, options).data
  ]);
}
