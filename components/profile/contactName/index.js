import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { changeContactName } from "@/store/slices/profile";
import { getUser, selectUserData } from "@/store/slices/auth";

import NormalBtn from "@/components/universalUI/NormalBtn";
import InputField from "@/components/universalUI/InputField";
import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";
import * as Yup from "yup";

const ContactName = ({ onPrimaryDetails }) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUserData);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: { name: '' },
        onSubmit: (values) => {
            setLoading(true);
            dispatch(changeContactName(values))
                .then(res => {
                    if (res.payload?.action) {
                        // Reset form after successful submission and Dispatch getUser action to update user data.
                        formik.resetForm();
                        dispatch(getUser());

                        // Display success toast message.
                        toast.success(res.payload?.message, { className: 'success-toaster' });
                        dispatch(getUser());
                    } else {
                        // Display error toast message and set form errors if any.
                        toast.error(res.payload?.result?.message);
                        formik.setErrors(res.payload?.result?.data);
                    };
                    setLoading(false);
                });
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .matches(/[^\s*].*[^\s*]/g, 'Name is required.')
                .required('Name is required.')
                .matches(/^[A-Za-z0-9\s]+$/, 'Enter an existing Name')
        })
    });

    // useEffect hook to set initial values when user data changes.
    useEffect(() => {
        if(user?.name && formik.values?.name === '') {
            formik.setValues({ name: user?.name || '' });
        };
    }, [user]);

    // Function to go back to the previous step.
    const goBack = () => onPrimaryDetails && onPrimaryDetails();

    return (
        <form className='nth-box contact-box step1' onSubmit={formik.handleSubmit}>
            <div>
                <div className='flex-center go-back' onClick={goBack}>
                    <div className="flex backBtn alignCenter gap5 lighthouse-black font20 weight700">
                        <BackSvgIcon/>
                        Back
                    </div>
                </div>
                <h1 className='box-title'>Contact Name</h1>
            </div>

            <InputField
                label='Contact Name'
                required
                placeholder='Enter full name'
                name='name'
                id="name"
                value={formik.values?.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched?.name && formik.errors?.name}
                width='full'
            />
            <div className='btn-field'>
                <NormalBtn
                    loading={loading}
                    onClick={formik.handleSubmit}
                    className='outlined bg-lighthouse-black'
                    type='submit'
                >
                    Save Name
                </NormalBtn>
            </div>
        </form>
    );
};

export default ContactName;