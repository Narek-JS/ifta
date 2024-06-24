import { Fragment, useEffect, useState } from 'react';
import First from './steps/First';
import Second from './steps/Second';

const EmailAddresses = ({ onPrimaryDetails, email }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Effect to initialize step from local storage.
    useEffect(() => {
        // Decode step from local storage.
        const decode = localStorage.getItem('st-email') ? atob(localStorage.getItem('st-email')) : null;

        // Set step if decoded value exists
        if (decode && decode > 0) {
            setStep(decode);
        };
    }, []);

    // Function to change step and update local storage.
    const onChangeStep = (nth) => {
        setStep(nth);

        // Encode and store step in local storage.
        const encode = btoa(nth);
        localStorage.setItem('st-email', encode);
    };

    // Function to handle click event.
    const onClick = () => {
        onChangeStep(step === 3 ? 2 : step - 1);

        // Call onPrimaryDetails function if provided and step is 1.
        if (onPrimaryDetails && step === 1) {
            onPrimaryDetails();
        };
    };

    return (
        <Fragment>
            {/* Render First component if step is 1 */}
            {step == 1 && (
                <First
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    email={email}
                />
            )}

            {/* Render Second component if step is 2 */}
            {step == 2 && (
                <Second
                    step={step}
                    onClick={onClick}
                    loading={loading}
                    setLoading={setLoading}
                    setStep={onChangeStep}
                />
            )}
        </Fragment>
    );
};

export default EmailAddresses;