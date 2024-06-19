import { getUser, resendEmailVerify, userLogin } from "@/store/slices/auth";
import { BoldArrowIcon } from "@/public/assets/svgIcons/BoldArrowIcon";
import { transformErrors } from "@/utils/helpers";
import { setPopUp } from "@/store/slices/common";
import { loginSchema } from "@/utils/schemas";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useState } from "react";
import InputField from "../universalUI/InputField";
import NormalBtn from "../universalUI/NormalBtn";
import GoogleLogin from "../auth/GoogleLogin";
import Link from "next/link";

const QuarterlyRegisterForm = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            remember_me: false
        },
        onSubmit: async (values) => {
            setIsLoading(true);
            const { payload: registrationResponse } = await dispatch(userLogin({ ...values, is_quarterly: '1' }));

            if(registrationResponse?.action) {
                successRegistration();  
            } else {
                handleRegistrationError(registrationResponse?.result);
            };
            setIsLoading(false);
        },
        validationSchema: loginSchema
    });

    function successRegistration() {
        dispatch(getUser());

        if(formik.values.remember_me) {
            localStorage.setItem("rememberUser", "true");
            localStorage.setItem("bG9naW4=", btoa(formik.values.email));
            localStorage.setItem("cGFzc3dvcmQ=", btoa(formik.values.password));
        } else {
            localStorage.removeItem("bG9naW4=");
            localStorage.removeItem("cGFzc3dvcmQ=");
        };

        localStorage.removeItem("toForm");
        router.push("/quarters");
    };

    function handleRegistrationError(result) {
        if(result?.data) {
            const errors = transformErrors(result?.data);
            formik.setErrors(errors);
        };

        toast.error(result?.message, { position: toast.POSITION.TOP_RIGHT });

        if(result?.data?.verified === false) {
            dispatch(setPopUp({
                popUp: "resend-email",
                popUpAction: () => 
                    dispatch(resendEmailVerify({ email: values.email }))
                        .then((res) => {
                            if(res?.payload?.message) {
                                toast.success(res?.payload?.message);
                            };
                            dispatch(setPopUp({}));
                        })
            }));
        };
    };

    const handleCheckboxChange = () => {
        formik.setValues({
            ...formik.values,
            remember_me: !formik.values.remember_me,
        });
    };

    return (
        <div className="registerForm quarterlyRegisterForm">
            <div className="registerTitle">
                <h3 className="lighthouse-black font20 textCenter">IFTA Quarterly Filling Now</h3>
            </div>
            <form className="flexColumn gap14" onSubmit={formik.handleSubmit}>
                <InputField
                    required={true}
                    name="email"
                    label="Email Address"
                    placeholder="example@domain.com"
                    error={formik.touched.email && formik.errors.email}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <InputField
                    error={formik.touched.password && formik.errors.password}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required={true}
                    id="password"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                />
                <div className="rememberForgot flexBetween">
                    <label className="rememberMe flex alignCenter gap10">
                        <input
                            onChange={handleCheckboxChange}
                            checked={formik.values.remember_me}
                            name="remember_me"
                            type="checkbox"
                        />
                        <span className="white user-select-none">Remember Me</span>
                    </label>
                    <Link href="/forgot-password" className="white underline white-space-nowrap">
                        Forgot password?
                    </Link>
                </div>
                <NormalBtn
                    onClick={formik.handleSubmit}
                    loading={isLoading}
                    type='submit'
                    className="registerBtn normalBtn bg-lighthouse-blackHome"
                >
                    Apply For Quarterly Filling <BoldArrowIcon /> <BoldArrowIcon />
                </NormalBtn>
                <p className="white font12 m-auto line18">
                    By logging in, you agree to our &nbsp;
                    <Link href='/terms-and-conditions' className="white underline font12 nowrap">Terms and Conditions</Link>
                </p>
                <p className="or">OR</p>
                <GoogleLogin name="Continue with Google" />
                <p className="white textCenter flexCenter gap2 font15">
                    Don’t have an account yet?
                    <Link href='/sign-up' className="white underline">Create Now</Link>
                </p>
            </form>
        </div>
    );
};

export { QuarterlyRegisterForm };