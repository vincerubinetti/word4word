import React from 'react';

import Button from '../components/button';

import './home.css';

export default ({ setScreen }) => (
  <>
    <header>
      <div className='home_title'>
        <Spin />
        <div className='home_title_number flex_row'>4</div>
      </div>
    </header>
    <main>
      <Button
        className='home_button'
        icon='fas fa-bolt fa-fw'
        text='NEW GAME'
        onClick={() => setScreen('newGame')}
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
        onClick={() => setScreen('dictionary')}
      />
      <Button
        className='home_button'
        icon='fas fa-chess-rook fa-fw'
        text='HOW 2 PLAY'
        link={true}
        href='https://github.com/vincerubinetti/word4word'
        target='_blank'
      />
    </main>
  </>
);

const text = 'WORD WORD '.split('');

const Spin = () => (
  <div className='home_title_circle'>
    {text.map((char, index) => (
      <span
        key={index}
        className='home_title_spoke'
        style={{
          transform:
            'translate(-50%,-50%) rotate(' +
            (index - 1.5) * (360 / text.length) +
            'deg)'
        }}
      >
        {char}
      </span>
    ))}
  </div>
);
