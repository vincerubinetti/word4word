import React from 'react';
import { Component } from 'react';

import './table.css';

export class Table extends Component {
  render() {
    const list = this.props.list.map((word, index) => (
      <Row
        key={index}
        word={word}
        selectedWord={this.props.selectedWord}
        changeSelected={this.props.changeSelected}
      />
    ));

    const sortArrow = (
      <i
        className={
          'fas fa-xs ' +
          (this.props.sortDirection === 'down' ?
            'fa-arrow-down' :
            'fa-arrow-up')
        }
      ></i>
    );

    return (
      <>
        <div className='section section_sm'>
          <div className='dictionary_table_row'>
            <button onClick={() => this.props.changeSort('type')}>
              <span>Type</span>
              {this.props.sortField === 'type' && sortArrow}
            </button>
            <button onClick={() => this.props.changeSort('text')}>
              <span>Word</span>
              {this.props.sortField === 'text' && sortArrow}
            </button>
            <button onClick={() => this.props.changeSort('links')}>
              <span>Links</span>
              {this.props.sortField === 'links' && sortArrow}
            </button>
          </div>
        </div>
        <div className='section section_v section_sm dictionary_table'>
          {list}
        </div>
      </>
    );
  }
}

class Row extends Component {
  render() {
    return (
      <button
        className='dictionary_table_row'
        onClick={() => this.props.changeSelected(this.props.word)}
        data-active={
          this.props.selectedWord.text === this.props.word.text ?
            'true' :
            undefined
        }
      >
        <div>
          {this.props.word.type === 'standard' ? (
            <i className='fas fa-paragraph'></i>
          ) : (
            <i className='fas fa-star-of-life'></i>
          )}
        </div>
        <div>{this.props.word.text.toUpperCase()}</div>
        <div>
          {this.props.word.type === 'standard' ?
            this.props.word.links.length :
            '-'}
        </div>
      </button>
    );
  }
}
