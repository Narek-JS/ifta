import { getQuarterPeriodDate, getTotalFormat } from "@/utils/helpers";
import { Fragment } from "react";
import classNames from "classnames";

export default function CarrierDetails({ data }) {
    if (!data) return null;

    // Check if the application is not a 'New IFTA Registration' and does not have an IFTA account number.
    const isIrpAndIfta = Boolean(
        data?.application_type.name !== 'New IFTA Registration' &&
        (data?.ifta_account_number === '' || data?.ifta_account_number === 0)
    );

    // Check if the application is a 'New IFTA Registration' or has an IRP account number.
    const isIprAccountNumber = Boolean(
        data?.application_type.name === 'New IFTA Registration' ||
        (data?.irp_account === '1' && data?.irp_account_number)
    );

    // Check if the application is not a 'New IFTA Registration' and has a valid IFTA account number.
    const isIftaAccountNumber = Boolean(
        data?.application_type.name !== 'New IFTA Registration' &&
        data?.ifta_account_number !== '' &&
        data?.ifta_account_number !== 0 &&
        data?.ifta_account_number !== null &&
        (data?.state.require_ifta !== '0' && data?.ifta_account_number !== '1')
    ); 

    // Check if there are any members associated with the carrier.
    const isMember = Boolean(Array.isArray(data?.member_with_relations) && data?.member_with_relations.length);

    // Check if there are any vehicles associated with the carrier.
    const isVehicle = Boolean(Array.isArray(data?.vehicle_with_relations) && data?.vehicle_with_relations?.length);

    // Check if there are any quarters associated with the carrier.
    const isQuarter = Boolean(Array.isArray(data?.quarters_with_relations) && data?.quarters_with_relations?.length);

    // Check the IRP account number value based on the data provided.
    const irpAccountNumberValue = data?.irp_account === '1' ? (
        (data?.irp_account_number && data?.irp_account_number !== '1') ? data.irp_account_number : 'Yes'
    ) : (
        'No'
    );

    return (
        <Fragment>
            <h2 className="subTitle flexCenter alignCenter gap10 font20 line24 whiteBg textCenter weight500 mb10">
                <span className="primary">Carrier Information</span>
            </h2>

            <div className="carrierInfo grayBG">
                <div className="carrierInfoCard whiteBg">
                    <div className="borderDashed overflow-y-auto">

                        {/* Carrier Details */}
                        <h3 className="infoSubTitle textCenter weight500">
                            <span className="primary weight700">Carrier Details</span>
                        </h3>
                        <table className="infoContainer">
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">Email Address:</p>
                                            <p className="primary60">{data.email}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">Base State :</p>
                                            <p className="primary60">{data.state?.state}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">USDOT Number:</p>
                                            <p className="primary60">{data.USDOT}</p>
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
                                        { isIprAccountNumber && (
                                            <div className="infoItem flex gap10 alignCenter">
                                                <p className="primary">IRP Account Number :</p>
                                                <p className="primary60">{irpAccountNumberValue}</p>
                                            </div>
                                        )}
                                        { isIftaAccountNumber && (
                                            <div className="infoItem flex gap10 alignCenter">
                                                <p className="primary">IFTA Account Number :</p>
                                                <p className="primary60">{data.ifta_account_number}</p>
                                            </div>
                                        )}
                                        { isIrpAndIfta && (
                                            <tr>
                                                <td>
                                                    <div className="infoItem flex gap10 alignCenter">
                                                        <p className="primary">Application Type :</p>
                                                        <p className="primary60">{data.application_type?.name}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </td>
                                    <td>
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">EIN:</p>
                                            <p className="primary60">{data.EIN}</p>
                                        </div>
                                    </td>
                                </tr>
                                { !isIrpAndIfta && (
                                    <tr>
                                        <td>
                                            <div className="infoItem flex gap10 alignCenter">
                                                <p className="primary">Application Type :</p>
                                                <p className="primary60">{data.application_type?.name}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Conditionally render Member Details if applicable */}
                        { isMember && (
                            <h3 className="infoSubTitle textCenter weight500">
                                <span className="primary weight700">Members Details</span>
                            </h3>
                        )}

                        {/* Render Member Details */}
                        { isMember && data?.member_with_relations.map((el, i) => (
                            <table key={el.id} className={classNames('infoContainer', {
                                borderDashedBottom: i !== (data.member_with_relations?.length - 1)}
                            )}>
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
                                                <p className="primary60">{el?.name || "N/A"}</p>
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
                                                <p className="primary60">{el.ssn ? 'XXX-XX-XXXX' : ''}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="infoItem flex gap10 alignCenter">
                                                <p className="primary">Home Address:</p>
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

                        {/* Conditionally render Vehicle Details if applicable */}
                        { isVehicle && (
                            <h3 className="infoSubTitle textCenter weight500">
                                <span className="primary weight700">Vehicle Details</span>
                            </h3>
                        )}

                        {/* Render Vehicle Details */}
                        { isVehicle && data?.vehicle_with_relations.map((el, i) => (
                            <table key={el.id} className={classNames('infoContainer', {
                                borderDashedBottom: i !== (data.vehicle_with_relations?.length - 1)
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
                                                <p className="primary">leased Vehicle:</p>
                                                <p className="primary60">{el.vehicles_leased || "N/A"}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ))}

                        {/* Conditionally render Quarterly Information if applicable */}
                        {isQuarter && data?.quarters_with_relations.map((el, i) => (
                            <div className="ownerOfficer quarterDataForView" key={el.id}>
                                <h2 className="subTitle font20 line24 whiteBg textCenter weight500 primary flexCenter gap4 columnCenter-mb">
                                    Reporting IFTA miles and gallons for the
                                    { getQuarterPeriodDate({ name: el?.quarter?.name, year: el?.quarter?.year }) }
                                    { !Boolean(el?.data?.length) && <p className="primary60">(No Operation)</p> }
                                </h2>
                                <table className={classNames('infoContainer', {
                                    borderDashedBottom: i !== (data.vehicle_with_relations?.length - 1) 
                                })}>
                                    { el?.data?.length ? (
                                        <tbody>
                                            <tr className="quarterTable spaceAround">
                                                <td>
                                                    <div className="infoItem flex gap10 alignCenter">
                                                        <p className="primary">Total Txbl Miles :</p>
                                                        <p className="primary60">{el?.data?.reduce((acm, item) => acm += item?.txbl_miles, 0)}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="infoItem flex gap10 alignCenter">
                                                        <p className="primary">Total Tax Paid Gal :</p>
                                                        <p className="primary60">{el?.data?.reduce((acm, item) => acm += item?.tax_paid_gal, 0)}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="infoItem flex gap10 alignCenter">
                                                        <p className="primary">Filling Fee :</p>
                                                        <p className="primary60">${getTotalFormat(data.cost / data?.quarters_with_relations.length)}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="flex gap40 flexCenter">
                                                        <div className="infoItem flex gap10 alignCenter">
                                                            <p className="primary">Filling Fee:</p>
                                                            <p className="primary60">${getTotalFormat(data.cost / data?.quarters_with_relations.length)}</p>
                                                        </div>
                                                    </div>  
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};