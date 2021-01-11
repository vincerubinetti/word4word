import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { createContext } from 'react';

import { Word } from '../util/word';
import { oneLetterDifferent } from '../util/word';
import { linkWords } from '../util/word';
import { useStorage } from '../util/hooks';

import { ReactComponent as Loading } from '../loading.svg';

import regularDictionary from './regular-dictionary.txt';
import specialDictionary from './special-dictionary.txt';
import par3 from './par3.dat';
import par4 from './par4.dat';
import par5 from './par5.dat';
import par6 from './par6.dat';
import par7 from './par7.dat';
import par8 from './par8.dat';
import par9 from './par9.dat';
import par10 from './par10.dat';
import par11 from './par11.dat';
import par12 from './par12.dat';
import par13 from './par13.dat';
import par14 from './par14.dat';
import par15 from './par15.dat';
import par16 from './par16.dat';
import par17 from './par17.dat';
import par18 from './par18.dat';
import par19 from './par19.dat';
import par20 from './par20.dat';
import par21 from './par21.dat';

import './index.css';

export const DataContext = createContext({});

export default ({ children }) => {
  const [regularDictionary, setRegularDictionary] = useState([]);
  const [specialDictionary, setSpecialDictionary] = useState([]);
  const [pars, setPars] = useState([]);
  const [par, setPar] = useStorage(3, 'par');
  const [chain, setChain] = useStorage({ a: [], b: [] }, 'chain');

  useEffect(() => {
    const loadData = async () => {
      let regularDictionary = await getRegularDictionary();
      regularDictionary = parseDictionary(regularDictionary, 'regular');
      let specialDictionary = await getSpecialDictionary();
      specialDictionary = parseDictionary(specialDictionary, 'special');
      linkDictionary([...regularDictionary, ...specialDictionary]);
      let pars = await getPars();
      pars = parsePars(pars, regularDictionary);
      setRegularDictionary(regularDictionary);
      setSpecialDictionary(specialDictionary);
      setPars(pars);
    };
    loadData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        regularDictionary,
        specialDictionary,
        pars,
        par,
        setPar,
        chain,
        setChain
      }}
    >
      {children}
      {(!regularDictionary.length ||
        !specialDictionary.length ||
        !pars.length) && (
        <div className='loading flex_row wiggle_hitbox'>
          <Loading width='40px' />
        </div>
      )}
    </DataContext.Provider>
  );
};

const getRegularDictionary = async () =>
  (await fetch(regularDictionary)).text();

const getSpecialDictionary = async () =>
  (await fetch(specialDictionary)).text();

const getPars = async () => {
  let pars = await Promise.all([
    Promise.resolve(null),
    Promise.resolve(null),
    Promise.resolve(null),
    fetch(par3),
    fetch(par4),
    fetch(par5),
    fetch(par6),
    fetch(par7),
    fetch(par8),
    fetch(par9),
    fetch(par10),
    fetch(par11),
    fetch(par12),
    fetch(par13),
    fetch(par14),
    fetch(par15),
    fetch(par16),
    fetch(par17),
    fetch(par18),
    fetch(par19),
    fetch(par20),
    fetch(par21)
  ]);
  pars = await Promise.all([
    ...pars.map((par) => (par ? par.arrayBuffer() : Promise.resolve(null)))
  ]);
  return pars;
};

const parseDictionary = (dictionary, type) =>
  dictionary
    .split('\n')
    .map((word) => word.trim())
    .filter((word) => word)
    .map((word, index) => new Word(word, index, type));

const linkDictionary = (dictionary) => {
  for (const wordA of dictionary) {
    for (const wordB of dictionary) {
      if (oneLetterDifferent(wordA, wordB))
        linkWords(wordA, wordB);
    }
  }
  return dictionary;
};

const parsePars = (pars, dictionary) => {
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
};
