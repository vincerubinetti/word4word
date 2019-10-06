import standardDictionary from './standard-dictionary.txt';
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

export function setData({ standardDictionary, specialDictionary, pars }) {
  return {
    type: 'set_data',
    payload: {
      standardDictionary: standardDictionary,
      specialDictionary: specialDictionary,
      pars: pars
    }
  };
}

export function loadData() {
  return async function(dispatch) {
    dispatch(setData(await fetchData()));
  };
}

async function fetchData() {
  return {
    standardDictionary: await fetchStandardDictionary(),
    specialDictionary: await fetchSpecialDictionary(),
    pars: await fetchPars()
  };
}

async function fetchStandardDictionary() {
  return await (await fetch(standardDictionary)).text();
}

async function fetchSpecialDictionary() {
  return await (await fetch(specialDictionary)).text();
}

async function fetchPars() {
  const responses = await Promise.all([
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
  const pars = await Promise.all([
    ...responses.map((response) =>
      response ? response.arrayBuffer() : Promise.resolve(null)
    )
  ]);

  return pars;
}
