import React from 'react';

import Button from '../components/button';
import Wiggle from '../components/wiggle';
import { findPath } from '../util/word';

import './game-complete.css';

export default ({ dictionary, setScreen, chain = [] }) => {
  chain = chain.map((text) => dictionary.find((word) => word.text === text));
  const parChain = findPath(chain[0], chain[chain.length - 1]);

  const strokes = chain.length;
  const par = parChain.length;
  const diff = strokes - par;

  let score;
  let formula;
  if (diff >= 0) {
    score = 1000 * (par - diff);
    formula = (1000).toLocaleString() + ' × (2 × par - strokes)';
  } else {
    score = 1000 * par * (1 - diff);
    formula = (1000).toLocaleString() + ' × par × (1 + par - strokes)';
  }
  if (score < 0) {
    formula = '';
    score = 0;
  }

  return (
    <>
      <header>
        <div className='flex_row'>
          <Button
            icon='fas fa-arrow-left'
            onClick={() => setScreen('home')}
            tooltip='Back to home'
          />
          <h2 className='wiggle_hitbox' data-wiggle>
            <Wiggle text='Game Complete' />
          </h2>
        </div>
      </header>
      <main className='game_complete_main'>
        <div className='game_complete_column'>
          <div className='game_complete_header'>Strokes</div>
          {chain.map((word, index) => (
            <WordRow key={index} word={word} />
          ))}
        </div>
        <div className='game_complete_column'>
          <div className='game_complete_header'>Par</div>
          {parChain.map((word, index) => (
            <WordRow key={index} word={word} />
          ))}
        </div>
      </main>
      <footer>
        <table className='game_complete_table'>
          <tbody>
            <tr>
              <td>Strokes</td>
              <td>{chain.length}</td>
            </tr>
            <tr>
              <td>Par</td>
              <td>{parChain.length}</td>
            </tr>
            <tr>
              <td colSpan='2'>{formula}</td>
            </tr>
            <tr>
              <td>Score</td>
              <td>{score.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </footer>
    </>
  );
};

const WordRow = ({ word }) => (
  <div className='flex_row'>
    <span className='game_complete_row_side flex_row'>
      {word?.type === 'special' && (
        <i
          className='fas fa-star fa-xs'
          title='Special word'
          aria-label='Special word'
        ></i>
      )}
    </span>
    <span className='game_complete_row_center flex_row'>
      {(word?.text || '').split('').map((char, index) => (
        <span key={index} className='game_complete_char flex_row'>
          {char}
        </span>
      ))}
    </span>
    <span className='game_complete_row_side flex_row'></span>
  </div>
);
