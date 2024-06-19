import { Dialog } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectPopUp, setPopUp } from "@/store/slices/common";
import { ExampleFilePopUp } from "./ExampleFilePopUp";
import { LogoutPopup } from "./LogoutPopup";
import { ExpiredVerifyPopup } from "./ExpiredVerifyPopup";
import { TermsPopup } from "./TermsPopup";
import { DeleteMember } from "./DeleteMember";
import { DeleteVehicle } from "./DeleteVehicle";
import { UpdatedPopup } from "./UpdatedPopup";
import { PrivacyPolicyPopup } from "./PrivacyPolicyPopup";
import RegisteredPopUp from "@/components/PopUp/RegisteredPopUp";
import ExtraFaildReloadPopUp from "./ExtraFaildReloadPopUp";
import classNames from "classnames";
import PaymenSuccessPopup from "./PaymenSuccessPopup";
import { ResentEmailPopup } from "./ResentEmailPopup";
import { DeleteQuarter } from "./DeleteQuarter";
import { PermitReContinue } from "./PermitReContinue";
import { DeleteQuarterPeriods } from "./DeleteQuarterPeriods";
import { RemoveQuarterPopup } from "./RemoveQuarterPopup";

export default function PopUp() {
    const dispatch = useDispatch();
    const pupUp = useSelector(selectPopUp);

    const handleClose = () => {
        dispatch(setPopUp({}));
    };

    return (
        <Dialog
            className={classNames("expirationPopUp", {
                "logoutPopupWrapper": ['logoutPopup', 'deleteVehicle', 'deleteMember', 'updatedPopup'].includes(pupUp),
                'expiredVerifyWrapper': pupUp === 'expiredVerify',
                'termsPopup': pupUp === 'termsPopup' || pupUp === 'privacy-policy',
                'resendEmailPopup': pupUp === 'resend-email' 
            })}
            open={!!pupUp}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {(() => {
                switch (pupUp) {
                    case 'registerSuccess':
                        return <RegisteredPopUp handleClose={handleClose} />;
                    case 'logoutPopup':
                        return <LogoutPopup handleClose={handleClose}/>;
                    case 'expiredVerify':
                        return <ExpiredVerifyPopup handleClose={handleClose} />;
                    case 'deleteVehicle':
                        return <DeleteVehicle handleClose={handleClose} />;
                    case 'deleteMember' :
                        return <DeleteMember handleClose={handleClose} />;
                    case 'deleteQuarter' :
                        return <DeleteQuarter handleClose={handleClose} />;
                    case 'deleteQuarterPeriods':
                        return <DeleteQuarterPeriods handleClose={handleClose} />;
                    case 'exampleFile':
                        return <ExampleFilePopUp />;
                    case 'updatedPopup':
                        return <UpdatedPopup handleClose={handleClose}/>;
                    case 'extraFaild':
                        return <ExtraFaildReloadPopUp handleClose={handleClose} />;
                    case 'termsPopup': 
                        return <TermsPopup handleClose={handleClose}/>;
                    case 'privacy-policy': 
                        return <PrivacyPolicyPopup handleClose={handleClose} />;
                    case 'payment-success': 
                        return <PaymenSuccessPopup handleClose={handleClose} />;
                    case 'resend-email':
                        return <ResentEmailPopup handleClose={handleClose} />;
                    case 'permitReContinue':
                        return <PermitReContinue handleClose={handleClose} />;
                    case 'removeQuarterPopup': 
                        return <RemoveQuarterPopup handleClose={handleClose} />;
                    default:
                        return null;
                }
            })()}
        </Dialog>
    )
}