import React from 'react';
import { Component } from 'react';

import './check-button.css';

export class CheckButton extends Component {
  render() {
    return (
      <button
        className={'check_button ' + (this.props.className || '')}
        data-checked={this.props.checked}
        onClick={this.props.onClick}
      >
        <i className={'fas ' + this.props.icon}></i>
        {this.props.text}
      </button>
    );
  }
}
