import React from 'react';
import { Component } from 'react';

import styles from './button.module.css';

export class Button extends Component {
  render() {
    return (
      <div className={styles.button} disabled={this.props.disabled}>
        <button
          className={styles.button_left}
          data-color={this.props.color}
          disabled={this.props.disabled}
        >
          {this.props.left}
        </button>
        <div className={styles.button_divider} />
        <button
          className={styles.button_right}
          data-color={this.props.color}
          disabled={this.props.disabled}
        >
          {this.props.right}
        </button>
      </div>
    );
  }
}
