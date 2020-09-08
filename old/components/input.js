import React from 'react';
import { Component } from 'react';

import './input.css';

export class Input extends Component {
  constructor() {
    super();

    this.state = {};
    this.state.focused = false;
  }

  render() {
    return (
      <div className="input" data-focused={this.state.focused}>
        <input
          maxLength="4"
          onFocus={() => this.setState({ focused: true })}
          onBlur={() => this.setState({ focused: false })}
          {...this.props}
        />
      </div>
    );
  }
}
