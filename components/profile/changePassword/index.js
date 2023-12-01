import React, {useEffect, useState} from 'react';
import First from "./steps/First";
import Second from "./steps/Second";
import Third from "./steps/Third";
import Fourth from "./steps/Fourth";
import Fade from "react-reveal/Fade";

const ChangePassword = ({ onPrimaryDetails, accountDetails }) => {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const onChangeStep = (nth) => {
        setStep(nth);
        const encode = btoa(nth);
        localStorage.setItem('st-pass', encode);
    };

    useEffect(() => {
        const decode = localStorage.getItem('st-pass') ? atob(localStorage.getItem('st-pass')) : null;
        if (decode && decode > 0) {
            setStep(decode);
        };
    }, []);

    const onClick = () => {
        onChangeStep(step === 4 ? 2 : step - 1);
        if (onPrimaryDetails && step === 1) {
            onPrimaryDetails();
        };
    };

    return (
        <>
            {step == 1 && <Fade>
                <First
                    loading={loading}
                    setLoading={setLoading}
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    email={accountDetails?.email}
                />
            </Fade>}
            {step == 2 && <Fade>
                <Second
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    accountDetails={accountDetails}
                    setCategory={setCategory}
                />
            </Fade>}
            {step == 3 && <Fade>
                <Third
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                    category={category}
                />
            </Fade>}
            {step == 4 && <Fade>
                <Fourth
                    loading={loading}
                    setLoading={setLoading}
                    step={step}
                    onClick={onClick}
                    setStep={onChangeStep}
                />
            </Fade>}
        </>
    );
};

export default ChangePassword;