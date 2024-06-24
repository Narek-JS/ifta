import { addOtherExtraFields, clearQarterRowData, selectOtherExtraValues } from "@/store/slices/resgister";
import { selectQuestionnaireLoadding, setQuestionnaireLoading } from "@/store/slices/questionnaire";
import { VerificationContext } from "@/contexts/VerificationCarrierInfoContext";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useContext, useEffect, useRef, useState } from "react";
import { getExtraFieldValidation } from "@/utils/schemas";
import { QUARTERLY_FILLING_ID } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@mui/material";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import InputField from "@/components/universalUI/InputField";
import InputFile from "@/components/universalUI/InputFile";
import * as yup from "yup";
import dayjs from "dayjs";
import classNames from "classnames";

// State ides which has a text extra filed with large lables.
const WITH_LARGE_LABELS_OF_STATES_ID = [70]; 

// Component to handle text input fields for extra fields.
const ExtraFieldTextInput = ({ el, formik, name, isRequired }) => {
    const isSmallSizeCalss = WITH_LARGE_LABELS_OF_STATES_ID.find(id => id === el.state_id);
    return (
        <InputField
            key={el.id}
            className={classNames({ 'small-size': isSmallSizeCalss })}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.[name]}
            error={formik.touched?.[name] && formik.errors?.[name]}
            required={el.validation?.length && isRequired}
            name={name}
            label={el.label || "[ NO LABEL ]"}
            placeholder={el.placeholder || "[ NO PLACEHOLDER ]"}
            type={el.type?.name}
            mobileLableWrap={true}
        />
    );
};

// Component to handle date input fields for extra fields.
const ExtraFieldFileInput = ({ el, onChange, formik, fileNames, setFileNames, name }) => (
    <InputFile
        key={el.id}
        onChange={onChange}
        onBlur={formik.handleBlur}
        fileName={fileNames[name]}
        error={formik.touched?.[name] && formik.errors?.[name]}
        required={el.validation?.length && el.validation[0]?.conditions !== "Not Required"}
        name={name}
        label={el.label || "[ NO LABEL ]"}
        placeholder={el.placeholder || "[ NO PLACEHOLDER ]"}
        exampleFilePath={el.exampleImagePath}
        className="memberFile inputField"
        resetFileName={(e, name) => {
            e.preventDefault();
            setFileNames({ ...fileNames, [name]: '' });
            formik.setValues({ ...formik.values, [name]: '' });
        }}
    />
);

// Component to handle date input fields for extra fields.
const ExtraFieldDateInput = ({ el, isRequired, formik, name, setExtraDatePicker, extraDatePicker }) => (
    <div className="dateInput m-year-Input" key={el.id}>
        <p className="helper mb5 bold500 font16 line24">
            {el.label || "[ NO LABEL ]"}
            {el.validation?.length && isRequired ? <sup className="red font16">*</sup> : ""}
        </p>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={formik.values?.[name] ? dayjs(formik.values?.[name]) : ''}
                format="MM/DD/YYYY"
                open={extraDatePicker?.[name] || false}
                onOpen={() => setExtraDatePicker({ ...extraDatePicker, [name]: true })}
                onClose={() => setExtraDatePicker({ ...extraDatePicker, [name]: false })}
                onChange={value => {
                    formik.setFieldValue(name, value, true);
                    setExtraDatePicker({ ...extraDatePicker, [name]: false });
                }}
                slotProps={{
                    textField: { onClick: () => setExtraDatePicker({ ...extraDatePicker, [name]: true })},
                    actionBar: { actions: ['clear'] }
                }}
                minDate={dayjs(String(new Date(`01-01-${new Date().getUTCFullYear() - 80}`)) )}
                renderInput={(params) => (
                    <TextField
                        error={formik.touched?.[name] && formik.errors?.[name]}
                        label="Birthday"
                        margin="normal"
                        name={name}
                        {...params}
                    />
                )}
            />
        </LocalizationProvider>
        <p className="err-message">{formik.touched?.[name] && formik.errors?.[name]}</p>
    </div>
);

// Main component to handle others section.
export default function Others({ permit_id, others, setSubmit, submit, applicationTypeId, stateId, ein }) {
    const router = useRouter();
    const dispatch = useDispatch();

    const otherExtraValues = useSelector(selectOtherExtraValues);
    const questionnaireLoadding = useSelector(selectQuestionnaireLoadding);

    const [ fileNames, setFileNames ] = useState({});
    const [ extraDatePicker, setExtraDatePicker ] = useState({});
    const { setLoader, setNextStapeLoading } = useContext(VerificationContext);

    const ref = useRef(null);

    // Initialize extra field values.
    const extraInitialValues = (others || []).reduce((acc, el) => {
        acc[`extra_field_${el.id}`] = "";
        return acc;
    }, {});

    // Initialize validation schema for extra fields.
    const validation = yup.object(
        (others || []).reduce((acc, el) => {
            const extraFieldvalidation = getExtraFieldValidation(el.validation);
            acc[`extra_field_${el.id}`] = el?.validation?.length ? extraFieldvalidation : null;
            return acc;
        }, {})
    );

    // Initialize formik for form handling.
    const formik = useFormik({
        initialValues: { ...extraInitialValues },
        validationSchema: validation,
        onSubmit: (values, { setErrors }) => {
            // Check if any file fields are required but not filled.
            const submitFileByEmail = others.reduce((acc, otherExtraField) => {
                if(otherExtraField?.type?.name === 'file') {
                    const findedExtraValue = values?.[`extra_field_${otherExtraField.id}`];
                    if(findedExtraValue === '') {
                        acc = true;
                    };
                };
                return acc;
            }, false);

            // Check if any fields are file type.
            const isFile = others?.some(el => el?.type?.name === "file");

            // Prepare form data for submission.
            const bodyEntries = Object.entries({
                ...values,
                ...(isFile && { submit_file_by_email: submitFileByEmail ? 1 : 0 }),
                permit_id,
                officer_type_id: applicationTypeId,
                state_id: stateId,
                EIN: ein,
            });

            // Initialize Form Data for collect form values. 
            const formData = new FormData();

            // Append each entry to formData.
            bodyEntries.forEach(([ key, value ]) => {
                formData.append(key, (value === 'null' || value === null) ? '' : value);
            });

            // Dispatch action to add other extra fields.
            dispatch(addOtherExtraFields(formData)).then(res => {
                if (res?.payload?.action) {
                    setNextStapeLoading(false);

                    if(applicationTypeId === QUARTERLY_FILLING_ID) {
                        // Redirect to payment page if the permit is quarter and clear quarterly row data.
                        router.push("/form/payment-info");
                        dispatch(clearQarterRowData());
                    } else {
                        // Redirect to questionnaire page if the permit is not quarter.
                        router.push("/form/questionnaire");
                    };
                } else {
                    // Turn off the next step button loading, and questionnaire loading.
                    setNextStapeLoading(false);
                    if(questionnaireLoadding) {
                        dispatch(setQuestionnaireLoading(false));
                    };

                    // Open extra faild popup if any extra faild is change from admin.
                    if(res?.payload?.result?.data?.reload) {
                        dispatch(setPopUp({ popUp: "extraFaild" }))
                    };

                    // Check If there are error messages from backend show it unders of correct extra faild.
                    if(res?.payload?.result?.data && Object.keys(res?.payload?.result?.data).length) {
                        let errors = {};
                        // collect errors for each extra faild and add in errors.
                        for(let invalidFaildKey in res?.payload?.result?.data) {
                            if(extraInitialValues?.[invalidFaildKey] !== undefined && res?.payload?.result?.data?.[invalidFaildKey]?.[0]) {
                                errors[invalidFaildKey] = res?.payload?.result?.data?.[invalidFaildKey]?.[0];
                            };
                        };

                        // Update Errors, with old errors what there in formik.
                        setErrors({ ...formik.errors, ...errors });

                        // Scroll on current section to show section error.
                        ref.current.scrollIntoView({ behavior: "smooth", block: 'center' });
                    } else {
                        // Show error with window if there is mentioned extra faild name.
                        toast.error(res.payload?.result?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    };
                    setLoader(false);
                };
            })
        },
    });

    // Effect to handle setting initial values from Redux store.
    useEffect(() => {
        if(otherExtraValues?.fields?.length) {
            const fileNamesData = {};
            const filteredOtherExtraValues = otherExtraValues?.fields.filter(el => el.relation === "other");

            const extraValues = filteredOtherExtraValues?.reduce((acc, el) => {
                acc[`extra_field_${el.extra_field_id}`] = Boolean(el?.is_file === 1 || el?.is_file === "1") ? 'same' : el?.value;
                fileNamesData[`extra_field_${el.extra_field_id}`] = el?.original_name || '';
                return acc;
            }, {});

            setFileNames(fileNamesData);
            formik.setValues({ ...formik.values, ...extraValues });
        };
    }, [otherExtraValues]);

    // Effect to handle form submission on submit state change.
    useEffect(() => {
        if (submit) {
            formik.handleSubmit();
        };

        // if there is any error, scroll into others section to show errors
        if (Object.values(formik.errors).some(el => el)) {
            setNextStapeLoading(false);
            ref.current.scrollIntoView({ behavior: "smooth" });
        };

        setSubmit(false);
    }, [submit]);

    // Handle file input change event.
    const handleFileInputChange = (e) => {
        e.preventDefault();
        let file = e.target.files[0];

        if (!file) {
            formik.setValues({ ...formik.values, [e.target.name]: "" });
            setFileNames({ ...fileNames, [e.target.name]: "" });
            return;
        } else {
            // Check if the selected file type is valid.
            const valid = otherExtraValues.allExtensions.includes(file?.type.split("/")[1]);
            if(!valid) {
                // If the file type is invalid, set an error in formik and mark the field as touched.
                formik.setErrors({ ...formik.errors, [e.target.name]: "Invalid file type!" }, false);
                formik.setTouched({ ...formik.touched, [e.target.name]: true }, false)
            } else {
                // If the file type is valid, clear any existing errors for this field.
                formik.setErrors({ ...formik.errors, [e.target.name]: "" });
            };

            // Update the state with the new file name and formik values.
            setFileNames({ ...fileNames, [e.target.name]: file.name, name: file.name });
            formik.setValues({ ...formik.values, [e.target.name]: file }, false);

            // Clear the file input value to allow re-uploading the same file if needed.
            e.target.value = '';
        };
    };

    // If there are no fields to display, return null.
    if (!(others || []).length) return null;

    return (
        <div ref={ref} className="others">
            <h2 className="subTitle font20 line24 whiteBg textCenter weight500">
                <span className="primary">Required Information </span>
            </h2>
            <div className="othersMain">
                <div className="inputsContainer flex wrap alignEnd gap20">
                    {others?.sort((a, b) => a.sort - b.sort).map(el => {
                        const isRequired = el?.validation?.find(val => val.conditions === 'required');

                        switch(el?.type?.name) {
                            case "file": {
                                return <ExtraFieldFileInput
                                    el={el}
                                    fileNames={fileNames}
                                    setFileNames={setFileNames}
                                    formik={formik}
                                    name={`extra_field_${el.id}`}
                                    onChange={handleFileInputChange}
                                />;
                            };
                            case "date": {
                                return <ExtraFieldDateInput
                                    el={el}
                                    extraDatePicker={extraDatePicker}
                                    formik={formik}
                                    isRequired={isRequired}
                                    name={`extra_field_${el.id}`}
                                    setExtraDatePicker={setExtraDatePicker}
                                />;
                            };
                            default: {
                                return <ExtraFieldTextInput
                                    el={el}
                                    formik={formik}
                                    isRequired={isRequired}
                                    name={`extra_field_${el.id}`}
                                />;
                            };
                        };
                    })}
                </div>
            </div>
        </div>
    );
};