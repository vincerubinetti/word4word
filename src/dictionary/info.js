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
    this.state.definitions = [];
  }

  componentDidMount() {
    if (this.props.selectedWord.text)
      this.getDefinitions(this.props.selectedWord.text);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.selectedWord.text !== prevProps.selectedWord.text &&
      this.props.selectedWord
    )
      this.getDefinitions(this.props.selectedWord.text);
  }

  getDefinitions(word) {
    this.setState({ definitions: 'looking up definitions...' }, () =>
      fetchDefinitions(word).then((results) =>
        this.setState({ definitions: results })
      )
    );
  }

  render() {
    let links = [];
    links = this.props.selectedWord.links.map((link, index) => (
      <span key={index} className="link">
        {link.text.toUpperCase()}
      </span>
    ));

    let definitions = this.state.definitions;
    if (Array.isArray(definitions)) {
      definitions = definitions.map((definition, index) => (
        <div key={index} className="dictionary_definition">
          <span>{index + 1}.</span>
          <span>{definition[0]}</span>
          <span>{definition[1]}</span>
        </div>
      ));
    } else
      definitions = <div className="dictionary_definition">{definitions}</div>;

    return (
      <>
        <div className="dictionary_info dictionary_word">
          {this.props.selectedWord.text.toUpperCase()}
          <a
            href={
              googleDefineQuery + ((this.props.selectedWord || {}).text || '')
            }
          >
            <i className="fas fa-external-link-alt fa-xs"></i>
          </a>
        </div>
        <div className="dictionary_info dictionary_links">{links}</div>
        <div className="dictionary_info dictionary_definitions">
          {definitions}
        </div>
      </>
    );
  }
}

async function fetchDefinitions(word) {
  const definitions = [];
  try {
    const query = await fetch(googleDictionaryQuery + word);
    if (!query.ok)
      return 'no definitions found';

    const json = await query.json();
    const response = json[0];
    const meaning = response.meaning;

    for (const partKey of Object.keys(meaning)) {
      const part = meaning[partKey];
      for (const entryKey of Object.keys(part)) {
        const definition = part[entryKey].definition;
        if (partKey && definition)
          definitions.push([partKey, definition]);
      }
    }

    return definitions;
  } catch (error) {
    return 'no definitions found';
  }
}
