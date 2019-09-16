import React from 'react';
import { Component } from 'react';

import './screen.css';

export class Screen extends Component {
  render() {
    return <div className='screen'>{this.props.children}</div>;
  }
}
