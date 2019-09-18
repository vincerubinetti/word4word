import axios from 'axios';
import { store } from '../index.js';

import { setLoading } from '../loading/actions.js';

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
  return (await axios.get(standardDictionary)).data;
}

async function fetchSpecialDictionary() {
  return (await axios.get(specialDictionary)).data;
}

async function fetchPars() {
  const options = {
    responseType: 'arraybuffer',
    onDownloadProgress: (event) => {
      store.dispatch(
        setLoading({
          id: event.currentTarget.responseURL,
          loaded: event.loaded,
          total: event.total
        })
      );
    }
  };
  const pars = await Promise.all([
    Promise.resolve(null),
    Promise.resolve(null),
    Promise.resolve(null),
    axios.get(par3, options),
    axios.get(par4, options),
    axios.get(par5, options),
    axios.get(par6, options),
    axios.get(par7, options),
    axios.get(par8, options),
    axios.get(par9, options),
    axios.get(par10, options),
    axios.get(par11, options),
    axios.get(par12, options),
    axios.get(par13, options),
    axios.get(par14, options),
    axios.get(par15, options),
    axios.get(par16, options),
    axios.get(par17, options),
    axios.get(par18, options),
    axios.get(par19, options),
    axios.get(par20, options),
    axios.get(par21, options)
  ]);

  return pars.map((response) => (response ? response.data : null));
}
