import React from 'react';
import {useDispatch} from "react-redux";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import {changePassword} from "@/store/slices/profile";
import InputField from "@/components/universalUI/InputField";
import NormalBtn from "@/components/universalUI/NormalBtn";
import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";
import * as Yup from "yup";

const First = ({ setStep, email, onClick, step,loading, setLoading }) => {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            current_password: '',
            password: '',
            password_confirmation: ''
        },
        onSubmit: (values) => {
            setLoading(true)
            dispatch(changePassword(values))
                .then(res => {
                    setLoading(false)
                    if(res.payload?.action) {
                        toast.success(res.payload.message, {
                            className: 'success-toaster'
                        });
                        formik.resetForm();
                    } else {
                        toast.error(res?.payload?.result?.message)
                    };
                });
        },
        validationSchema: Yup.object({
            current_password: Yup.string().min(6, 'Too short !').required('Current Password is required!'),
            password: Yup.string().min(6, 'Too short !').required('New Password is required!'),
            password_confirmation: Yup.string().required('Please confirm your password').oneOf([Yup.ref('password'), null], 'Passwords do not match')
        })
    })

    return (
        <div className={`nth-box pass-box step${step}`}>
            <div>
                <div onClick={onClick} className="flex go-back backBtn alignCenter gap5 secondary font20 weight700">
                    <BackSvgIcon/>
                    Back
                </div>
                <h1 className='box-title'>{step === 1 ? 'Change Password' : 'Reset Password'}</h1>
            </div>
            <p className='primary'>Create a new password that is at least 8 character long.</p>
            <div className='input-section'>
                <InputField
                    width='full'
                    name='current_password'
                    label='Type your current password'
                    required
                    placeholder='Enter your password'
                    type='password'
                    value={formik.values.current_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.current_password && formik.errors.current_password}
                />
                <InputField
                    width='full'
                    name='password'
                    label='Type your new password'
                    required
                    placeholder='Enter strong password'
                    type='password'
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={formik.touched.password && formik.errors.password}
                />
                <InputField
                    width='full'
                    name='password_confirmation'
                    label='Confirm your new password'
                    required
                    placeholder='Confirm password'
                    type='password'
                    onBlur={formik.handleBlur}
                    value={formik.values.password_confirmation}
                    onChange={formik.handleChange}
                    error={formik.touched.password_confirmation && formik.errors.password_confirmation}
                />
            </div>
            <div className='btn-field mt20'>
                <NormalBtn
                    loading={loading}
                    className='outlined bg-lighthouse-black'
                    type='button'
                    onClick={formik.handleSubmit}
                > Submit </NormalBtn>
                <span className='forgot-pass' onClick={() => setStep(2)}>Forgot current password?</span>
            </div>
        </div>
    );
};

export default First;