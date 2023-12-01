import { Tooltip } from "@/components/universalUI/Tooltip";

export default function CarrierDetails({ data }) {

    if (!data) return null;

    const isIrpAndIfta = data?.application_type.name !== 'New IFTA Registration' && (
        data?.ifta_account_number === '' || data?.ifta_account_number === 0
    );

    return (
        <>
            <h2 className="subTitle flexCenter alignCenter gap10 font20 line24 whiteBg textCenter weight500 mb10">
                <span className="primary">Carrier Information</span>
                <Tooltip content='You can always see your billing information in menu’s “ History “ page !' >
                    <span className="carrierTooltipRoot">!</span>
                </Tooltip>
            </h2>
            <div className="carrierInfo grayBG">
                <div className="carrierInfoCard whiteBg">
                    <div className="borderDashed overflow-y-auto">
                        <h3 className="infoSubTitle textCenter weight500">
                            <span className="primary weight700">Carrier Details</span>
                        </h3>
                        <table className="infoContainer">
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
                                    { data?.application_type.name === 'New IFTA Registration' &&
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">IRP Account Number :</p>
                                            <p className="primary60">{data.irp_account_number === '1' ? 'Yes' : 'No'}</p>
                                        </div>
                                    }
                                    { data?.application_type.name !== 'New IFTA Registration' && data?.ifta_account_number !== '' && data?.ifta_account_number !== 0 &&
                                        <div className="infoItem flex gap10 alignCenter">
                                            <p className="primary">IFTA Account Number :</p>
                                            <p className="primary60">{data.ifta_account_number}</p>
                                        </div>
                                    }
                                    { isIrpAndIfta &&
                                        <tr>
                                            <div className="infoItem flex gap10 alignCenter">
                                                <p className="primary">Application Type :</p>
                                                <p className="primary60">{data.application_type?.name}</p>
                                            </div>
                                        </tr>
                                    }
                                </td>
                                <td>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">EIN:</p>
                                        <p className="primary60">{data.EIN}</p>
                                    </div>
                                </td>
                            </tr>
                            { !isIrpAndIfta &&
                                <tr>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">Application Type :</p>
                                        <p className="primary60">{data.application_type?.name}</p>
                                    </div>
                                </tr>
                            }
                        </table>
                        <h3 className="infoSubTitle textCenter weight500">
                            <span className="primary weight700">Members Details</span>
                        </h3>

                        {[
                            ...data.member_with_relations
                        ]?.map((el, i) => (
                            <table key={el.id} className={`infoContainer ${i === data.member_with_relations?.length - 1 ? "" : "borderDashedBottom"}`}>
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
                            </table>
                        ))}
                        <h3 className="infoSubTitle textCenter weight500">
                            <span className="primary weight700">Vehicle Details</span>
                        </h3>
                        {data.vehicle_with_relations?.map((el, i) => (
                            <table key={el.id} className={`infoContainer ${i === data.vehicle_with_relations?.length - 1 ? "" : "borderDashedBottom"}`}>
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
                            </table>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}