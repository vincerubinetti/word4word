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
    this.sortField = 'text';
  }

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

    list.sort((a, b) => {
      a = a[this.sortField];
      b = b[this.sortField];
      if (a > b)
        return 1;
      else if (a < b)
        return -1;
      else
        return 0;
    });

    list = list.map((word, index) => (
      <tr key={index}>
        <td>
          {word.type === 'standard' ? (
            <i className='fas fa-paragraph'></i>
          ) : (
            <i className='fas fa-star-of-life'></i>
          )}
        </td>
        <td>{word.text.toUpperCase()}</td>
        <td>{word.type === 'standard' ? word.links.length : '-'}</td>
      </tr>
    ));

    return (
      <>
        <div className='dictionary_details'>
          <div>{list.length} words</div>
          <CheckButton
            text={<>standard words</>}
            icon='fa-paragraph'
            checked={this.state.showStandard}
            onClick={() =>
              this.setState({ showStandard: !this.state.showStandard })
            }
          />
          <CheckButton
            text={<>special words</>}
            icon='fa-star-of-life'
            checked={this.state.showSpecial}
            onClick={() =>
              this.setState({ showSpecial: !this.state.showSpecial })
            }
          />
        </div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Word</th>
              <th>Links</th>
            </tr>
          </thead>
        </table>
        <div className='table_container'>
          <table>
            <tbody>{list}</tbody>
          </table>
        </div>
      </>
    );
  }
}
Table = connect((state) => ({
  data: state.data
}))(Table);
