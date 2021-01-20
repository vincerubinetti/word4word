import React from 'react';
import ReactSlider from 'react-slider';

import Button from '../components/button';
import Wiggle from '../components/wiggle';

import './new-game.css';

const minPar = 3;
const maxPar = 21;

export default ({ pars, setScreen, par, setPar, setChain }) => (
  <>
    <header>
      <div className='flex_row'>
        <Button
          icon='fas fa-arrow-left'
          onClick={() => setScreen('home')}
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
      />
      <p>
        <b>Par: {par}</b>
      </p>
      <p>
        <b>0</b> of <b>{pars[par].length.toLocaleString()}</b> games played
      </p>
    </main>
    <footer>
      <Button
        className='new_game_button'
        text='Play'
        icon='fas fa-play'
        onClick={() => {
          setChain([]);
          setScreen('game');
        }}
        tooltip='Start new game'
      />
    </footer>
  </>
);
