import { selectPopUpAction } from "@/store/slices/common";
import { useState } from "react";
import { useSelector } from "react-redux";

const ResentEmailPopup = ({ handleClose }) => {
    const [loading, setLoading] = useState(false);
    const popUpAction = useSelector(selectPopUpAction);

    const resentCall = () => {
        if(!loading) {
            setLoading(true);
            popUpAction().then(() => {
                setLoading(false)
                handleClose();
            });
        };
    };

    return (
        <div className='logoutPopup'>
            <h2 className="popUpContent">
                You haven't verified <span>your email</span>
            </h2>
            <p>
                If you haven't received the email verification link or want to receive it again,
                please click the <b>'Resend Email Link'</b> button to verify your email address. Thank you!
            </p>
            <button className="cancel-btn" onClick={handleClose}>
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.2071 8.70711C21.5976 8.31658 21.5976 7.68342 21.2071 7.29289L14.8431 0.928932C14.4526 0.538408 13.8195 0.538408 13.4289 0.928932C13.0384 1.31946 13.0384 1.95262 13.4289 2.34315L19.0858 8L13.4289 13.6569C13.0384 14.0474 13.0384 14.6805 13.4289 15.0711C13.8195 15.4616 14.4526 15.4616 14.8431 15.0711L21.2071 8.70711ZM0.5 9H20.5V7H0.5V9Z" fill="black"/>
                </svg>
                Cancel
            </button>

            <button className='resend-btn' onClick={resentCall}>
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.2071 8.70711C21.5976 8.31658 21.5976 7.68342 21.2071 7.29289L14.8431 0.928932C14.4526 0.538408 13.8195 0.538408 13.4289 0.928932C13.0384 1.31946 13.0384 1.95262 13.4289 2.34315L19.0858 8L13.4289 13.6569C13.0384 14.0474 13.0384 14.6805 13.4289 15.0711C13.8195 15.4616 14.4526 15.4616 14.8431 15.0711L21.2071 8.70711ZM0.5 9H20.5V7H0.5V9Z" fill="#000000"/>
                </svg>
                { !loading && 'Resend email verification link'}
                { loading && <span /> }
            </button>
        </div>
    );
};

export { ResentEmailPopup };