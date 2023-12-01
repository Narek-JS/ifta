import { setPopUp } from "@/store/slices/common";
import { useDispatch } from "react-redux";

export default function FooterSmall () {
    const dispatch = useDispatch();
    return(
        <footer className="footerSmall">
            <div className="flexCenter alignCenter">
                <p className="primary80 font14">
                    © {new Date().getFullYear()} - IFTA.online. All Rights Reserved.
                </p>
                <p className="lighthouse-black font14 underline pointer" onClick={() => {
                    dispatch(setPopUp({
                        popUp: 'termsPopup',
                    }));
                }}>
                    Terms And Conditions
                </p>
                <p className="lighthouse-black font14 underline pointer" onClick={() => {
                    dispatch(setPopUp({
                        popUp: 'privacy-policy',
                    }));
                }}>
                    Privacy Policy
                </p>
            </div>
        </footer>
    )
}