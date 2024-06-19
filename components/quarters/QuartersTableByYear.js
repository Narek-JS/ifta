import { selectAppTypes } from "@/store/slices/resgister";
import { QUARTERLY_FILLING_ID } from "@/utils/constants";
import { EditQuarter } from "./EditQuarter";
import { ViewQuarter } from "./ViewQuarter";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import classNames from "classnames";

const QuartersTableByYear = ({ quarters }) => {
    const router = useRouter();

    const user = useSelector(state => state?.auth?.user);
    const appTypes = useSelector(selectAppTypes);

    const [quarterDataForEdit, setQuarterDataForEdit] = useState(null);
    const [quarterDataForView, setQuarterDataForView] = useState(null);

    const handleRowEdit = (quarterRow) => {
        if(quarterRow.id === quarterDataForEdit?.id) {
            setQuarterDataForEdit(null);
        } else {
            setQuarterDataForEdit(quarterRow);
            if(quarterDataForView) {
                setQuarterDataForView(null);
            };
        };
    };

    const handleRowView = (quarterRow) => {
        if(quarterRow.id === quarterDataForView?.id) {
            setQuarterDataForView(null);
        } else {
            if(quarterDataForEdit) {
                setQuarterDataForEdit(null);
            };
            setQuarterDataForView(quarterRow);
        };
    }

    const handleGoToFilling = (quarterRow) => {
        const quarterAppType = appTypes?.find(type => type?.id === QUARTERLY_FILLING_ID);

        const registerData = {
            email: user?.email || "",
            phone: user?.phone || "",
            ...(quarterAppType && { application_type: quarterAppType }),
            state: "",
            fromPermits: true,
            fromQuarter: true                                                
        };

        localStorage.setItem("registerData", JSON.stringify(registerData));

        if(quarterRow.permit_id) {
            localStorage.setItem('fromPermitsPage', true);
        };

        const toStartFilling = `/form/carrier-info?permitId=${quarterRow.permit_id}`;
        const toContinueFilling = `/form/carrier-info?taxReturnPeriodId=${quarterRow.id}`;

        router.push(quarterRow.permit_id ? toStartFilling : toContinueFilling);
    };

    if(!Array.isArray(quarters)) {
        return null;
    };

    return (
        <div className="dataTable">
            <table>
                <thead>
                    <tr>
                        <td className="weight500 font15">Return Period</td>
                        <td className="weight500 font15">Status</td>
                        <td className="weight500 font15">Actions</td>
                    </tr>
                </thead>
                <tbody>
                    { quarters.map((quarterRow, index) => (
                        <tr key={index} className={classNames({
                            disabled: quarterRow?.is_upcoming_period
                        })}>
                            <td className="weight700 font16">
                                <span className={classNames('pariod', {
                                    disabled: quarterRow?.is_upcoming_period,
                                })}>
                                    {quarterRow?.period.split('-').map((slice, sliceIndex) => sliceIndex === 0 ? <span key={sliceIndex}>{slice}</span> : <span key={sliceIndex} className="none-mobile">- {slice}</span>)}
                                </span>
                            </td>
                            <td className="weight700 font16"> 
                                { !quarterRow?.is_filling_expired && quarterRow?.is_paid && (
                                    <span className="flex flexCenter alignCenter gap5">
                                        <input type="checkbox" defaultChecked={true} className="pointer-eventsNone" />
                                        <span>Filed</span>
                                    </span>
                                )}

                                { !quarterRow?.is_paid && quarterRow?.is_filling_expired && (
                                    <span className="red nowrap">Not Filed</span>
                                )}

                                { !quarterRow?.is_paid && !quarterRow?.is_filling_expired && (
                                    <span className={classNames({
                                        disabled: quarterRow?.is_upcoming_period
                                    })}>-</span>
                                )}
                            </td>
                            <td className="actionsBtns flexCenter alignCenter gap10">
                                { quarterRow?.is_paid ? (
                                    <Fragment>
                                        <button
                                            className="bg-lighthouse-black weight900 pm8 pt4 editViewBtn"
                                            onClick={() => handleRowEdit(quarterRow)}
                                        >
                                            {quarterRow.id === quarterDataForEdit?.id ? 'Cancel' : 'Edit'}
                                        </button>
                                        <button
                                            className="weight700 pm8 pt4 blackBg editViewBtn"
                                            onClick={() => handleRowView(quarterRow)}
                                        >
                                            {quarterRow?.id === quarterDataForView?.id ? 'Close' : 'View'}
                                        </button>
                                    </Fragment>
                                ) : (
                                    <button
                                        className={classNames("startQuarterFilingBtn", {
                                            none: quarterRow?.is_upcoming_period
                                        })}
                                        onClick={() => handleGoToFilling(quarterRow)}
                                    >
                                        { quarterRow.permit_id ? 'Continue Filling' : 'Start Filling' }
                                    </button>
                                ) }
                            </td>
                        </tr>
                    ))}
                </tbody> 
            </table>
            { Boolean(quarterDataForEdit) && (
                <EditQuarter quarterDataForEdit={quarterDataForEdit} />
            )}

            { Boolean(quarterDataForView) && (
                <ViewQuarter quarterDataForView={quarterDataForView} />
            )}
        </div>
    );
};

export { QuartersTableByYear };
