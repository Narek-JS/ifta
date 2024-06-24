import { ImageLoader, transformErrors } from "@/utils/helpers";
import { resetPasswordSchema } from "@/utils/schemas";
import { resetPassword } from "@/store/slices/auth";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useState } from "react";
import InputField from "@/components/universalUI/InputField";
import NormalBtn from "@/components/universalUI/NormalBtn";
import Image from "next/image";
import Link from "next/link";

export default function ResetPassword() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            password: "",
            passwordConfirm: ""
        },
        onSubmit: (values) => {
            setLoading(true);
            // Dispatch resetPassword action with password values and token
            dispatch(resetPassword({
                password: values.password,
                password_confirmation: values.passwordConfirm,
                token: router.query?.token
            })).then(res => {
                setLoading(false);

                // If reset password action is successful
                if (res.payload?.action) {
                    toast.success(res.payload?.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    router.push("/sign-in");
                } else {
                    // If reset password action fails
                    if(res.payload?.result?.data?.expired) {
                        return router.push("/forgot-password");
                    };

                    // If there are validation errors
                    if(res.payload?.result?.data) {
                        const errors = transformErrors(res.payload?.result?.data);
                        formik.setErrors(errors);
                    };

                    // Show error toast with message
                    toast.error(res.payload?.result?.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                };
            });
        },
        validationSchema: resetPasswordSchema
    });

    return (
        <div className="authForm loginForm resetPasswordForm">
            <div className="authHeaders flexColumn alignCenter gap20 textCenter">
                <Link href="/" className="logoArea">
                    <Image
                        src="/assets/images/logo3.png"
                        quality={100}
                        width={240}
                        height={80}
                        loader={ImageLoader}
                        alt="logo"
                    />
                </Link>
                <h1 className="primary font24">
                    Forget Your
                    <span className="secondary"> Password </span>
                </h1>
                <p className="primary80">
                    Enter your new password for sign in your profile
                </p>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="inputGroup flexBetween gap25 mb30">
                    <InputField
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        error={formik.touched.password && formik.errors.password}
                        id="password"
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                    />
                    <InputField
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.passwordConfirm}
                        error={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
                        id="passwordConfirm"
                        name="passwordConfirm"
                        label="Password"
                        placeholder="Confirm your password"
                        type="password"
                    />
                </div>
                <div className="flexCenter mb20">
                    <NormalBtn
                        loading={loading}
                        onClick={formik.handleSubmit}
                        className="loginBtn filled white weight700"
                    >
                        Log In
                    </NormalBtn>
                </div>
            </form>
            <div className="authFormEnding flexColumn gap20 alignCenter" />
            <p className="primary60 mt20 textCenter">
                Don’t have an account yet?
                <Link href="/sign-up" className="secondary underline"> Create Now </Link>
            </p>
        </div>
    );
};