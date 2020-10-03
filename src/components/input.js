import React from 'react';
import { useState } from 'react';

import './input.css';

export default ({
  value = '',
  icon = '',
  onChange = () => null,
  className = '',
  disabled = false,
  tooltip = '',
  ...props
}) => {
  const [focus, setFocus] = useState(false);
  const lettersOnly = (event) =>
    onChange(event.target.value.replace(/[^A-Za-z]/g, '').toLowerCase());

  return (
    <div
      className={'input ' + className}
      data-disabled={disabled}
      data-focused={focus}
    >
      <input
        className='input_box'
        {...props}
        disabled={disabled}
        value={value}
        onChange={lettersOnly}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        title={tooltip}
        aria-label={tooltip}
      />
      {icon && <i className={icon + ' input_icon'} data-show={!focus} />}
    </div>
  );
};
