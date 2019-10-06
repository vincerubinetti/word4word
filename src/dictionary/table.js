import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { CheckButton } from '../components/check-button.js';
import { Input } from '../components/input.js';

import './table.css';

export class Table extends Component {
  constructor() {
    super();

    this.state = {};
    this.state.showStandard = true;
    this.state.showSpecial = false;
    this.state.sortField = 'text';
    this.state.sortDirection = 'down';
    this.state.search = '';
  }

  changeSort = (sortField) => {
    if (this.state.sortField === sortField) {
      this.setState({
        sortDirection: this.state.sortDirection === 'down' ? 'up' : 'down'
      });
    } else
      this.setState({ sortField: sortField, sortDirection: 'down' });
  };

  sortFunction = (a, b) => {
    if (this.state.sortField === 'links') {
      a = a[this.state.sortField].length;
      b = b[this.state.sortField].length;
    } else {
      a = a[this.state.sortField];
      b = b[this.state.sortField];
    }

    if (a > b)
      return this.state.sortDirection === 'down' ? 1 : -1;
    else if (a < b)
      return this.state.sortDirection === 'down' ? -1 : 1;
    else
      return 0;
  };

  changeSearch = (event) => {
    this.setState({ search: event.target.value.toLowerCase() });
  };

  render() {
    const data = this.props.data;
    if (!data)
      return <></>;

    const standardDictionary = data.standardDictionary;
    const specialDictionary = data.specialDictionary;
    const pars = data.pars;
    if (!standardDictionary || !specialDictionary || !pars)
      return <></>;

    let list = [];
    if (this.state.showStandard)
      list = list.concat(standardDictionary);
    if (this.state.showSpecial)
      list = list.concat(specialDictionary);

    list.sort(this.sortFunction);

    list = list.filter((word) => word.text.includes(this.state.search));

    list = list.map((word, index) => (
      <button
        key={index}
        className="table_row"
        onClick={() => this.props.changeSelected(word)}
        data-active={
          this.props.selectedWord.text === word.text ? 'true' : undefined
        }
      >
        <div>
          {word.type === 'standard' ? (
            <i className="fas fa-paragraph"></i>
          ) : (
            <i className="fas fa-star-of-life"></i>
          )}
        </div>
        <div>{word.text.toUpperCase()}</div>
        <div>{word.type === 'standard' ? word.links.length : '-'}</div>
      </button>
    ));

    const sortArrow = (
      <i
        className={
          'fas fa-xs ' +
          (this.state.sortDirection === 'down' ?
            'fa-arrow-down' :
            'fa-arrow-up')
        }
      ></i>
    );

    return (
      <>
        <div className="dictionary_details">
          <CheckButton
            text={<>standard</>}
            icon="fa-paragraph"
            checked={this.state.showStandard}
            onClick={() =>
              this.setState({ showStandard: !this.state.showStandard })
            }
          />
          <CheckButton
            text={<>special</>}
            icon="fa-star-of-life"
            checked={this.state.showSpecial}
            onClick={() =>
              this.setState({ showSpecial: !this.state.showSpecial })
            }
          />
          <Input className="dictionary_search" onInput={this.changeSearch} />
          <div className="dictionary_count semibold">{list.length} words</div>
        </div>
        <div className="dictionary_table">
          <div className="table_row">
            <button onClick={() => this.changeSort('type')}>
              Type{this.state.sortField === 'type' && sortArrow}
            </button>
            <button onClick={() => this.changeSort('text')}>
              Word{this.state.sortField === 'text' && sortArrow}
            </button>
            <button onClick={() => this.changeSort('links')}>
              Links{this.state.sortField === 'links' && sortArrow}
            </button>
          </div>
          <div data-table-overflow>{list}</div>
        </div>
      </>
    );
  }
}
Table = connect((state) => ({
  data: state.data
}))(Table);
