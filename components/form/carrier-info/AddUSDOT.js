import { clearUsdotValues, getUsdotValuesByNumber, selectUsdotValues, selectUsdotValuesStatus } from "@/store/slices/resgister";
import { VerificationContext } from "@/contexts/VerificationCarrierInfoContext";
import { LoadingRow } from "@/components/universalUI/LoadingRow";
import { useContext, useEffect, Fragment } from "react";
import { TO_GET_USDOT_DOMAIN } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { selectIsUser } from "@/store/slices/auth";
import { IMaskInput } from "react-imask";
import InputField from "@/components/universalUI/InputField";
import NormalBtn from "@/components/universalUI/NormalBtn";
import classNames from "classnames";
import Link from "next/link";

export default function AddUSDOT({ formik, handleVerify, disableBtn, einRef }) {
    const usdotValuesStatus = useSelector(selectUsdotValuesStatus);
    const usdotValues = useSelector(selectUsdotValues);
    const isUser = useSelector(selectIsUser);
    const dispatch = useDispatch();

    const { setVerified, loader, isVerifyUsdot, isUnVerifyedState, setIsUnVerifyedState } = useContext(VerificationContext);

    // Effect to fetch USDOT values when the formik value for usdotNumber changes and the values are empty.
    useEffect(() => {
        if(formik.values.usdotNumber && Object.keys(usdotValues).length === 0) {
            dispatch(getUsdotValuesByNumber({ usdotNumber: formik.values.usdotNumber }))
        };
    }, []);

    // Effect to clear USDOT values when the usdotValuesStatus is 'success' and the user status changes.
    useEffect(() => {
        if(usdotValues && usdotValuesStatus === 'success') {
            dispatch(clearUsdotValues());
        };
    }, [isUser]);

    // Handle form submission.
    const onSubmit = (e) => {
        e.preventDefault();
        handleVerify();
    };

    // Handle changes to the USDOT input field.
    const handleUsdotChange = (event) => {
        let string = event.target.value;
        if (/^\d+$/.test(string) || string === '') {
            formik.setValues({ ...formik.values, usdotNumber: string });
        };
    };

    // Handle selection of "No USDOT".
    const handleSelectNoUsdot = (event) => {
        setIsUnVerifyedState(true);
        setVerified(false);
        formik.handleChange(event);
    };

    // Handle selection of "Yes USDOT".
    const handleSelectYesUsdot = (event) => {
        isUnVerifyedState === false && setVerified(true);
        formik.handleChange(event);
    };

    return (
        <div className={classNames('addUSDOT whiteBg p20 mb10', { sectionLoading: loader })}>
            <form className="flexBetween gap20 alignEnd" onSubmit={onSubmit}>
                <div className="radioQuestion">
                    <p className="primary mb5 line24 nowrap">
                        Add an Active USDOT Number to Your IFTA Application
                        <sup className="red">* </sup>
                    </p>
                    <div className="radioGroup flex gap20 alignCenter">
                        <label className="flexCenter alignCenter gap5 line24 primary">
                            <input
                                type="radio"
                                value="yes"
                                name="isUSDOT"
                                checked={formik.values.isUSDOT === "yes"}
                                onChange={handleSelectYesUsdot}
                            />
                            <span className="white-space-nowrap">USDOT Number</span>
                        </label>
                        <label className="flexCenter alignCenter gap5 line24 primary">
                            <input
                                type="radio"
                                value="no"
                                name="isUSDOT"
                                checked={formik.values.isUSDOT === "no"}
                                onChange={handleSelectNoUsdot}
                            />
                            <span className="white-space-nowrap"> I don't have an active USDOT number to attach!</span>
                        </label>
                    </div>
                </div>
                {formik.values.isUSDOT === "yes" && (
                    <div className="usdotArea flex alignEnd gap20 justifyEnd w100">
                        <InputField
                            onChange={handleUsdotChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.usdotNumber}
                            error={(formik.touched.usdotNumber && formik.errors.usdotNumber) || usdotValuesStatus === 'failed' && 'USDOT Number Not Found'}
                            required={true}
                            id="usdotNumber"
                            name="usdotNumber"
                            label="USDOT Number"
                            placeholder="Enter your USDOT#"
                            type='text'
                            className='usdotInput min-150'
                        />
                        <NormalBtn
                            loading={loader}
                            onClick={handleVerify}
                            className={classNames('outlined usdotVerify bg-lighthouse-black', { disableBtn })}
                        >
                            Verify
                        </NormalBtn>
                        { isVerifyUsdot && <span className="error">Please verify your USDOT Number</span>}
                    </div>
                )}
                {formik.values.isUSDOT !== "yes" && (
                    <div className='formMessage primary'>
                        <p>
                            In order to register for the IFTA, you will need to have a valid USDOT number.
                            We can help you get one!
                            <Link href={TO_GET_USDOT_DOMAIN} target="_blank"> Click here </Link>
                            or simply call
                            <Link href="tel:8882330899">(888)-233-0899</Link>
                            to apply for your USDOT number.
                        </p>
                    </div>
                )}
            </form>
            { usdotValues.content && formik.values.isUSDOT === "yes" && (
                loader ? <LoadingRow /> : (
                    <div className={classNames('usdotValues', {
                        'blockEin': !usdotValues.content?.carrier?.ein
                    })}>
                        <div className="block">
                            <h2 className="title mb5">Company Name</h2>
                            <p className="subTitle ">{usdotValues.content?.carrier?.legalName}</p>
                        </div> 
                        <div className="block">
                            <h2 className="title mb5">Physical Address</h2>
                            <div className="wrapperContent">
                                { usdotValues.content?.carrier?.phyStreet && (
                                    <p className="subTitle"><span>Address: </span> {usdotValues.content.carrier.phyStreet} </p>
                                )}
                                { usdotValues.content?.carrier?.phyCity && (
                                    <p className="subTitle"><span>City: </span> {usdotValues.content.carrier.phyCity}</p>
                                )}
                                { usdotValues.content?.carrier?.phyState && (
                                    <p className="subTitle"><span>State: </span> {usdotValues.content.carrier.phyState}</p>
                                )}
                                { usdotValues.content?.carrier?.phyZipcode && (
                                    <p className="subTitle"><span>Zipcode: </span> {usdotValues.content.carrier.phyZipcode}</p>
                                )}
                            </div>                            
                        </div>

                        <div className="block">
                            { usdotValues.content?.carrier?.ein ? (
                                <Fragment>
                                    <h2 className="title mb5">EIN</h2>
                                    <p className="subTitle ">{"XX-XXX" + String(usdotValues.content?.carrier?.ein).slice(5)}</p>
                                </Fragment>
                            ) : (
                                <InputField
                                    className="phoneMask"
                                    label="EIN"
                                    required={true}
                                    error={formik.touched.ein && formik.errors.ein}
                                    element={<IMaskInput
                                        ref={einRef}
                                        type="tel"
                                        mask="00-0000000"
                                        onBlur={formik.handleBlur}
                                        value={formik.values.ein}
                                        onChange={formik.handleChange}
                                        id="ein"
                                        name="ein"
                                        placeholder="Enter EIN Number"
                                    />}
                                />
                            )}
                        </div> 
                    </div>
                )
            )}
        </div>
    );
};