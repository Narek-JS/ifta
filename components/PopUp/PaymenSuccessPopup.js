import NormalBtn from "@/components/universalUI/NormalBtn";
import { selectPaymentMessage } from "@/store/slices/payment";
import { useSelector } from "react-redux";

export default function PaymenSuccessPopup({ handleClose }) {
    const message = useSelector(selectPaymentMessage);

    return (
        <>
            <div className="warningIcon">
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--toastify-icon-color-success)">
                    <path
                        d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"></path>
                </svg>
            </div>
            <h2 className="primary font24 m-center">
                {message}
            </h2>
            <NormalBtn
                onClick={handleClose}
                className="outlined primary"
            >
                Ok
            </NormalBtn>
        </>
    )
}