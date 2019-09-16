import React from 'react';
import { Component } from 'react';

import './button.css';

export class Button extends Component {
  render() {
    return (
      <button
        className={'button wiggle_hitbox' + (this.props.className || '')}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
      >
        <div className="button_left">{this.props.left}</div>
        <div className="button_right">{this.props.right}</div>
      </button>
    );
  }
}
