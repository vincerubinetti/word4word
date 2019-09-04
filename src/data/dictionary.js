import axios from 'axios';

import { Word } from './word.js';

import standardDictionary from './standard-dictionary.txt';
import specialDictionary from './special-dictionary.txt';

export class Dictionary {
  constructor() {
    fetchDictionaries().then((dictionaries) => this.init(dictionaries));
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
