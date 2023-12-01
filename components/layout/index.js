import { setLoading, setPopUp } from "@/store/slices/common";
import { useRouter } from "next/router";
import { getUser, selectUserData, userLogout } from "@/store/slices/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToTopBtn from "@/components/universalUI/ToTopBtn";
import FooterSmall from "@/components/layout/FooterSmall";
import AuthWrapper from "@/components/auth/AuthWrapper";
import Loading from "@/components/universalUI/Loading";
import Cookies from "js-cookie";
import ExpiresPopUp from "@/components/layout/ExpiresPopUp";
import PopUp from "@/components/PopUp";

export default function Layout({ children }) {
    const router = useRouter();
    const {pathname} = router;
    const dispatch = useDispatch();
    const user = useSelector(selectUserData);
    const form = pathname.split("/")[1] === "form";
    const profile = pathname === "/profile" || pathname === "/history"

    const auth = (
        pathname === "/sign-in" ||
        pathname === "/sign-up" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password"
    );

    useEffect(() => {
        setTimeout(() => {
            const isUpdate = localStorage.getItem('isUpdate');
            if(!isUpdate) {
                dispatch(setPopUp({
                    popUp: "updatedPopup",
                    popUpAction: () => {
                        localStorage.setItem('isUpdate', true);
                        return router.push("/sign-in");
                    }
                }))
            };
        }, 15000);
    }, []);

    useEffect(() => {
        if (Cookies.get("authorized") && !user) {
            dispatch(setLoading(true));
            dispatch(getUser())
                .then(res => {
                        dispatch(setLoading(false))
                    if (res?.payload?.action) {

                    } else {
                        if(form || profile){
                            router?.push('/')
                        }
                    }
                })
        } else {
            if((form && !user) || (profile && !user)){
                router?.push('/')
            }
        }
    }, [router])

    const handleLogOut = () => {
        dispatch(setPopUp({
            popUp: "logoutPopup",
            popUpContent: 'Are You Sure You Want to Log Out From Your Account?',
            popUpAction: () => {
                return dispatch(userLogout())
                    .finally(() => {
                        dispatch(setPopUp({}));
                        if(form || profile) {
                            router.push("/")
                        }
                    })
            }
        }))
    };

    if (auth) {
        return <>
            <AuthWrapper user={user}>
               <Loading/>
                <PopUp />
                {children}
            </AuthWrapper>
            <FooterSmall/>
        </>
    };

    return (
        <>
            <Loading/>
            <PopUp/>
            <ExpiresPopUp router={router}/>
            <Header
                disableTopPanel={form || profile}
                handleLogOut={handleLogOut}
                user={user}
            />
            {children}
            <ToTopBtn/>
            {form || profile ? <FooterSmall/> : <Footer/>}
        </>
    );
};