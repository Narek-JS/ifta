import { useEffect, useState, Fragment } from 'react';
import Second from "@/components/profile/phoneNumbers/steps/Second";
import First from "@/components/profile/phoneNumbers/steps/First";
import Third from "@/components/profile/phoneNumbers/steps/Third";

const PhoneNumbers = ({ phoneNumber, onPrimaryDetails, withoutPass }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [changingPhone, setChangingPhone] = useState('');

    // Effect hook to decode and set step from localStorage.
    useEffect(() => {
        const decode = localStorage.getItem('st-phone') ? atob(localStorage.getItem('st-phone')) : null;
        if (decode && decode > 0) {
            setStep(decode);
        };
    }, []);

    // Function to change step and encode it in localStorage.
    const onChangeStep = (nth) => {
        setStep(nth);
        const encode = btoa(nth);
        localStorage.setItem('st-phone', encode);
    };

    // Function to handle click event and update step.
    const onClick = () => {
        onChangeStep(step === 3 ? 2 : step - 1);
        if (onPrimaryDetails && step === 1) {
            onPrimaryDetails();
        };
    };

    // Render different steps based on the withoutPass prop.
    if(withoutPass) {
        return (
            <Fragment>
                {step !== 3 && (
                    <Second
                        withoutPass={withoutPass}
                        loading={loading}
                        setLoading={setLoading}
                        step={step}
                        onClick={onPrimaryDetails}
                        setStep={onChangeStep}
                        setChangingPhone={setChangingPhone}
                    />
                )}
                {/* Render Third step if step is 3 */}
                {step === 3 && (
                    <Third
                        step={step}
                        onClick={onClick}
                        setStep={onChangeStep}
                        changingPhone={changingPhone}
                    />
                )}
            </Fragment>
        );
    };

    // Render different steps based on the step state
    return (
        <Fragment>
            {/* Render First step if step is 1 */}
            {step == 1 && (
                <First
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    phoneNumber={phoneNumber}
                />
            )}

            {/* Render Second step if step is 2 */}
            {step == 2 && (
                <Second
                    withoutPass={withoutPass}
                    loading={loading}
                    setLoading={setLoading}
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    setChangingPhone={setChangingPhone}
                />
            )}

            {/* Render Third step if step is 3 */}
            {step == 3 && (
                <Third
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    changingPhone={changingPhone}
                />
            )}
        </Fragment>
    );
};

export default PhoneNumbers;