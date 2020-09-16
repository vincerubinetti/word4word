import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

import Home from './home';
import Dictionary from './dictionary';
import Definition from './definition';

import './index.css';

const screens = {
  home: Home,
  dictionary: Dictionary,
  definition: Definition
};

export default () => {
  const [screen, setScreen] = useState({ name: 'home' });
  const { name, ...rest } = screen;

  const Screen = screens[name];

  return (
    <AnimatePresence>
      <motion.div
        key={name}
        className='screen'
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ ease: 'easeInOut' }}
      >
        <Screen {...rest} {...{ setScreen }} />
      </motion.div>
    </AnimatePresence>
  );
};
