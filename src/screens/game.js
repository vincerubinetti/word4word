import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

import { DataContext } from '../data';
import Button from '../components/button';
import Input from '../components/input';

import './game.css';

let delay = 10;
const maxDelay = 200;

export default ({ goToScreen, par }) => {
  const [spinning, setSpinning] = useState(true);
  const { pars } = useContext(DataContext);
  const [{ wordA = null, wordB = null }, setPair] = useState({});

  const randomPair = useCallback(() => {
    let [wordA, wordB] = rand(pars[par]);
    if (Math.random() < 0.5)
      [wordA, wordB] = [wordB, wordA];
    return { wordA, wordB };
  }, [par, pars]);

  const newGame = useCallback(() => {
    delay = 10;
    setPair(randomPair());
    setSpinning(true);
  }, [randomPair]);

  useEffect(() => {
    newGame();
  }, [newGame]);

  useEffect(() => {
    let timer;
    if (delay < maxDelay) {
      delay *= 1.1;
      const newPair = () => {
        let pair = randomPair();
        while (
          pair.wordA?.text === wordA?.text ||
          pair.wordB?.text === wordB?.text
        )
          pair = randomPair();
        setPair(pair);
      };
      timer = window.setTimeout(newPair, delay);
    } else
      setSpinning(false);
    return () => window.clearTimeout(timer);
  }, [randomPair, wordA, wordB]);

  return (
    <>
      <Header {...{ goToScreen, newGame, wordA, wordB, par }} />
      <Main {...{ wordA, wordB, spinning }} />
      <Footer {...{ par }} />
    </>
  );
};

const rand = (array) => array[Math.floor(Math.random() * array.length)];

const Header = ({ goToScreen, newGame, wordA, wordB }) => (
  <header>
    <div className='flex_row'>
      <Button
        icon='fas fa-arrow-left'
        onClick={() => goToScreen({ name: 'home' })}
      />
      <h2 className='flex_row'>
        <TopWord word={wordA} align='left' />{' '}
        <i className='fas fa-arrows-alt-h'></i>{' '}
        <TopWord word={wordB} align='right' />
      </h2>
      <Button icon='fas fa-sync-alt' onClick={newGame} />
    </div>
  </header>
);

const TopWord = ({ word, align }) => (
  <div className={'top_word_container top_word_' + align}>
    <AnimatePresence>
      <motion.div
        key={word?.text}
        className='top_word'
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.1 }}
      >
        {word?.text || ''}
      </motion.div>
    </AnimatePresence>
  </div>
);

const Main = ({ wordA, wordB, spinning }) => {
  const [word, setWord] = useState('');
  const [aChain, setAChain] = useState([]);
  const [bChain, setBChain] = useState([]);

  useEffect(() => {
    setWord('');
    setAChain([wordA]);
    setBChain([wordB]);
  }, [wordA, wordB]);

  return (
    <main>
      {aChain.map((word, index) => (
        <WordRow key={index} word={word} />
      ))}
      <Input
        className='game_word_row'
        value={word}
        onChange={setWord}
        maxLength='4'
        disabled={spinning}
      />
      {bChain.map((word, index) => (
        <WordRow key={index} word={word} />
      ))}
    </main>
  );
};

const WordRow = ({ word }) => (
  <div className='game_word_row'>{word?.text || word || ''}</div>
);

const Footer = ({ par }) => <>Par: {par}</>;
