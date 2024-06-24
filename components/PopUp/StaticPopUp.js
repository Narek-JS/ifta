import { selectPopUpAction, selectPopUpContent } from "@/store/slices/common";
import { useSelector } from "react-redux";
import { useState } from "react";

import NormalBtn from "@/components/universalUI/NormalBtn";

export default function StaticPopUp ({ handleClose }) {
    const [loading, setLoading] = useState(false);
    const popUpContent = useSelector(selectPopUpContent);
    const popUpAction = useSelector(selectPopUpAction);

    // Function to handle "Yes" button click.
    const handleAcceptButtonClick = () => {
        // Set loading state to true and Trigger the pop-up action.
        setLoading(true);
        popUpAction().then(() => setLoading(false));
    };

    return (
        <div className="flexColumn alignCenter gap30 sectionPadding">
            <h2 className="primary font24 textCenter">
                {popUpContent}
            </h2>
            <div className="flexCenter alignCenter w100 gap20">
                <NormalBtn
                    loading={loading}
                    onClick={handleAcceptButtonClick}
                    className="filled secondary"
                >
                    Yes
                </NormalBtn>
                <NormalBtn
                    loading={loading}
                    onClick={handleClose}
                    className="outlined primary"
                >
                    Cancel
                </NormalBtn>
            </div>
        </div>
    );
};