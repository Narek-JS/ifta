import { GoToIconForButtons } from "@/public/assets/svgIcons/GoToIconForButtons";
import { selectPopUpAction } from "@/store/slices/common";
import { useSelector } from "react-redux";
import { useState } from "react";

const ResentEmailPopup = ({ handleClose }) => {
    const [loading, setLoading] = useState(false);
    const popUpAction = useSelector(selectPopUpAction);

    // Function to trigger the pop-up action and close the pop-up.
    const resentCall = () => {

        // Prevent multiple clicks while request is in progress
        if(!loading) {
            setLoading(true);
            popUpAction().then(() => {
                setLoading(false);
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
                <GoToIconForButtons fill="black" />
                Cancel
            </button>

            <button className='resend-btn' onClick={resentCall}>
                <GoToIconForButtons fill="#000000" />
                { !loading && 'Resend email verification link'}
                { loading && <span /> }
            </button>
        </div>
    );
};

export { ResentEmailPopup };