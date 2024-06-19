import { StepTransition } from "../universalUI/StepTransition";
import { useStep } from "@/utils/hooks/useFormStep";
import { Fragment, memo } from "react";
import QuestionnaireSvgIcon from "@/public/assets/svgIcons/QuestionnaireSvgIcon";
import PaymentSvgIcon from "@/public/assets/svgIcons/PaymentSvgIcon";
import CarrierSvgIcon from "@/public/assets/svgIcons/CarrierSvgIcon";
import classNames from "classnames";

export default memo(function StepController({ withoutAdditionalQuestion }) {
    const step = useStep();

    return (
        <div className="stepController grayBG pt-10">
            <div className={classNames("flexBetween alignStart stepControllerWrapper", { [`step${step}`]: step })}>
                <div className={classNames('stepItem', { active: step === "1", completed: step !== "1" })}>
                    <div className="flex alignCenter gap5">
                        <CarrierSvgIcon />
                        <h2 className="stepName font20 lighthouse-black">Carrier Info</h2>
                    </div>
                    <p className={classNames("stepDesc font14 lighthouse-black-80", { 'green': step === "3" || step === '2' })}>
                        Confirm Your Official Representative
                    </p>
                </div>

                <StepTransition style={withoutAdditionalQuestion && { width: '85%', maxWidth: 'initial' }} />

                { !withoutAdditionalQuestion && (
                    <Fragment>
                        <div className={classNames('stepItem', { active: step === "2", completed: step !== "3" })}>
                            <div className="flex alignCenter gap5">
                                <QuestionnaireSvgIcon />
                                <h2 className="stepName font20 lighthouse-black">Additional Questions</h2>
                            </div>
                            <p className={classNames("stepDesc font14 lighthouse-black-80 nowrap", { 'green': step === "3" })}>
                                Provide More Business Info
                            </p>
                        </div>

                        <StepTransition className='stepTransitionToPayment' />
                    </Fragment>
                )}

                <div className={classNames('stepItem', { active: step === "3" })}>
                    <div className="flex alignCenter gap5">
                        <PaymentSvgIcon />
                        <h2 className="stepName font20 lighthouse-black">Payment Info</h2>
                    </div>
                    <p className="stepDesc font14 lighthouse-black-80 nowrap-768">Pay and Complete Registration</p>
                </div>
            </div>
        </div>
    );
});