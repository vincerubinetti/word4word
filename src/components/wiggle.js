import React from 'react';

import './wiggle.css';

export default ({ text }) => {
  const letters = Array.from(text).map((letter, index) => (
    <span
      key={index}
      className='wiggle_item'
      style={{ animationDelay: index * 0.1 + 's' }}
    >
      {letter === ' ' ? <>&nbsp;</> : letter}
    </span>
  ));
  return <>{letters}</>;
};
