import { SubmitArrowIcon } from "@/public/assets/svgIcons/SubmitArrowIcon";
import { ContactUs } from "@/store/slices/auth";
import { contactSchema } from "@/utils/schemas";
import { TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Textarea } from "@mui/joy";
import { useFormik } from "formik";
import { useState } from "react";
import NormalBtn from "@/components/universalUI/NormalBtn";
import TextMaskCustom from "@/components/universalUI/PhoneMask";

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
            // Set loading state to true on form submission.
            setLoading(true);

            // Dispatch ContactUs action with form values.
            dispatch(ContactUs(values))
                .then(res => {
                    if (res?.payload?.action) {
                        // Show success toast notification.
                        toast.success(res.payload?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });

                        // Reset form values.
                        resetForm();
                    } else {
                        // Show error toast notification.
                        toast.error(res.payload?.result?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    };

                    // Set loading state to false after submission
                    setLoading(false);
                });
        },
        validationSchema: contactSchema
    });

    return (
        <div className="contactForm">
            <form onSubmit={formik.handleSubmit} className="flexColumn gap20">
                <div className="contactFormMain flexBetween gap20">
                    <div className="left">
                        <div className="inputGroup mb20">
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
                        <div className="inputGroup mb20">
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
                        <div className="inputGroup mb20">
                            <TextField
                                onBlur={formik.handleBlur}
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                error={formik.touched.phone && !!formik.errors.phone}
                                helperText={formik.touched.phone && formik.errors.phone}
                                InputProps={{inputComponent: TextMaskCustom}}
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
                                minRows={2}
                                maxRows={4}
                            />
                            <p
                                className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium css-1d1r5q-MuiFormHelperText-root"
                                id="name-helper-text"
                            >
                                {formik.touched.message && formik.errors.message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="submitContact flex alignCenter justifyEnd gap15">
                    <NormalBtn loading={loading} onClick={formik.handleSubmit} className="outlined secondary gap10">
                        Submit Now
                        <SubmitArrowIcon />
                    </NormalBtn>
                </div>
            </form>
        </div>
    );
};