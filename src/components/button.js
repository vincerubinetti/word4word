import React from 'react';

import Wiggle from './wiggle';

import './button.css';

export default ({
  className = '',
  icon = '',
  text = '',
  flip = false,
  link = false,
  children = null,
  tooltip = '',
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

  const Component = link ? Link : Button;

  return (
    <Component
      className={'button wiggle_hitbox ' + className}
      {...props}
      data-square={icon && !text}
      title={tooltip}
      aria-label={tooltip}
    >
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
    </Component>
  );
};

const Button = ({ ...props }) => <button {...props} />;

// eslint-disable-next-line jsx-a11y/anchor-has-content
const Link = ({ ...props }) => <a {...props} />;
