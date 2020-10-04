import React from 'react';

import Button from '../components/button';
import Wiggle from '../components/wiggle';
import { findPath } from '../util/word';

import './game-complete.css';

export default ({ goToScreen, chain }) => {
  const parChain = findPath(chain[0], chain[chain.length - 1]);

  const strokes = chain.length - parChain.length;
  let strokeScore;
  if (strokes > 0)
    strokeScore = 1000 * (parChain.length - strokes);
  else
    strokeScore = 1000 * parChain.length * (1 - strokes);
  if (strokeScore < 0)
    strokeScore = 0;
  const specials = chain.filter((word) => word.type === 'special').length;
  const specialScore = 2000 * specials;
  const score = strokeScore + specialScore;

  return (
    <>
      <header>
        <div className='flex_row'>
          <Button
            icon='fas fa-arrow-left'
            onClick={() => goToScreen({ name: 'home' })}
            tooltip='Back to home'
          />
          <h2 className='wiggle_hitbox' data-wiggle>
            <Wiggle text='Game Complete' />
          </h2>
        </div>
      </header>
      <main className='game_complete_main'>
        <div className='game_complete_column'>
          <div className='game_complete_header'>Yours</div>
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
              <td>
                {strokes === 0 && 'Par matched:'}
                {strokes < 0 && -strokes + ' strokes below par:'}
                {strokes > 0 && strokes + ' strokes above par:'}
              </td>
              <td>{strokeScore.toLocaleString()}</td>
            </tr>
            <tr>
              <td>{specials} special words:</td>
              <td>{specialScore.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total:</td>
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
      {word.type === 'special' && (
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
