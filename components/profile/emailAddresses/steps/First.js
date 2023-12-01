import React from 'react';
import NormalBtn from "@/components/universalUI/NormalBtn";
import Fade from "react-reveal/Fade";
import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";

const First = ({setStep, email,step, onClick}) => {

    return (
        <Fade>
            <div className={`nth-box email-box step${step}`}>
                <div className="w100">
                    <div onClick={onClick} className="flex go-back backBtn alignCenter gap5 secondary font20 weight700">
                        <BackSvgIcon/>
                        Back
                    </div>
                    <h1 className='box-title'>Email Address</h1>
                </div>
                <div className='primary-part'>
                    <p className='primary'>Email you’ve added</p>
                    <div>
                        <p className='primary bold'>Primary email</p>
                        <p className='primary60'>{email ? email : 'info@domain.com'}</p>
                    </div>
                </div>
                <div className='btn-field'>
                    <p className='primary60 desc'>Your email address helps us keep your account secure by adding an
                        additional layer of verification and also send important notifications.</p>
                    <div className="flexCenter">
                        <NormalBtn
                            className='outlined bg-lighthouse-black'
                            type='button'
                            onClick={() => setStep(2)}
                        >
                            Update email address
                        </NormalBtn>
                    </div>
                </div>
            </div>
        </Fade>
    );
};

export default First;