import React from 'react';
import { Component } from 'react';

import { Screen } from '../components/screen.js';
import { Button } from './button.js';

export class Difficulty extends Component {
  render() {
    return (
      <Screen>
        <Button left='Easy' right='1' color='blue' />
        <Button left='Medium' right='2' color='purple' />
        <Button left='Hard' right='3' color='red' />
        <Button left='Master' right='4' color='gray' />
      </Screen>
    );
  }
}
