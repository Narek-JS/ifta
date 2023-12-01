import { ImageLoader } from "@/utils/helpers";
import { useFormik } from "formik";
import { signupSchema } from "@/utils/schemas";
import { userRegister } from "@/store/slices/auth";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setPopUp } from "@/store/slices/common";
import InputField from "@/components/universalUI/InputField";
import PhoneMask from "@/components/universalUI/PhoneMask";
import NormalBtn from "@/components/universalUI/NormalBtn";
import GoogleLogin from "@/components/auth/GoogleLogin";
import Link from "next/link";
import Image from "next/image";

export default function RegisterForm() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [ loading, setLoading ] = useState(false);
    
    const formik = useFormik({
        initialValues: {
            name: "",
            last_name: "",
            email: "",
            phone: "",
            password: "",
            passwordConfirm: ""
        },
        onSubmit: (values) => {
            setLoading(true)
            dispatch(userRegister({
                name: values.name,
                last_name: values.last_name,
                email: values.email,
                phone: values.phone,
                password: values.password,
                password_confirmation: values.passwordConfirm
            }))
                .then(res => {
                    setLoading(false)
                    if (res.payload?.action) {
                        dispatch(setPopUp({popUp: "registerSuccess"}))
                        router.push("/");
                    } else {
                        const data = res.payload?.result?.data;
                        let errors = {};
                        if (data) {
                            Object.keys(data).forEach((key, i) => {
                                errors[key] = typeof data[key] === "string" ? data[key] : data[key]?.[0]
                            })
                        }
                        formik.setErrors(errors)
                        toast.error(res.payload?.result?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                })
        },
        validationSchema: signupSchema
    });

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('registerData') || "{}");
        formik.setFieldValue('email', storedData.email || "");
        formik.setFieldValue('phone', storedData.phone || "");
    }, []);

    return (
        <div className="authForm loginForm">
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
                    Create A New Account for <span className="secondary">FREE</span>
                </h1>
                <p className="primary80 line24 font16">Our team has helped truckers from all over the country register
                    for the
                    IFTA for over a decade. We’ll
                    make your experience filing for the IFTA simple and straightforward!
                </p>
            </div>
            <form onSubmit={formik.handleSubmit} autoComplete="off">
                <div className="inputGroup flexBetween gap25 mb20">
                    <InputField
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        error={formik.touched.name && formik.errors.name}
                        helperText={formik.touched.name && formik.errors.name}
                        id="name"
                        name="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                        readOnly={true}
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        autoComplete="off"
                    />
                    <InputField
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.last_name}
                        error={formik.touched.last_name && formik.errors.last_name}
                        helperText={formik.touched.last_name && formik.errors.last_name}
                        id="last_name"
                        name="last_name"
                        label="Business Name"
                        placeholder="Enter your business name"
                        readOnly={true}
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        autoComplete="off"
                    />
                </div>
                <div className="inputGroup flexBetween gap25 mb20">
                    <InputField
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        error={formik.touched.email && formik.errors.email}
                        id="email"
                        name="email"
                        label="Email address"
                        placeholder="Enter email address"
                        autoComplete="off"
                        readOnly={true}
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                    />
                    <InputField
                        className="phoneMask"
                        label="Phone Number"
                        error={formik.touched.phone && formik.errors.phone}
                        element={<PhoneMask
                            type="text"
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            id="phone"
                            name="phone"
                            placeholder="Enter your phone number"
                            autoComplete="off"
                            readOnly={true}
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                        />}
                    />
                </div>
                <div className="inputGroup flexBetween gap25 mb20">
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
                        autoComplete="on"
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
                        autoComplete="on"
                    />
                </div>
                <div className="flexCenter mb20">
                    <NormalBtn
                        loading={loading}
                        onClick={formik.handleSubmit}
                        className="loginBtn filled white weight700"
                    >
                        Sign Up
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
                Returning customer? Please<Link href="/sign-in" className="lighthouse-black underline"> Log in here </Link>
            </p>
        </div>
    )
}