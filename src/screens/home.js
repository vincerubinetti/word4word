import React from 'react';

import Wiggle from '../components/wiggle';
import Button from '../components/button';

import './home.css';

export const Main = ({ setScreen }) => (
  <>
    <h1 className='wiggle_hitbox' data-wiggle>
      <Wiggle text='WORD4WORD' />
    </h1>
    <div className='flex_column'>
      <Button
        className='home_button'
        icon='fas fa-bolt'
        text='NEW GAME'
        disabled
      />
      <Button className='home_button' icon='fas fa-bookmark' text='CONTINUE' />
      <Button className='home_button' icon='fas fa-star' text='COMPLETED' />
      <Button
        className='home_button'
        icon='fas fa-book'
        text='DICTIONARY'
        onClick={() => setScreen('dictionary')}
      />
    </div>
  </>
);
