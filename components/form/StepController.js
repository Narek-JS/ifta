import PaymentSvgIcon from "@/public/assets/svgIcons/PaymentSvgIcon";
import CarrierSvgIcon from "@/public/assets/svgIcons/CarrierSvgIcon";
import QuestionnaireSvgIcon from "@/public/assets/svgIcons/QuestionnaireSvgIcon";
import classNames from "classnames";

export default function StepController({router}) {
    const { pathname } = router;

    return (
        <div className="stepController grayBG pt-10">
            <div className="flexBetween alignStart">
                <div className={`stepItem ${pathname === "/form/carrier-info" ? "active" : "completed"}`}>
                    <div className="flex alignCenter gap5">
                        <CarrierSvgIcon/>
                        <h2 className="stepName font20 lighthouse-black">Carrier Info</h2>
                    </div>
                    <p className={classNames("stepDesc font14 lighthouse-black-80", {
                        'green': pathname === "/form/payment-info" || pathname === '/form/questionnaire' 
                    })}>Confirm Your Official Representative</p>
                </div>

                <div className="stepTransition">
                    <span>◼</span>
                    <div />
                    <span>▼</span>
                </div>

                <div className={`stepItem ${pathname === "/form/carrier-info" ? "" : pathname === "/form/questionnaire" ? "active": "completed"}`}>
                    <div className="flex alignCenter gap5">
                        <QuestionnaireSvgIcon/>
                        <h2 className="stepName font20 lighthouse-black">Additional Questions</h2>
                    </div>
                    <p className={classNames("stepDesc font14 lighthouse-black-80", {
                        'green': pathname === "/form/payment-info" 
                    })}>Provide More Business Info</p>
                </div>

                <div className="stepTransition">
                    <span>◼</span>
                    <div />
                    <span>▼</span>
                </div>

                <div className={`stepItem ${pathname === "/form/payment-info" ? "active" : ""}`}>
                    <div className="flex alignCenter gap5">
                        <PaymentSvgIcon/>
                        <h2 className="stepName font20 lighthouse-black">Payment Info</h2>
                    </div>
                    <p className="stepDesc font14 lighthouse-black-80">Pay and Complete Registration</p>
                </div>
            </div>
        </div>
    )
}