import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import CodeFiling from "@/components/profile/codeFiling";
import NormalBtn from "@/components/universalUI/NormalBtn";
import {checkVerificationCode, verifyPhone} from "@/store/slices/profile";
import Fade from "react-reveal/Fade";
import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";
import {getUser} from "@/store/slices/auth";

const Third = ({setStep, changingPhone, step,onClick}) => {
    const dispatch = useDispatch();
    const [code, setCode] = useState('');

    const onSubmit = () => {
        dispatch(checkVerificationCode({code}))
            .then(res => {
                if (res.payload.action) {
                    dispatch(verifyPhone({phoneNumber: changingPhone, code}))
                        .then(data => {
                            if (data.payload?.action) {
                                dispatch(getUser());
                                toast.success(`The Phone Number has been changed successfully`, {
                                    className: 'success-toaster'
                                })
                                setStep(1)
                            }
                        })
                } else {
                    toast.error(res.payload?.result?.message);
                    setCode('');
                }
            })
    };

    return (
        <Fade>
            <div className={`nth-box phone-box step${step}`}>
                <div className="w100">
                    <div onClick={onClick} className="flex backBtn alignCenter gap5 lighthouse-black font20 weight700">
                        <BackSvgIcon/>
                        Back
                    </div>
                    <h1 className='box-title'>Phone Number</h1>
                </div>
                <div className='d-flex justify-between w-100'>
                    <div className='flexColumn gap20'>
                        <p className='primary60 desc'>The recovery code was sent to your new mobile number. Please enter
                            the
                            code:</p>
                        <p className='primary'>Enter 4 - digit recovery code</p>
                    </div>
                </div>
                <CodeFiling code={code} setCode={setCode}/>
                <div className='btn-field'>
                    <NormalBtn className={`outlined secondary ${code ? '' : 'disableBtn'}`} disabled={!code} type='button' onClick={onSubmit}>Submit
                        new phone number
                    </NormalBtn>
                </div>
            </div>
        </Fade>
    );
};

export default Third;