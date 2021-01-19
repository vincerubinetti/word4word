import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

import { loadData } from './data';
import Background from './screens/background';
import Loading from './screens/loading';
import Home from './screens/home';
import NewGame from './screens/new-game';
import Game from './screens/game';
import GameComplete from './screens/game-complete';
import Dictionary from './screens/dictionary';
import Definition from './screens/definition';
import { useStorage } from './util/hooks';

import './app.css';

const screens = {
  loading: Loading,
  home: Home,
  newGame: NewGame,
  game: Game,
  gameComplete: GameComplete,
  dictionary: Dictionary,
  definition: Definition
};

const screenAnimation = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
  transition: { ease: 'easeInOut', duration: 0.3 }
};

export default () => {
  const [regularDictionary, setRegularDictionary] = useState([]);
  const [specialDictionary, setSpecialDictionary] = useState([]);
  const [pars, setPars] = useState([]);
  const loaded =
    regularDictionary.length && specialDictionary.length && pars.length;

  const [screen, setScreen] = useState('loading');
  const [par, setPar] = useStorage(3, 'par');
  const [word, setWord] = useState('');

  useEffect(() => {
    loadData().then(({ regularDictionary, specialDictionary, pars }) => {
      setRegularDictionary(regularDictionary);
      setSpecialDictionary(specialDictionary);
      setPars(pars);
    });
  }, []);

  useEffect(() => {
    if (loaded)
      setScreen('home');
  }, [loaded]);

  const Screen = screens[screen];
  const props = {
    regularDictionary,
    specialDictionary,
    pars,
    par,
    setPar,
    word,
    setWord
  };

  return (
    <>
      <Background {...props} />
      <AnimatePresence>
        <motion.div
          key={screen}
          className='screen flex_column'
          {...screenAnimation}
        >
          <Screen {...props} setScreen={setScreen} />
        </motion.div>
      </AnimatePresence>
    </>
  );
};
