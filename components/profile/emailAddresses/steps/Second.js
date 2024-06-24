import { changeEmail } from "@/store/slices/profile";
import { getUser } from "@/store/slices/auth";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";
import InputField from "@/components/universalUI/InputField";
import NormalBtn from "@/components/universalUI/NormalBtn";
import * as Yup from "yup";

const Second = ({ setStep, step, onClick, setLoading }) => {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
            current_password: ''
        },
        onSubmit: (values) => {
            setLoading(true);
            dispatch(changeEmail(values))
                .then(res => {
                    setLoading(false);
                    if (res.payload?.action) {
                        // Dispatch getUser action to update user data and Reset form after successful submission.
                        dispatch(getUser());
                        formik.resetForm();

                        // Display success toast message and Move to the first step.
                        toast.success(res.payload.message, { className: 'success-toaster' });
                        setStep(1);
                    } else {
                        // Display error toast message and set form errors if any.
                        if (res.payload?.result?.data) {
                            formik.setErrors(res.payload?.result?.data);
                        };
                        toast.error(res.payload?.result?.message);
                    };
                });
        },
        validationSchema: Yup.object({
            email: Yup
                .string()
                .email("Please enter a valid email address")
                .required('Please enter email address')
                .test(
                    'email',
                    'Please enter email address',
                    (value) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
                ),
            current_password: Yup
                .string()
                .min(6, 'Too short !')
                .required('Password is required!')
        })
    });

    return (
        <div className={`nth-box email-box step${step}`}>
            <div>
                <div onClick={onClick} className="flex backBtn alignCenter gap5 lighthouse-black font20 weight700">
                    <BackSvgIcon/>
                    Back
                </div>
                <h1 className='box-title'>Email Address</h1>
            </div>
            <div className='d-flex justify-between w-100'>
                <div>
                    <p className='primary'>Add a new email</p>
                    <p className='primary60 desc'>
                        A confirmation will be sent to this account.Click on the
                        confirmation link to verify and add this email.
                    </p>
                </div>
            </div>
            <div className='d-flex justify-between w-100 input-section'>
                <InputField
                    name='email'
                    label='New Email Address '
                    required
                    placeholder='Enter your new email address'
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && formik.errors.email}
                />
                <InputField
                    name='current_password'
                    label='Type your current password'
                    required
                    placeholder='Enter your password'
                    type='password'
                    onBlur={formik.handleBlur}
                    value={formik.values.current_password}
                    onChange={formik.handleChange}
                    error={formik.touched.current_password && formik.errors.current_password}
                />
            </div>
            <div className='btn-field'>
                <NormalBtn
                    className='outlined bg-lighthouse-black'
                    type='button'
                    onClick={formik.handleSubmit}
                >
                    Submit
                </NormalBtn>
            </div>
        </div>
    );
};

export default Second;