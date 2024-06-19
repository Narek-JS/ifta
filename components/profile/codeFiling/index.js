import React, { useEffect, useState } from 'react';

const CodeFiling = ({ code, setCode }) => {
    const [inputValues, setInputValues] = useState(['', '', '', '']);

    const codeChangeHandler = (event, idx) => {
        let value = event.target.value;
        const element = event.target;

        if (value && !event.target.validity.valid) {
            return;
        };

        if (event.target.value) {
            if (event.target.value.length >= 2) {
                value = event.target.value.charAt(0);
            }
            const nextSibling = element.nextElementSibling;
            nextSibling ? nextSibling.focus() : element.blur();
        } else if (idx !== 0) {
            const previousSibling = element.previousSibling;
            previousSibling ? previousSibling.focus() : element.blur();
        };

        const changedValue = [...inputValues];
        changedValue[idx] = value;
        setInputValues(changedValue);
        if (changedValue.every((val) => val)) {
            let value = '';
            changedValue.forEach((el) => (value += el));
            setCode(value);
        } else {
            setCode('');
        };
    };

    const pasteHandler = (event) => {
        event.preventDefault();
        const pastedData = event.clipboardData.getData('text/plain').trim();
        if (/^\d+$/.test(pastedData)) {
            setInputValues(pastedData.split(''));
            setCode(pastedData);
        };
    };

    useEffect(() => {
        if (!code && inputValues.every((item) => item)) {
            setInputValues(['', '', '', '']);
        };
    }, [code]);

    return (
        <form className='code-input-section flex gap30 alignCenter w100'>
            {[1, 2, 3, 4].map((item, index) => (
                <input
                    name={`code-${index}`}
                    type='tel'
                    pattern="[0-9]"
                    key={index}
                    onChange={(event) => codeChangeHandler(event, index)}
                    onPaste={pasteHandler}
                    required
                    value={inputValues[index]}
                    maxLength={1}
                    max={1}
                    autoComplete="off"
                />
            ))}
        </form>
    );
};

export default CodeFiling;