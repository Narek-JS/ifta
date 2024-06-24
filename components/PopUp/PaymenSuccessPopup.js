import { SuccessfullyDoneIcon } from "@/public/assets/svgIcons/SuccessfullyDoneIcon";
import { selectPaymentMessage } from "@/store/slices/payment";
import { useSelector } from "react-redux";
import { Fragment } from "react";

import NormalBtn from "@/components/universalUI/NormalBtn";

export default function PaymenSuccessPopup({ handleClose }) {
    const message = useSelector(selectPaymentMessage);

    return (
        <Fragment>
            <div className="warningIcon">
                <SuccessfullyDoneIcon />
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
        </Fragment>
    );
};