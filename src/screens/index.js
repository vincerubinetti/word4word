import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

import * as Home from './home';
import * as Dictionary from './dictionary';

import './index.css';

const screens = {
  home: Home,
  dictionary: Dictionary
};

export default () => {
  const [screen, setScreen] = useState('home');

  const { Header, Main, Footer } = screens[screen];

  return (
    <AnimatePresence>
      <motion.div
        key={screen}
        className='screen'
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ ease: 'easeInOut' }}
      >
        <header>{Header && <Header {...{ setScreen }} />}</header>
        <main>{Main && <Main {...{ setScreen }} />}</main>
        <footer>{Footer && <Footer {...{ setScreen }} />}</footer>
      </motion.div>
    </AnimatePresence>
  );
};
