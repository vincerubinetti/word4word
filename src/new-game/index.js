import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Wiggle } from '../components/wiggle.js';
import { Button } from '../components/button.js';
import { BigButton } from '../components/big-button.js';
import { setBackground } from '../background/actions.js';
import { setScreen } from '../screen/actions.js';

import './index.css';

const difficulties = [
  { name: 'LEARN', pars: [3] },
  { name: 'EASY', pars: [4, 5, 6, 7, 8] },
  { name: 'MEDIUM', pars: [9, 10, 11, 12, 13] },
  { name: 'HARD', pars: [14, 15, 16, 17, 18] },
  { name: 'MASTER', pars: [19, 20, 21] }
];

export class NewGame extends Component {
  render() {
    return (
      <>
        <div className='section section_h'>
          <Button
            onClick={() => this.props.dispatch(setScreen({ screen: 'home' }))}
          >
            <i className='fas fa-lg fa-chevron-left'></i>
          </Button>
          <h2 className='wiggle_hitbox' data-wiggle>
            <Wiggle text='New Game' />
          </h2>
        </div>
        <div className='section section_v'>
          {difficulties.map((difficulty, index) => {
            let total = 0;
            for (const par of difficulty.pars)
              total += this.props.data.pars[par].length;
            return (
              <BigButton
                key={index}
                className='new_game_button'
                left={<i className='fas fa-play' />}
                right={difficulty.name}
                onClick={() =>
                  this.props.dispatch(setBackground({ background: index }))
                }
                tooltip={
                  <>
                    Par {difficulty.pars.join(', ')}
                    <br />
                    Completed 0 of {total.toLocaleString()}
                  </>
                }
              />
            );
          })}
        </div>
      </>
    );
  }
}
NewGame = connect((state) => ({
  data: state.data
}))(NewGame);
