import React, { useEffect } from 'react';
import { useWindowSize } from '@/utils/hooks/useWindowSize';
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from '@/store/slices/auth';
import { changePhone } from "@/store/slices/profile";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import classNames from 'classnames';
import PhoneMask from "@/components/universalUI/PhoneMask";
import NormalBtn from "@/components/universalUI/NormalBtn";
import InputField from "@/components/universalUI/InputField";
import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";

import * as Yup from "yup";

const Second = ({
    setStep,
    setChangingPhone,
    step,
    onClick,
    loading,
    setLoading,
    withoutPass
}) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUserData);
    const { width } = useWindowSize();

    const formik = useFormik({
        initialValues: {
            phoneNumber: '',
            ...(!withoutPass && {current_password: ''})
        },
        onSubmit: (values) => {
            setLoading(true);
            dispatch(changePhone(values))
                .then(res => {
                    setLoading(false)
                    if (res.payload?.action) {
                        toast.success(res.payload.message, {
                            className: 'success-toaster'
                        });
                        setChangingPhone(values.phoneNumber);
                        setStep(3);
                    } else {
                        toast.error(res.payload?.result?.message)
                    }
                })
        },
        validationSchema: Yup.object({
            phoneNumber: Yup.string().required('Please enter your phone number').min(14, 'Enter valid phone number'),
            ...(!withoutPass && {current_password: Yup.string().min(6, 'Too short !').required('Password is required!')})
        })
    });

    useEffect(() => {
        if(withoutPass && user?.phone && formik.values?.phoneNumber === '') {
            formik.setValues({ phoneNumber: user?.phone || ''});
        };
    }, [user]);

    return (
        <form
            autoComplete='off'
            className={classNames(`nth-box phone-box step${step}`, {
                'p55': withoutPass
            })}
        >
            <div className="w100">
                { (!withoutPass || Number(width) < 768) &&
                    <div onClick={onClick} className="flex backBtn alignCenter gap5 lighthouse-black font20 weight700">
                        <BackSvgIcon/>
                        Back
                    </div>
                }
                <h1 className='box-title'>Phone Number</h1>
            </div>
            { !withoutPass &&
                <div className='d-flex justify-between w-100'>
                    <div>
                        <p className='primary'>Add a new phone number</p>
                        <p className='primary60 desc'>
                            We’ll send a verification code to this number.
                            You’ll need it for the next step.
                        </p>
                    </div>
                </div>
            }
            <form autoComplete='off' className={classNames('d-flex justify-between w100', {
                'input-section': !withoutPass
            })}>
                { !withoutPass &&
                    <InputField
                        name='current_password'
                        id='current_password'
                        label='Type your current password'
                        required
                        placeholder='Enter your password'
                        type='password'
                        onBlur={formik.handleBlur}
                        value={formik.values.current_password}
                        onChange={formik.handleChange}
                        error={formik.touched.current_password && formik.errors.current_password}
                    />
                }
                <InputField
                    className={classNames("phoneMask", {
                        'widthFull': withoutPass
                    })}
                    label={withoutPass ? 'Add New Phone Number': "New Phone Number"}
                    error={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    element={<PhoneMask
                        type="tel"
                        onBlur={formik.handleBlur}
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter your number"
                        readOnly={true}
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        autoComplete="off"
                    />}
                />

            </form>
            <div className={classNames('btn-field', {
                'alignCenter': withoutPass
            })}>
                <NormalBtn
                    loading={loading}
                    className='outlined bg-lighthouse-black mob-fullWidth'
                    type='button'
                    onClick={formik.handleSubmit}
                >
                    {!withoutPass ? 'Send Code' : 'Save Phone'}
                </NormalBtn>
            </div>
        </form>
    );
};

export default Second;