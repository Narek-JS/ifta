import { useEffect, useState, Fragment } from 'react';
import First  from "./steps/First" ;
import Second from "./steps/Second";
import Third  from "./steps/Third" ;
import Fourth from "./steps/Fourth";

const ChangePassword = ({ onPrimaryDetails, accountDetails }) => {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    // Function to update the current step and store it in local storage.
    const onChangeStep = (nth) => {
        setStep(nth);
        const encode = btoa(nth);
        localStorage.setItem('st-pass', encode);
    };

    // Effect to retrieve the current step from local storage on component mount.
    useEffect(() => {
        const decode = localStorage.getItem('st-pass') ? atob(localStorage.getItem('st-pass')) : null;
        if (decode && decode > 0) {
            setStep(decode);
        };
    }, []);

    // Function to handle click event for navigating between steps.
    const onClick = () => {
        onChangeStep(step === 4 ? 2 : step - 1);
        if (onPrimaryDetails && step === 1) {
            onPrimaryDetails();
        };
    };

    return (
        <Fragment>
            {/* Render First step component if step is 1 */}
            {step == 1 && (
                <First
                    loading={loading}
                    setLoading={setLoading}
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                />
            )}

            {/* Render Second step component if step is 2 */}
            {step == 2 && (
                <Second
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    accountDetails={accountDetails}
                    setCategory={setCategory}
                />
            )}

            {/* Render Third step component if step is 3 */}
            {step == 3 && (
                <Third
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    category={category}
                />
            )}

            {/* Render Fourth step component if step is 4 */}
            {step == 4 && (
                <Fourth
                    loading={loading}
                    setLoading={setLoading}
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                />
            )}
        </Fragment>
    );
};

export default ChangePassword;