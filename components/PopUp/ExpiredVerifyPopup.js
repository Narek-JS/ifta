import { ExpiredVerifyTitleIcon } from "@/public/assets/svgIcons/ExpiredVerifyTitleIcon";
import { ComeBackLeftArrowIcon } from "@/public/assets/svgIcons/ComeBackLeftArrowIcon";
import { selectPopUpAction, selectPopUpContent } from "@/store/slices/common";
import { IFTA_EMAIL } from "@/utils/constants";
import { ImageLoader } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { useState } from "react";

import NormalBtn from "../universalUI/NormalBtn";
import Image from "next/image";
import Link from "next/link";

const ExpiredVerifyPopup = ({ handleClose }) => {
    const [loading, setLoading] = useState(false);
    const popUpContent = useSelector(selectPopUpContent);
    const popUpAction = useSelector(selectPopUpAction);

    // Handle resend email click.
    const handleAccaptResendClick = () => {
        setLoading(true);
        popUpAction().then(() => setLoading(false));
    };

    return (
        <div className='expiredVerifyPopup'>
            <div className="close-popup" onClick={handleClose}/>

            <Image
                alt="log out popup Image"
                src='/assets/images/ExpiredVerifyPopupImg.png'
                width={300}
                height={260}
                loader={ImageLoader}
            />

            <h2 className="popUpContent">
                <ExpiredVerifyTitleIcon />
                {popUpContent.title}
            </h2>

            <p className='popupText'>
                Upon clicking the&nbsp;
                <span>Resend Email for Verification</span>&nbsp;
                button, an email verification link will be sent to the email address
                <span>{popUpContent.email}</span>.
                Kindly check both your inbox and spam folder to complete the email address verification.
                If you do not receive an email within the next 24 hours,
                please do not hesitate to reach out to our support team via the contact form or by emailing us at&nbsp;
                <Link href={`mailto: ${IFTA_EMAIL}`}>{IFTA_EMAIL}</Link>.
                Thank you for your cooperation!
            </p>

            <NormalBtn
                loading={loading}
                onClick={handleClose}
                className="border-btn"
            >
                Cancel
            </NormalBtn>
            <NormalBtn
                loading={loading}
                onClick={handleAccaptResendClick}
                className="w100-imp bg-lighthouse-black"
            >
                <ComeBackLeftArrowIcon />
                Resend Email for Verification
            </NormalBtn>
        </div>
    );
};

export { ExpiredVerifyPopup };