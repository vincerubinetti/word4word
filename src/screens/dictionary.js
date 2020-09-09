import React from 'react';
import { memo } from 'react';
import { useState } from 'react';
import { useContext } from 'react';

import Home from './home';
import Definition from './definition';
import Input from '../components/input';
import Button from '../components/button';
import Wiggle from '../components/wiggle';

import { DataContext } from '../data';

import './dictionary.css';

export default ({ setScreen }) => {
  const { standardDictionary, specialDictionary } = useContext(DataContext);

  const [showStandard, setShowStandard] = useState(true);
  const [showSpecial, setShowSpecial] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState({ field: 'type', direction: 'down' });

  const SortButton = ({ field, name }) => (
    <Button
      text={name}
      icon={sortBy.field === field ? 'fas fa-arrow-' + sortBy.direction : ''}
      flip={true}
      onClick={() => {
        if (sortBy.field !== field)
          setSortBy({ field, direction: 'down' });
        else {
          if (sortBy.direction === 'down')
            setSortBy({ field, direction: 'up' });
          else
            setSortBy({});
        }
      }}
    />
  );

  const sortFuncs = {
    ' ': (a, b) => b.type.localeCompare(a.type),
    'type down': (a, b) => b.type.localeCompare(a.type),
    'type up': (b, a) => b.type.localeCompare(a.type),
    'word down': (b, a) => b.text.localeCompare(a.text),
    'word up': (a, b) => b.text.localeCompare(a.text),
    'links down': (a, b) => b.links.length - a.links.length,
    'links up': (b, a) => b.links.length - a.links.length
  };
  const { field = '', direction = '' } = sortBy;
  const sortFunc = sortFuncs[field + ' ' + direction] || sortFuncs[' '];

  const filterFunc = (word) =>
    word.text.toLowerCase().includes(search.toLowerCase());

  let list = [];
  if (showStandard)
    list = list.concat(standardDictionary);
  if (showSpecial)
    list = list.concat(specialDictionary);
  list = list.sort(sortFunc).filter(filterFunc);

  return (
    <>
      <header>
        <div className='flex_row'>
          <Button
            icon='fas fa-arrow-left'
            onClick={() => setScreen(<Home />)}
          />
          <h2 className='wiggle_hitbox' data-wiggle>
            <Wiggle text='Dictionary' />
          </h2>
        </div>
        <div className='flex_row dictionary_header'>
          <div className='dictionary_row'>
            <SortButton field='type' name='Type' />
            <SortButton field='word' name='Word' />
            <SortButton field='links' name='Links' />
          </div>
        </div>
      </header>
      <main className='dictionary_main'>
        <List {...{ list, setScreen }} />
      </main>
      <footer className='dictionary_footer'>
        <Button
          text='standard'
          icon={showStandard ? 'fas fa-check' : ''}
          onClick={() => setShowStandard(!showStandard)}
        />
        <Button
          text='special'
          icon={showSpecial ? 'fas fa-check' : ''}
          onClick={() => setShowSpecial(!showSpecial)}
        />
        <Input
          className='dictionary_search'
          icon='fas fa-search'
          maxLength='4'
          value={search}
          onChange={setSearch}
        />
        <span>
          {list.length} word{list.length > 1 ? 's' : ''}
        </span>
      </footer>
    </>
  );
};

const List = memo(
  ({ list, setScreen }) =>
    list.map((word, index) => (
      <DictionaryRow key={index} {...{ word, setScreen }}>
        {word.text}
      </DictionaryRow>
    )),
  (prev, next) => listCode(prev.list) === listCode(next.list)
);
const listCode = (list) => JSON.stringify(list.map((word) => word.text));

const DictionaryRow = ({ word, setScreen }) => {
  return (
    <Button
      className='dictionary_row'
      onClick={() => setScreen(<Definition {...{ word }} />)}
    >
      <div>
        {word.type === 'standard' && <i className='fas fa-paragraph'></i>}
        {word.type === 'special' && <i className='fas fa-asterisk'></i>}
      </div>
      <div>{word.text}</div>
      <div>{word.links.length}</div>
    </Button>
  );
};
