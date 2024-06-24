import { getQuarterRow, selectAllFuelTypes, selectBaseStatesWithCanada, selectEditQarterRowStatus, selectQarterRowData } from "@/store/slices/resgister";
import { useDispatch, useSelector } from "react-redux";
import { getTotalFormat } from "@/utils/helpers";
import { useMemo } from "react";

import DeleteSvgIcon from "@/public/assets/svgIcons/DeleteSvgIcon";
import EditSvgIcon from "@/public/assets/svgIcons/EditSvgIcon";

const QuarterlyQuestionsTable = ({ quarterlyFillingsList, handleEditCallback, handleDelete, totalCost }) => { 
    const editQarterRowStatus = useSelector(selectEditQarterRowStatus);
    const allStates = useSelector(selectBaseStatesWithCanada);
    const qarterRowData = useSelector(selectQarterRowData);
    const allFuelTypes = useSelector(selectAllFuelTypes);

    const dispatch = useDispatch();

    // Handler for editing quarterly row.
    const handleEdit = (id) => {
        // Fetch quarter row data for editing.
        if(editQarterRowStatus !== 'panding' && qarterRowData?.id !== id) {
            dispatch(getQuarterRow({ id, callback: handleEditCallback }));
        };
    };

    // Calculate total values.
    const totalValues = useMemo(() => {
        return (quarterlyFillingsList || []).reduce((acm, item) => {
            acm.totalMiles += item?.txbl_miles || 0;
            acm.totalGal += item?.tax_paid_gal || 0;
            return acm;
        }, { totalMiles: 0, totalGal: 0 });
    }, [quarterlyFillingsList]);

    return (
        <div className="dataTable">
            <table>
                <thead>
                    <tr>
                        <td>Type of fuel <span className="none-420">used</span></td>
                        <td>Jurisdiction</td>
                        <td className="none-mobile">Txbl Miles</td>
                        <td className="none-mobile">Tax Paid Gal</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    { quarterlyFillingsList.map((quarterlyItem) => {
                        const state = allStates?.find((state) => state.id === quarterlyItem.state_id);
                        const fuelType = allFuelTypes?.find((fuelItem) => fuelItem?.id === quarterlyItem?.fuel_type_id);

                        const isTxblMiles = quarterlyItem?.txbl_miles || quarterlyItem?.txbl_miles === 0;
                        const isTaxPaidGall = quarterlyItem?.tax_paid_gal || quarterlyItem?.tax_paid_gal === 0

                        return (
                            <tr key={quarterlyItem?.id}>
                                { <td>{fuelType?.name || '-'}</td> }
                                { state && <td>{state?.state}</td> }
                                { isTxblMiles && <td className="none-mobile">{quarterlyItem?.txbl_miles}</td> }
                                { isTaxPaidGall && <td className="none-mobile">{quarterlyItem?.tax_paid_gal}</td> }
                                <td className="actionsBtns flexCenter alignCenter gap10">
                                    <button className="none-min-width-and-height" onClick={() => handleEdit(quarterlyItem?.id)}>
                                        <EditSvgIcon />
                                    </button>
                                    <button className="none-min-width-and-height" onClick={() => handleDelete(quarterlyItem?.id)}>
                                        <DeleteSvgIcon />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    <tr className="totalBar">
                        <td className="sz12-480" colSpan="2">Total</td>
                        <td className="none-mobile">Miles: {totalValues?.totalMiles}</td>
                        <td className="none-mobile">Paid Gal: {totalValues?.totalGal}</td>
                        <td className="sz12-480">Filling fee: ${getTotalFormat(totalCost)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export { QuarterlyQuestionsTable };