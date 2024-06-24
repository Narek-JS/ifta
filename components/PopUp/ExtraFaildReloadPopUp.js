import { SuccessfullyDoneIcon } from "@/public/assets/svgIcons/SuccessfullyDoneIcon";
import { Fragment } from "react";

import NormalBtn from "@/components/universalUI/NormalBtn";

export default function ExtraFaildReloadPopUp() {

    return (
        <Fragment>
            <div className="warningIcon">
                <SuccessfullyDoneIcon />
            </div>
            <h2 className="primary font24 m-center">
                Extra field does not belong to state. Please Reload the Page
            </h2>
            <NormalBtn
                onClick={() => window?.navigation?.reload()}
                className="outlined primary"
            >
                Reload
            </NormalBtn>
        </Fragment>
    );
};