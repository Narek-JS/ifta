import { selectPopUpAction, selectPopUpContent } from "@/store/slices/common";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ImageLoader } from "@/utils/helpers";
import Image from "next/image";
import NormalBtn from "../universalUI/NormalBtn";
import Link from "next/link";
import { IFTA_EMAIL } from "@/utils/constants";

const ExpiredVerifyPopup = ({ handleClose }) => {
    const [loading, setLoading] = useState(false);
    const popUpContent = useSelector(selectPopUpContent);
    const popUpAction = useSelector(selectPopUpAction);

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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M13 9.5H11V7.5H13M13 17.5H11V11.5H13M12 2.5C10.6868 2.5 9.38642 2.75866 8.17317 3.2612C6.95991 3.76375 5.85752 4.50035 4.92893 5.42893C3.05357 7.3043 2 9.84784 2 12.5C2 15.1522 3.05357 17.6957 4.92893 19.5711C5.85752 20.4997 6.95991 21.2363 8.17317 21.7388C9.38642 22.2413 10.6868 22.5 12 22.5C14.6522 22.5 17.1957 21.4464 19.0711 19.5711C20.9464 17.6957 22 15.1522 22 12.5C22 11.1868 21.7413 9.88642 21.2388 8.67317C20.7363 7.45991 19.9997 6.35752 19.0711 5.42893C18.1425 4.50035 17.0401 3.76375 15.8268 3.2612C14.6136 2.75866 13.3132 2.5 12 2.5Z" fill="#FFBF00"/>
                </svg>
                {popUpContent.title}
            </h2>

            <p className='popupText'>
                Upon clicking the <span>'Resend Email for Verification'</span> button,
                an email verification link will be sent to the email address <span>{popUpContent.email}</span>.
                Kindly check both your inbox and spam folder to complete the email address verification.
                If you do not receive an email within the next 24 hours,
                please do not hesitate to reach out to our support team via the contact form or by emailing us at
                <Link href={`mailto: ${IFTA_EMAIL}`}>{IFTA_EMAIL}</Link>. Thank you for your cooperation!
            </p>

            <NormalBtn
                loading={loading}
                onClick={handleClose}
                
                className="border-btn"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                    <path d="M2.75 12C2.75 17.3845 7.11547 21.75 12.5 21.75C17.8845 21.75 22.25 17.3845 22.25 12C22.25 6.61547 17.8845 2.25 12.5 2.25C7.11547 2.25 2.75 6.61547 2.75 12ZM12.718 7.7175C12.7879 7.78687 12.8435 7.86934 12.8816 7.96019C12.9196 8.05105 12.9394 8.14851 12.9398 8.24702C12.9402 8.34552 12.9212 8.44314 12.8838 8.5343C12.8465 8.62545 12.7916 8.70836 12.7222 8.77828L10.2697 11.25H16.5312C16.7302 11.25 16.9209 11.329 17.0616 11.4697C17.2022 11.6103 17.2812 11.8011 17.2812 12C17.2812 12.1989 17.2022 12.3897 17.0616 12.5303C16.9209 12.671 16.7302 12.75 16.5312 12.75H10.2697L12.7222 15.2217C12.7916 15.2917 12.8465 15.3747 12.8838 15.4659C12.9211 15.5571 12.9401 15.6548 12.9396 15.7533C12.9392 15.8519 12.9194 15.9494 12.8812 16.0402C12.8431 16.1311 12.7875 16.2136 12.7175 16.283C12.6475 16.3523 12.5645 16.4073 12.4733 16.4446C12.3821 16.4819 12.2845 16.5009 12.1859 16.5004C12.0874 16.5 11.9899 16.4801 11.899 16.442C11.8081 16.4039 11.7256 16.3483 11.6562 16.2783L7.93484 12.5283C7.79544 12.3878 7.71722 12.1979 7.71722 12C7.71722 11.8021 7.79544 11.6122 7.93484 11.4717L11.6562 7.72172C11.7256 7.65164 11.8082 7.59593 11.8991 7.55778C11.99 7.51964 12.0876 7.4998 12.1862 7.49941C12.2849 7.49902 12.3826 7.51808 12.4738 7.5555C12.5651 7.59292 12.648 7.64797 12.718 7.7175Z" fill="#FFBF00"/>
                </svg>
                Cancel
            </NormalBtn>
            <NormalBtn
                loading={loading}
                onClick={()=> {
                    setLoading(true);
                    popUpAction()
                        .then(() => {
                            setLoading(false)
                        })
                }}
                className="fill-btn"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M2.25 12C2.25 17.3845 6.61547 21.75 12 21.75C17.3845 21.75 21.75 17.3845 21.75 12C21.75 6.61547 17.3845 2.25 12 2.25C6.61547 2.25 2.25 6.61547 2.25 12ZM12.218 7.7175C12.2879 7.78687 12.3435 7.86934 12.3816 7.96019C12.4196 8.05105 12.4394 8.14851 12.4398 8.24702C12.4402 8.34552 12.4212 8.44314 12.3838 8.5343C12.3465 8.62545 12.2916 8.70836 12.2222 8.77828L9.76969 11.25H16.0312C16.2302 11.25 16.4209 11.329 16.5616 11.4697C16.7022 11.6103 16.7812 11.8011 16.7812 12C16.7812 12.1989 16.7022 12.3897 16.5616 12.5303C16.4209 12.671 16.2302 12.75 16.0312 12.75H9.76969L12.2222 15.2217C12.2916 15.2917 12.3465 15.3747 12.3838 15.4659C12.4211 15.5571 12.4401 15.6548 12.4396 15.7533C12.4392 15.8519 12.4194 15.9494 12.3812 16.0402C12.3431 16.1311 12.2875 16.2136 12.2175 16.283C12.1475 16.3523 12.0645 16.4073 11.9733 16.4446C11.8821 16.4819 11.7845 16.5009 11.6859 16.5004C11.5874 16.5 11.4899 16.4801 11.399 16.442C11.3081 16.4039 11.2256 16.3483 11.1562 16.2783L7.43484 12.5283C7.29544 12.3878 7.21722 12.1979 7.21722 12C7.21722 11.8021 7.29544 11.6122 7.43484 11.4717L11.1562 7.72172C11.2256 7.65164 11.3082 7.59593 11.3991 7.55778C11.49 7.51964 11.5876 7.4998 11.6862 7.49941C11.7849 7.49902 11.8826 7.51808 11.9738 7.5555C12.0651 7.59292 12.148 7.64797 12.218 7.7175Z" fill="#FDFDFF"/>
                </svg>
                Resend Email for Verification
            </NormalBtn>
        </div>
    );
};

export { ExpiredVerifyPopup };