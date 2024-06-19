import { createOrder, paymentFromEmail, selectPaymentFromEmailData, selectPaymentFromEmailStatus } from "@/store/slices/payment";
import { getExtraData, selectExtraData } from "@/store/slices/resgister";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import UserInfo from "@/components/form/payment-info/UserInfo";
import Billing from "@/components/form/payment-info/Billing";
import NormalBtn from "@/components/universalUI/NormalBtn";
import MainScreen from "@/components/screens/MainScreen";
import schemas, { paymentSchema } from "@/utils/schemas";
import Cookies from 'js-cookie';
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

const cardType = (cardNumberInit) => {
    const number = cardNumberInit;
    let re;
    for (const [card, pattern] of Object.entries(CARDS)) {
        re = new RegExp(pattern);
        if (number.match(re) != null) {
            return card;
        };
    };

    return '';
};

export default function PaymentFromEmail() {
    const [submitLoading, setSubmitLoading] = useState(false);
    const [cvcValidation, setCvcValidatoin] = useState(null);
    const [condition, setCondition] = useState(false);

    const paymentFromEmailStatus = useSelector(selectPaymentFromEmailStatus);
    const paymentFromEmailData = useSelector(selectPaymentFromEmailData);
    const extraData = useSelector(selectExtraData);
    const dispatch = useDispatch();

    const mainScreenRef = useRef();
    const billingRef = useRef();

    const { query, push, pathname } = useRouter();

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
            setSubmitLoading(true);
            dispatch(createOrder({
                ...(paymentFromEmailData?.is_admin !== 1 && { card_number: values.cardNumber }),
                card_holder: values.cardHolder,
                card_exp_date: values.cardDate,
                ...(paymentFromEmailData?.is_admin !== 1 && { card_cvc: values.cardCvv }),
                billing_address: values.address,
                billing_city: values.city,
                billing_state_id: values.state.id,
                billing_zip_code: values.zip_code,
                initial: values.initial1,
                signature: values.signature,
                permit_id: paymentFromEmailData?.permit?.form_id,
                web_site: 0,
                hash: Cookies.get('hash')
            })).then(res => {
                setSubmitLoading(false);

                if(res?.error?.message === "Rejected") {
                    return toast.error(res.payload?.result?.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                };

                if(res?.payload?.message?.toLowerCase?.()?.includes('failed')) {
                    return toast.error(res?.payload?.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }

                return push("/thank-you");
            });
        },
        validationSchema: yup.object({
            address: schemas.text,
            city: schemas.text,
            state: schemas.select,
            zip_code: schemas.zip_code,
            initial1: schemas.initial1,
            initial2: schemas.initialConfirm,
            initial3: schemas.initialConfirm,
            initial4: schemas.initialConfirm,
            signature: schemas.required,
            cardNumber: schemas.cardNumber,
            cardHolder: schemas.cardHolder,
            cardDate: schemas.required,
            ...(cvcValidation && { cardCvv: cvcValidation })
        })
    });

    useEffect(() => {
        return () => {
            Cookies.remove('hash');
        };
    }, []);

    useEffect(() => {
        if(query.token) {
            Cookies.set('hash', query.token);
        };

        if(Cookies.get('hash') && paymentFromEmailStatus === '') {
            dispatch(paymentFromEmail({ token: Cookies.get('hash') }))
                .then((res) => {
                    if(res?.error?.message === "Rejected") {
                        return push({
                            pathname: '/404',
                            query: { message: res.payload?.result?.message }
                        });
                    };

                    if(!extraData) {
                        dispatch(getExtraData(2));
                    };
                }).finally(() => {
                    push({ pathname, query: {} });
                });
        };
    }, [query]);

    useEffect(() => {
        if(paymentFromEmailStatus !== 'success' || !extraData) {
            return;
        };

        if(paymentFromEmailData?.is_admin === 1) {
            formik.setValues({
                ...formik.values,
                cardNumber: paymentFromEmailData?.card_number,
                cardHolder: paymentFromEmailData?.card_holder,
                cardDate: paymentFromEmailData?.card_exp_date,
                cardCvv: paymentFromEmailData?.card_cvc || '',
                address: paymentFromEmailData?.billing_address,
                city: paymentFromEmailData?.billing_city,
                state: extraData?.allStates?.find?.(state => state.id === paymentFromEmailData?.billing_state_id),
                zip_code: paymentFromEmailData?.billing_zip_code,
            });
        };
    }, [paymentFromEmailData, paymentFromEmailStatus, extraData]);

    const useCardType = useMemo(() => {
        return cardType(formik.values.cardNumber);
    }, [formik.values.cardNumber]);

    useEffect(() => {
        if(paymentFromEmailData?.is_admin !== 0) {
            return;
        };

        if(useCardType === "amex") {
            setCvcValidatoin(schemas.cvvAmex);
        } else {
            setCvcValidatoin(schemas.cvv);
        };
    }, [useCardType]);

    const handleSubmit = (event) => {
        const firstGroup = [ "cardNumber", "cardHolder", "cardDate", "cardCvv" ];
        const seccondGroup = [ "address", "city", "state", "zip_code" ];

        if(firstGroup.find(name => formik.errors[name])) {
            mainScreenRef.current?.scrollIntoView({ behavior: "smooth" });
        };

        if(seccondGroup.find(name => formik.errors[name])) {
            billingRef.current?.scrollIntoView({ behavior: "smooth" });
        };

        formik.handleSubmit(event);
    };

    if(!paymentFromEmailData) return null;

    return (
        <main className="formPage mPadding grayBG">
            <div className="formPageCard grayBG">
                <MainScreen
                    formRef={mainScreenRef}
                    formik={formik}
                    orderDetails={{ totalCost: paymentFromEmailData?.cost }}
                    useCardType={useCardType}
                    isAdmin={paymentFromEmailData?.is_admin === 1}
                />

                <Billing
                    formRef={billingRef}
                    formik={formik}
                    states={extraData?.allStates}
                    isAdmin={paymentFromEmailData?.is_admin === 1}
                />

                <UserInfo
                    formik={formik}
                    data={{ name: paymentFromEmailData?.full_name, title: 'Official Representative' }}
                    condition={condition}
                    setCondition={setCondition}
                />

                <NormalBtn
                    loading={submitLoading}
                    disabled={condition === false}
                    onClick={handleSubmit}
                    className={`ml-auto mr20 nextStep secondary outlined ${condition === false ? "disableBtn": "bg-lighthouse-black"}`}
                >
                    Submit
                </NormalBtn>
            </div>
        </main>
    );
};