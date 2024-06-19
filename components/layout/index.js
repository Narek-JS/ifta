import { VerificationProvider as VerificationCarrierInfoProvider } from "@/contexts/VerificationCarrierInfoContext";
import { clearStoreData, clearTaxReturnPeriod } from "@/store/slices/resgister";
import { getUser, selectUserData, userLogout } from "@/store/slices/auth";
import menuData from '@/data/menu.js';
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
import Cookies from "js-cookie";
import { FormSectionsCarrierInfoProvider } from "@/contexts/FormSectionsCarrierInfoContext";

export default function Layout({ children }) {
    const user = useSelector(selectUserData);
    const dispatch = useDispatch();

    const router = useRouter();

    const form = router.pathname.split("/")[1] === "form";
    const profile = menuData.profileLinks.find(link => link === router.pathname);
    const auth = menuData.authLinks.find(link => link === router.pathname);

    useEffect(() => {
        if(!(router.pathname === '/payment') && Cookies.get('hash')) {
            Cookies.remove('hash');
        };
    }, [router.pathname]);

    useEffect(() => {
        if(router.pathname === '/payment' || router.pathname === '/404') return;

        setTimeout(() => {
            const isUpdate = localStorage.getItem('isUpdate');
            if(!isUpdate && user) {
                dispatch(setPopUp({
                    popUp: "updatedPopup",
                    popUpAction: () => {
                        localStorage.setItem('isUpdate', true);
                        return router.push("/sign-in");
                    }
                }));
            };
        }, 15000);
    }, [user]);

    useEffect(() => {
        if(router.pathname === '/payment' || router.pathname === '/404') return;

        if ((Cookies.get("authorized")) && !user && !auth) {
            dispatch(setLoading(true));
            dispatch(getUser())
                .then(res => {
                    dispatch(setLoading(false))
                    if (!res?.payload?.action && (form || profile)) {
                        router?.push('/');
                    };
                });
        } else if (!user && (form || profile)) {
            router?.push('/');
        };
    }, [router]);

    const handleLogOut = () => {
        dispatch(setPopUp({
            popUp: "logoutPopup",
            popUpContent: 'Are You Sure You Want to Log Out From Your Account?',
            popUpAction: () => dispatch(userLogout())
                .finally(() => {
                    dispatch(setPopUp({}));
                    dispatch(clearTaxReturnPeriod());
                    dispatch(clearStoreData());
                    if(form || profile || router.pathname === '/thank-you') {
                        router.push("/")
                    };
                })
        }));
    };

    if(router.pathname === '/payment') {
        return children;
    };

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