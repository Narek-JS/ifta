import { addOtherExtraFields, clearQarterRowData, selectOtherExtraValues } from "@/store/slices/resgister";
import { selectQuestionnaireLoadding, setQuestionnaireLoading } from "@/store/slices/questionnaire";
import { QUARTERLY_FILLING_ID } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import InputField from "@/components/universalUI/InputField";
import InputFile from "@/components/universalUI/InputFile";
import { getExtraFieldValidation } from "@/utils/schemas";
import * as yup from "yup";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { VerificationContext } from "@/contexts/VerificationCarrierInfoContext";

export default function Others({
    permit_id,
    others,
    setSubmit,
    submit,
    applicationTypeId,
    stateId,
    ein
}) {
    const dispatch = useDispatch();
    const router = useRouter();
    const ref = useRef(null);
    const otherExtraValues = useSelector(selectOtherExtraValues);
    const questionnaireLoadding = useSelector(selectQuestionnaireLoadding);
    const isFile = others?.some(el => el?.type?.name === "file");
    const [fileNames, setFileNames] = useState({});
    const [extraDatePicker, setExtraDatePicker] = useState({});

    const { setLoader, setNextStapeLoading } = useContext(VerificationContext);

    const extraInitialValues = (others || []).reduce((acc, el) => {
        acc[`extra_field_${el.id}`] = "";
        return acc;
    }, {});

    const validation = yup.object(
        (others || []).reduce((acc, el) => {
            const extraFieldvalidation = getExtraFieldValidation(el.validation);
            acc[`extra_field_${el.id}`] = el?.validation?.length ? extraFieldvalidation : null;
            return acc;
        }, {})
    );

    const formik = useFormik({
        initialValues: {
            ...extraInitialValues,
        },
        onSubmit: (values, { setErrors }) => {
            const submitFileByEmail = others.reduce((acc, otherExtraField) => {
                if(otherExtraField?.type?.name === 'file') {
                    const findedExtraValue = values?.[`extra_field_${otherExtraField.id}`];
                    if(findedExtraValue === '') {
                        acc = true;
                    };
                };
                return acc;
            }, false);

            const bodyEntries = Object.entries({
                ...values,
                ...(isFile && { submit_file_by_email: submitFileByEmail ? 1 : 0 }),
                permit_id,
                officer_type_id: applicationTypeId,
                state_id: stateId,
                EIN: ein,
            });

            const formData = new FormData();
            
            bodyEntries.forEach(([ key, value ]) => {
                formData.append(key,(value === 'null' || value === null) ? '' : value);
            });

            dispatch(addOtherExtraFields(formData)).then(res => {
                if (res?.payload?.action) {
                    setNextStapeLoading(false);
                    if(applicationTypeId === QUARTERLY_FILLING_ID) {
                        router.push("/form/payment-info");
                        dispatch(clearQarterRowData());
                    } else {
                        router.push("/form/questionnaire");
                    };
                } else {
                    setNextStapeLoading(false);
                    if(questionnaireLoadding) {
                        dispatch(setQuestionnaireLoading(false));
                    };

                    if(res?.payload?.result?.data?.reload) {
                        dispatch(setPopUp({ popUp: "extraFaild" }))
                    };

                    // check If there are error messages from backend show it unders correct extra faild.
                    if(res?.payload?.result?.data && Object.keys(res?.payload?.result?.data).length) {
                        let errors = {};
                        for(let invalidFaildKey in res?.payload?.result?.data) {
                            if(extraInitialValues?.[invalidFaildKey] !== undefined && res?.payload?.result?.data?.[invalidFaildKey]?.[0]) {
                                errors[invalidFaildKey] = res?.payload?.result?.data?.[invalidFaildKey]?.[0];
                            };
                        };

                        setErrors({
                            ...formik.errors,
                            ...errors
                        });

                        ref.current.scrollIntoView({ behavior: "smooth", block: 'center' });
                    } else {
                        toast.error(res.payload?.result?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    };

                    setLoader(false);
                };
            })
        },
        validationSchema: validation
    });

    useEffect(() => {
        const extraFields = otherExtraValues?.fields;
        if (extraFields?.length) {
            const fileNamesData = {};
            const otherExtraValues = extraFields.filter(el => el.relation === "other");

            const extraValues = otherExtraValues?.reduce((acc, el) => {
                acc[`extra_field_${el.extra_field_id}`] = Boolean(el?.is_file === 1 || el?.is_file === "1") ? 'same' : el?.value;
                fileNamesData[`extra_field_${el.extra_field_id}`] = el?.original_name || '';
                return acc;
            }, {});

            setFileNames(fileNamesData);
            formik.setValues({
                ...formik.values,
                ...extraValues
            });
        }
    }, [otherExtraValues]);

    useEffect(() => {
        if (submit) {
            formik.handleSubmit();
        };

        if (Object.values(formik.errors).some(el => el)) {
            setNextStapeLoading(false);
            ref.current.scrollIntoView({ behavior: "smooth" });
        };

        setSubmit(false);
    }, [submit]);

    if (!(others || []).length) return null;

    const handleFileInputChange = (e) => {
        e.preventDefault();
        let file = e.target.files[0];

        const valid = otherExtraValues.allExtensions.includes(file?.type.split("/")[1]);

        if (!file) {
            formik.setValues({
                ...formik.values,
                [e.target.name]: ""
            });
            setFileNames({
                ...fileNames,
                [e.target.name]: ""
            });
            return;
        } else {
            if (!valid) {
                formik.setErrors({
                    ...formik.errors,
                    [e.target.name]: "Invalid file type!"
                }, false);
                formik.setTouched({
                    ...formik.touched,
                    [e.target.name]: true
                }, false)
            } else {
                formik.setErrors({
                    ...formik.errors,
                    [e.target.name]: ""
                });
            };

            setFileNames({
                ...fileNames,
                [e.target.name]: file.name,
                name: file.name
            });

            formik.setValues({
                ...formik.values,
                [e.target.name]: file
            }, false);

            e.target.value = '';
        };
    };

    return (
        <div ref={ref} className="others">
            <h2 className="subTitle font20 line24 whiteBg textCenter weight500">
                <span className="primary">Required Information </span>
            </h2>
            <div className="othersMain">
                <div className="inputsContainer flex wrap alignEnd gap20">
                    {others?.sort((a, b) => a.sort - b.sort).map(el => {
                        if(el?.type?.name === "file") {
                            return <InputFile
                                key={el.id}
                                onChange={handleFileInputChange}
                                onBlur={formik.handleBlur}
                                fileName={fileNames[`extra_field_${el.id}`]}
                                error={formik.touched?.[`extra_field_${el.id}`] && formik.errors?.[`extra_field_${el.id}`]}
                                required={el.validation?.length && el.validation[0]?.conditions !== "Not Required"}
                                name={`extra_field_${el.id}`}
                                label={el.label || "[ NO LABEL ]"}
                                placeholder={el.placeholder || "[ NO PLACEHOLDER ]"}
                                exampleFilePath={el.exampleImagePath}
                                className="memberFile inputField"
                                resetFileName={(e, name) => {
                                    e.preventDefault();
                                    setFileNames({
                                        ...fileNames,
                                        [name]: ''
                                    });
                                    formik.setValues({
                                        ...formik.values,
                                        [name]: ''
                                    });
                                }}
                            />
                        };

                        if(el?.type?.name === "date") {
                            return <div className="dateInput m-year-Input" key={el.id}>
                                <p className="helper mb5 bold500 font16 line24">
                                    {el.label || "[ NO LABEL ]"}
                                    {el.validation?.length && el.validation?.find(({ conditions }) => conditions === 'required') ? <sup className="red font16">*</sup> : ""}
                                </p>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={formik.values?.[`extra_field_${el.id}`] ? dayjs(formik.values?.[`extra_field_${el.id}`]) : ''}
                                        format="MM/DD/YYYY"
                                        open={extraDatePicker?.[`extra_field_${el.id}`] || false}
                                        onOpen={() => setExtraDatePicker({
                                            ...extraDatePicker,
                                            [`extra_field_${el.id}`]: true
                                        })}
                                        onClose={() => setExtraDatePicker({
                                            ...extraDatePicker,
                                            [`extra_field_${el.id}`]: false
                                        })}
                                        onChange={value => {
                                            formik.setFieldValue(`extra_field_${el.id}`, value, true);
                                            setExtraDatePicker({
                                                ...extraDatePicker,
                                                [`extra_field_${el.id}`]: false
                                            })
                                        }}
                                        slotProps={{
                                            textField: {
                                                onClick: () => setExtraDatePicker({
                                                    ...extraDatePicker,
                                                    [`extra_field_${el.id}`]: true
                                                })
                                            },
                                            actionBar: { actions: ['clear'] }
                                        }}
                                        minDate={dayjs(String(new Date(`01-01-${new Date().getUTCFullYear() - 80}`)) )}
                                        renderInput={(params) => (
                                            <TextField
                                                error={formik.touched?.[`extra_field_${el.id}`] && formik.errors?.[`extra_field_${el.id}`]}
                                                label="Birthday"
                                                margin="normal"
                                                name={`extra_field_${el.id}`}
                                                {...params}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                                <p className="err-message">{formik.touched?.[`extra_field_${el.id}`] && formik.errors?.[`extra_field_${el.id}`]}</p>
                            </div>
                        };

                        return (
                            <InputField
                                key={el.id}
                                className={el.state_id === 70 ? 'small-size' : ''}
                                onChange={(event) => {
                                    if(el?.validation?.[0]?.conditions === 'amount') {
                                        if(event.target.value[0] === '0') return;
                                        let modifiedValue = event.target.value.replace(/\$/g, '');

                                        if(isNaN(Number(modifiedValue))) return;
                                        if(modifiedValue.length > 8) return;
                                        if (modifiedValue !== '') {
                                            modifiedValue = '$' + modifiedValue;
                                        };
                                        event.target.value = modifiedValue;
                                    };
                                    formik.handleChange(event);
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values?.[`extra_field_${el.id}`]}
                                error={formik.touched?.[`extra_field_${el.id}`] && formik.errors?.[`extra_field_${el.id}`]}
                                required={el.validation?.length && el.validation?.find(val => val.conditions === 'required')}
                                name={`extra_field_${el.id}`}
                                label={el.label || "[ NO LABEL ]"}
                                placeholder={el.placeholder || "[ NO PLACEHOLDER ]"}
                                type={el.type?.name}
                                mobileLableWrap={true}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};