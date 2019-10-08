import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from 'react';

import './tooltip.css';

const delay = 500;

export class Tooltip extends Component {
  constructor() {
    super();

    this.state = {};
    this.state.open = false;
    this.state.x = 0;
    this.state.y = 0;
    this.state.opacity = 0;

    this.timer = null;
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  onEnter = (event) => {
    const target = event.currentTarget;
    this.timer = window.setTimeout(() => this.openTooltip(target), delay);
    this.setState({ hover: true });
  };

  onLeave = () => {
    this.setState({ hover: false, open: false });
  };

  openTooltip = (target) => {
    if (!this.state.hover || !target) {
      this.setState({ open: false });
      return;
    }

    const left = target.getBoundingClientRect().left + window.scrollX;
    const top = target.getBoundingClientRect().top + window.scrollY;
    const width = target.getBoundingClientRect().width;

    this.setState({
      open: true,
      x: left + width / 2,
      y: top
    });
  };

  render() {
    if (!this.props.text)
      return <>{this.props.children}</>;

    const children = React.Children.map(this.props.children, (element) => {
      const props = {
        onMouseEnter: (event) => {
          this.onEnter(event);
          if (element.props.onMouseEnter)
            element.props.onMouseEnter(event);
        },
        onMouseLeave: (event) => {
          this.onLeave(event);
          if (element.props.onMouseLeave)
            element.props.onMouseLeave(event);
        },
        onFocus: (event) => {
          this.onEnter(event);
          if (element.props.onFocus)
            element.props.onFocus(event);
        },
        onBlur: (event) => {
          this.onLeave(event);
          if (element.props.onBlur)
            element.props.onBlur(event);
        }
      };
      if (React.isValidElement(element))
        return React.cloneElement(element, props);
      else if (typeof element === 'string')
        return <span {...props}>{element}</span>;
      else
        return element;
    });

    return (
      <>
        {children}
        {this.state.open && (
          <Popup
            text={this.props.text}
            open={this.state.open}
            x={this.state.x}
            y={this.state.y}
            width={this.state.width}
            height={this.state.height}
          />
        )}
      </>
    );
  }
}

class Popup extends Component {
  render() {
    return ReactDOM.createPortal(
      <div
        className="tooltip"
        style={{
          left: this.props.x + 'px',
          top: this.props.y + 'px'
        }}
      >
        {this.props.text}
      </div>,
      document.body
    );
  }
}
