import { SuccessfullyDoneIcon } from "@/public/assets/svgIcons/SuccessfullyDoneIcon";
import { Fragment } from "react";

import NormalBtn from "@/components/universalUI/NormalBtn";

export default function RegisteredPopUp({ handleClose }) {
    return (
        <Fragment>
            <div className="warningIcon">
                <SuccessfullyDoneIcon />
            </div>
            <h2 className="primary font24 m-center">
                Successfully Registered. Please check Your email
            </h2>
            <NormalBtn onClick={handleClose} className="outlined primary">
                Ok
            </NormalBtn>
        </Fragment>
    );
};