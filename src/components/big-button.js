import React from 'react';
import { Component } from 'react';

import { Button } from './button.js';

import './big-button.css';

export class BigButton extends Component {
  render() {
    const { className, onClick, left, right } = this.props;
    return (
      <Button className={'big_button ' + (className || '')} onClick={onClick}>
        <div className="big_button_left">{left}</div>
        <div className="big_button_right">{right}</div>
      </Button>
    );
  }
}
