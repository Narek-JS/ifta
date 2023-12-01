import React, { useState } from 'react';

function ExpiryInput({
    delimiter = '/',
    inputRef,
    onFocus,
    onBlur,
    className,
    placeholder,
    onChange,
    name
}) {
  const [value, setValue] = useState('');
  const maxLength = delimiter.length + 4;

  const expriy_format = (event) => {
    const target = event?.target;
    const expdate = target?.value;
    let expDateFormatter =
      expdate.replace(/\//g, "").substring(0, 2) +
      (expdate.length > 2 ? "/" : "") +
      expdate.replace(/\//g, "").substring(2, 4);

    const month = expDateFormatter.slice(0, 2);
    const year = expDateFormatter.slice(3, 5);

    if(isNaN(Number(month) + Number(year))) {
        event.target.value = event.target.value.slice(0, event.target.value.length - 1);
        return;
    };

    if(Number(month[0]) > 1) {
        expDateFormatter = expDateFormatter.replace(expDateFormatter.slice(0, 2), `0${month[0]}`);
    };

    if(Number(year[0]) > 2 || Number(year[0]) === 0) {
        expDateFormatter = expDateFormatter.replace(expDateFormatter.slice(3, 5), ``);
    };

    setValue(expDateFormatter);

    if(event?.target?.value !== undefined) {
        event.target.value = expDateFormatter; 
    };

    if(onChange) {
        onChange(event);
    };
  };

  return (
    <input
        ref={inputRef}
        onFocus={onFocus}
        onBlur={onBlur}
        name={name}
        onChange={expriy_format}
        className={className}
        maxLength={maxLength}
        placeholder={placeholder}
        type="tel"
        autoComplete='cc-exp'
        value={value}
    />
  );
}

export default ExpiryInput;
