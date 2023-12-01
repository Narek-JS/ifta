import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getPermitId} from "@/store/slices/questionnaire";
import {createOrder, getCarrierInfo, selectCarrierInfo, setPaymentLoading} from "@/store/slices/payment";
import {useFormik} from "formik";
import {clearPermit, getExtraData, selectExtraData} from "@/store/slices/resgister";
import {toast} from "react-toastify";
import {useRef} from "react";
import {useMemo} from "react";
import StepController from "@/components/form/StepController";
import Fade from "react-reveal/Fade";
import MainScreen from "@/components/screens/MainScreen";
import NormalBtn from "@/components/universalUI/NormalBtn";
import NextSvgIcon from "@/public/assets/svgIcons/NextSvgIcon";
import CarrierDetails from "@/components/form/payment-info/CarrierDetails";
import Billing from "@/components/form/payment-info/Billing";
import schemas from "@/utils/schemas";
import UserInfo from "@/components/form/payment-info/UserInfo";
import classNames from "classnames";
import * as yup from "yup";

const CARDS = {
    visa: '^4',
    amex: '^(34|37)',
    mastercard: '^5[1-5]',
    discover: '^6011',
    unionpay: '^62',
    troy: '^9792',
    diners: '^(30[0-5]|36)'
};

export const cardType = (cardNumberInit) => {
    const number = cardNumberInit;
    let re;
    for (const [card, pattern] of Object.entries(CARDS)) {
        re = new RegExp(pattern);
        if (number.match(re) != null) {
            return card;
        }
    };

    return '';
};

export default function PaymentInfo() {
    const router = useRouter();
    const dispatch = useDispatch();
    const carrierInfo = useSelector(selectCarrierInfo);
    const states = useSelector(selectExtraData)?.allStates;
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
                permit_id
            })).then(res => {
                setLoading(false);
                if(res?.payload.action){
                    formik.resetForm();
                    router.push("/history");
                    dispatch(clearPermit());
                } else {
                    const errors = res.payload?.result?.data
                    if(errors){
                        formik.setErrors({
                            cardNumber:  errors.card_number || "" ,
                            cardHolder: errors.card_holder || "",
                            cardDate:   errors.card_exp_date || "" ,
                            cardCvv:  errors.card_cvc || "" ,
                            address: errors.billing_address || "",
                            city:  errors.billing_city,
                            zip_code: errors.billing_zip_code || "",
                            initial1: errors.initial || "",
                            signature: errors.signature || "" ,
                        })
                    }
                    toast.error(res.payload?.result?.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            })
        },
        validationSchema: yup.object(
            {
                address: schemas.text,
                city: schemas.text,
                state: schemas.select,
                zip_code: schemas.zip_code,
                initial1:schemas.initial1,
                initial2:schemas.initialConfirm,
                initial3:schemas.initialConfirm,
                initial4:schemas.initialConfirm,
                signature: schemas.required,
                cardNumber: schemas.cardNumber,
                cardHolder: schemas.required,
                cardDate: schemas.required,
                cardCvv: cvcValidation,
            }
        )
    });

    useEffect(() => {
        dispatch(setPaymentLoading(true))
        dispatch(getExtraData(2));
        dispatch(getPermitId())
            .then(res => {
                if (res?.payload?.action) {
                    setPermitID(res.payload.data?.form_id)
                    dispatch(getCarrierInfo(res.payload.data?.form_id))
                        .then((resCarrierInformation) => {
                            if(resCarrierInformation?.payload?.result?.action === false) {
                                toast.error(resCarrierInformation?.payload?.result?.message, {
                                    position: toast.POSITION.TOP_RIGHT
                                });
                                return router.push("/form/carrier-info");
                            };
                            dispatch(setPaymentLoading(false))
                        })
                } else {
                    router.push("/form/carrier-info")
                }
            })
        return () => {
            dispatch(setPaymentLoading(false))
        }
    }, []);

    const useCardType = useMemo(() => {
        return cardType(formik.values.cardNumber);
    }, [formik.values.cardNumber]);

    useEffect(()=> {
            if(useCardType === "amex"){
                setCvcValidatoin(schemas.cvvAmex)
            } else {
                setCvcValidatoin(schemas.cvv)
            }
    }, [useCardType]);
    
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

    return (
        <main className={classNames(
            "formPage formPage mPadding grayBG", 
            { unclickableChilds: loading }
        )}>
            <Fade>
                <div className="formPageCard grayBG">
                    <h1 className="formTitle font24 line24 textCenter" style={{ background: "#FFFFFF" }}>
                        <span className="primary">IFTA Application Form</span>
                    </h1>
                    <StepController router={router}/>

                    <CarrierDetails
                        data={carrierInfo?.carrierInformation}
                    />

                    <MainScreen
                        formRef={mainScreenRef}
                        formik={formik}
                        orderDetails={carrierInfo?.orderDetails}
                        useCardType={useCardType}
                    />
                    <Billing
                        formRef={billingRef}
                        formik={formik}
                        states={states}
                        usdotNumber={carrierInfo?.carrierInformation?.USDOT}
                    />
                    {carrierInfo?.user && <UserInfo
                        formik={formik}
                        data={carrierInfo?.user}
                        condition={condition}
                        setCondition={setCondition}
                    />}
                    <div className="steBtns flexBetween">
                        <NormalBtn onClick={() => {
                            router.push("/form/questionnaire")
                        }} className="prevStep bg-lighthouse-black outlined gap5">
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
            </Fade>
        </main>
    );
};