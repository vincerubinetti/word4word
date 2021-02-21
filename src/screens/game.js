import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { AnimateSharedLayout } from 'framer-motion';
import { useAnimation } from 'framer-motion';

import { oneLetterDifferent } from '../util/word';
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

export default ({ dictionary, pars, setScreen, par, chain, setChain }) => {
  const [input, setInput] = useState('');
  const [strokes, setStrokes] = useState(2);
  const [spinning, setSpinning] = useState(true);
  const [complete, setComplete] = useState(false);

  const slot = chain.findIndex((text) => text === null);

  const randomPair = useCallback(() => {
    let [startWord, endWord] = random(pars[par]);
    if (Math.random() < 0.5)
      [startWord, endWord] = [endWord, startWord];
    return [startWord.text, endWord.text];
  }, [par, pars]);

  const newPair = useCallback(() => {
    let [startWord, endWord] = randomPair();
    while (startWord === chain[0] || endWord === chain[chain.length - 1])
      [startWord, endWord] = randomPair();
    setChain([startWord, null, endWord]);
    setInput('');
  }, [chain, setChain, randomPair]);

  const newGame = useCallback(() => {
    delay = startDelay;
    const [startWord, endWord] = randomPair();
    setChain([startWord, null, endWord]);
    setInput('');
    setSpinning(true);
    setComplete(false);
  }, [setChain, randomPair]);

  const swapWords = useCallback(() => {
    chain.reverse();
    setChain([...chain]);
  }, [chain, setChain]);

  const submitWord = useCallback(
    (event) => {
      event.preventDefault();

      setInput('');

      if (!dictionary.find((word) => word.text === input))
        return false;

      const before = chain[slot - 1];
      const after = chain[slot + 1];

      const connectsBefore = oneLetterDifferent(input, before);
      const connectsAfter = oneLetterDifferent(input, after);

      if (connectsBefore && connectsAfter) {
        chain.splice(slot, 1, input);
        setChain([...chain]);
        return true;
      }
      if (connectsBefore) {
        chain.splice(slot, 0, input);
        setChain([...chain]);
        return true;
      }
      if (connectsAfter) {
        chain.splice(slot + 1, 0, input);
        setChain([...chain]);
        return true;
      }

      return false;
    },
    [dictionary, chain, setChain, slot, input]
  );

  const undo = useCallback(
    (offset) => {
      chain.splice(slot + offset, 1);
      setChain([...chain]);
    },
    [chain, setChain, slot]
  );

  const randomLink = useCallback(() => {
    const adjacent = chain[slot + (Math.random() < 0.5 ? 1 : -1)];
    const found = dictionary.find((word) => word.text === adjacent);
    const links = found.links.filter((link) => link.type === 'regular');
    return random(links).text;
  }, [dictionary, chain, slot]);

  const getHint = useCallback(() => {
    let newInput = randomLink();
    while (newInput === input)
      newInput = randomLink();
    setInput(newInput);
  }, [randomLink, input]);

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
    let timer;
    if (chain?.length && slot === -1) {
      setComplete(true);
      timer = window.setTimeout(() => setScreen('gameComplete'), 3000);
    }
    () => window.clearTimeout(timer);
  }, [complete, setScreen, chain, slot]);

  useEffect(() => {
    setStrokes(chain.filter((text) => text).length);
  }, [chain]);

  useEffect(() => {
    document.querySelector('input')?.focus();
  }, [input]);

  useEffect(() => {
    newGame();
  }, [newGame]);

  return (
    <AnimateSharedLayout>
      <Header {...{ setScreen, chain, newGame, swapWords, complete }} />
      <Main
        {...{
          dictionary,
          chain,
          slot,
          spinning,
          complete,
          input,
          setInput,
          submitWord,
          getHint,
          undo
        }}
      />
      <Footer {...{ par, strokes }} />
    </AnimateSharedLayout>
  );
};

const random = (array) => array[Math.floor(Math.random() * array.length)];

const Header = ({ setScreen, chain, newGame, swapWords, complete }) => (
  <motion.header layout {...sectionAnimation}>
    <div className='flex_row'>
      <Button
        icon='fas fa-arrow-left'
        onClick={() => setScreen('home')}
        tooltip='Back to home'
      />
      <h2 className='flex_row'>
        <TopWord text={chain[0]} align='left' />
        <Button
          icon='fas fa-arrows-alt-h'
          onClick={swapWords}
          disabled={complete}
          tooltip='Swap start and end words'
        />
        <TopWord text={chain[chain.length - 1]} align='right' />
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

const TopWord = ({ text, align }) => (
  <div className={'game_top game_top_' + align}>
    <AnimatePresence>
      <motion.div key={text} className='game_top_word' {...topWordAnimation}>
        {text}
      </motion.div>
    </AnimatePresence>
  </div>
);

const Main = ({
  dictionary,
  chain,
  slot,
  spinning,
  complete,
  input,
  setInput,
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
    {chain.map((text, index) => {
      if (text === null) {
        return (
          <WordInput
            key={index}
            {...{ text, input, setInput, spinning, submitWord, getHint }}
          />
        );
      } else {
        const offset = index - slot;
        const undoable =
          Math.abs(offset) === 1 && index > 0 && index < chain.length - 1;
        const type = dictionary.find((word) => word.text === text)?.type;
        return (
          <WordRow
            key={text + index}
            index={index}
            text={text}
            type={type}
            undo={undoable ? () => undo(offset) : undefined}
          />
        );
      }
    })}
  </motion.main>
);

const WordInput = ({ input, setInput, spinning, submitWord, getHint }) => {
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
          value={input}
          onChange={setInput}
          maxLength='4'
          disabled={spinning}
        />
      </motion.form>
      <span className='game_row_side flex_row'>
        <Button
          icon='fas fa-lightbulb fa-xs'
          onClick={getHint}
          tooltip='Get a hint word that connects to the start or end chain'
        />
      </span>
    </motion.div>
  );
};

const WordRow = ({ index, undo, text, type }) => (
  <motion.div layout {...rowAnimation} className='flex_row'>
    <span className='game_row_side flex_row'>
      {type === 'special' && (
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
      {text.split('').map((char, index) => (
        <span key={index} className='game_row_char flex_row'>
          {char}
        </span>
      ))}
    </motion.span>
    <span className='game_row_side flex_row'>
      {undo && (
        <Button
          icon='fas fa-undo fa-xs'
          onClick={undo}
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
