import React from 'react';
import { useContext } from 'react';
import ReactSlider from 'react-slider';

import Button from '../components/button';
import Wiggle from '../components/wiggle';
import { DataContext } from '../data';
import { useStorage } from '../util/hooks';

import './new-game.css';

const minPar = 3;
const maxPar = 21;

export default ({ goToScreen }) => {
  const [par, setPar] = useStorage(minPar, 'newGamePar');
  const { pars } = useContext(DataContext);

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
            <Wiggle text='New Game' />
          </h2>
        </div>
      </header>
      <main>
        <h3>Difficulty</h3>
        <ReactSlider
          min={minPar}
          max={maxPar}
          step={1}
          className='new_game_slider'
          value={par}
          onChange={setPar}
          pageFn={() => 3}
          thumbClassName='new_game_slider_thumb'
          trackClassName='new_game_slider_track'
          renderThumb={(props) => <div {...props} data-par={par} />}
          renderTrack={(props) => <div {...props} data-par={par} />}
        />
        <p>
          <strong>Par: {par}</strong>
        </p>
        <p>
          <strong>0</strong> of{' '}
          <strong>{pars[par].length.toLocaleString()}</strong> games played
        </p>
      </main>
      <footer>
        <Button
          className='new_game_button'
          text='Play'
          icon='fas fa-play'
          onClick={() => goToScreen({ name: 'game', par })}
          tooltip='Play new game'
        />
      </footer>
    </>
  );
};
