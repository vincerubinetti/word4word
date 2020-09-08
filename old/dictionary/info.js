import React from 'react';
import { Component } from 'react';

import './info.css';

const googleDefineQuery = 'https://www.google.com/search?q=define%3A+';
const googleDictionaryQuery =
  'https://googledictionaryapi.eu-gb.mybluemix.net/?lang=en&define=';

export class Info extends Component {
  constructor() {
    super();

    this.state = {};
    this.state.definition = [];
  }

  componentDidMount() {
    if (this.props.selectedWord.text)
      this.getDefinition(this.props.selectedWord.text);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.selectedWord.text !== prevProps.selectedWord.text &&
      this.props.selectedWord
    )
      this.getDefinition(this.props.selectedWord.text);
  }

  getDefinition(word) {
    this.setState({ definition: 'looking up definition...' }, () =>
      fetchDefinition(word).then((results) =>
        this.setState({ definition: results })
      )
    );
  }

  render() {
    return (
      <>
        <div className='section section_v section_sm'>
          <div className='dictionary_word semibold'>
            {this.props.selectedWord.text.toUpperCase()}
          </div>
        </div>
        <div className='section section_sm'>
          <div className='dictionary_links'>
            {this.props.selectedWord.links.map((link, index) => (
              <span key={index} className='dictionary_link'>
                {link.text.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
        <div className='section section_sm dictionary_definition'>
          <span>{this.state.definition}</span>
          <a
            href={
              googleDefineQuery + ((this.props.selectedWord || {}).text || '')
            }
          >
            <i className='fas fa-external-link-alt fa-xs'></i>
          </a>
        </div>
      </>
    );
  }
}

async function fetchDefinition(word) {
  try {
    const query = await fetch(googleDictionaryQuery + word);
    if (!query.ok)
      return 'no definition found';

    const json = await query.json();

    const response = json[0];
    const meaning = response.meaning;

    for (const partKey of Object.keys(meaning)) {
      const part = meaning[partKey];
      for (const entryKey of Object.keys(part)) {
        const definition = part[entryKey].definition;
        if (definition)
          return definition;
      }
    }

    return 'no definition found';
  } catch (error) {
    return 'no definition found';
  }
}
