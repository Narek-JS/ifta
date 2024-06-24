import { getCorrectCardNumberFormat, getDateISOString, getTotalFormat } from '@/utils/helpers';
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from 'react';
import InputField from "@/components/universalUI/InputField";
import classNames from "classnames";
import dayjs from "dayjs";

export default function CForm({
    isAdmin,
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

    // Handle form input changes.
    const handleFormChange = (event) => {
        const { name, value } = event.target;

        // Prevent CVV from being more than 3 digits for non-Amex cards
        if(name === 'cardCvv' && useCardType !== "amex" && value.length > 3) {
            return;
        };

        // Update state values.
        onUpdateState(name, value);
    };

    // Handle card number changes and format the card number.
    const onCardNumberChange = (event) => {
        let { value, name } = event.target;
        let cardNumber = getCorrectCardNumberFormat(value);

        // Set the formatted card number and Update state values.
        setCardNumber(cardNumber.trimRight());
        onUpdateState(name, cardNumber);
    };

    // Handle focus event on CVV input.
    const onCvvFocus = () => onUpdateState('isCardFlipped', true);

    // Handle blur event on CVV input.
    const onCvvBlur = () => onUpdateState('isCardFlipped', false);

    return (
        <div className="card-form">
            <div className="card-list">{children}</div>
            <div className="card-form__inner">
                <div className={classNames("flexBetween gap10 mb20", { disabled: isAdmin })}>
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
                        value={isAdmin ? formik.values.cardNumber.replace(/(\d{4})(\*{4})(\*{4})(\d{4})/, '$1 $2 $3 $4') : cardNumber}
                    />
                    <InputField
                        {...(isAdmin && { value: formik.values.cardHolder })}
                        error={formik.touched.cardHolder && formik.errors.cardHolder}
                        label="Card Holders"
                        placeholder="Enter Name on card"
                        autoComplete="cc-name"
                        name="cardHolder"
                        required={true}
                        onChange={handleFormChange}
                        ref={cardHolderRef}
                        onFocus={(e) => onCardInputFocus(e, 'cardHolder')}
                        onBlur={(e)=> {
                            formik.handleBlur(e);
                            onCardInputBlur(e)
                        }}
                    />
                </div>
                <div className={classNames("flexBetween gap10", { disabled: isAdmin })}>
                    <InputField
                        error={formik.touched.cardDate && formik.errors.cardDate}
                        label="Expiration Date"
                        required={true}
                        element={
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateField
                                    format="MM/YY"
                                    ref={cardDateRef}
                                    onFocus={(e) => onCardInputFocus(e, 'cardDate')}
                                    onBlur={(e) => {
                                        formik.handleBlur(e);
                                        onCardInputBlur(e);
                                    }}
                                    slotProps={{
                                        textField: {
                                            helperText: formik.values.cardDate && "Invalid date",
                                        },
                                    }}
                                    value={isAdmin ? dayjs(formik.values.cardDate, "MM/YY") : cardDate}
                                    onChange={(e) => onUpdateState("cardDate", e)}
                                    minDate={dayjs(getDateISOString(new Date()))}
                                    placeholder="MM/YY"
                                    name="cardDate"
                                    autoComplete='cc-exp'
                                />
                            </LocalizationProvider>
                        }
                    />
                    { !Boolean(isAdmin) && (
                        <InputField
                            error={formik.touched.cardCvv && formik.errors.cardCvv}
                            label="Card CVV Number"
                            placeholder="CVV"
                            type="tel"
                            maxLength="4"
                            minLength="3"
                            autoComplete="cc-csc"
                            name="cardCvv"
                            required={true}
                            onFocus={onCvvFocus}
                            onBlur={(e)=> {
                                formik.handleBlur(e);
                                onCvvBlur(e)
                            }}
                            ref={cardCvv}
                            value={formik.values.cardCvv}
                            onChange={handleFormChange}
                        />
                    )}
                </div>
                <div className="orderDetail mt20 borderDashed">
                    <h3 className="font20 weight500 textCenter mb10">
                        <span className="primary weight700">Order Details </span>
                    </h3>
                    { Boolean(orderDetails?.vehicleCount) && (
                        <div className="flexBetween alignCenter mb10">
                            <p className="primary">Vehicle Total</p>
                            <p className="primary60">{orderDetails?.vehicleCount}</p>
                        </div>
                    )}
                    <div className="flexBetween alignCenter mb10">
                        <p className="primary">Total Cost</p>
                        <p className="primary60">${getTotalFormat(orderDetails?.totalCost)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};