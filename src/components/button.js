import React from 'react';

import Wiggle from './wiggle';

import './button.css';

export default ({
  className = '',
  icon = '',
  text = '',
  flip = false,
  children = null,
  ...props
}) => {
  let Icon = <></>;
  if (icon) {
    Icon = (
      <div className='button_icon icon'>
        <i className={icon} />
      </div>
    );
  }

  let Text = <></>;
  if (text) {
    Text = (
      <div className='button_text'>
        <Wiggle text={text} />
      </div>
    );
  }

  return (
    <button className={'button wiggle_hitbox ' + className} {...props}>
      {!flip && (
        <>
          {Icon}
          {Text}
        </>
      )}
      {flip && (
        <>
          {Text}
          {Icon}
        </>
      )}
      {children}
    </button>
  );
};
