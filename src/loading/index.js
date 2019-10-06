import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Wiggle } from '../components/wiggle.js';

import './index.css';

export class Loading extends Component {
  render() {
    if (Object.keys(this.props.data).length)
      return <></>;

    return (
      <div className="loading_background">
        <h2 className="wiggle_hitbox" data-wiggle>
          <Wiggle text="loading..." />
        </h2>
      </div>
    );
  }
}
Loading = connect((state) => ({
  data: state.data
}))(Loading);
