import React from 'react';
import { cloneElement } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

import Home from './home';

import './index.css';

export default () => {
  const [Screen, setScreen] = useState(<Home />);

  return (
    <AnimatePresence>
      <motion.div
        key={'1'}
        className='screen'
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ ease: 'easeInOut' }}
      >
        {cloneElement(Screen, { setScreen })}
      </motion.div>
    </AnimatePresence>
  );
};
