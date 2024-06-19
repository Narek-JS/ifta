import { IFTA_EMAIL, IFTA_PHONE } from "@/utils/constants";
import { setPopUp } from "@/store/slices/common";
import { ImageLoader } from "@/utils/helpers";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const dispatch = useDispatch();

    const openTermsPopup = () => {
        dispatch(setPopUp({ popUp: 'termsPopup' }));
    };

    const openPrivacyPopup = () => {
        dispatch(setPopUp({ popUp: 'privacy-policy' }));
    };

    return (
        <footer className="mPadding sectionPadding">
            <div className="footerMain flexBetween gap40">
                <div>
                    <Link href='/' className="footerLogo">
                        <Image
                            src="/assets/images/logo3.png"
                            quality={100}
                            width={240}
                            height={80}
                            loader={ImageLoader}
                            alt="footer logo"
                        />
                    </Link>
                </div>

                <div className="infoItem contactInfoItem">
                    <Link href="" className="font20 lighthouse-black bold500 mb10">Contact Info</Link>
                    <p className="flex alignCenter gap2-5 font14 mb10 primary80">
                        Phone: 
                        <Link href={`tel:${IFTA_PHONE}`} className="lighthouse-black underline">
                            ( 800 ) 341 - 2870
                        </Link>
                    </p>
                    <p className="flex alignCenter gap2-5 font14 mb10 primary80">
                        Email: 
                        <Link href={`mailto:${IFTA_EMAIL}`} className="lighthouse-black underline">
                            {IFTA_EMAIL}
                        </Link>
                    </p>
                </div>
                <div className="infoItem">
                    <Link href="/about-us" className="font20 lighthouse-black bold500 mb20">About Us</Link>
                </div>
                <div className="infoItem">
                    <Link href="/services" className="font20 lighthouse-black bold500 mb20">Services</Link>
                </div>
                <div className="infoItem">
                    <Link href="/contact-us" className="font20 lighthouse-black bold500 mb20">Contact Us</Link>
                </div>
            </div>
            <div className="mt20 flex alignCenter flexBetween footerBar">
                <p className="primary80 font14 w100">
                    © {new Date().getFullYear() - 1} - IFTA.online. All Rights Reserved.
                </p>
                <div className="flex flexBetween w100">
                    <p className="lighthouse-black font14 underline pointer nowrap" onClick={openTermsPopup}>
                        Terms And Conditions
                    </p>
                    <p className="lighthouse-black font14 underline pointer nowrap" onClick={openPrivacyPopup}>
                        Privacy Policy
                    </p>
                </div>
            </div>
        </footer>
    );
};