import React from 'react';
import { Component } from 'react';

import './button.css';

export class Button extends Component {
  render() {
    const { className, children, ...props } = this.props;
    return (
      <button className={'button ' + (className || '')} {...props}>
        {children}
      </button>
    );
  }
}
