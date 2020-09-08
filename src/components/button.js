import React from 'react';

import Wiggle from './wiggle';

import './button.css';

export default ({ className = '', icon = '', text = '', ...props }) => (
  <button className={'button wiggle_hitbox ' + className} {...props}>
    {icon && (
      <div className='button_icon flex_row'>
        <i className={'fa ' + icon} />
      </div>
    )}
    {text && (
      <div className='button_text flex_row'>
        <Wiggle text={text} />
      </div>
    )}
  </button>
);
