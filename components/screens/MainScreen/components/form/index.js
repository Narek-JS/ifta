import React, { useState } from 'react';
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputField from "@/components/universalUI/InputField";
import dayjs from "dayjs";
import { getTotalFormat } from '@/utils/helpers';

export default function CForm({
    formik,
    orderDetails,
    onUpdateState,
    cardNumberRef,
    cardHolderRef,
    cardDateRef,
    onCardInputFocus,
    onCardInputBlur,
    cardCvv,
    children,
    cardDate,
    useCardType
}) {
    const [cardNumber, setCardNumber] = useState('');
    
    const handleFormChange = (event) => {
        const { name, value } = event.target;
        if(name === 'cardCvv' && useCardType !== "amex" && value.length > 3) {
            return;
        };

        onUpdateState(name, value);
    };

    const date = new Date();
    const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
        .toISOString()
        .split("T")[0];

    const onCardNumberChange = (event) => {
        let { value, name } = event.target;
        let cardNumber = value;
        value = value.replace(/\D/g, '');

        if (/^3[47]\d{0,13}$/.test(value)) {
            cardNumber = value
                .replace(/(\d{4})/, '$1 ')
                .replace(/(\d{4}) (\d{6})/, '$1 $2 ');
        } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
            // diner's club, 14 digits
            cardNumber = value
                .replace(/(\d{4})/, '$1 ')
                .replace(/(\d{4}) (\d{6})/, '$1 $2 ');
        } else if (/^\d{0,16}$/.test(value)) {
            // regular cc number, 16 digits
            cardNumber = value
                .replace(/(\d{4})/, '$1 ')
                .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
                .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
        }

        setCardNumber(cardNumber.trimRight());
        onUpdateState(name, cardNumber);
    };

    const onCvvFocus = () => {
        onUpdateState('isCardFlipped', true);
    };

    const onCvvBlur = () => {
        onUpdateState('isCardFlipped', false);
    };

    return (
        <div className="card-form">
            <div className="card-list">{children}</div>
            <div className="card-form__inner">
                <div className="flexBetween gap10 mb20">
                    <InputField
                        onBlur={(e)=> {
                            formik.handleBlur(e);
                            onCardInputBlur(e)
                        }}
                        error={formik.touched.cardNumber && formik.errors.cardNumber}
                        label="Card Number"
                        required={true}
                        placeholder="Enter card number"
                        type="tel"
                        name="cardNumber"
                        autoComplete="cc-number"
                        onChange={onCardNumberChange}
                        maxLength="19"
                        ref={cardNumberRef}
                        onFocus={(e) => onCardInputFocus(e, 'cardNumber')}
                        value={cardNumber}
                    />
                    <InputField
                        error={formik.touched.cardHolder && formik.errors.cardHolder}
                        type="tel"
                        label="Card Holders"
                        placeholder="Enter Name on card"
                        autoComplete="cc-name"
                        name="cardHolder"
                        onChange={handleFormChange}
                        ref={cardHolderRef}
                        onFocus={(e) => onCardInputFocus(e, 'cardHolder')}
                        onBlur={(e)=> {
                            formik.handleBlur(e);
                            onCardInputBlur(e)
                        }}
                    />
                </div>
                <div className="flexBetween gap10">
                    <InputField
                        error={formik.touched.cardDate && formik.errors.cardDate}
                        label="Expiration Date"
                        required={true}
                        element={
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateField
                                    format="MM/YY"
                                    inputRef={cardDateRef}
                                    onFocus={(e) => onCardInputFocus(e, 'cardDate')}
                                    onBlur={(e)=> {
                                        formik.handleBlur(e);
                                        onCardInputBlur(e);
                                    }}
                                    slotProps={{
                                        textField: {
                                            helperText: formik.values.cardDate && "Invalid date",
                                        },
                                    }}
                                    value={cardDate}
                                    onChange={(e)=> {
                                        onUpdateState("cardDate", e);
                                    }}
                                    minDate={dayjs(dateString)}
                                    placeholder="MM/YY"
                                    name="cardDate"
                                    autoComplete='cc-exp'
                                />
                            </LocalizationProvider>
                        }
                    />
                    <InputField
                        error={formik.touched.cardCvv && formik.errors.cardCvv}
                        label="Card CVV Number"
                        placeholder="CVV"
                        type="tel"
                        maxLength="4"
                        minLength="3"
                        autoComplete="cc-csc"
                        name="cardCvv"
                        onFocus={onCvvFocus}
                        onBlur={(e)=> {
                            formik.handleBlur(e);
                            onCvvBlur(e)
                        }}
                        ref={cardCvv}
                        value={formik.values.cardCvv}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="orderDetail mt20 borderDashed">
                    <h3 className="font20 weight500 textCenter mb10">
                        <span className="primary weight700">Order Details </span>
                    </h3>
                    <div className="flexBetween alignCenter mb10">
                        <p className="primary">Vehicle Total</p>
                        <p className="primary60">{orderDetails?.vehicleCount}</p>
                    </div>
                    <div className="flexBetween alignCenter mb10">
                        <p className="primary">Total Cost</p>
                        <p className="primary60">${getTotalFormat(orderDetails?.totalCost)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
