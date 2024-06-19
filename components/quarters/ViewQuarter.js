import { selectBaseStatesWithCanada, selectExtraData } from "@/store/slices/resgister";
import { getQuarterPeriodDate } from "@/utils/helpers";
import { useSelector } from "react-redux";

const ViewQuarter = ({ quarterDataForView }) => {
    const extraData = useSelector(selectExtraData);
    const allStates = useSelector(selectBaseStatesWithCanada);

    return (
        <div className="ownerOfficer quarterDataForView">
            <h2 className="subTitle font20 whiteBg textCenter weight500">
                <span className="primary flexCenter gap4">
                    Reporting IFTA miles and gallons for the 
                    {getQuarterPeriodDate({ name: quarterDataForView?.period, year: quarterDataForView?.year })}
                </span>
            </h2>

            { quarterDataForView?.data?.length ? (
                <table className="infoContainer">
                    <tbody>
                        {quarterDataForView?.data.map((quarterRow, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">Type of fuel used:</p>
                                        <p className="primary60">{ extraData?.fuelType?.find(type => type?.id === quarterRow?.fuel_type_id)?.name }</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">Jurisdiction:</p>
                                        <p className="primary60">{ allStates?.find(state => state?.id === quarterRow?.state_id)?.state }</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">Txbl Miles:</p>
                                        <p className="primary60">{quarterRow?.txbl_miles}</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="infoItem flex gap10 alignCenter">
                                        <p className="primary">Tax Paid Gal:</p>
                                        <p className="primary60">{quarterRow?.tax_paid_gal}</p>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="flex gap10 flexCenter">
                    <p className="primary60">No Operate</p>
                </div>  
            )}
        </div>
    );
};

export { ViewQuarter };