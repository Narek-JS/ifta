import {useRef} from "react";

export default function OrderDetails({data}) {
    const ref = useRef();

    return (
        <div ref={ref} className="carrierInfo grayBG p-initial">
            <div className="carrierInfoCard whiteBg">
                <div className=" borderDashed">
                    <div className="toPdf primary weight700 flex alignCenter gap5" onClick={() => window.print()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21.86 10.5C21.1369 9.64848 20.1116 9.11074 19 9C19 7.05 18.32 5.4 16.96 4.04C15.6 2.68 13.95 2 12 2C10.42 2 9 2.5 7.75 3.43C6.5 4.36 5.67 5.62 5.25 7.15C4 7.43 2.96 8.08 2.17 9.1C1.38 10.12 1 11.28 1 12.58C1 14.09 1.54 15.38 2.61 16.43C3.57 17.36 4.7 17.85 6 17.95V22H18V18H18.5C19.75 18 20.81 17.56 21.69 16.69C22.56 15.81 23 14.75 23 13.5C23 12.35 22.62 11.35 21.86 10.5ZM16 20H8V13H16V20ZM15 15H9V14H15V15ZM15 17H9V16H15V17ZM15 19H9V18H15V19Z"
                                fill="#FFBF00"
                            />
                        </svg>
                        <span>Print and download this order</span>
                    </div>
                    <h3 className="infoSubTitle textCenter weight500 font20">
                        <span className="secondary">Carrier </span>
                        <span className="primary">Details</span>
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
                            <div className="infoItem flex gap10 alignCenter">
                                <p className="primary">Application Type :</p>
                                <p className="primary60">{data.application_type?.name}</p>
                            </div>
                        </tr>
                    </table>
                    <h3 className="infoSubTitle textCenter weight500 font20">
                        <span className="secondary">Members </span>
                        <span className="primary">Details</span>
                    </h3>
                    {data.member_with_relations?.map((el, i) => (
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
                    <h3 className="infoSubTitle textCenter weight500 font20">
                        <span className="secondary">Vehicle </span>
                        <span className="primary">Details</span>
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
                                        <p className="primary">Leased vehicle:</p>
                                        <p className="primary60">{Number(data.irp_account_number) ? 'No' : 'Yes' || "N/A"}</p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    ))}
                </div>
            </div>
        </div>
    )
}