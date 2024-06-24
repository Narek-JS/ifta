import { GoToIconForButtons } from "@/public/assets/svgIcons/GoToIconForButtons";
import { selectPopUpAction } from "@/store/slices/common";
import { useSelector } from "react-redux";

const PermitReContinue = ({ handleClose }) => {
    const popUpAction = useSelector(selectPopUpAction);
    
    // Handle rejection Action.
    const handleReject = (e) => {
        // Close the pop-up and trigger the pop-up action with 'no' parameter.
        handleClose(e);
        popUpAction('no');
    };

    // Handle acceptance Action.
    const handelAccept = () => {
        // Trigger the pop-up action with 'yes' parameter and close the pop-up.
        popUpAction('yes');
        handleClose();
    };

    return (
        <div className='permitReContinue-popup'>
            <h2 className="popUpContent">
                You've already started the new IFTA registration permit process. Would you like to continue that?
            </h2>
            
            <div className="flex flexCenter alignCenter gap20">
                <button className="cancel-btn mPadding30" onClick={handleReject}>
                    No
                    <GoToIconForButtons fill="black" />
                </button>

                <button className='resend-btn alignCenter mPadding30' onClick={handelAccept}>
                    Yes
                    <GoToIconForButtons fill="black" />
                </button>
            </div>
        </div>
    );
};

export { PermitReContinue };