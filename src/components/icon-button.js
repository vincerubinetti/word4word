import React from 'react';
import { Component } from 'react';

import './icon-button.css';

export class IconButton extends Component {
  render() {
    return (
      <button
        className={'icon_button ' + (this.props.className || '')}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
      >
        <div className="icon_button_left">{this.props.left}</div>
        <div className="icon_button_right">{this.props.right}</div>
      </button>
    );
  }
}
