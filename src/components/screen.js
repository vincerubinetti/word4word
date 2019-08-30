import React from 'react';
import { Component } from 'react';

import styles from './screen.module.css';

export class Screen extends Component {
  render() {
    return <div className={styles.screen}>{this.props.children}</div>;
  }
}
