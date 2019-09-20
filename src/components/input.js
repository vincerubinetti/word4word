import React from 'react';
import { Component } from 'react';

import './input.css';

export class Input extends Component {
  render() {
    return (
      <input
        maxLength="4"
        className={'input ' + (this.props.className || '')}
        disabled={this.props.disabled}
        onInput={this.props.onInput}
      />
    );
  }
}
