import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import './index.css';

const division = 360 / 12;
const alpha = 0.1;
const spin = 1;
const offset = 100;
const fps = 1000 / 40;
// const dpi = 96 * window.devicePixelRatio;
const dpi = 96;

export class Background extends Component {
  constructor() {
    super();

    this.ref = React.createRef();
  }

  componentDidMount() {
    this.canvas = this.ref.current;
    this.ctx = this.canvas.getContext('2d');
    this.onResize();
    this.step();

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.clearTimeout(this.timeout);
  }

  onResize = () => {
    const scaleFactor = dpi / 96;
    this.canvas.width = this.canvas.clientWidth * scaleFactor;
    this.canvas.height = this.canvas.clientHeight * scaleFactor;
    this.width = this.canvas.width / scaleFactor;
    this.height = this.canvas.height / scaleFactor;
    this.ctx.scale(scaleFactor, scaleFactor);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.globalAlpha = alpha;
    this.radius =
      Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2)) +
      offset * Math.sqrt(2);
  };

  step = () => {
    const time = window.performance.now() / 1000;
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.sun(0 - offset, 0 - offset, time * spin * 2);
    this.sun(this.width + offset, this.height + offset, time * spin);

    this.timeout = window.requestAnimationFrame(() =>
      window.setTimeout(this.step, fps)
    );
  };

  sun = (x, y, angle) => {
    for (let angleAdd = 0; angleAdd < 360; angleAdd += division * 2) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.arc(
        x,
        y,
        this.radius,
        this.degToRad(angle + angleAdd),
        this.degToRad(angle + angleAdd + division)
      );
      this.ctx.lineTo(x, y);
      this.ctx.fill();
    }
  };

  degToRad = (degrees) => {
    return (2 * Math.PI * degrees) / 360;
  };

  render() {
    return (
      <div className="background" data-color={this.props.background}>
        <canvas ref={this.ref}></canvas>
      </div>
    );
  }
}
Background = connect((state) => ({
  background: state.background
}))(Background);
