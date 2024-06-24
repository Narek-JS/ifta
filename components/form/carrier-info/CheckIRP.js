import { VerificationContext } from "@/contexts/VerificationCarrierInfoContext";
import { useContext, useEffect, useRef, useState } from "react";
import { IRP_DOMAIN, QUARTERLY_FILLING_ID } from "@/utils/constants";
import InputField from "@/components/universalUI/InputField";
import classNames from "classnames";
import Link from "next/link";

export default function CheckIRP({ formik, newApp, require_ifta, application_typeId, state, iftaAccountNumberRef }) {
    const [workingOur, setWorkingOur] = useState(false);
    const timeoutId = useRef(null);

    const { loader } = useContext(VerificationContext);

    // Effect to check working hours and set intervals to update the working hours status.
    useEffect(() => {
        const checkWorkingHour = () => {
            const hour = new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Yerevan'})).getHours();
            if((hour >= 0 && hour <= 4) || (hour >= 17)) {
                // Set working hours to true if the current hour is within specified range.
                setWorkingOur(true);
            } else {
                // Set working hours to false otherwise.
                setWorkingOur(false);
            };
        };

        // Initial check of working hours.
        checkWorkingHour();

        // Get the current date and Calculate the number of milliseconds until the next hour.
        const now = new Date();
        const millisecondsUntilNextHour = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();
    
        // Set a timeout to check working hours at the start of the next hour.
        timeoutId.current = setTimeout(() => {
            checkWorkingHour();
            timeoutId.current = setInterval(checkWorkingHour, 60 * 60 * 1000);
        }, millisecondsUntilNextHour);
    
        // Cleanup function to clear timeout and interval on component unmount.
        return () => {
            clearTimeout(timeoutId.current);
            clearInterval(timeoutId.current);
        };
    }, []);

    // Handle changes to IFTA and IRP account numbers, trimming leading spaces.
    const handleIftaAndIrpAccountNumberChange = (event) => {
        const { target } = event;
        target.value = target.value.replace(/^\s+/g, '');
        formik.handleChange(event);
    };

    // Set IRP account value to '1' (Yes) in formik values.
    const handleIrpCheckMarkYes = () => {
        formik.setValues({ ...formik.values, irpAccount: '1'});
    };

    // Set IRP account value to '0' (No) and clear IRP account number in formik values.
    const handleIrpCheckMarkNo = () => {
        formik.setValues({ ...formik.values, irpAccount: '0', irpAccountNumber: '' });
    };

    // Booleans to manage conditional rendering of components.
    const isQuarterly = application_typeId === QUARTERLY_FILLING_ID;
    const isIrpAccount = !isQuarterly && (Boolean(!newApp || application_typeId === 4) && application_typeId !== 1) === false;
    const isIftaAccount = application_typeId !== 1 && require_ifta === '1';

    return (
        <div className="checkIRP whiteBg p20">
            <div className={classNames('mobile-initial-display gap20', {
                flex: isIrpAccount,
                sectionLoading: loader,
                'pointer-eventsNone': loader
            })}>
                { isIrpAccount && (
                    <div className="radioQuestion checkIrpAccount">
                        <p className="primary mb5">
                            Do you have an IRP Account?
                            <sup className="red"> * </sup>
                        </p>
                        <div className="radioGroup flex gap20 alignCenter">
                            <label className="flexCenter alignCenter gap5">
                                <input
                                    type="radio"
                                    value="yes"
                                    name="irpAccount"
                                    checked={formik.values.irpAccount === "1"}
                                    onChange={handleIrpCheckMarkYes}
                                />
                                <span className="primary">Yes</span>
                            </label>
                            <label className="flexCenter alignCenter gap5">
                                <input
                                    type="radio"
                                    value="no"
                                    name="irpAccount"
                                    checked={formik.values.irpAccount === "0"}
                                    onChange={handleIrpCheckMarkNo}
                                />
                                <span className="primary">No</span>
                            </label>
                        </div>
                        <p className="err-message">{formik.errors.irpAccount}</p>
                    </div>
                )}

                {/* When the User has not irp account but it's required  */}
                { Boolean(isIrpAccount && formik.values.irpAccount === "0" && state?.require_irp === '1') && (
                    <div className="notToConnctUs">
                        { workingOur ? (
                            <p>
                                In order to register for IFTA in the state of {state?.state} IRP Registration and Apportioned Plates are mandatory.
                                Please contact IRP Department at the number below: {"\u00A0"}
                                <Link href='tel:(888) 202-4927' className="underline primary">(888) 202-4927</Link>
                            </p>
                        ) : (
                            <p>
                                In order to register for IFTA in the state of {state?.state} IRP Registration and Apportioned Plates are mandatory.
                                Please complete the registration request for IRP in the website below: {"\u00A0"}
                                <Link href={IRP_DOMAIN} target="_blank" className="underline primary">
                                    IRP Registration Services
                                </Link>
                            </p>
                        )}
                    </div>
                )}

                {Boolean(isIrpAccount && formik.values.irpAccount === "1") && (
                    <InputField
                        onChange={handleIftaAndIrpAccountNumberChange}
                        {...(state?.require_irp === '1' && {
                            error: formik.errors.irpAccountNumber,
                            required: true
                        })}
                        onBlur={formik.handleBlur}
                        value={formik.values.irpAccountNumber === '0' ? '' : formik.values.irpAccountNumber}
                        name="irpAccountNumber"
                        label="IRP Account Number"
                        placeholder="Enter Entity Number"
                        className={classNames({'max-width-227': isQuarterly })}
                    />
                )}

                {isIftaAccount && (
                    <InputField
                        ref={iftaAccountNumberRef}
                        onChange={handleIftaAndIrpAccountNumberChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.iftaAccountNumber === '0' ? '' : formik.values.iftaAccountNumber}
                        error={formik.errors.iftaAccountNumber}
                        required={true}
                        name="iftaAccountNumber"
                        label="IFTA Account Number"
                        placeholder="Enter Entity Number"
                        className={classNames({'max-width-227': isQuarterly })}
                    />
                )}
            </div>
        </div>
    );
};