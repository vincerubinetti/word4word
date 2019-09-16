import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Screen } from '../components/screen.js';
import { Button } from '../components/button.js';
import { setScreen } from '../state/actions.js';

import './index.css';

export class Home extends Component {
  render() {
    return (
      <Screen>
        <h1 className="wiggle_hitbox">
          <span className="wiggle_item">W</span>
          <span className="wiggle_item">O</span>
          <span className="wiggle_item">R</span>
          <span className="wiggle_item">D</span>
          <span className="wiggle_item">4</span>
          <span className="wiggle_item">W</span>
          <span className="wiggle_item">O</span>
          <span className="wiggle_item">R</span>
          <span className="wiggle_item">D</span>
        </h1>
        <Button
          onClick={() => this.props.dispatch(setScreen({ screen: 'newgame' }))}
          left={<i className="fas fa-bolt" />}
          right={
            <>
              <span className="wiggle_item">N</span>
              <span className="wiggle_item">E</span>
              <span className="wiggle_item">W</span>
              <span className="wiggle_item">&nbsp;</span>
              <span className="wiggle_item">G</span>
              <span className="wiggle_item">A</span>
              <span className="wiggle_item">M</span>
              <span className="wiggle_item">E</span>
            </>
          }
        />
        <Button
          onClick={() => this.props.dispatch(setScreen({ screen: 'continue' }))}
          left={<i className="fas fa-bookmark" />}
          right={
            <>
              <span className="wiggle_item">C</span>
              <span className="wiggle_item">O</span>
              <span className="wiggle_item">N</span>
              <span className="wiggle_item">T</span>
              <span className="wiggle_item">I</span>
              <span className="wiggle_item">N</span>
              <span className="wiggle_item">U</span>
              <span className="wiggle_item">E</span>
            </>
          }
        />
        <Button
          onClick={() =>
            this.props.dispatch(setScreen({ screen: 'completed' }))
          }
          left={<i className="fas fa-star" />}
          right={
            <>
              <span className="wiggle_item">C</span>
              <span className="wiggle_item">O</span>
              <span className="wiggle_item">M</span>
              <span className="wiggle_item">P</span>
              <span className="wiggle_item">L</span>
              <span className="wiggle_item">E</span>
              <span className="wiggle_item">T</span>
              <span className="wiggle_item">E</span>
              <span className="wiggle_item">D</span>
            </>
          }
        />
        <Button
          onClick={() =>
            this.props.dispatch(setScreen({ screen: 'dictionary' }))
          }
          left={<i className="fas fa-book" />}
          right={
            <>
              <span className="wiggle_item">D</span>
              <span className="wiggle_item">I</span>
              <span className="wiggle_item">C</span>
              <span className="wiggle_item">T</span>
              <span className="wiggle_item">I</span>
              <span className="wiggle_item">O</span>
              <span className="wiggle_item">N</span>
              <span className="wiggle_item">A</span>
              <span className="wiggle_item">R</span>
              <span className="wiggle_item">Y</span>
            </>
          }
        />
      </Screen>
    );
  }
}
Home = connect()(Home);
