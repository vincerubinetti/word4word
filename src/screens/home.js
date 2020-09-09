import React from 'react';

import Dictionary from './dictionary';
import Wiggle from '../components/wiggle';
import Button from '../components/button';

import './home.css';

export default ({ setScreen }) => (
  <>
    <header>
      <h1 className='wiggle_hitbox' data-wiggle>
        <Wiggle text='WORD4WORD' />
      </h1>
    </header>
    <main>
      <Button
        className='home_button'
        icon='fas fa-bolt fa-fw'
        text='NEW GAME'
      />
      <Button
        className='home_button'
        icon='fas fa-bookmark fa-fw'
        text='CONTINUE'
      />
      <Button
        className='home_button'
        icon='fas fa-star fa-fw'
        text='COMPLETED'
      />
      <Button
        className='home_button'
        icon='fas fa-book fa-fw'
        text='DICTIONARY'
        onClick={() => setScreen(<Dictionary />)}
      />
    </main>
  </>
);
