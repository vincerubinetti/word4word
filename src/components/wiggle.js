import React from 'react';
import { Component } from 'react';

import './wiggle.css';

export class Wiggle extends Component {
  render() {
    const letters = Array.from(this.props.text).map((letter, index) => {
      if (letter === ' ')
        letter = <>&nbsp;</>;
      return (
        <span key={index} className='wiggle_item'>
          {letter}
        </span>
      );
    });
    return <>{letters}</>;
  }
}
