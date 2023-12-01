import Image from "next/image";
import {ImageLoader} from "@/utils/helpers";
import InputField from "@/components/universalUI/InputField";
import Link from "next/link";
import {useState} from "react";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import NormalBtn from "@/components/universalUI/NormalBtn";
import {useDispatch} from "react-redux";
import {forgotPassword} from "@/store/slices/auth";

const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export default function ForgotForm() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const [touched, setTouched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setEmail(e.target.value);
        if (touched) {
            if (emailReg.test(e.target.value)) {
                setError(false)
            } else {
                setError(true)
            }
        }
    }

    const handleBlur = () => {
        setTouched(true);
        if (emailReg.test(email)) {
            setError(false)
        } else {
            setError(true)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (emailReg.test(email)) {
            setLoading(true)
            dispatch(forgotPassword({email}))
                .then(res => {
                    setLoading(false)
                    if (res.payload?.action) {
                        toast.success(res.payload?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        router.push("/")
                    } else {
                        toast.error(res.payload?.result?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                })
        } else {
            setError(true)
        }
    }

    return (
        <div className="authForm loginForm">
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
                    Enter the email you used to sign up with us. A link to reset your password will be sent to your
                    email.
                </p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="inputGroup flexBetween alignEnd gap25">
                    <InputField
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={email}
                        error={error ? "Invalid email address" : ""}
                        required={true}
                        id="email"
                        name="email"
                        label="Email address"
                        placeholder="Enter email address"
                    />
                    <NormalBtn onClick={handleSubmit} loading={loading} className="loginBtn filled white weight700">
                        Reset Password
                    </NormalBtn>
                </div>
                <div className="flexCenter mb20">
                </div>
            </form>
            <div className="authFormEnding flexColumn gap20 alignCenter">
            </div>
            <p className="primary60 mt20 textCenter">
                Don’t have an account yet?<Link href="/sign-up" className="secondary underline white-space-nowrap"> Create Now </Link>
            </p>
        </div>
    )
}