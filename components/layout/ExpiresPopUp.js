import { deleteUserDetails, getUser, selectAuth, setAuth, userRefresh } from "@/store/slices/auth";
import { useEffect, useRef, useState, useCallback } from "react";
import { clearStoreData } from "@/store/slices/resgister";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@mui/material";
import { toast } from "react-toastify";

import WarningSvgIcon from "@/public/assets/svgIcons/WarningSvgIcon";
import NormalBtn from "@/components/universalUI/NormalBtn";
import Cookies from "js-cookie";

export default function ExpiresPopUp({ router }) {
    const auth = useSelector(selectAuth);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const timeoutIdRef = useRef();

    // Function to set a timeout for session expiration.
    const listenExpiresTime = useCallback(() => {
        clearTimeout(timeoutIdRef.current);

        // Calculate differance of expires date.
        const date = new Date();
        const expiresTime = +localStorage.getItem("expires_date");
        const diffTime = expiresTime - date.getTime();

        if (diffTime > 0) {
            // If the remaining time is within safe limits, set a timeout.
            if (diffTime < 2147483646) {
                timeoutIdRef.current = setTimeout(handleOpen, diffTime);
            } else {
                timeoutIdRef.current = setTimeout(handleOpen, 3600000);
            };
        } else {
            // If the session has already expired, open the popup immediately.
            handleOpen();
        };
    }, [timeoutIdRef.current]);

    // Effect to set authentication status from cookies.
    useEffect(() => {
        const auth = Cookies.get("authorized");
        if (auth) {
            dispatch(setAuth(auth));
        } else {
            localStorage.removeItem("expires_date");
        };
    }, []);

    // Effect to start listening for expiration time if authenticated.
    useEffect(() => {
        if (auth) {
            listenExpiresTime();
            document.addEventListener("visibilitychange", listenExpiresTime);
        };

        return () => {
            clearTimeout(timeoutIdRef.current);
            document.removeEventListener("visibilitychange", listenExpiresTime);
        };
    }, [auth]);

    // Functions to open and close the expiration popup.
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Function to log out the user.
    const logout = () => {
        setLoading(true);
        dispatch(deleteUserDetails());
        dispatch(clearStoreData());
        handleClose();
        router.push("/");
    };

    // Function to refresh the user token.
    const refreshToken = () => {
        // before dispatch action turn on loading.
        setLoading(true);

        // refresh token call.
        dispatch(userRefresh())
            .then(res => {
                // after succesfuly done the api call, turn off the loading.
                setLoading(false);

                // close refresh token api, and user with updated token.
                if (res?.payload?.action) {
                    handleClose();
                    dispatch(getUser());
                } else {
                    // show error message.
                    toast.error("Please, try again or log out", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            });
    };

    return (
        <Dialog
            className="expirationPopUp"
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div className="warningIcon">
                <WarningSvgIcon/>
            </div>
            <h1 className="font28 primary">
                Your login time has expired
            </h1>
            <p className="font16 primary80">
                You can stay on Your account or log out
            </p>
            <div className="actions alignCenter gap20">
                <NormalBtn
                    loading={loading}
                    className="filled secondary"
                    onClick={refreshToken}
                >
                    Keep me logged in
                </NormalBtn>
                <NormalBtn
                    loading={loading}
                    className="outlined primary"
                    onClick={logout}
                    autoFocus
                >
                    Log out
                </NormalBtn>
            </div>
        </Dialog>
    );
};