import React from 'react';
import { resetPassword } from "@/store/slices/profile";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";
import InputField from "@/components/universalUI/InputField";
import NormalBtn from "@/components/universalUI/NormalBtn";
import * as Yup from "yup";

const Fourth = ({ setStep, step, onClick, loading, setLoading }) => {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            password: '',
            password_confirmation: ''
        },
        onSubmit: (values) => {
            setLoading(true);
            dispatch(resetPassword(values))
                .then(res => {
                    setLoading(false)
                    if(res.payload?.action) {
                        toast.success(`The password has benn changed successfully!`, {
                            className: 'success-toaster'
                        });
                        setStep(1)
                    } else {
                        toast.error(res.payload?.result?.message);
                    };
                });
        },
        validationSchema: Yup.object({
            password: Yup.string().min(6, 'Too short !').required('Password is required!'),
            password_confirmation: Yup.string().required('Please confirm your password').oneOf([Yup.ref('password'), null], 'Passwords do not match')
        })
    });

    return (
        <div className={`nth-box pass-box step${step}`}>
            <div>
                <div onClick={onClick} className="flex backBtn alignCenter gap5 lighthouse-black font20 weight700">
                    <BackSvgIcon/>
                    Back
                </div>
                <h1 className='box-title'>{step === 1 ? 'Change Password' : 'Reset Password'}</h1>
            </div>
            <p className='primary'>Create a new password that is at least 8 character long.</p>
            <InputField
                name='password'
                label='Type your new password'
                required
                placeholder='Enter strong password'
                type='password'
                onBlur={formik.handleBlur}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && formik.errors.password}
            />
            <InputField
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

            <div className='btn-field'>
                <NormalBtn
                    loading={loading}
                    className='outlined secondary'
                    type='button'
                    onClick={formik.handleSubmit}
                >
                    Submit
                </NormalBtn>
            </div>
        </div>
    );
};

export default Fourth;