import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import Dictionary from './dictionary';
import Button from '../components/button';
import Wiggle from '../components/wiggle';

import { ReactComponent as Loading } from '../loading.svg';

import './definition.css';

export default ({ word, setScreen }) => {
  const [definitions, setDefinitions] = useState('loading');
  const [audio, setAudio] = useState('');

  useEffect(() => {
    (async () => {
      const { definitions, audio } = await loadDefinitions(word.text);
      setDefinitions(definitions);
      setAudio(audio);
    })();
  }, [word.text]);

  return (
    <>
      <header>
        <div className='flex_row'>
          <Button
            icon='fas fa-arrow-left'
            onClick={() => setScreen(<Dictionary />)}
          />
          <h2 className='wiggle_hitbox' data-wiggle>
            <Wiggle text={word.text.toUpperCase()} />
          </h2>
          {audio && (
            <>
              <audio src={audio} />
              <Button
                icon='fas fa-volume-up'
                onClick={() => document.querySelector('audio').play()}
              />
            </>
          )}
        </div>
      </header>
      <main>
        <h3>Type</h3>
        {word.type === 'standard' && (
          <p>
            <i className='fas fa-paragraph icon'></i>
            <span>Standard</span>
          </p>
        )}
        {word.type === 'special' && (
          <p>
            <i className='fas fa-asterisk icon'></i>
            <span>Special</span>
          </p>
        )}
        <h3>Linked Words</h3>
        <p>{word.links.map((link) => link.text).join(', ') || 'no words'}</p>
        <h3>Definition</h3>
        {definitions === 'loading' && (
          <p>
            <Loading width='30px' />
          </p>
        )}
        {definitions === 'lookup' && (
          <p>
            <a href={googleDefine + word.text}>Lookup definition on Google</a>
          </p>
        )}
        {Array.isArray(definitions) &&
          definitions.map((definition, index) => (
            <p key={index} className='definition'>
              <b>{index + 1}</b>: <i>{definition.part}</i> &mdash;{' '}
              {definition.description}
            </p>
          ))}
      </main>
    </>
  );
};

const googleDefine = 'https://www.google.com/search?q=define%3A+';
const googleDictionary = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const loadDefinitions = async (word) => {
  let definitions = [];
  let audio = '';
  try {
    const results = await (await fetch(googleDictionary + word)).json();
    if (!Array.isArray(results))
      throw new Error();

    definitions = (results[0]?.meanings || [])
      .map((meaning) =>
        (meaning?.definitions || []).map((definition) => ({
          description: definition?.definition,
          part: meaning?.partOfSpeech
        })))
      .flat();
    audio = results[0]?.phonetics[0]?.audio;

    if (!definitions.length)
      throw new Error();

    return { definitions, audio };
  } catch (error) {
    return { definitions: 'lookup', audio };
  }
};
