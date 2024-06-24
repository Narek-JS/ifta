import { getQuarterlyFillings, createQuarterPeriod, selectPermitDetails, selectQarterRowData, clearQarterRowData, updateQuarter, selectQuarterlyFillingsList } from "@/store/slices/resgister";
import { QuarterlyQuestions } from "./QuarterlyQuestions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";

const AllQuarters = ({ selectedQuarterPariods = [], quarterRangeFormiksRefIntoTop, quartersRef }) => {
    const quarterlyFillingsList = useSelector(selectQuarterlyFillingsList);
    const permitDetails = useSelector(selectPermitDetails);
    const qarterRowData = useSelector(selectQarterRowData);

    const dispatch = useDispatch();

    // Map over the selected quarter periods to create a formik instance for each period.
    const quarterRangeFormiks = selectedQuarterPariods.map((quarterPeriodRange) => {
        // Find the specific quarter period from the list of quarterly fillings.
        const specialQuarterPeriod = (quarterlyFillingsList || []).find(filling => filling?.id === quarterPeriodRange?.id);

        // Set the initial isOperate state based on the presence of data in the specialQuarterPeriod.
        let isOperate = 'no';
        if(specialQuarterPeriod?.data?.length) {
            isOperate = 'added';
        };

        // Create a formik instance for the current range
        const curentRangeFormik = useFormik({
            initialValues: {
                [`fuel_type${quarterPeriodRange.id}`]: "",
                [`state${quarterPeriodRange.id}`]: "",
                [`txbl_miles${quarterPeriodRange.id}`]: "",
                [`tax_paid_gal${quarterPeriodRange.id}`]: "",
                [`isOperate${quarterPeriodRange.id}`]: isOperate
            },

            onSubmit: (values, { resetForm, setValues }) => {
                // Create the payload to be sent to the server.
                const payload = {
                    permit_id: permitDetails.form_id,
                    quarter_id: quarterPeriodRange.id,
                    fuel_type_id: values?.[`fuel_type${quarterPeriodRange.id}`]?.id,
                    state_id: values?.[`state${quarterPeriodRange.id}`]?.id,
                    txbl_miles: values?.[`txbl_miles${quarterPeriodRange.id}`],
                    tax_paid_gal: values?.[`tax_paid_gal${quarterPeriodRange.id}`],
                    quarter_condition: '1'
                };

                // Define the callback function to be executed after a successful operation.
                const callbackForRegetQuarters = () => {
                    resetForm();
                    setValues({
                        [`fuel_type${quarterPeriodRange.id}`]: "",
                        [`state${quarterPeriodRange.id}`]: "",
                        [`txbl_miles${quarterPeriodRange.id}`]: "",
                        [`tax_paid_gal${quarterPeriodRange.id}`]: "",
                        [`isOperate${quarterPeriodRange.id}`]: 'added'
                    });

                    // Dispatch actions to refresh the quarterly fillings and clear row data.
                    dispatch(getQuarterlyFillings({ permit_id: permitDetails?.form_id }));
                    dispatch(clearQarterRowData());
                };

                // Define the callback function to be executed after a failed operation.
                const rejectCallback = (message = 'server Error, please try again after one minutes') => {
                    toast.error(message, { position: toast.POSITION.TOP_RIGHT });
                };

                // Check if the current operation is an edit or a create action.
                if(values?.[`isOperate${quarterPeriodRange.id}`] === 'edit') {
                    const id = qarterRowData.id;

                    // Dispatch the update action.
                    return dispatch(updateQuarter({
                        id,
                        payload,
                        callback: callbackForRegetQuarters,
                        rejectCallback
                    }));
                };
                
                // Dispatch the create action.
                dispatch(createQuarterPeriod({
                    payload,
                    callback: callbackForRegetQuarters,
                    rejectCallback
                }));
            },
            validationSchema: yup.object({
                [`fuel_type${quarterPeriodRange.id}`]: yup.object().when(`isOperate${quarterPeriodRange.id}`, {
                    is: val => val === 'yes' || val === 'edit',
                    then: () => yup.object().required("Please select option")
                }),
                [`state${quarterPeriodRange.id}`]: yup.object().when(`isOperate${quarterPeriodRange.id}`, {
                    is: val => val === 'yes' || val === 'edit',
                    then: () => yup.object().required("Please select option")
                }),
                [`txbl_miles${quarterPeriodRange.id}`]: yup.string().when(`isOperate${quarterPeriodRange.id}`, {
                    is: val => val === 'yes' || val === 'edit',
                    then: () => yup.string().required("Required").max(7, "value is so large").matches(/^[0-9]+(\.[0-9]*)?$/, "Must be only digits")
                }),
                [`tax_paid_gal${quarterPeriodRange.id}`]: yup.string().when(`isOperate${quarterPeriodRange.id}`, {
                    is: val => val === 'yes' || val === 'edit',
                    then: () => yup.string().required("Required").max(7, "value is so large").matches(/^[0-9]+(\.[0-9]*)?$/, "Must be only digits")
                }),
                [`isOperate${quarterPeriodRange.id}`]: yup.string().required("Required")
            })
        });

        return { formik: curentRangeFormik, currentPeriodRange: quarterPeriodRange };
    });

    // Store the formik instances in a ref to be accessible from a parent component.
    quarterRangeFormiksRefIntoTop.current = quarterRangeFormiks;

    // Render the QuarterlyQuestions component for each formik instance.
    return quarterRangeFormiks.map(({ currentPeriodRange, formik }, index) => (
        <QuarterlyQuestions
            quartersRef={quartersRef}
            formik={formik}
            currentPeriodRange={currentPeriodRange}
            index={index}
            key={index}
        />
    ));
};

export { AllQuarters };