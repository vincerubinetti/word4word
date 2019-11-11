import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Header } from './header.js';
import { Filters } from './filters.js';
import { Table } from './table.js';
import { Info } from './info.js';

import './index.css';

export class Dictionary extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.state.showStandard = true;
    this.state.showSpecial = false;
    this.state.selectedWord = this.props.data.standardDictionary[0];
    this.state.search = '';
    this.state.sortField = 'text';
    this.state.sortDirection = 'down';
  }

  toggleStandard = () => {
    this.setState({ showStandard: !this.state.showStandard });
  };

  toggleSpecial = () => {
    this.setState({ showSpecial: !this.state.showSpecial });
  };

  changeSelected = (word) => {
    this.setState({ selectedWord: word });
  };

  changeSearch = (event) => {
    this.setState({ search: event.target.value.toLowerCase() });
  };

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

  getList = () => {
    let list = [];
    const data = this.props.data;
    if (!data)
      return list;

    const standardDictionary = data.standardDictionary;
    const specialDictionary = data.specialDictionary;
    const pars = data.pars;
    if (!standardDictionary || !specialDictionary || !pars)
      return list;

    if (this.state.showStandard)
      list = list.concat(standardDictionary);
    if (this.state.showSpecial)
      list = list.concat(specialDictionary);

    list.sort(this.sortFunction);

    list = list.filter((word) => word.text.includes(this.state.search));

    return list;
  };

  render() {
    const list = this.getList();

    return (
      <>
        <Header />
        <Filters
          words={list.length}
          showStandard={this.state.showStandard}
          showSpecial={this.state.showSpecial}
          toggleStandard={this.toggleStandard}
          toggleSpecial={this.toggleSpecial}
          changeSearch={this.changeSearch}
        />
        <Table
          list={list}
          selectedWord={this.state.selectedWord}
          sortField={this.state.sortField}
          sortDirection={this.state.sortDirection}
          changeSelected={this.changeSelected}
          changeSort={this.changeSort}
        />
        <Info selectedWord={this.state.selectedWord} />
      </>
    );
  }
}
Dictionary = connect((state) => ({
  data: state.data
}))(Dictionary);
