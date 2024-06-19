import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import Second from "@/components/profile/phoneNumbers/steps/Second";
import First from "@/components/profile/phoneNumbers/steps/First";
import Third from "@/components/profile/phoneNumbers/steps/Third";

const PhoneNumbers = ({ phoneNumber, onPrimaryDetails, withoutPass }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [changingPhone, setChangingPhone] = useState('');

    useEffect(() => {
        const decode = localStorage.getItem('st-phone') ? atob(localStorage.getItem('st-phone')) : null;
        if (decode && decode > 0) {
            setStep(decode);
        };
    }, []);

    const onChangeStep = (nth) => {
        setStep(nth);
        const encode = btoa(nth);
        localStorage.setItem('st-phone', encode);
    };

    const onClick = () => {
        onChangeStep(step === 3 ? 2 : step - 1);
        if (onPrimaryDetails && step === 1) {
            onPrimaryDetails();
        };
    };

    if(withoutPass) {
        return (
            <Fragment>
                {step !== 3 &&
                    <Second
                        withoutPass={withoutPass}
                        loading={loading}
                        setLoading={setLoading}
                        step={step}
                        onClick={onPrimaryDetails}
                        setStep={onChangeStep}
                        setChangingPhone={setChangingPhone}
                    />
                }
                {step === 3 &&
                    <Third
                        step={step}
                        onClick={onClick}
                        setStep={onChangeStep}
                        changingPhone={changingPhone}
                    />
                }
            </Fragment>
        );
    };

    return (
        <Fragment>
            {step == 1 &&
                <First
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    phoneNumber={phoneNumber}
                />
            }
            {step == 2 &&
                <Second
                    withoutPass={withoutPass}
                    loading={loading}
                    setLoading={setLoading}
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    setChangingPhone={setChangingPhone}
                />
            }
            {step == 3 &&
                <Third
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    changingPhone={changingPhone}
                />
            }
        </Fragment>
    );
};

export default PhoneNumbers;