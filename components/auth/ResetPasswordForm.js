import Image from "next/image";
import {ImageLoader} from "@/utils/helpers";
import {useFormik} from "formik";
import {resetPasswordSchema} from "@/utils/schemas";
import InputField from "@/components/universalUI/InputField";
import Link from "next/link";
import NormalBtn from "@/components/universalUI/NormalBtn";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {resetPassword} from "@/store/slices/auth";
import {toast} from "react-toastify";
import {useState} from "react";

export default function ResetPasswordForm() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            password: "",
            passwordConfirm: ""
        },
        onSubmit: (values, {resetForm}) => {
            setLoading(true)
            dispatch(resetPassword({
                password: values.password,
                password_confirmation: values.passwordConfirm,
                token: router.query?.token
            }))
                .then(res => {
                    setLoading(false)
                    if (res.payload?.action) {
                        toast.success(res.payload?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        router.push("/sign-in");
                    } else {
                        if(res.payload?.result?.data?.expired){
                            router.push("/forgot-password")
                        }
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
        validationSchema: resetPasswordSchema
    });

    return (
        <div className="authForm loginForm resetPasswordForm">
            <div className="authHeaders flexColumn alignCenter gap20 textCenter">
                <Link href="/" className="logoArea">
                    <Image src="/assets/images/logo3.png" quality={100} width={240} height={80} loader={ImageLoader}
                           alt="logo"/>
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
                    <NormalBtn loading={loading} onClick={formik.handleSubmit}
                               className="loginBtn filled white weight700">
                        Log In
                    </NormalBtn>
                </div>
            </form>
            <div className="authFormEnding flexColumn gap20 alignCenter">
            </div>
            <p className="primary60 mt20 textCenter">
                Don’t have an account yet?<Link href="/sign-up" className="secondary underline"> Create Now </Link>
            </p>
        </div>
    )
}