import React from 'react';
import { memo } from 'react';
import { useState } from 'react';
import { useContext } from 'react';

import Input from '../components/input';
import Button from '../components/button';
import Wiggle from '../components/wiggle';

import { DataContext } from '../data';

import './dictionary.css';

let listScroll = 0;

export default ({ goToScreen }) => {
  const { regularDictionary, specialDictionary } = useContext(DataContext);

  const [showRegular, setShowRegular] = useState(true);
  const [showSpecial, setShowSpecial] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState({ field: 'word', direction: 'down' });

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
    ' ': (a, b) => b.text.localeCompare(a.text),
    'type down': (b, a) => b.type.localeCompare(a.type),
    'type up': (a, b) => b.type.localeCompare(a.type),
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
  if (showRegular)
    list = list.concat(regularDictionary);
  if (showSpecial)
    list = list.concat(specialDictionary);
  list = list.sort(sortFunc).filter(filterFunc);

  return (
    <>
      <header>
        <div className='flex_row'>
          <Button
            icon='fas fa-arrow-left'
            onClick={() => goToScreen({ name: 'home' })}
            tooltip='Back to home'
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
      <main
        ref={(element) => {
          if (element)
            element.scrollTop = listScroll;
          return element;
        }}
        onScroll={(event) => (listScroll = event.target.scrollTop)}
        className='dictionary_main'
      >
        <List {...{ list, goToScreen }} />
      </main>
      <footer className='dictionary_footer'>
        <Button
          text='regular'
          icon={showRegular ? 'fas fa-check' : ''}
          onClick={() => setShowRegular(!showRegular)}
          tooltip={(showRegular ? 'Hide' : 'Show') + ' regular words'}
        />
        <Button
          text='special'
          icon={showSpecial ? 'fas fa-check' : ''}
          onClick={() => setShowSpecial(!showSpecial)}
          tooltip={(showSpecial ? 'Hide' : 'Show') + ' special words'}
        />
        <Input
          className='dictionary_search'
          icon='fas fa-search'
          maxLength='4'
          value={search}
          onChange={setSearch}
          tooltip='Search for a word'
        />
        <span>
          {list.length} word{list.length > 1 ? 's' : ''}
        </span>
      </footer>
    </>
  );
};

const List = memo(
  ({ list, goToScreen }) =>
    list.map((word, index) => (
      <DictionaryRow key={index} {...{ word, goToScreen }}>
        {word.text}
      </DictionaryRow>
    )),
  (prev, next) => listCode(prev.list) === listCode(next.list)
);
const listCode = (list) => JSON.stringify(list.map((word) => word.text));

const DictionaryRow = ({ word, goToScreen }) => {
  return (
    <Button
      className='dictionary_row'
      onClick={() => goToScreen({ name: 'definition', word })}
      tooltip='Back to home'
    >
      <div>
        {word.type === 'regular' && <i className='fas fa-paragraph'></i>}
        {word.type === 'special' && <i className='fas fa-star'></i>}
      </div>
      <div>{word.text}</div>
      <div>{word.links.length}</div>
    </Button>
  );
};
