import React from 'react';
import { useState } from 'react';

import './input.css';

export default ({
  value = '',
  icon = '',
  onChange = () => null,
  className = '',
  ...props
}) => {
  const [focus, setFocus] = useState(false);
  const lettersOnly = (event) =>
    onChange(event.target.value.replace(/[^A-Za-z]/g, '').toLowerCase());

  return (
    <div className='input' data-focused={focus}>
      <input
        className={'input_box ' + className}
        {...props}
        value={value}
        onChange={lettersOnly}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      {icon && <i className={icon + ' input_icon'} data-show={!focus} />}
    </div>
  );
};
