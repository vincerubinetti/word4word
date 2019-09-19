import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { CheckButton } from '../components/check-button.js';

export class Table extends Component {
  constructor() {
    super();

    this.state = {};
    this.state.showStandard = true;
    this.state.showSpecial = false;
    this.state.sortField = 'text';
    this.state.sortDirection = 'down';
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
    if (a.type !== b.type) {
      a = a['type'];
      b = b['type'];
    } else if (this.state.sortField === 'links') {
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

    list = list.map((word, index) => (
      <div key={index} className="table_row">
        <div>
          {word.type === 'standard' ? (
            <i className="fas fa-paragraph"></i>
          ) : (
            <i className="fas fa-star-of-life"></i>
          )}
        </div>
        <div>{word.text.toUpperCase()}</div>
        <div>{word.type === 'standard' ? word.links.length : '-'}</div>
      </div>
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
          <div className="semibold">{list.length} words</div>
          <CheckButton
            text={<>standard words</>}
            icon="fa-paragraph"
            checked={this.state.showStandard}
            onClick={() =>
              this.setState({ showStandard: !this.state.showStandard })
            }
          />
          <CheckButton
            text={<>special words</>}
            icon="fa-star-of-life"
            checked={this.state.showSpecial}
            onClick={() =>
              this.setState({ showSpecial: !this.state.showSpecial })
            }
          />
        </div>
        <div className="table_container">
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
        </div>
        <div className="table_container" data-overflow>
          {list}
        </div>
      </>
    );
  }
}
Table = connect((state) => ({
  data: state.data
}))(Table);
