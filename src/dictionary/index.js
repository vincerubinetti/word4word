import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Wiggle } from '../components/wiggle.js';
import { Table } from './table.js';
import { Info } from './info.js';

import './index.css';

export class Dictionary extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.state.selectedWord = this.props.data.standardDictionary[0];
  }

  changeSelected = (word) => {
    this.setState({ selectedWord: word });
  };

  render() {
    return (
      <>
        <div className="screen_top">
          <h2 className="wiggle_hitbox">
            <Wiggle text="Dictionary" />
          </h2>
        </div>
        <div className="screen_middle">
          <Table
            changeSelected={this.changeSelected}
            selectedWord={this.state.selectedWord}
          />
        </div>
        <div className="screen_bottom">
          <Info selectedWord={this.state.selectedWord} />
        </div>
      </>
    );
  }
}
Dictionary = connect((state) => ({
  data: state.data
}))(Dictionary);
