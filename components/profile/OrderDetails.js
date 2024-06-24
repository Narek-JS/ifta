import { getExtraData, selectExtraData } from "@/store/slices/resgister";
import { getQuarterPeriodDate, getTotalFormat } from "@/utils/helpers";
import { PrintIcon } from "@/public/assets/svgIcons/PrintIcon";
import { Fragment, useEffect, useRef, memo } from "react";
import { QUARTERLY_FILLING_ID } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

export default memo(function OrderDetails({ data }) {
    const extraData = useSelector(selectExtraData);
    const dispatch = useDispatch();

    const ref = useRef();

    const isQuarter = data?.application_type?.id === QUARTERLY_FILLING_ID;

    useEffect(() => {
        if(isQuarter && !extraData) {
            dispatch(getExtraData(1));
        };
    }, []);

    return (
        <div ref={ref} className="carrierInfo grayBG p-initial orderDetailsTb">
            <div className="carrierInfoCard whiteBg">
                <div className=" borderDashed">
                    <div
                        onClick={() => window.print()}
                        className="primary weight700 flex alignCenter gap5 pointer ml20 toPdf"
                    >
                        <PrintIcon />
                        <span>Print and download this order</span>
                    </div>

                    <h3 className="infoSubTitle textCenter weight500 font20">
                        <span className="primary">Carrier Details</span>
                    </h3>

                    <table className="infoContainer">
                        <tbody>
                            <tr>
                                <td>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">Email:</p>
                                        <p className="primary60 email">{data?.email}</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">Base State :</p>
                                        <p className="primary60">{data?.state?.state}</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">USDOT Number:</p>
                                        <p className="primary60">{data?.USDOT}</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">Phone Number:</p>
                                        <p className="primary60">{data.phone}</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">IRP Account Number :</p>
                                        <p className="primary60">{Number(data.irp_account_number) ? 'No' : 'Yes'}</p>
                                    </div>

                                </td>
                                <td>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">EIN:</p>
                                        <p className="primary60">{data.EIN}</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">Application Type :</p>
                                        <p className="primary60">{data.application_type?.name}</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    { !isQuarter && (
                        <h3 className="infoSubTitle textCenter weight500 font20">
                            <span className="primary">Members Details</span>
                        </h3>
                    )}

                    {!isQuarter && data.member_with_relations?.map((el, i) => (
                        <table key={i} className={classNames('infoContainer', {
                            borderDashedBottom: i !== data.member_with_relations?.length - 1 
                        })}>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">Officer Type:</p>
                                            <p className="primary60">{el.officer_type?.name || "N/A"}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">Name:</p>
                                            <p className="primary60">{el?.name}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">City/State:</p>
                                            <p className="primary60">{el.city + ", " + (el.state?.app || "N/A")}</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">SSN:</p>
                                            <p className="primary60">{el.ssn}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">Address:</p>
                                            <p className="primary60">{el.home_address}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">Zip Code:</p>
                                            <p className="primary60">{el.zip_code}</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ))}

                    { !isQuarter && (
                        <h3 className="infoSubTitle textCenter weight500 font20">
                            <span className="primary">Vehicle Details</span>
                        </h3>
                    )}

                    {!isQuarter && data.vehicle_with_relations?.map((el, i) => (
                        <table key={i} className={classNames('infoContainer', {
                            borderDashedBottom: i !== data.vehicle_with_relations?.length - 1 
                        })}>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">VIN :</p>
                                            <p className="primary60">{el.vin || "N/A"}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">Type of fuel used :</p>
                                            <p className="primary60">{el.fuel_type?.name || "N/A"}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">Leased vehicle:</p>
                                            <p className="primary60">{Number(data.irp_account_number) ? 'No' : 'Yes' || "N/A"}</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ))}

                    { isQuarter && (
                        <h3 className="infoSubTitle textCenter weight500 font20">
                            <span className="primary">Quarter Details</span>
                        </h3>
                    )}

                    { isQuarter && data?.quarters_with_relations?.map((quarterPariod, index) => (
                        <Fragment key={index}>
                            <span className="primary flexCenter gap4 mb10 mt10 textCenter">
                                Reporting IFTA miles and gallons for the
                                {getQuarterPeriodDate({
                                    name: quarterPariod?.quarter?.name,
                                    year: quarterPariod?.quarter?.year
                                })}
                            </span>
                            { quarterPariod?.data?.map((quarter, i) => (
                                <table key={i} className='infoContainer quarterInfoContainer'> 
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="infoItem flex gap10 alignCenter">
                                                    <p className="primary">Type of fuel used :</p>
                                                    <p className="primary60">{extraData?.fuelType?.find(fuelType => fuelType?.id === quarter?.fuel_type_id)?.name || "N/A"}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="infoItem flex gap10 alignCenter">
                                                    <p className="primary">Jurisdiction :</p>
                                                    <p className="primary60">{extraData?.allStates?.find(state => state?.id === quarter?.state_id)?.state || "N/A"}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="infoItem flex gap10 alignCenter">
                                                    <p className="primary">Txbl Miles:</p>
                                                    <p className="primary60">{quarter?.txbl_miles || "N/A"}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="infoItem flex gap10 alignCenter">
                                                    <p className="primary">Tax Paid Gal:</p>
                                                    <p className="primary60">{quarter?.tax_paid_gal || "N/A"}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            ))}
                        </Fragment>
                    ))}

                    <h3 className="infoSubTitle textCenter flexColumn gap10 mt10 mb10 weight500 font20">
                        <span className="primary">Total Cost </span>
                        <span className="totalCostHistory">${getTotalFormat(data?.cost)}</span>
                    </h3>
                </div>
            </div>
        </div>
    );
});