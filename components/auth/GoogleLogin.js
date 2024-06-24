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

    // Defining the Google login handler using useGoogleLogin hook.
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: (res) => {
            // Dispatching setLoading action to show loader.
            dispatch(setLoading(true));

            // Dispatching googleLogin action with the received token.
            dispatch(googleLogin({ token: res?.access_token }))
                .then(res => {
                    if (res?.payload?.action) {
                        // Dispatching getUser action to fetch user data and Navigating to carrier info form.
                        dispatch(getUser());
                        router.push("/form/carrier-info");
                    } else {
                        // Showing error toast notification.
                        toast.error(res.payload?.result?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    };

                    // Dispatching setLoading action to hide loader.
                    dispatch(setLoading(false));
                });
        },
        onError: (err) => {
            // Showing error toast notification on login failure.
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