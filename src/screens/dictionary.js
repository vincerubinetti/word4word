import React from 'react';
import { useContext } from 'react';

import Button from '../components/button';
import Wiggle from '../components/wiggle';

import { DataContext } from '../data';

import './dictionary.css';

export const Header = ({ setScreen }) => (
  <>
    <Button icon='fas fa-arrow-left' onClick={() => setScreen('home')} />
    <h2 className='wiggle_hitbox' data-wiggle>
      <Wiggle text='Dictionary' />
    </h2>
  </>
);

export const Main = () => {
  const { standardDictionary } = useContext(DataContext);
  return standardDictionary.map((word, index) => (
    <DictionaryRow key={index} {...{ word }} />
  ));
};

const DictionaryRow = ({ word }) => (
  <button className='dictionary_row'>{word.text}</button>
);
