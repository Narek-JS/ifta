import { useState } from "react";
import { useFormik } from "formik";
import { Textarea } from "@mui/joy";
import { toast } from "react-toastify";
import { TextField} from "@mui/material";
import { useDispatch } from "react-redux";
import { commentSchema } from "@/utils/schemas";
import { postComment } from "@/store/slices/auth";
import TextMaskCustom from "@/components/universalUI/PhoneMask";
import NormalBtn from "@/components/universalUI/NormalBtn";

export default function Reply({ id }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            comments: ''
        },
        onSubmit: (values, {resetForm}) => {
            setLoading(true)
            dispatch(postComment({ ...values, id }))
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
                    };
                    setLoading(false);
                });
        },
        validationSchema: commentSchema
    });

    return (
        <div className="post-reply sectionPadding">
            <div>
                <form onSubmit={formik.handleSubmit}>
                    <h1 className="lilac font20 bold900 line24 mb10">Leave a Reply </h1>
                    <div className='inputs flexBetween gap40'>
                        <div className="left">
                            <div className=" inputGroup mb20">
                                <TextField
                                    inputProps={{ maxLength: 50 }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    error={formik.touched.name && formik.errors.name}
                                    helperText={formik.touched.name && formik.errors.name}
                                    id="name"
                                    name="name"
                                    label="Name*"
                                    variant="standard"
                                    autoComplete="off"
                                />
                            </div>
                            <div className=" inputGroup mb20">
                                <TextField
                                    inputProps={{ maxLength: 50 }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    error={formik.touched.email && formik.errors.email}
                                    helperText={formik.touched.email && formik.errors.email}
                                    id="email"
                                    name="email"
                                    label="Email Address *"
                                    variant="standard"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="inputGroup mb20">
                                <TextField
                                    inputProps={{ maxLength: 15 }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phone}
                                    error={formik.touched.phone && formik.errors.phone}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                    InputProps={{
                                        inputComponent: TextMaskCustom
                                    }}
                                    id="phone"
                                    name="phone"
                                    label="Phone Number*"
                                    variant="standard"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="message inputGroup mb20">
                            <span>Your comment here...</span>
                            <Textarea
                                value={formik.values.comments}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.comments && formik.errors.comments}
                                helperText={formik.touched.comments && formik.errors.comments}
                                name="comments"
                                id="comments"
                                placeholder=""
                                minRows={2}
                                maxRows={4}
                                inputProps={{maxLength: 200}}
                            />
                            <p 
                                className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium css-1d1r5q-MuiFormHelperText-root"
                                id="name-helper-text"
                            >
                                {formik.touched.comments && formik.errors.comments}
                            </p>
                        </div>
                    </div>
                    <div className="submitBtn bottom wrap gap20">
                        <NormalBtn
                            loading={loading}
                            onClick={formik.handleSubmit}
                            className="font18 normalBtn contactBtn outlined bg-lighthouse-black weight700 flex gap10"
                        >
                            Post Comment
                        </NormalBtn>
                    </div>
                </form>
            </div>
        </div>
    );
};