import { Word } from '../util/word.js';

export function data(state = {}, action) {
  let newState = state;
  switch (action.type) {
    case 'set_data':
      newState.standardDictionary = linkDictionary(
        parseDictionary(action.payload.standardDictionary, 'standard')
      );
      newState.specialDictionary = parseDictionary(
        action.payload.specialDictionary,
        'special'
      );
      newState.pars = parsePars(
        action.payload.pars,
        newState.standardDictionary
      );
      break;

    default:
      break;
  }

  if (typeof newState !== 'object')
    newState = {};

  return newState;
}

function parseDictionary(dictionary, type) {
  return dictionary
    .split('\n')
    .map((word) => word.trim())
    .filter((word) => word)
    .map((word, index) => new Word(word, index, type));
}

function linkDictionary(dictionary) {
  for (let a = 0; a < dictionary.length; a++) {
    for (let b = 0; b < dictionary.length; b++) {
      if (a > b) {
        if (dictionary[a].oneDifferent(dictionary[b])) {
          dictionary[a].link(dictionary[b]);
          dictionary[b].link(dictionary[a]);
        }
      }
    }
  }
  return dictionary;
}

function parsePars(pars, dictionary) {
  const newPars = [];
  for (const par of pars) {
    const pairs = [];
    if (par) {
      const bytes = new Uint16Array(par);
      for (let index = 0; index < bytes.length; index += 2)
        pairs.push([dictionary[bytes[index]], dictionary[bytes[index + 1]]]);
    }
    newPars.push(pairs);
  }
  return newPars;
}
