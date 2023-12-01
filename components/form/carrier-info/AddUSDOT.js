import { IMaskInput } from "react-imask";
import { useDispatch, useSelector } from "react-redux";
import { clearUsdotValues, getUsdotValuesByNumber, selectUsdotValues, selectUsdotValuesStatus } from "@/store/slices/resgister";
import { LoadingRow } from "@/components/universalUI/LoadingRow";
import { useEffect } from "react";
import { selectIsUser } from "@/store/slices/auth";
import { Fragment } from "react";
import InputField from "@/components/universalUI/InputField";
import NormalBtn from "@/components/universalUI/NormalBtn";
import Link from "next/link";
import Fade from "react-reveal/Fade";
import classNames from "classnames";

export default function AddUSDOT({
    formik,
    handleVerify,
    loading,
    disableBtn,
    setVerified,
    isVerifyUsdot,
    statusUsdotValues,
    isTemporaryPermits,
    isUnVerifyedState,
    setIsUnVerifyedState
}) {
    const usdotValues = useSelector(selectUsdotValues);
    const dispatch = useDispatch();
    const isUSDOT = formik.values.isUSDOT === "yes";
    const isUser = useSelector(selectIsUser);
    const usdotValuesStatus = useSelector(selectUsdotValuesStatus);

    useEffect(() => {
        if(usdotValues && usdotValuesStatus === 'success') {
            dispatch(clearUsdotValues())
        }
    }, [isUser]);

    useEffect(() => {
        if(formik.values.usdotNumber && Object.keys(usdotValues).length === 0) {
            dispatch(getUsdotValuesByNumber({ usdotNumber: formik.values.usdotNumber }))
        };
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        handleVerify();
    };

    return (
        <div className={`addUSDOT whiteBg p20 mb10 ${loading ? 'sectionLoading' : ''}`}>
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
                                onChange={(e) => {
                                    isUnVerifyedState === false && setVerified(true);
                                    formik.handleChange(e);
                                }}
                            />
                            <span className="white-space-nowrap">USDOT Number</span>
                        </label>
                        <label className="flexCenter alignCenter gap5 line24 primary">
                            <input
                                type="radio"
                                value="no"
                                name="isUSDOT"
                                checked={formik.values.isUSDOT === "no"}
                                onChange={(e) => {
                                    setIsUnVerifyedState(true);
                                    setVerified(false);
                                    formik.handleChange(e);
                                }}
                            />
                            <span className="white-space-nowrap"> I don't have an active USDOT number to attach!</span>
                        </label>
                    </div>
                </div>
                {isUSDOT && !isTemporaryPermits ? <Fade>
                    <div className="usdotArea flex alignEnd gap20 ">
                        <InputField
                            onChange={(event) => {
                                let string = event.target.value;
                                if (/^\d+$/.test(string) || string === '') {
                                    formik.setValues({
                                        ...formik.values,
                                        usdotNumber: string
                                    })
                                }
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.usdotNumber}
                            error={(formik.touched.usdotNumber && formik.errors.usdotNumber) || statusUsdotValues === 'failed' && 'USDOT Number Not Found'}
                            required={true}
                            id="usdotNumber"
                            name="usdotNumber"
                            label="USDOT Number"
                            placeholder="Enter your USDOT#"
                            type='text'
                            className='usdotInput min-150'
                        />
                        <NormalBtn
                            loading={loading}
                            onClick={handleVerify}
                            className={`outlined usdotVerify bg-lighthouse-black ${disableBtn ? "disableBtn" : ""}`}
                        >
                            Verify
                        </NormalBtn>
                        { Boolean(isVerifyUsdot) && <span className="error">Please verify your USDOT Number</span>}
                    </div>
                </Fade> : ""}
                {!isUSDOT ? <Fade>
                    <div className={`formMessage primary`}>
                        <p>
                            In order to register for the IFTA, you will need to have a valid USDOT number. We can help
                            you
                            get one! <Link href="https://www.dotoperatingauthority.com/how-to-get-a-usdot-number-2/" target="_blank"> Click
                            here </Link>
                            or simply call <Link href="tel:8882330899">(888)-233-0899</Link> to apply for your USDOT
                            number.
                        </p>
                    </div>
                </Fade> : ""}
                { Boolean(isUSDOT) === true && isTemporaryPermits && (
                    <div className={`formMessage primary`}>
                        <p>
                            If you are looking for temporary fuel permits, you will need to apply for individual trip/fuel permits. Our sister company, <Link href='https://www.tripsandfuel.com/#tripAndFuelNationWide'>Trip Fuel Permits</Link>, is happy to help you obtain your temporary permit(s)!
                        </p>
                    </div>
                )}
            </form>
            { usdotValues.content && formik.values.isUSDOT === "yes" && !isTemporaryPermits && (
                loading ? <LoadingRow /> : (
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
                                { usdotValues.content?.carrier?.phyStreet &&
                                    <p className="subTitle"><span>Address: </span> {usdotValues.content.carrier.phyStreet} </p>
                                }
                                { usdotValues.content?.carrier?.phyCity && 
                                    <p className="subTitle"><span>City: </span> {usdotValues.content.carrier.phyCity}</p>
                                }
                                { usdotValues.content?.carrier?.phyState && 
                                    <p className="subTitle"><span>State: </span> {usdotValues.content.carrier.phyState}</p>
                                }
                                { usdotValues.content?.carrier?.phyZipcode &&  
                                    <p className="subTitle"><span>Zipcode: </span> {usdotValues.content.carrier.phyZipcode}</p>
                                }
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
    )
}