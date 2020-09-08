import React from 'react';
import { Component } from 'react';

import { Button } from '../components/button.js';
import { Input } from '../components/input.js';

import './filters.css';

export class Filters extends Component {
  render() {
    return (
      <>
        <div className='section dictionary_filters'>
          <Button
            data-disabled={!this.props.showStandard}
            onClick={this.props.toggleStandard}
          >
            <i className='fas fa-paragraph' />
            <span>standard</span>
          </Button>
          <Button
            icon='fa-star-of-life'
            data-disabled={!this.props.showSpecial}
            onClick={this.props.toggleSpecial}
          >
            <i className='fas fa-star-of-life' />
            <span>special</span>
          </Button>
          <Input
            className='dictionary_search'
            onInput={this.props.changeSearch}
          />
          <div className='dictionary_count semibold'>
            {this.props.words} words
          </div>
        </div>
      </>
    );
  }
}
