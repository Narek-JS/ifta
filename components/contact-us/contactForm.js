import { useFormik } from "formik";
import { contactSchema } from "@/utils/schemas";
import { TextField } from "@mui/material";
import { Textarea } from "@mui/joy";
import { useDispatch } from "react-redux";
import { ContactUs } from "@/store/slices/auth";
import { toast } from "react-toastify";
import { useState } from "react";
import TextMaskCustom from "@/components/universalUI/PhoneMask";
import Fade from "react-reveal/Fade";
import NormalBtn from "@/components/universalUI/NormalBtn";

export default function ContactForm() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        },
        onSubmit: (values, { resetForm }) => {
            setLoading(true)
            dispatch(ContactUs(values))
                .then(res => {
                    if (res?.payload?.action) {
                        toast.success(res.payload?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        resetForm();
                    } else {
                        toast.error(res.payload?.result?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                    setLoading(false)
                })
        },
        validationSchema: contactSchema
    });

    const invalid = Object.keys(formik.touched).some(key => formik.touched[key] && formik.errors[key]);

    return (
        <Fade right>
            <div className="contactForm">
                <form onSubmit={formik.handleSubmit} className="flexColumn gap20">
                    <div className="contactFormMain flexBetween gap20">
                        <div className="left">
                            <div className=" inputGroup mb20">
                                <TextField
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    error={formik.touched.name && formik.errors.name}
                                    helperText={formik.touched.name && formik.errors.name}
                                    id="name"
                                    name="name"
                                    label="Name"
                                    variant="standard"
                                    autoComplete="off"
                                />
                            </div>
                            <div className=" inputGroup mb20">
                                <TextField
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    error={formik.touched.email && formik.errors.email}
                                    helperText={formik.touched.email && formik.errors.email}
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    variant="standard"
                                    autoComplete="off"
                                />
                            </div>
                            <div className=" inputGroup mb20">
                                <TextField
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    error={formik.touched.phone && !!formik.errors.phone}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                    InputProps={{
                                        inputComponent: TextMaskCustom
                                    }}
                                    id="phone"
                                    name="phone"
                                    label="Phone Number"
                                    variant="standard"
                                />
                            </div>
                        </div>
                        <div className="right">
                            <div className="inputGroup mb20">
                                <TextField
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.subject}
                                    error={formik.touched.subject && formik.errors.subject}
                                    helperText={formik.touched.subject && formik.errors.subject}
                                    id="subject"
                                    name="subject"
                                    label="Subject"
                                    variant="standard"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="message inputGroup mb20">
                                <span>Your Message</span>
                                <Textarea
                                    value={formik.values.message}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.message && formik.errors.message}
                                    helperText={formik.touched.message && formik.errors.message}
                                    name="message"
                                    id="message"
                                    placeholder=""
                                    minRows={2}
                                    maxRows={4}
                                />
                                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium css-1d1r5q-MuiFormHelperText-root"
                                   id="name-helper-text">{formik.touched.message && formik.errors.message}</p>
                            </div>
                        </div>
                    </div>
                    <div className="submitContact flex alignCenter justifyEnd gap15">
                        <NormalBtn loading={loading} onClick={formik.handleSubmit} className="outlined secondary gap10">
                            Submit Now
                            <svg
                                width="24"
                                height="16"
                                viewBox="0 0 24 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M23.7071 8.7071C24.0976 8.31658 24.0976 7.68342 23.7071 7.29289L17.3431 0.928931C16.9526 0.538406 16.3195 0.538406 15.9289 0.928931C15.5384 1.31946 15.5384 1.95262 15.9289 2.34314L21.5858 8L15.9289 13.6569C15.5384 14.0474 15.5384 14.6805 15.9289 15.0711C16.3195 15.4616 16.9526 15.4616 17.3431 15.0711L23.7071 8.7071ZM8.74228e-08 9L23 9L23 7L-8.74228e-08 7L8.74228e-08 9Z"
                                    fill="#000"
                                />
                            </svg>
                        </NormalBtn>
                        {!formik.isValid && invalid && <p className="primary60 font14">
                            One or more fields have an error. Please check and try again.
                        </p>}
                    </div>
                </form>
            </div>
        </Fade>
    );
};