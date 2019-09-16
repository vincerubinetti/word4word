import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import './index.css';

export class Loading extends Component {
  render() {
    const percent = getPercent(this.props.loadProgress);
    const largeArc = percent >= 0.5 ? '1' : '0';
    const x = Math.cos(Math.PI / 2 + percent * Math.PI * 2);
    const y = -Math.sin(Math.PI / 2 + percent * Math.PI * 2);

    return (
      <>
        {percent !== 1 && (
          <div className="loading_background">
            <svg className="loading_bar" viewBox="-1 -1 2 2">
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
        )}
      </>
    );
  }
}
Loading = connect((state) => ({
  loadProgress: state.loadProgress
}))(Loading);

export function getPercent(loadProgress) {
  if (Object.keys(loadProgress) < 15)
    return 0;

  let loaded = 0;
  let total = 0;
  for (const key of Object.keys(loadProgress)) {
    loaded += loadProgress[key].loaded;
    total += loadProgress[key].total;
  }

  let percent = loaded / Math.max(total, 1);
  if (percent > 0.99)
    percent = 1;

  return percent;
}
