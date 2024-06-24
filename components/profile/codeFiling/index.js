import { useEffect, useState } from 'react';

const CodeFiling = ({ code, setCode }) => {
    const [inputValues, setInputValues] = useState(['', '', '', '']);

    // Function to handle change in input values.
    const codeChangeHandler = (event, idx) => {
        let value = event.target.value;
        const element = event.target;

        // Validate input value.
        if (value && !event.target.validity.valid) {
            return;
        };

        // Move focus to next input or blur if input value is entered.
        if (event.target.value) {
            if (event.target.value.length >= 2) {
                value = event.target.value.charAt(0);
            };
            const nextSibling = element.nextElementSibling;
            nextSibling ? nextSibling.focus() : element.blur();
        } else if (idx !== 0) {
            const previousSibling = element.previousSibling;
            previousSibling ? previousSibling.focus() : element.blur();
        };

        // Update input values state.
        const changedValue = [...inputValues];
        changedValue[idx] = value;
        setInputValues(changedValue);

        // Concatenate input values and update code state if all inputs are filled.
        if (changedValue.every((val) => val)) {
            let value = '';
            changedValue.forEach((el) => (value += el));
            setCode(value);
        } else {
            setCode('');
        };
    };

    // Function to handle pasting of code.
    const pasteHandler = (event) => {
        event.preventDefault();
        const pastedData = event.clipboardData.getData('text/plain').trim();

        // Check if pasted data is numeric and update input values and code state.
        if (/^\d+$/.test(pastedData)) {
            setInputValues(pastedData.split(''));
            setCode(pastedData);
        };
    };

    // Reset input values if code is cleared.
    useEffect(() => {
        if (!code && inputValues.every((item) => item)) {
            setInputValues(['', '', '', '']);
        };
    }, [code]);

    return (
        <form className='code-input-section flex gap30 alignCenter w100'>
            {new Array(4).fill().map((_, index) => (
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