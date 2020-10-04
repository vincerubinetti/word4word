import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

import Home from './home';
import NewGame from './new-game';
import Game from './game';
import GameComplete from './game-complete';
import Dictionary from './dictionary';
import Definition from './definition';

import './index.css';

const screens = {
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
  const [screen, setScreen] = useState({ name: 'home' });
  const { name, ...rest } = screen;

  const Screen = screens[name];

  return (
    <AnimatePresence>
      <motion.div
        key={name}
        className='screen flex_column'
        {...screenAnimation}
      >
        <Screen {...rest} goToScreen={setScreen} />
      </motion.div>
    </AnimatePresence>
  );
};
