import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import './index.css';

export class Loading extends Component {
  render() {
    if (!this.props.loading)
      return <></>;

    const percent = this.props.loading.percent || 0;
    const largeArc = percent >= 0.5 ? '1' : '0';
    const x = Math.cos(Math.PI / 2 + percent * Math.PI * 2);
    const y = -Math.sin(Math.PI / 2 + percent * Math.PI * 2);

    return (
      <div className='loading_background'>
        <svg className='loading_bar' viewBox='-1 -1 2 2'>
          <path
            d={
              'M 0 -1 L 0 0 L ' +
              x +
              ' ' +
              y +
              ' A 1 1 0 ' +
              largeArc +
              ' 1 0 -1'
            }
          />
        </svg>
      </div>
    );
  }
}
Loading = connect((state) => ({
  loading: state.loading
}))(Loading);
