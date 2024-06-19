import { QuarterlyQuestions } from "./QuarterlyQuestions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import {
    getQuarterlyFillings,
    createQuarterPeriod,
    selectPermitDetails,
    selectQarterRowData,
    clearQarterRowData,
    updateQuarter,
    selectQuarterlyFillingsList
} from "@/store/slices/resgister";
import * as yup from "yup";

const AllQuarters = ({ selectedQuarterPariods = [], quarterRangeFormiksRefIntoTop, quartersRef }) => {
    const quarterlyFillingsList = useSelector(selectQuarterlyFillingsList);
    const permitDetails = useSelector(selectPermitDetails);
    const qarterRowData = useSelector(selectQarterRowData);
    
    const dispatch = useDispatch();

    const quarterRangeFormiks = selectedQuarterPariods.map((quarterPeriodRange) => {
        const specialQuarterPeriod = (quarterlyFillingsList || []).find((quarterlyFilling) => quarterlyFilling?.id === quarterPeriodRange?.id);
        let isOperate = 'no';
        if(specialQuarterPeriod?.data?.length) {
            isOperate = 'added';
        };
            
        const curentRangeFormik = useFormik({
            initialValues: {
                [`fuel_type${quarterPeriodRange.id}`]: "",
                [`state${quarterPeriodRange.id}`]: "",
                [`txbl_miles${quarterPeriodRange.id}`]: "",
                [`tax_paid_gal${quarterPeriodRange.id}`]: "",
                [`isOperate${quarterPeriodRange.id}`]: isOperate
            },

            onSubmit: (values, { resetForm, setValues }) => {
                const payload = {
                    permit_id: permitDetails.form_id,
                    quarter_id: quarterPeriodRange.id,
                    fuel_type_id: values?.[`fuel_type${quarterPeriodRange.id}`]?.id,
                    state_id: values?.[`state${quarterPeriodRange.id}`]?.id,
                    txbl_miles: values?.[`txbl_miles${quarterPeriodRange.id}`],
                    tax_paid_gal: values?.[`tax_paid_gal${quarterPeriodRange.id}`],
                    quarter_condition: '1'
                };

                const callbackForRegetQuarters = (response) => {
                    resetForm();
                    setValues({
                        [`fuel_type${quarterPeriodRange.id}`]: "",
                        [`state${quarterPeriodRange.id}`]: "",
                        [`txbl_miles${quarterPeriodRange.id}`]: "",
                        [`tax_paid_gal${quarterPeriodRange.id}`]: "",
                        [`isOperate${quarterPeriodRange.id}`]: 'added'
                    });
                    dispatch(getQuarterlyFillings({ permit_id: permitDetails?.form_id }));
                    dispatch(clearQarterRowData());
                };

                const rejectCallback = (message = 'server Error, please try again after one minutes') => {
                    toast.error(message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                };

                if(values?.[`isOperate${quarterPeriodRange.id}`] === 'edit') {
                    const id = qarterRowData.id;

                    return dispatch(updateQuarter({
                        id,
                        payload,
                        callback: callbackForRegetQuarters,
                        rejectCallback
                    }));
                };
                
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

    quarterRangeFormiksRefIntoTop.current = quarterRangeFormiks;

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