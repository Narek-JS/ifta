import React, { Fragment, useEffect, useState } from 'react';
import First from './steps/First';
import Second from './steps/Second';

const EmailAddresses = ({ onPrimaryDetails, email }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const decode = localStorage.getItem('st-email') ? atob(localStorage.getItem('st-email')) : null;
        if (decode && decode > 0) {
            setStep(decode);
        };
    }, []);

    const onChangeStep = (nth) => {
        setStep(nth);
        const encode = btoa(nth);
        localStorage.setItem('st-email', encode);
    };

    const onClick = () => {
        onChangeStep(step === 3 ? 2 : step - 1);
        if (onPrimaryDetails && step === 1) {
            onPrimaryDetails();
        };
    };

    return (
        <Fragment>
            {step == 1 &&
                <First
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    email={email}
                />
            }
            {step == 2 &&
                <Second
                    step={step}
                    onClick={onClick}
                    loading={loading}
                    setLoading={setLoading}
                    setStep={onChangeStep}
                />
            }
        </Fragment>
    );
};

export default EmailAddresses;