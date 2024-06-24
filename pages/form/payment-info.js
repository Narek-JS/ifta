import { createOrder, getCarrierInfo, selectCarrierInfo, setPaymentLoading } from "@/store/slices/payment";
import { clearPermit, getExtraData, selectExtraData } from "@/store/slices/resgister";
import { useEffect, useState, useRef, useMemo } from "react";
import { getPermitId } from "@/store/slices/questionnaire";
import { QUARTERLY_FILLING_ID } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import CarrierDetails from "@/components/form/payment-info/CarrierDetails";
import NextSvgIcon from "@/public/assets/svgIcons/NextSvgIcon";
import UserInfo from "@/components/form/payment-info/UserInfo";
import StepController from "@/components/form/StepController";
import Billing from "@/components/form/payment-info/Billing";
import NormalBtn from "@/components/universalUI/NormalBtn";
import MainScreen from "@/components/screens/MainScreen";
import schemas, { paymentSchema } from "@/utils/schemas";
import classNames from "classnames";
import * as yup from "yup";

// Card types regex patterns.
const CARDS = {
    visa: '^4',
    amex: '^(34|37)',
    mastercard: '^5[1-5]',
    discover: '^6011',
    unionpay: '^62',
    troy: '^9792',
    diners: '^(30[0-5]|36)'
};

// Function to determine card type based on card number.
export const cardType = (cardNumberInit) => {
    const number = cardNumberInit;
    let re;
    for (const [card, pattern] of Object.entries(CARDS)) {
        re = new RegExp(pattern);
        if (number?.match?.(re) != null) {
            return card;
        };
    };

    return '';
};

export default function PaymentInfo() {
    const router = useRouter();
    const dispatch = useDispatch();
    const carrierInfo = useSelector(selectCarrierInfo);
    const extraData = useSelector(selectExtraData);
    const [loading, setLoading] = useState(false);
    const [condition, setCondition] = useState(false);
    const [permit_id, setPermitID] = useState("");
    const [cvcValidation, setCvcValidatoin] = useState(null);

    const mainScreenRef = useRef();
    const billingRef = useRef();

    const formik = useFormik({
        initialValues: {
            cardNumber: "",
            cardHolder: "",
            cardDate: "",
            cardCvv: "",
            address: "",
            city: "",
            state: "",
            zip_code: "",
            initial1: "",
            initial2: "",
            initial3: "",
            initial4: "",
            signature: ""
        },
        onSubmit: (values) => {
            setLoading(true);
            dispatch(createOrder({
                card_number: values.cardNumber,
                card_holder: values.cardHolder,
                card_exp_date: values.cardDate,
                card_cvc: values.cardCvv,
                billing_address: values.address,
                billing_city: values.city,
                billing_state_id: values.state.id,
                billing_zip_code: values.zip_code,
                initial: values.initial1,
                signature: values.signature,
                permit_id,
                web_site: 1
            })).then(res => {
                setLoading(false);
                if(res?.payload.action) {
                    formik.resetForm();
                    router.push("/thank-you");
                    dispatch(clearPermit());
                } else {
                    const errors = res.payload?.result?.data
                    if(errors) {
                        formik.setErrors({
                            cardNumber: errors.card_number || "" ,
                            cardHolder: errors.card_holder || "",
                            cardDate: errors.card_exp_date || "" ,
                            cardCvv: errors.card_cvc || "" ,
                            address: errors.billing_address || "",
                            city: errors.billing_city,
                            zip_code: errors.billing_zip_code || "",
                            initial1: errors.initial || "",
                            signature: errors.signature || "" ,
                        })
                    };

                    toast.error(res.payload?.result?.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                };
            });
        },
        validationSchema: yup.object({
            ...paymentSchema,
            cardCvv: cvcValidation
        })
    });

    // useEffect to fetch data on component mount
    useEffect(() => {
        dispatch(setPaymentLoading(true))
        dispatch(getExtraData(2));
        dispatch(getPermitId())
            .then(res => {
                if(res?.payload?.action) {
                    setPermitID(res.payload.data?.form_id)
                    dispatch(getCarrierInfo(res.payload.data?.form_id))
                        .then((resCarrierInformation) => {
                            if(resCarrierInformation?.payload?.result?.action === false) {
                                // Notify and redirect in case of error
                                toast.error(resCarrierInformation?.payload?.result?.message, {
                                    position: toast.POSITION.TOP_RIGHT
                                });
                                return router.push(`/form/carrier-info?permitId=${res.payload.data?.form_id}`);
                            };
                            dispatch(setPaymentLoading(false));
                        });
                } else {
                    router.push("/form/carrier-info");
                };
            });

        return () => {
            dispatch(setPaymentLoading(false));
        };
    }, []);

    // useMemo to determine card type based on card number
    const useCardType = useMemo(() => {
        return cardType(formik.values.cardNumber);
    }, [formik.values.cardNumber]);

    // useEffect to set CVC validation schema based on card type
    useEffect(() => {
        if(useCardType === "amex") {
            setCvcValidatoin(schemas.cvvAmex);
        } else {
            setCvcValidatoin(schemas.cvv);
        }
    }, [useCardType]);
    
    // Handle form submission and scroll to error fields if any
    const handleSubmit = (event) => {
        const firstGroup = [ "cardNumber", "cardHolder", "cardDate", "cardCvv" ];
        const seccondGroup = [ "address", "city", "state", "zip_code" ];

        if(firstGroup.find(name => formik.errors[name])) {
            mainScreenRef.current?.scrollIntoView({behavior: "smooth"});
        };

        if(seccondGroup.find(name => formik.errors[name])) {
            billingRef.current?.scrollIntoView({behavior: "smooth"});
        };

        formik.handleSubmit(event);
    };

    // Handle Previous Step button click.
    const handlePreviousStep = () => {
        if(carrierInfo?.carrierInformation?.application_type?.id === QUARTERLY_FILLING_ID) {
            router.push(`/form/carrier-info?permitId=${permit_id}`);
        } else {
            router.push("/form/questionnaire");
        };
    };

    return (
        <main className={classNames("formPage mPadding grayBG", { unclickableChilds: loading })}>
            <div className="formPageCard grayBG">
                <h1 className="formTitle font24 line24 textCenter" style={{ background: "#FFFFFF" }}>
                    <span className="primary">IFTA Application Form</span>
                </h1>

                {/* Render Steps with quarter or not condition */}
                <StepController
                    withoutAdditionalQuestion={carrierInfo?.carrierInformation?.application_type?.id === QUARTERLY_FILLING_ID}
                />

                {/* Render carrierInformation table */}
                <CarrierDetails data={carrierInfo?.carrierInformation} />

                {/* Render main screen section */}
                <MainScreen
                    formRef={mainScreenRef}
                    formik={formik}
                    orderDetails={carrierInfo?.orderDetails}
                    useCardType={useCardType}
                />

                {/* Render billing information section */}
                <Billing
                    formRef={billingRef}
                    formik={formik}
                    states={extraData?.allStates}
                    usdotNumber={carrierInfo?.carrierInformation?.USDOT}
                />

                {/* Render user information section */}
                {carrierInfo?.user && <UserInfo
                    formik={formik}
                    data={carrierInfo?.user}
                    condition={condition}
                    setCondition={setCondition}
                />}

                {/* Render submit button */}
                <div className="steBtns flexBetween">
                    <NormalBtn onClick={handlePreviousStep} className="prevStep bg-lighthouse-black outlined gap5">
                        <NextSvgIcon/>
                        Previous Step
                    </NormalBtn>
                    <NormalBtn
                        loading={loading}
                        disabled={condition === false}
                        onClick={handleSubmit}
                        className={`nextStep secondary outlined ${condition === false ? "disableBtn": ""}`}
                    >
                        Submit
                    </NormalBtn>
                </div>
            </div>
        </main>
    );
};