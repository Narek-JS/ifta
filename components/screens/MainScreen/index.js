import React, {useState, useRef, useCallback, useEffect} from 'react';
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import CForm from './components/form';
import Card from './components/card';
import dayjs from "dayjs";
import { cardType } from '@/pages/form/payment-info';

const initialState = {
    cardNumber: '',
    cardHolder: '',
    cardCvv: '',
    cardDate: "",
    isCardFlipped: false,
    
};

const MainScreen = ({orderDetails, formik, formRef, useCardType}) => {
    const {width} = useWindowSize();
    const [state, setState] = useState(initialState);
    const [currentFocusedElm, setCurrentFocusedElm] = useState(null);

    const updateStateValues = useCallback(
        (keyName, value) => {
            if(keyName === 'cardDate') {
                setState({
                    ...state,
                    [keyName]: dayjs(value).format('MM/YY') !== 'Invalid Date' ? (value || initialState[keyName]) : initialState[keyName]
                });
            } else {
                setState({
                    ...state,
                    ...(keyName === 'cardNumber' && cardType(value) !== 'amex' && formik.values.cardCvv.length > 3 && { cardCvv: '' }),
                    [keyName]: value || initialState[keyName]
                });
            };
        },
        [state]
    );

    useEffect(() => {
        const month = state.cardDate ? (state.cardDate.month() + 1).toString() : "";
        const year = state.cardDate ? state.cardDate.year().toString().substr(-2) : "";

        formik.setValues({
            ...formik.values,
            cardNumber: state.cardNumber.split(" ").join(""),
            cardHolder: state.cardHolder,
            cardDate: month && year ? (month.length < 2 ? "0" + month : month) + "/" + year: "",
            cardCvv: state.cardCvv,
        });
    }, [state]);

    // References for the Form Inputs used to focus corresponding inputs.
    let formFieldsRefObj = {
        cardNumber: useRef(),
        cardHolder: useRef(),
        cardDate: useRef(),
        cardCvv: useRef()
    };

    let focusFormFieldByKey = useCallback((key) => {
        formFieldsRefObj[key].current.focus();
    });

    // This are the references for the Card DIV elements.
    let cardElementsRef = {
        cardNumber: useRef(),
        cardHolder: useRef(),
        cardDate: useRef()
    };

    let onCardFormInputFocus = (_event, inputName) => {
        const refByName = cardElementsRef[inputName];
        setCurrentFocusedElm(refByName);
    };

    let onCardInputBlur = useCallback(() => {
        setCurrentFocusedElm(null);
    }, []);

    return (
        <>
            <h2 className="subTitle font20 line24 whiteBg textCenter weight500 mb10" ref={formRef}>
                <span className="secondary"> </span>
                <span className="primary">Payment Information</span>
            </h2>
            <div className="wrapper mb10 grayBG">
                <CForm
                    formik={formik}
                    orderDetails={orderDetails}
                    cardMonth={state.cardMonth}
                    cardDate={state.cardDate}
                    cardYear={state.cardYear}
                    onUpdateState={updateStateValues}
                    cardNumberRef={formFieldsRefObj.cardNumber}
                    cardHolderRef={formFieldsRefObj.cardHolder}
                    cardDateRef={formFieldsRefObj.cardDate}
                    cardCvv={formFieldsRefObj.cardCvv}
                    onCardInputFocus={onCardFormInputFocus}
                    onCardInputBlur={onCardInputBlur}
                    useCardType={useCardType}
                >
                    {width > 768 ? <Card
                        cardNumber={state.cardNumber}
                        cardHolder={state.cardHolder}
                        cardMonth={state.cardMonth}
                        cardYear={state.cardYear}
                        cardCvv={state.cardCvv}
                        cardDate={state.cardDate}
                        isCardFlipped={state.isCardFlipped}
                        currentFocusedElm={currentFocusedElm}
                        onCardElementClick={focusFormFieldByKey}
                        cardNumberRef={cardElementsRef.cardNumber}
                        cardHolderRef={cardElementsRef.cardHolder}
                        cardDateRef={cardElementsRef.cardDate}
                    ></Card>: ""}
                </CForm>
            </div>
        </>
    );
};

export default MainScreen;