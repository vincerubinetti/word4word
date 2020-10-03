import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { AnimateSharedLayout } from 'framer-motion';

import { DataContext } from '../data';
import { oneLetterDifferent } from '../util/word';
import Button from '../components/button';
import Input from '../components/input';

import './game.css';

let delay;
const startDelay = 10;
const maxDelay = 150;
const delayMultiplier = 1.2;

const sectionAnimation = {
  transition: { ease: 'easeInOut', duration: 0.1 }
};

const rowAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
  transition: { ease: 'easeInOut', duration: 0.1 }
};

const topWordAnimation = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
  transition: { ease: 'easeInOut', duration: 0.1 }
};

export default ({ goToScreen, par }) => {
  const [spinning, setSpinning] = useState(true);
  const { pars } = useContext(DataContext);
  const [{ wordA, wordB }, setPair] = useState({});

  const randomPair = useCallback(() => {
    let [wordA, wordB] = rand(pars[par]);
    if (Math.random() < 0.5)
      [wordA, wordB] = [wordB, wordA];
    return { wordA, wordB };
  }, [par, pars]);

  const newGame = useCallback(() => {
    delay = startDelay;
    setPair(randomPair());
    setSpinning(true);
  }, [randomPair]);

  useEffect(() => {
    newGame();
  }, [newGame]);

  useEffect(() => {
    let timer;
    if (delay < maxDelay) {
      delay *= delayMultiplier;
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
    <AnimateSharedLayout>
      <Header {...{ goToScreen, newGame, wordA, wordB, par }} />
      <Main {...{ wordA, wordB, spinning }} />
      <Footer {...{ par }} />
    </AnimateSharedLayout>
  );
};

const rand = (array) => array[Math.floor(Math.random() * array.length)];

const Header = ({ goToScreen, newGame, wordA, wordB }) => (
  <motion.header layout {...sectionAnimation}>
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
  </motion.header>
);

const TopWord = ({ word, align }) => (
  <div className={'game_top game_top_' + align}>
    <AnimatePresence>
      <motion.div
        key={word?.text}
        className='game_top_word'
        {...topWordAnimation}
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
  const { regularDictionary, specialDictionary } = useContext(DataContext);

  useEffect(() => {
    if (!wordA || !wordB)
      return;
    setWord('');
    setAChain([wordA]);
    setBChain([wordB]);
  }, [wordA, wordB]);

  useEffect(() => {
    if (
      aChain.length &&
      bChain.length &&
      oneLetterDifferent(aChain[aChain.length - 1], bChain[bChain.length - 1])
    )
      console.log('game over');
  }, [aChain, bChain]);

  console.log(
    (aChain[aChain.length - 1]?.links || []).find(
      (link) => link.type === 'special'
    )?.text
  );

  const submitWord = (event) => {
    event.preventDefault();

    const foundWord =
      regularDictionary.find((entry) => entry.text === word) ||
      specialDictionary.find((entry) => entry.text === word) ||
      null;

    if (!foundWord)
      console.log('invalid word');
    else if (oneLetterDifferent(foundWord, aChain[aChain.length - 1])) {
      setAChain([...aChain, foundWord]);
      console.log('valid word');
    } else if (oneLetterDifferent(foundWord, bChain[bChain.length - 1]))
      setBChain([...bChain, foundWord]);
    else
      console.log('word doesnt connect');

    setWord('');
  };

  const undo = (chain) => {
    if (chain === 'a')
      setAChain(aChain.slice(0, -1));
    if (chain === 'b')
      setBChain(bChain.slice(0, -1));
  };

  return (
    <motion.main
      layout
      {...sectionAnimation}
      className='game_main'
      data-show={!spinning}
    >
      {aChain.map((word, index) => (
        <WordRow
          key={word.text + index}
          last={index > 0 && index === aChain.length - 1}
          chain='a'
          undo={undo}
          word={word}
        />
      ))}
      <motion.div
        layout
        {...rowAnimation}
        className='game_row_center game_input'
      >
        <form onSubmit={submitWord}>
          <Input
            value={word}
            onChange={setWord}
            maxLength='4'
            disabled={spinning}
          />
        </form>
      </motion.div>
      {bChain
        .map((word, index) => (
          <WordRow
            key={word.text + index}
            last={index > 0 && index === bChain.length - 1}
            chain='b'
            undo={undo}
            word={word}
          />
        ))
        .reverse()}
    </motion.main>
  );
};

const WordRow = ({ last, chain, undo, word }) => (
  <motion.div layout {...rowAnimation} className='flex_row'>
    <span className='game_row_side flex_row'>
      {word.type === 'special' && <i className='fas fa-star fa-xs'></i>}
    </span>
    <span className='game_row_center flex_row'>
      {(word?.text || '').split('').map((char, index) => (
        <span key={index} className='game_row_char flex_row'>
          {char}
        </span>
      ))}
    </span>
    <span className='game_row_side flex_row'>
      {last && <Button icon='fas fa-undo fa-xs' onClick={() => undo(chain)} />}
    </span>
  </motion.div>
);

const Footer = ({ par }) => (
  <motion.footer layout {...sectionAnimation}>
    Par: {par}
  </motion.footer>
);
