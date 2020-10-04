import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { AnimateSharedLayout } from 'framer-motion';
import { useAnimation } from 'framer-motion';

import { DataContext } from '../data';
import { oneLetterDifferent } from '../util/word';
import { findPath } from '../util/word';
import Button from '../components/button';
import Input from '../components/input';

import './game.css';

let delay;
const startDelay = 10;
const maxDelay = 140;
const delayMultiplier = 1.1;

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
  const [word, setWord] = useState('');
  const [chain, setChain] = useState({ a: [], b: [] });
  const { regularDictionary, specialDictionary, pars } = useContext(
    DataContext
  );
  const [strokes, setStrokes] = useState(2);
  const [spinning, setSpinning] = useState(true);
  const [complete, setComplete] = useState(false);

  const randomPair = useCallback(() => {
    let [wordA, wordB] = rand(pars[par]);
    if (Math.random() < 0.5)
      [wordA, wordB] = [wordB, wordA];
    return { wordA, wordB };
  }, [par, pars]);

  const newPair = useCallback(() => {
    let { wordA, wordB } = randomPair();
    while (
      wordA?.text === chain.a[0]?.text ||
      wordB?.text === chain.b[0]?.text
    ) {
      const pair = randomPair();
      wordA = pair.wordA;
      wordB = pair.wordB;
    }
    setChain({ a: [wordA], b: [wordB] });
    setWord('');
  }, [chain.a, chain.b, randomPair]);

  const newGame = useCallback(() => {
    delay = startDelay;
    const { wordA, wordB } = randomPair();
    setChain({ a: [wordA], b: [wordB] });
    setSpinning(true);
    setWord('');
    setComplete(false);
  }, [randomPair]);

  const swapWords = useCallback(() => {
    setChain({ a: chain.b, b: chain.a });
  }, [chain.a, chain.b]);

  const submitWord = useCallback(
    (event) => {
      event.preventDefault();

      const foundWord =
        regularDictionary.find((entry) => entry.text === word) ||
        specialDictionary.find((entry) => entry.text === word) ||
        null;

      const { a, b } = chain;
      let success = true;
      if (!foundWord)
        success = false;
      else if (oneLetterDifferent(foundWord, a[a.length - 1]))
        setChain({ a: [...a, foundWord], b });
      else if (oneLetterDifferent(foundWord, b[b.length - 1]))
        setChain({ a, b: [...b, foundWord] });
      else
        success = false;

      setWord('');
      return success;
    },
    [chain, regularDictionary, specialDictionary, word]
  );

  const undo = useCallback(
    (aOrB) => {
      const { a, b } = chain;
      if (aOrB === 'a')
        setChain({ a: a.slice(0, -1), b });
      if (aOrB === 'b')
        setChain({ a, b: b.slice(0, -1) });
    },
    [chain]
  );

  const randomLink = useCallback(() => {
    const randChain = Math.random() < 0.5 ? chain.a : chain.b;
    let links = randChain[randChain.length - 1].links;
    links = links.filter((link) => link.type === 'regular');
    return rand(links);
  }, [chain.a, chain.b]);

  const getHint = useCallback(
    (event) => {
      document.querySelector('input').focus();
      if (event.ctrlKey && event.shiftKey) {
        const { a, b } = chain;
        const wordA = a[a.length - 1];
        const wordB = b[b.length - 1];
        const newWord = findPath(wordA, wordB, event.altKey ? false : true)[1];
        setWord(newWord.text);
      } else {
        let newWord = randomLink();
        while (newWord.text === word)
          newWord = randomLink();
        setWord(newWord.text);
      }
    },
    [chain, randomLink, word]
  );

  useEffect(() => {
    newGame();
  }, [newGame]);

  useEffect(() => {
    let timer;
    if (spinning && delay < maxDelay) {
      delay *= delayMultiplier;
      timer = window.setTimeout(newPair, delay);
    } else
      setSpinning(false);
    return () => window.clearTimeout(timer);
  }, [spinning, newPair, randomPair]);

  useEffect(() => {
    const { a, b } = chain;
    let timer;
    if (
      a.length &&
      b.length &&
      oneLetterDifferent(a[a.length - 1], b[b.length - 1])
    ) {
      setComplete(true);
      timer = window.setTimeout(
        () =>
          goToScreen({
            name: 'gameComplete',
            chain: [...chain.a, ...chain.b.reverse()]
          }),
        3000
      );
    }
    () => window.clearTimeout(timer);
  }, [goToScreen, chain]);

  useEffect(() => {
    setStrokes(chain.a.length + chain.b.length);
  }, [chain.a.length, chain.b.length, setStrokes]);

  return (
    <AnimateSharedLayout>
      <Header {...{ goToScreen, chain, newGame, swapWords, complete }} />
      <Main
        {...{
          chain,
          spinning,
          complete,
          word,
          setWord,
          submitWord,
          getHint,
          undo
        }}
      />
      <Footer {...{ par, strokes }} />
    </AnimateSharedLayout>
  );
};

const rand = (array) => array[Math.floor(Math.random() * array.length)];

const Header = ({ goToScreen, chain, newGame, swapWords, complete }) => (
  <motion.header layout {...sectionAnimation}>
    <div className='flex_row'>
      <Button
        icon='fas fa-arrow-left'
        onClick={() => goToScreen({ name: 'home' })}
        tooltip='Back to home'
      />
      <h2 className='flex_row'>
        <TopWord word={chain.a[0]} align='left' />
        <Button
          icon='fas fa-arrows-alt-h'
          onClick={swapWords}
          disabled={complete}
          tooltip='Swap start and end words'
        />
        <TopWord word={chain.b[0]} align='right' />
      </h2>
      <Button
        icon='fas fa-sync-alt'
        onClick={newGame}
        disabled={complete}
        tooltip='Start new game of same par'
      />
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

const Main = ({
  chain,
  spinning,
  complete,
  word,
  setWord,
  submitWord,
  getHint,
  undo
}) => (
  <motion.main
    layout
    {...sectionAnimation}
    className='game_main'
    data-show={!spinning}
    data-complete={complete}
  >
    {chain.a.map((word, index) => (
      <WordRow
        key={word.text + index}
        index={index}
        last={index > 0 && index === chain.a.length - 1}
        chain='a'
        {...{ complete, undo, word }}
      />
    ))}
    {!complete && (
      <WordInput {...{ word, setWord, spinning, submitWord, getHint }} />
    )}
    {chain.b
      .map((word, index) => (
        <WordRow
          key={word.text + index}
          index={chain.a.length + chain.b.length - index - 1}
          last={index > 0 && index === chain.b.length - 1}
          chain='b'
          {...{ complete, undo, word }}
        />
      ))
      .reverse()}
  </motion.main>
);

const WordInput = ({ word, setWord, spinning, submitWord, getHint }) => {
  const animate = useAnimation();

  const wiggle = async () => {
    await animate.start({
      x: -5,
      transition: { ease: 'easeInOut', duration: 0.1 }
    });
    await animate.start({
      x: 5,
      transition: { ease: 'easeInOut', duration: 0.1 }
    });
    await animate.start({
      x: 0,
      transition: { ease: 'easeInOut', duration: 0.1 }
    });
  };

  return (
    <motion.div layout {...rowAnimation} className='flex_row'>
      <span className='game_row_side flex_row'></span>
      <motion.form
        className='game_row_center game_input'
        onSubmit={(event) => {
          if (!submitWord(event))
            wiggle();
        }}
        animate={animate}
      >
        <Input
          value={word}
          onChange={setWord}
          maxLength='4'
          disabled={spinning}
        />
      </motion.form>
      <span className='game_row_side flex_row'>
        <Button
          icon='fas fa-lightbulb fa-xs'
          onClick={getHint}
          tooltip='Get hint'
        />
      </span>
    </motion.div>
  );
};

const WordRow = ({ index, last, chain, complete, undo, word }) => (
  <motion.div layout {...rowAnimation} className='flex_row'>
    <span className='game_row_side flex_row'>
      {word.type === 'special' && (
        <i
          className='fas fa-star fa-xs'
          title='Special word'
          aria-label='Special word'
        ></i>
      )}
    </span>
    <motion.span
      className='game_row_center flex_row'
      style={{ animationDelay: index * 0.1 + 's' }}
    >
      {(word?.text || '').split('').map((char, index) => (
        <span key={index} className='game_row_char flex_row'>
          {char}
        </span>
      ))}
    </motion.span>
    <span className='game_row_side flex_row'>
      {last && !complete && (
        <Button
          icon='fas fa-undo fa-xs'
          onClick={() => undo(chain)}
          tooltip='Undo this word'
        />
      )}
    </span>
  </motion.div>
);

const Footer = ({ par, strokes }) => (
  <motion.footer layout {...sectionAnimation}>
    <p>{strokes > 2 && <>Strokes: {strokes}</>}</p>
    <p>Par: {par}</p>
  </motion.footer>
);
