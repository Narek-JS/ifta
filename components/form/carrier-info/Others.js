import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectQuestionnaireLoadding, setQuestionnaireLoading } from "@/store/slices/questionnaire";
import { addOtherExtraFields, selectOtherExtraValues } from "@/store/slices/resgister";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import InputField from "@/components/universalUI/InputField";
import InputFile from "@/components/universalUI/InputFile";
import schemas from "@/utils/schemas";
import Link from "next/link";
import * as yup from "yup";

export default function Others({
    permit_id,
    others,
    setLoading,
    setSubmit,
    submit,
    sendFileByEmail,
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
    const [after, setAfter] = useState(sendFileByEmail === "1");
    const [fileNames, setFileNames] = useState({});

    const extraInitialValues = (others || []).reduce((acc, el) => {
        acc[`extra_field_${el.id}`] = "";
        return acc;
    }, {});

    const validation = yup.object(
        (others || []).reduce((acc, el) => {
            acc[`extra_field_${el.id}`] = schemas[el.validation[0]?.conditions] || null;
            return acc;
        }, {})
    );

    const formik = useFormik({
        initialValues: {
            ...extraInitialValues,
        },
        onSubmit: (values, { resetForm }) => {
            setLoading(true);
            const asArray = Object.entries(values);
            const filtered = asArray.filter(([key, value]) => value);
            const withValidValues = Object.fromEntries(filtered);
            dispatch(addOtherExtraFields({
                ...withValidValues,
                ...(isFile && {submit_file_by_email: after ? 1 : 0}),
                permit_id,
                originalNames: fileNames,
                officer_type_id: applicationTypeId,
                state_id: stateId,
                EIN: ein
            })).then(res => {
                if (res?.payload?.action) {
                    if (after && isFile) {
                        toast.success(res.payload?.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                    router.push("/form/questionnaire");
                } else {
                    if(questionnaireLoadding) {
                        dispatch(setQuestionnaireLoading(false));
                    };
                    if(res?.payload?.result?.data?.reload) {
                        dispatch(setPopUp({ popUp: "extraFaild" }))
                    };
                    toast.error(res.payload?.result?.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    setLoading(false)
                }
            })
        },
        validationSchema: isFile ? !after ? validation : null : validation
    });

    useEffect(() => {
        const extraFields = otherExtraValues?.fields
        if (extraFields?.length) {
            const fileNamesData = {}
            const otherExtraValues = extraFields.filter(el => el.relation === "other")
            const extraValues = otherExtraValues?.reduce((acc, el) => {
                acc[`extra_field_${el.extra_field_id}`] = el.value;
                fileNamesData[`extra_field_${el.extra_field_id}`] = el?.original_name || '';
                return acc;
            }, {});

            setFileNames(fileNamesData)
            formik.setValues({
                ...formik.values,
                ...extraValues
            })
        }
    }, [otherExtraValues]);

    useEffect(() => {
        if (submit) {
            if (Object.values(formik.errors).some(el => el)) {
                ref.current.scrollIntoView({behavior: "smooth"})
            };
            formik.handleSubmit();
        }
        setSubmit(false);
    }, [submit]);

    if (!(others || []).length) return null;

    const getBase64 = (file) => {
        return new Promise(resolve => {
            let baseURL = "";
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                baseURL = reader.result;
                resolve(baseURL);
            };
        });
    };

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
        };

        getBase64(file)
            .then(result => {
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
                    name: 'asdsad'
                });

                formik.setValues({
                    ...formik.values,
                    [e.target.name]: result
                }, false);

                e.target.value = '';
            });
    };

    return (
        <div ref={ref} className="others">
            <h2 className="subTitle font20 line24 whiteBg textCenter weight500">
                <span className="primary">Required Information </span>
            </h2>
            <div className="othersMain">
                <div className="inputsContainer flex wrap alignEnd gap20">
                    {others?.sort((a, b) => a.sort - b.sort).map(el => {
                        if(isFile) {
                            return <InputFile
                                key={el.id}
                                onChange={handleFileInputChange}
                                onBlur={formik.handleBlur}
                                disabled={isFile && after}
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
                                disabled={isFile && after}
                                value={formik.values?.[`extra_field_${el.id}`]}
                                error={formik.touched?.[`extra_field_${el.id}`] && formik.errors?.[`extra_field_${el.id}`]}
                                required={el.validation?.length && el.validation[0]?.conditions !== "Not Required"}
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