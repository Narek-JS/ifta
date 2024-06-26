import { checkVerificationCode, verifyPhone } from "@/store/slices/profile";
import { getUser } from "@/store/slices/auth";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState } from 'react';

import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";
import NormalBtn from "@/components/universalUI/NormalBtn";
import CodeFiling from "@/components/profile/codeFiling";
import classNames from "classnames";

const Third = ({ setStep, changingPhone, step, onClick }) => {
    const dispatch = useDispatch();
    const [code, setCode] = useState('');

    // Function to Check the verification code and submit the entered verification code.
    const onSubmit = () => {
        dispatch(checkVerificationCode({ code }))
            .then(res => {
                if(res.payload.action) {
                    // If verification code is correct, verify the new phone number.
                    dispatch(verifyPhone({ phoneNumber: changingPhone, code }))
                        .then(data => {
                            if(data.payload?.action) {
                                // If phone number is verified successfully, update user data and Show success toast.
                                dispatch(getUser());
                                toast.success(`The Phone Number has been changed successfully`, {
                                    className: 'success-toaster'
                                });

                                // Move back to the first step.
                                setStep(1);
                            };
                        });
                } else {
                    // If verification code is incorrect, show error toast and Reset the entered code.
                    toast.error(res.payload?.result?.message);
                    setCode('');
                };
            })
    };

    return (
        <div className={`nth-box phone-box step${step}`}>
            <div className="w100">
                <div onClick={onClick} className="flex backBtn alignCenter gap5 lighthouse-black font20 weight700">
                    <BackSvgIcon />
                    Back
                </div>
                <h1 className='box-title'>Phone Number</h1>
            </div>
            <div className='d-flex justify-between w-100'>
                <div className='flexColumn gap20'>
                    <p className='primary60 desc'>
                        The recovery code was sent to your new mobile number. Please enter the code:
                    </p>
                    <p className='primary'>Enter 4 - digit recovery code</p>
                </div>
            </div>

            <CodeFiling code={code} setCode={setCode} />

            <div className='btn-field'>
                <NormalBtn
                    className={classNames('outlined bg-lighthouse-black', { 'disableBtn': !code })}
                    disabled={!code}
                    type='button'
                    onClick={onSubmit}
                >
                    Submit new phone number
                </NormalBtn>
            </div>
        </div>
    );
};

export default Third;