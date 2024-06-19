import { deleteUserDetails, getUser, selectAuth, setAuth, userRefresh } from "@/store/slices/auth";
import { clearStoreData } from "@/store/slices/resgister";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "@mui/material";
import { toast } from "react-toastify";
import { useCallback } from "react";
import WarningSvgIcon from "@/public/assets/svgIcons/WarningSvgIcon";
import NormalBtn from "@/components/universalUI/NormalBtn";
import Cookies from "js-cookie";

export default function ExpiresPopUp({ router }) {
    const auth = useSelector(selectAuth);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const timeoutIdRef = useRef();

    const listenExpiresTime = useCallback(() => {
        clearTimeout(timeoutIdRef.current);
        const date = new Date();
        const expiresTime = +localStorage.getItem("expires_date");
        const diffTime = expiresTime - date.getTime();
        if (diffTime > 0) {
            if (diffTime < 2147483646) {
                timeoutIdRef.current = setTimeout(handleOpen, diffTime);
            } else {
                timeoutIdRef.current = setTimeout(handleOpen, 3600000);
            };
        } else {
            handleOpen();
        };
    }, [timeoutIdRef.current]);

    useEffect(() => {
        const auth = Cookies.get("authorized");
        if (auth) {
            dispatch(setAuth(auth));
        } else {
            localStorage.removeItem("expires_date");
        };
    }, []);

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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const logout = () => {
        setLoading(true);
        dispatch(deleteUserDetails());
        dispatch(clearStoreData());
        handleClose();
        router.push("/");
    };

    const refreshToken = () => {
        setLoading(true);
        dispatch(userRefresh())
            .then(res => {
                setLoading(false)
                if (res?.payload?.action) {
                    handleClose();
                    dispatch(getUser())
                } else {
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