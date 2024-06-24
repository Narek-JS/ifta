import { VerificationProvider as VerificationCarrierInfoProvider } from "@/contexts/VerificationCarrierInfoContext";
import { FormSectionsCarrierInfoProvider } from "@/contexts/FormSectionsCarrierInfoContext";
import { clearStoreData, clearTaxReturnPeriod } from "@/store/slices/resgister";
import { getUser, selectUserData, userLogout } from "@/store/slices/auth";
import { setLoading, setPopUp } from "@/store/slices/common";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import ExpiresPopUp from "@/components/layout/ExpiresPopUp";
import FooterSmall from "@/components/layout/FooterSmall";
import ToTopBtn from "@/components/universalUI/ToTopBtn";
import AuthWrapper from "@/components/auth/AuthWrapper";
import Loading from "@/components/universalUI/Loading";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PopUp from "@/components/PopUp";
import menuData from '@/data/menu.js';
import Cookies from "js-cookie";

export default function Layout({ children }) {
    const user = useSelector(selectUserData);
    const dispatch = useDispatch();

    const router = useRouter();

    const form = router.pathname.split("/")[1] === "form";
    const profile = menuData.profileLinks.find(link => link === router.pathname);
    const auth = menuData.authLinks.find(link => link === router.pathname);

    // Remove 'hash' cookie if the current path is not '/payment'.
    useEffect(() => {
        if(!(router.pathname === '/payment') && Cookies.get('hash')) {
            Cookies.remove('hash');
        };
    }, [router.pathname]);

    // Keep time to open update popup if the page is not payment and if the user is auth.
    useEffect(() => {
        if(router.pathname === '/payment' || router.pathname === '/404') return;

        // After 15 seccond open update popup.
        setTimeout(() => {
            const isUpdate = localStorage.getItem('isUpdate');

            // if that popup is never open, and user is auth.
            if(!isUpdate && !user) {
                dispatch(setPopUp({
                    popUp: "updatedPopup",
                    popUpAction: () => {
                        // When user attach our update popup, keep isUpdate in browser storage.
                        localStorage.setItem('isUpdate', true);
                        return router.push("/sign-in");
                    }
                }));
            };
        }, 15000);
    }, [user]);

    // Fetch user data if authorized and not already fetched.
    useEffect(() => {
        if(router.pathname === '/payment' || router.pathname === '/404') return;

        if ((Cookies.get("authorized")) && !user && !auth) {
            // Set loading state to true until successfuly finish api call.
            dispatch(setLoading(true));

            // check if user is auth, just keep them in redux, else redirect to home page.
            dispatch(getUser())
                .then(res => {
                    dispatch(setLoading(false))
                    if (!res?.payload?.action && (form || profile)) {
                        router?.push('/');
                    };
                });
        } else if (!user && (form || profile)) {
            // if user isn't there and try to open privite page redirect to home.
            router?.push('/');
        };
    }, [router]);

    // Handle user logout.
    const handleLogOut = () => {
        dispatch(setPopUp({
            popUp: "logoutPopup",
            popUpContent: 'Are You Sure You Want to Log Out From Your Account?',
            popUpAction: () => {
                return dispatch(userLogout())
                    .finally(() => {
                        // close logout popup.
                        dispatch(setPopUp({}));

                        // Clear tax return period and store data.
                        dispatch(clearTaxReturnPeriod());
                        dispatch(clearStoreData());

                        // After logut if user is privite pages redirect to home page.
                        if(form || profile || router.pathname === '/thank-you') {
                            router.push("/");
                        };
                    });
            }
        }));
    };

    // If the current path is '/payment', return the children directly.
    if(router.pathname === '/payment') {
        return children;
    };

    // If the current path is an auth links, render the auth layout.
    if (auth) {
        return (
            <Fragment>
                <AuthWrapper user={user}>
                <Loading />
                    <PopUp />
                    {children}
                </AuthWrapper>
                <FooterSmall />
            </Fragment>
        );
    };

    // Render the main layout.
    return (
        <Fragment>
            <Loading />
            <PopUp />
            <ExpiresPopUp router={router} />
            <Header disableTopPanel={false} handleLogOut={handleLogOut} user={user} />
            <VerificationCarrierInfoProvider>
                <FormSectionsCarrierInfoProvider>
                    {children}
                </FormSectionsCarrierInfoProvider>
            </VerificationCarrierInfoProvider>
            <ToTopBtn />
            {form || profile ? <FooterSmall /> : <Footer />}
        </Fragment>
    );
};