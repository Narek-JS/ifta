import { useState } from 'react';
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { checkVerificationCode } from "@/store/slices/profile";

import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";
import NormalBtn from "@/components/universalUI/NormalBtn";
import CodeFiling from "@/components/profile/codeFiling";
import classNames from 'classnames';

const Third = ({ setStep, step, onClick, category }) => {
    const dispatch = useDispatch();
    const [code, setCode] = useState('');

    // Function to handle form submission.
    const onSubmit = () => {
        dispatch(checkVerificationCode({code}))
            .then(res => {
                if(res.payload.action) {
                    // If verification code is correct, move to the next step.
                    setStep(4);
                } else {
                    // If verification code is incorrect, display error message.
                    toast.error(res.payload?.result?.message);
                    setCode('');
                };
            });
    };

    return (
        <div className={`nth-box pass-box step${step}`}>
            <div>
                <div onClick={onClick} className="flex backBtn alignCenter gap5 lighthouse-black font20 weight700">
                    <BackSvgIcon/>
                    Back
                </div>
                <h1 className='box-title'>{step === 1 ? 'Change Password' : 'Reset Password'}</h1>
            </div>
            <div className='d-flex justify-between w-100'>
                <div className='flexColumn gap20'>
                    <p className='primary60 desc'>
                        The recovery code was sent to your {category === 'email' ? 'email address' : 'new mobile number'}. Please enter the code:
                    </p>
                    <p className='primary'>Enter 4 - digit recovery code</p>
                </div>
            </div>
            <CodeFiling code={code} setCode={setCode} />
            <div className='btn-field'>
                <NormalBtn
                    className={classNames('bg-lighthouse-black', { disableBtn: !code })}
                    type='button'
                    onClick={onSubmit}
                >
                    Reset password
                </NormalBtn>
            </div>
        </div>
    );
};

export default Third;