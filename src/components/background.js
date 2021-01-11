import React from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';

import { DataContext } from '../data';

import './background.css';

// options
const division = 360 / 12;
const alpha = 0.1;
const spin = 1;
const offset = 100;
const fps = 40;

// variables
let canvas = null;
let ctx = null;
let width = 0;
let height = 0;
let radius = 0;

// map pars to background gradient colors
const bgs = [
  [3, 5, '#4dd0e1', '#1e88e5'],
  [6, 8, '#cddc39', '#4caf50'],
  [9, 11, '#ffc107', '#ff5722'],
  [12, 14, '#ff5722', '#e91e63'],
  [15, 17, '#e91e63', '#9c27b0'],
  [18, 21, '#c0c0c0', '#808080']
];

export default () => {
  const { par } = useContext(DataContext);

  useEffect(() => {
    updateCanvas();
  }, []);

  return (
    <div className='background'>
      {bgs.map(([startPar, endPar, startColor, endColor], index) => {
        const active = par >= startPar && par <= endPar;
        return (
          <div
            key={index}
            className='background_gradient'
            style={{
              background: `linear-gradient(45deg, ${startColor}, ${endColor})`,
              opacity: active ? 1 : 0,
              transition: `opacity 0.25s ease-${active ? 'out' : 'in'}`
            }}
          />
        );
      })}
      <canvas ref={(element) => (canvas = element)} />
    </div>
  );
};

// update canvas properties
const updateCanvas = () => {
  // update dimensions
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = width;
  canvas.height = height;
  radius =
    Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) + offset * Math.sqrt(2);

  // update canvas context object
  // globalAlpha gets reset on dimension change, so do this after
  ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = alpha;
};
window.addEventListener('resize', updateCanvas);

// clear canvas for next frame to be drawn
const clearCanvas = () => {
  if (ctx)
    ctx.clearRect(0, 0, width, height);
};

// draw multiple suns in corners of screen
const drawSuns = () => {
  if (!ctx)
    return;

  const time = window.performance.now() / 1000;
  drawSun(0 - offset, 0 - offset, time * spin * 2);
  drawSun(width + offset, height + offset, time * spin);
};

// draw "sun" with rays at some # of divisions, at position and angle
const drawSun = (x, y, angle) => {
  if (!ctx)
    return;

  for (let angleAdd = 0; angleAdd < 360; angleAdd += division * 2) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(
      x,
      y,
      radius,
      degToRad(angle + angleAdd),
      degToRad(angle + angleAdd + division)
    );
    ctx.lineTo(x, y);
    ctx.fill();
  }
};

// convert degrees to radians
const degToRad = (degrees) => (2 * Math.PI * degrees) / 360;

// draw canvas loop
const drawCanvas = () => {
  clearCanvas();
  drawSuns();
  window.requestAnimationFrame(() => window.setTimeout(drawCanvas, 1000 / fps));
};
drawCanvas();
