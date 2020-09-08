import React from 'react';
import { Component } from 'react';

import { Button } from './button.js';
import { Wiggle } from './wiggle.js';
import { Tooltip } from './tooltip.js';

import './big-button.css';

export class BigButton extends Component {
  render() {
    const { className, left, right, tooltip, ...props } = this.props;
    return (
      <Tooltip text={tooltip}>
        <Button
          className={'button wiggle_hitbox ' + (className || '')}
          {...props}
        >
          <div className="button_left">{left}</div>
          <div className="button_right">
            <Wiggle text={right} />
          </div>
        </Button>
      </Tooltip>
    );
  }
}
