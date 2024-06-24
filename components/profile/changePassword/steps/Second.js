import { ProfilePhoneIcon } from '@/public/assets/svgIcons/ProfilePhoneIcon';
import { sendVerificationCode } from "@/store/slices/profile";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState } from 'react';

import EmailSvgIcon from "@/public/assets/svgIcons/EmailSvgIcon";
import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";
import classNames from 'classnames';

const Second = ({ setStep, accountDetails, step, onClick, setCategory }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(null);

    // Function to send verification code.
    const onSendCode = (type) => {
        setLoading(type);

        // Dispatch action to send verification code.
        dispatch(sendVerificationCode(type))
            .then(res => {
                if(res?.payload?.action) {
                    // If verification code is sent successfully, display success message.
                    toast.success(`Please check your ${type} to enter the Code!`, {
                        className: 'success-toaster'
                    });

                    // Move to the next step and set the category (email or phone).
                    setStep(3);
                    setCategory(type);
                } else {
                    // If there's an error, display error message.
                    toast.error(res?.payload?.result?.message);
                };
            }).finally(() => {
                // Set loading state to false after the process is complete.
                setLoading(false);
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
            <div>
                <p className='primary'>Forgot Password</p>
                <p className='primary60 desc'>Select which contact details should we use to reset your password:</p>
                <div className='sms-options'>
                    <div className={classNames({ loading })} onClick={() => onSendCode('phone')}>
                        <div className='flex flexCenter alignCenter gap10 wrapBlock min-250'>
                            <div className='icon'>
                                <ProfilePhoneIcon />
                            </div>
                            <div className='info-block'>
                                <span>via sms:</span>
                                <span>*** *** {accountDetails?.phone?.slice(-4)}</span>
                            </div>
                        </div>
                        {loading === 'phone' && (
                            <div className="flexCenter alignCenter btn-load">
                                <CircularProgress/>
                            </div>
                        )}
                    </div>
                    <div className={classNames({ loading })} onClick={() => onSendCode('email')}>
                        <div className='flex flexCenter alignCenter gap10 wrapBlock min-250'>
                            <div className='icon'>
                                <EmailSvgIcon/>
                            </div>
                            <div className='info-block'>
                                <span>via email:</span>
                                <span>****@{accountDetails?.email.split('@')[1]}</span>
                            </div>
                        </div>
                        {loading === 'email' && (
                            <div className="flexCenter alignCenter btn-load">
                                <CircularProgress/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Second;