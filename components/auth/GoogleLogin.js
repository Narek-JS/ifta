import { GoogleLoginIcon } from "@/public/assets/svgIcons/GoogleLoginIcon";
import { getUser, googleLogin } from "@/store/slices/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { setLoading } from "@/store/slices/common";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

export default function GoogleLogin ({ name }) {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: (res) => {
            dispatch(setLoading(true));

            dispatch(googleLogin({ token: res?.access_token }))
                .then(res => {
                    if (res?.payload?.action) {
                        dispatch(getUser());
                        router.push("/form/carrier-info");
                    } else {
                        toast.error(res.payload?.result?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    };
                    dispatch(setLoading(false));
                });
        },
        onError: (err) => {
            toast.error(err.message, {
                position: toast.POSITION.TOP_RIGHT
            });
        },
    });

    return(
        <Button onClick={handleGoogleLogin} className="loginWithGoogle">
            <div className="googleIcon">
                <GoogleLoginIcon />
            </div>
            <span className="action">{name}</span>
        </Button>
    );
};