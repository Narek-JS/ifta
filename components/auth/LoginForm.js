import { getUser, resendEmailVerify, userLogin } from "@/store/slices/auth";
import { setPopUp } from "@/store/slices/common";
import { ImageLoader } from "@/utils/helpers";
import { loginSchema } from "@/utils/schemas";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import InputField from "@/components/universalUI/InputField";
import NormalBtn from "@/components/universalUI/NormalBtn";
import GoogleLogin from "@/components/auth/GoogleLogin";

export default function LoginForm() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        onSubmit: (values) => {
            setLoading(true)
            dispatch(userLogin({
                ...values,
                remember_me: remember
            })).then(res => {
                setLoading(false);
                if (res.payload?.action) {
                    localStorage.setItem("rememberUser", remember ? "true" : "");
                    dispatch(getUser());
                    router.push("/form/carrier-info");
                    localStorage.removeItem("toForm");
                    if(remember) {
                        localStorage.setItem("bG9naW4=", btoa(values.email));
                        localStorage.setItem("cGFzc3dvcmQ=", btoa(values.password));
                    } else{
                        localStorage.removeItem("bG9naW4=");
                        localStorage.removeItem("cGFzc3dvcmQ=");
                    };
                } else {
                    const data = res.payload?.result?.data;
                    let errors = {};
                    if (data) {
                        Object.keys(data).forEach((key, i) => {
                            errors[key] = typeof data[key] === "string" ? data[key] : data[key]?.[0];
                        });
                    };
                    formik.setErrors(errors);
                    toast.error(res.payload?.result?.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });

                    if(res.payload?.result?.data?.verified === false) {
                        dispatch(setPopUp({ popUp: "resend-email", popUpAction: () => {
                            return dispatch(resendEmailVerify({
                                email: values.email
                            })).then((res) => {
                                if(res?.payload?.message) {
                                    toast.success(res?.payload?.message);
                                };
                                dispatch(setPopUp({}));
                            });
                        }}));
                    };
                };
            });
        },
        validationSchema: loginSchema
    });

    useEffect(() => {
        const rememberFromStorage = localStorage.getItem("rememberUser")
        setRemember(!!rememberFromStorage);
        if(rememberFromStorage){
            formik.setValues({
                email: atob(localStorage.getItem("bG9naW4=") || ""),
                password:atob(localStorage.getItem("cGFzc3dvcmQ=") || "")
            })
        }
    }, []);

    useEffect(() => {
        if (router?.query?.message) {
            router.replace(router.pathname);
            if(router?.query?.expired) {
                toast.error(router.query.message);
                dispatch(setPopUp({
                    popUp: "expiredVerify",
                    popUpContent: {
                        title: 'Your verification time was expired.',
                        email: router?.query?.email
                    },
                    popUpAction: () => {
                        return dispatch(resendEmailVerify({
                            email: router?.query?.email
                        })).then((res) => {
                            if(res?.payload?.message) {
                                toast.success(res?.payload?.message);
                            };
                            dispatch(setPopUp({}));
                        });
                    }
                }));
            } else {
                toast.success(router.query.message);
            };
        };
    }, [router]);

    return (
        <div className="authForm loginForm">
            <div className="authHeaders flexColumn alignCenter gap20 textCenter">
                <Link href="/" className="logoArea">
                    <Image src="/assets/images/logo3.png" quality={100} width={240} height={80} loader={ImageLoader}
                           alt="logo"/>
                </Link>
                <h1 className="primary font24">
                    <span className="secondary">Sign In </span>
                    To Your Account
                </h1>
                <p className="primary80 line24 font16">Our team has helped truckers from all over the country sign in
                    for the
                    IFTA for over a decade. We’ll
                    make your experience filing for the IFTA simple and straightforward!
                </p>
            </div>
            <form autoComplete={remember ? "on" : "off"} onSubmit={formik.handleSubmit}>
                <div className="inputGroup flexBetween gap25 mb20">
                    <InputField
                        autoComplete={remember ? "on" : "off"}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        error={formik.touched.email && formik.errors.email}
                        required={true}
                        id="email"
                        name="email"
                        label="Email address"
                        placeholder="Enter email address"
                    />
                    <InputField
                        autoComplete={remember ? "on" : "off"}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        error={formik.touched.password && formik.errors.password}
                        required={true}
                        id="password"
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                    />
                </div>
                <div className="rememberForgot flexBetween mb20">
                    <label className="rememberMe flex alignCenter gap10">
                        <input onChange={() => setRemember(!remember)} type="checkbox" checked={remember}/>
                        <span className="primary60">Remember Me</span>
                    </label>
                    <Link href="/forgot-password" className="lighthouse-black underline white-space-nowrap">
                        Forgot password?
                    </Link>
                </div>
                <div className="flexCenter mb20">
                    <NormalBtn loading={loading} onClick={formik.handleSubmit}
                               className="loginBtn filled white weight700">
                        Log In
                    </NormalBtn>
                </div>
            </form>
            <div className="authFormEnding flexColumn gap20 alignCenter pb20">
                <span className="primary60 terms">
                    By logging in, you agree to our
                    <span className="lighthouse-black underline pointer" onClick={() => {
                        dispatch(setPopUp({
                            popUp: 'termsPopup',
                        }));
                    }}> Terms and Conditions. </span>
                </span>
                <div className='orPart'>
                    <hr/>
                    <span className='font16 primary60'>OR</span>
                    <hr/>
                </div>
                <GoogleLogin name="Continue with Google"/>
            </div>
            <p className="primary60 mt20 textCenter">
                Don’t have an account yet?<Link href="/sign-up" className="lighthouse-black underline white-space-nowrap"> Create Now </Link>
            </p>
        </div>
    )
}