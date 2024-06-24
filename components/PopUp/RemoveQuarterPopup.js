import { GoToIconForButtons } from "@/public/assets/svgIcons/GoToIconForButtons";
import { selectPopUpAction, selectPopUpContent } from "@/store/slices/common";
import { useSelector } from "react-redux";

const RemoveQuarterPopup = ({ handleClose }) => {
    const popUpAction = useSelector(selectPopUpAction);
    const popUpContent = useSelector(selectPopUpContent);

    // Handle click on the accept button.
    const handleAcceptButtonClick = () => {
        // Trigger pop-up action and close the pop-up.
        popUpAction();
        handleClose();
    };

    return (
        <div className='permitReContinue-popup'>
            { popUpContent.includes('&nbsp') ? (
                <h2 className="popUpContent" dangerouslySetInnerHTML={{ __html: popUpContent }}/>   
            ) : (
                <h2 className="popUpContent">
                    { popUpContent }
                </h2>
            )}
            
            <div className="flex flexCenter alignCenter gap20">
                <button className="cancel-btn mPadding30" onClick={handleClose}>
                    No 
                </button>

                <button className='resend-btn alignCenter mPadding30' onClick={handleAcceptButtonClick}>
                    Yes
                    <GoToIconForButtons fill="black" />
                </button>
            </div>
        </div>
    );
};

export { RemoveQuarterPopup };