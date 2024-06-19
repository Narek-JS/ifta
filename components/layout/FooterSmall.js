import { setPopUp } from "@/store/slices/common";
import { useDispatch } from "react-redux";

export default function FooterSmall() {
    const dispatch = useDispatch();

    const openTermsPopup = () => {
        dispatch(setPopUp({ popUp: 'termsPopup' }));
    };

    const openPrivacyPopup = () => {
        dispatch(setPopUp({ popUp: 'privacy-policy' }));
    };

    return(
        <footer className="footerSmall">
            <div className="flexCenter alignCenter">
                <p className="primary80 font14">
                    © {new Date().getFullYear() - 2} - IFTA.online. All Rights Reserved.
                </p>
                <p className="lighthouse-black font14 underline pointer" onClick={openTermsPopup}>
                    Terms And Conditions
                </p>
                <p className="lighthouse-black font14 underline pointer" onClick={openPrivacyPopup}>
                    Privacy Policy
                </p>
            </div>
        </footer>
    );
};