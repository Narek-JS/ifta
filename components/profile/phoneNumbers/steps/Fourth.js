import React, { Fragment } from 'react';
import Switch from "@/components/customs/switch";
import Button from "@/components/customs/button";

const Fourth = () => {
    const goToPreviousStep = () => setStep(2);

    return (
        <Fragment>
            <p className='primary'>Phone number you’ve added</p>
            <div className='d-flex justify-between switch-field'>
                <div>
                    <div className='flex-center justify-between'>
                        <p className='primary'>( 999 ) 999 - 9999</p>
                        <Switch label='Off' checked={false} />
                    </div>
                    <p className='primary60 smaller-text'>
                        If selected, you’ll be able to use this number to reset your password
                    </p>
                    <span className='color-s'>Make primary</span>
                </div>
                <div>
                    <div className='flex-center justify-between'>
                        <p className='primary'>( 999 ) 999 - 9999</p>
                        <Switch label='Off' checked={false} />
                    </div>
                    <p className='primary60'>Use for resetting password</p>
                </div>

            </div>
            <div className='d-flex justify-center'>
                <p className='primary60 desc'>
                    Your phone number helps us keep your account secure by adding an
                    additional layer of verification.
                </p>
            </div>

            <div className='btn-field'>
                <Button
                    className='outlined secondary'
                    type='button'
                    onClick={goToPreviousStep}
                >
                    Add phone number
                </Button>
            </div>
        </Fragment>
    );
};

export default Fourth;