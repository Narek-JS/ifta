
import { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPopUp } from "@/store/slices/common";
import { useFormik } from "formik";
import {
    deleteMember,
    editMember,
    getMembers, removeMember,
    selectMembers,
    storeMember,
    updateMember,
    getCityByZipCode,
    selectGetCityByZipCode,
    clearCityByZipCode,
    selectUsdotValues,
    selectOtherExtraValues
} from "@/store/slices/resgister";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MemberTableMobile from "@/components/form/carrier-info/MemberTableMobile";
import MemberTable from "@/components/form/carrier-info/MermberTable";
import InputField from "@/components/universalUI/InputField";
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";
import NormalBtn from "@/components/universalUI/NormalBtn";
import schemas, { getExtraFieldValidation } from "@/utils/schemas";
import classNames from "classnames";
import dayjs from 'dayjs';
import * as yup from "yup";
import InputFile from "@/components/universalUI/InputFile";
import { FormSectionsCarrierInfoContext } from "@/contexts/FormSectionsCarrierInfoContext";

const initialFormValues = {
    officer_type: "",
    name: "",
    home_address: "",
    city: "",
    state: "",
    zip_code: "",
};

export default function OwnerOfficer({
    width,
    allStates,
    officerType,
    extraFields,
    permit_id,
    baseStateId
}) {
    const dispatch = useDispatch();
    const members = useSelector(selectMembers);
    const citiesByZipCode = useSelector(selectGetCityByZipCode);
    const otherExtraValues = useSelector(selectOtherExtraValues);
    const usdotValues = useSelector(selectUsdotValues);
    const membersRef = useRef();
    const debounceTimeRef = useRef();
    const ownerOfficerRef = useRef(null);
    const formRef = useRef(null);
    const [ active, setActive ] = useState(false);
    const [ edit, setEdit ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ autocompleteKey, setAutocompleteKey ] = useState(0);
    const [ maskedSsnValue, setMaskedSsnValue ] = useState('');
    const [ isShowSnnValue, setIsShowSnnValue ] = useState(false);
    const [ autoFillHomeAddress, setAutoFillHomeAddress ] = useState(false);
    const [ physicalBgValues, setPhysicalBgValues ] = useState(null);
    const [ sectionError, setSectionError ] = useState(false);
    const [ datePicker, setDatePicker ] = useState({});
    const [ fileName, setFileName ] = useState({});

    const { ownerOfficerSectionError, setOwnerOfficerActive } = useContext(FormSectionsCarrierInfoContext);

    const extraInitialValues = extraFields.reduce((acc, el, i) => {
        acc[`extra_field_${el.id}`] = "";
        return acc;
    }, {});

    const extraFaildValidation = extraFields.reduce((acc, el) => {
        if(el?.type?.name === 'file') {
            if(el?.validation?.find(({ conditions }) => conditions === 'required')) {
                acc[`extra_field_${el.id}`] = schemas.text
            };
        } else if(el?.validation?.[0]?.conditions) {
            acc[`extra_field_${el.id}`] = getExtraFieldValidation(el?.validation);
        };
        return acc;
    }, {});

    const formik = useFormik({
        initialValues: {
            ...initialFormValues,
            ...extraInitialValues,
            ...(!Boolean(baseStateId === 89 || baseStateId === 87 || baseStateId === 53) && {ssn: ""}),
        },
        onSubmit: (values, { resetForm }) => {
            if (edit) {
                handleUpdate(resetForm);
            } else {
                storeMembers(values);
            };

            if(autoFillHomeAddress === true) {
                setAutoFillHomeAddress(false);
            };
        },
        validationSchema: yup.object({
            ...(!Boolean(baseStateId === 89 || baseStateId === 87 || baseStateId === 53) && {ssn: schemas.ssn}),
            officer_type: schemas.select,
            name: schemas.text,
            ...extraFaildValidation,
            home_address: schemas.text,
            city: schemas.text,
            state: schemas.select,
            zip_code: schemas.zip_code
        }),
    });

    useEffect(() => {
        if(Object.keys(formik.errors || {}).length) {
            formik.setErrors(formik.initialErrors);
        };

        if (permit_id) {
            dispatch(getMembers(permit_id))
                .then(res => {
                    if (!res?.payload?.data?.length) {
                        setActive(true)
                    }
                })
        };
    }, []);

    useEffect(() => {
        if(!active) {
            setSectionError(false);
        };
        setOwnerOfficerActive(active);
    }, [active]);

    useEffect(() => {
        if(ownerOfficerSectionError) {
            ownerOfficerRef.current?.scrollIntoView({ behavior: "smooth" });
            if(active) {
                setSectionError(true);
            };
        };
    }, [ownerOfficerSectionError]);

    const stateAsPhysical = useMemo(() => {
        return allStates?.find(item => item?.app?.toUpperCase() === usdotValues.content.carrier.phyState.toUpperCase())?.state;
    }, [usdotValues, allStates]);

    const storeMembers = (values) => {
        setLoading(true);

        const { officer_type, state, ...rest } = values;

        const bodyEntries = Object.entries({
            ...rest,
            same_as: autoFillHomeAddress ? 1 : 0,
            officer_type_id: officer_type?.id,
            state_id: state?.id,
            permit_id
        });

        const formData = new FormData();

        bodyEntries.forEach(([ key, value ]) => {
            formData.append(key, value);
        });

        dispatch(storeMember(formData)).then(res => {
            setLoading(false);
            if (res?.payload?.action) {
                setFileName({});
                setActive(false);
                formik.resetForm();
                setTimeout(() => {
                    formik.setValues(prev => {
                        prev.officer_type = '';
                        return prev;
                    });
                }, 100);
            } else {
                if(res?.payload?.result?.data?.reload) {
                    dispatch(setPopUp({popUp: "extraFaild"}))
                };
                formik.setErrors(res?.payload?.result?.data)
            }
        });
    };

    const handleEdit = (el) => {
        setLoading(true);
        dispatch(editMember(el.id))
            .then(res => {
                if (res?.payload?.action) {
                    const {extra_value, ...data} = res.payload.data;
                    const extraInitialValues = extra_value.reduce((acc, el) => {
                        if(el.extra_field?.type?.name === 'file') {
                            acc.values[`extra_field_${el.extra_field_id}`] = 'same';
                            acc.filesOriginalNames[`extra_field_${el.extra_field_id}`] = el?.original_name;
                        } else {
                            acc.values[`extra_field_${el.extra_field_id}`] = el.value;
                        };

                        return acc;
                    }, {
                        values: {},
                        filesOriginalNames: {}
                    });

                    setFileName(extraInitialValues.filesOriginalNames);

                    setAutoFillHomeAddress(Boolean(res?.payload?.data?.same_as));

                    formik.setValues({
                        ...extraInitialValues.values,
                        permit_id,
                        officer_type: data.officer_type,
                        ssn: data.ssn,
                        name: data.name,
                        home_address: data.home_address,
                        city: data.city,
                        state: data.state,
                        zip_code: data.zip_code,
                        id: data.id
                    });

                    setActive(true);

                    setEdit(true);
                } else if(res?.payload?.result?.data?.reload) {
                    dispatch(setPopUp({popUp: "extraFaild"}))
                }
                setLoading(false)
            })
    };

    const handleUpdate = () => {
        setLoading(true);

        const {officer_type, state, ...rest} = formik.values;

        const bodyEntries = Object.entries({
            ...rest,
            officer_type_id: officer_type.id,
            state_id: state.id,
            same_as: autoFillHomeAddress ? 1 : 0,
        });

        const formData = new FormData();

        bodyEntries.forEach(([key, value]) => {
            formData.append(key, value);
        });
        formData.append("_method", "PUT");

        dispatch(updateMember(formData))
            .then(res => {
                setLoading(false);

                if (res?.payload?.action) {
                    setFileName({});
                    setEdit(false);
                    setActive(false);

                    setTimeout(() => {
                        if(ownerOfficerRef.current) {
                            ownerOfficerRef.current.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                            });
                        };
                    }, 100);

                    dispatch(getMembers(permit_id));
                    formik.resetForm();
                } else {
                    if(res?.payload?.result?.data?.reload) {
                        dispatch(setPopUp({popUp: "extraFaild"}))
                    };
                    formik.setErrors(res?.payload?.result?.data)
                }
                
            })
    };

    const handleDelete = (id) => {
        dispatch(setPopUp({
            popUp: "deleteMember",
            popUpContent: "Are You sure to delete the member ?",
            popUpAction: () =>
                dispatch(deleteMember({id, permit_id}))
                    .then(res => {
                        if (formik.values.id === id) {
                            formik.resetForm();
                            setEdit(false);
                        };
                        dispatch(setPopUp({}));
                        if(res?.payload?.action){
                            dispatch(removeMember(id));

                            if(members.length === 1 && active === false) {
                                formik.resetForm({values: {
                                    ...initialFormValues,
                                    ...extraInitialValues,
                                    ...(!Boolean(baseStateId === 89 || baseStateId === 87 || baseStateId === 53) && {ssn: ""}),
                                }});
                                setActive(true);
                            };
                        } else if(res?.payload?.result?.data?.reload) {
                            dispatch(setPopUp({popUp: "extraFaild"}))
                        };
                    })
        }));
    };

    const hendleOnInputChangeZipAndCity = (event, name) => {
        if(event) { 
            const inputString = event.target.value;
            const regexs = {
                zip_code: /^(?:\d{1,5})?$/,
                city: /\d/
            };
            const isValid = name === 'city' ? !regexs[name].test(inputString) : regexs[name].test(inputString);
            if(isValid && inputString) {
                formik.setValues(prev => {
                    prev[name] = event.target.value;
                    return prev;
                });
                clearTimeout(debounceTimeRef.current);

                debounceTimeRef.current = setTimeout(() => {
                    dispatch(inputString ? getCityByZipCode(inputString) : clearCityByZipCode());
                }, 500);
            };
        };
    };

    const hendleOnChangeZipAndCity = (value, name) => {
        formik.setValues(prev => {
            if(value) {
                const [city, stateCode, zipCode] = value && value.split(',');
                const state = allStates?.find(oneState => oneState.app === stateCode);
                return {
                    ...prev,
                    zip_code: zipCode,
                    city: city,
                    state: state,
                };
            } else return {...prev, [name]: '' };
        })
        setAutocompleteKey(prev => prev + 1);
    };

    const selectPhysicalBgValues = () => {
        setAutoFillHomeAddress(false);
        formik.setValues({
            ...formik.values,
            ...physicalBgValues
        });
    };

    const selectAutoFillAdresses = () => {
        setAutoFillHomeAddress(true);

        setPhysicalBgValues({
            home_address: formik.values.home_address,
            zip_code: formik.values.zip_code,
            city: formik.values.city,
            state: formik.values.state,
        });

        formik.setValues({
            ...formik.values,
            home_address: usdotValues?.content?.carrier?.phyStreet,
            zip_code: usdotValues?.content?.carrier?.phyZipcode,
            city: usdotValues.content.carrier.phyCity,
            ...(Boolean(stateAsPhysical) && { state: allStates?.find(item => item?.app?.toUpperCase() === usdotValues.content.carrier.phyState.toUpperCase()) }),
        });
    };

    const makeModifySsnValue = (value) => {
        let checkMount = false;
        if(value === undefined) {
            checkMount = true;
            value = formik.values?.ssn
        };
        let string = '';
        if(value[value.length - 1] === 'X' || value[value.length - 1] === '-' || value === '') {
            string = formik.values.ssn.slice(0, formik.values.ssn[formik.values.ssn.length - 1] === '-' ? value.length - 1 : value.length);
        } else {
            string = formik.values.ssn + value[value.length - 1]
        };
        const test = /^[\d-]*$/.test(string)
        if (!test || string.length > 11) {
            return checkMount ? string.replace(/[0-9]/g, 'X') : undefined;
        };

        string = string.replace(/-/g, "");

        let formattedString = string;
        if (string.length >= 3 && string.length <= 5) {
            formattedString = string.substring(0, 3) + "-" + string.substring(3);
        } else if (string.length >= 6 && string.length <= 10) {
            formattedString = string.substring(0, 3) + "-" + string.substring(3, 5) + "-" + string.substring(5);
        }

        formik.setValues({
            ...formik.values,
            ssn: formattedString
        });
        
        const modifyedValue = formattedString.replace(/[0-9]/g, 'X');
        setMaskedSsnValue(modifyedValue);
        return modifyedValue;
    };

    const extraInputChange = (event, el) => {
        if(event.target.type === 'file') {
            const file = event.target.files[0];
            const valid = otherExtraValues?.allExtensions?.includes(file?.type.split("/")[1]);
            if (!file) {
                formik.setValues({
                    ...formik.values,
                    [event.target.name]: ""
                });
                setFileName({});
                return;
            };
            if(!valid) {
                formik.setErrors({
                    ...formik.errors,
                    [event.target.name]: "Invalid file type!"
                });
                formik.setTouched({
                    ...formik.touched,
                    [event.target.name]: true
                }, false);
                return;
            } else {
                formik.setErrors({
                    ...formik.errors,
                    [event.target.name]: ""
                });
            };

            if(file?.name) {
                setFileName({
                    ...fileName,
                    [event.target.name]: file?.name,
                });
            };

            formik.setValues({
                ...formik.values,
                [event.target.name]: file
            }, false);
        } else {
            formik.handleChange(event);
        };
    };

    return (
        <div className="ownerOfficer" ref={ownerOfficerRef}>
            <h2 ref={membersRef} className="subTitle font20 line24 whiteBg textCenter weight500">
                <span className="primary">Owner/Officer Information </span>
            </h2>
            <div className="ownerOfficerMain">
                {width > 768 ? <MemberTable
                    loading={loading}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    members={members}
                    {...(formik.values?.id && { activeEditLineId: formik.values?.id })}
                /> : <MemberTableMobile
                    loading={loading}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    members={members}
                />}
                {active ? <form className="relative mb20" ref={formRef}>
                    <div className="inputsContainer flex wrap alignEnd gap20">
                        {extraFields?.map(el => 
                            el.type.name === 'date' ? (
                                <div className="dateInput m-year-Input" key={el.id}>
                                    <p className="helper mb5 bold500 font16 line24">
                                        {el.label || "[ NO LABEL ]"}
                                        {el.validation?.length && el.validation?.find(({ conditions }) => conditions === 'required') ? <sup className="red font16">*</sup> : ""}
                                    </p>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            value={formik.values?.[`extra_field_${el.id}`] ? dayjs(formik.values?.[`extra_field_${el.id}`]) : ''}
                                            format="MM/DD/YYYY"
                                            open={datePicker?.[`extra_field_${el.id}`] || false}
                                            onOpen={() => setDatePicker({
                                                ...datePicker,
                                                [`extra_field_${el.id}`]: true
                                            })}
                                            onClose={() => setDatePicker({
                                                ...datePicker,
                                                [`extra_field_${el.id}`]: false
                                            })}
                                            onChange={value => {
                                                formik.setFieldValue(`extra_field_${el.id}`, value, true);
                                                setDatePicker({
                                                    ...datePicker,
                                                    [`extra_field_${el.id}`]: false
                                                });
                                            }}
                                            slotProps={{
                                                textField: {
                                                    onClick: () => setDatePicker({
                                                        ...datePicker,
                                                        [`extra_field_${el.id}`]: true
                                                    })
                                                },
                                                actionBar: { actions: ['clear'] }
                                            }}
                                            minDate={dayjs(String(new Date(`01-01-${new Date().getUTCFullYear() - 80}`)) )}
                                            renderInput={(params) => (
                                                <TextField
                                                    error={formik.touched?.[`extra_field_${el.id}`] && formik.errors?.[`extra_field_${el.id}`]}
                                                    helperText={touched.birthday && errors.birthday}
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
                            ) : el.type?.name === 'file' ? (
                                <InputFile
                                    key={el.id}
                                    onChange={(e) => extraInputChange(e, el)}
                                    onBlur={formik.handleBlur}
                                    fileName={fileName?.[`extra_field_${el.id}`] || ''}
                                    error={formik.touched?.[`extra_field_${el.id}`] && formik.errors?.[`extra_field_${el.id}`]}
                                    required={el.validation?.length && el.validation?.find(({ conditions }) => conditions === 'required')}
                                    name={`extra_field_${el.id}`}
                                    placeholder={el.placeholder || "[ NO PLACEHOLDER ]"}
                                    exampleFilePath={el.exampleImagePath}
                                    className="memberFile inputField"
                                    resetFileName={(e, name) => {
                                        e.preventDefault();
                                        setFileName({
                                            ...fileName,
                                            [name]: ""
                                        });
                                        formik.setValues({
                                            ...formik.values,
                                            [name]: ''
                                        });
                                    }}
                                />
                            ) : (
                                <InputField
                                    key={el.id}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched?.[`extra_field_${el.id}`] && formik.errors?.[`extra_field_${el.id}`]}
                                    required={el.validation?.length && el.validation?.find(({ conditions }) => conditions === 'required')}
                                    name={`extra_field_${el.id}`}
                                    label={el.label || "[ NO LABEL ]"}
                                    placeholder={el.placeholder || "[ NO PLACEHOLDER ]"}
                                    type={el.type?.name}
                                    value={formik.values?.[`extra_field_${el.id}`]}
                                />
                            )
                        )}
                        <InputField
                            error={formik.touched?.officer_type && formik.errors?.officer_type}
                            className="inputField"
                            label="Officer Type"
                            required={true}
                            element={<Autocomplete
                                onChange={(e, value) => {
                                    formik.setValues(prev => {
                                        prev.officer_type = value;
                                        return prev;
                                    })
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values?.officer_type || null}
                                popupIcon={<PopupIcon/>}
                                id={`officer_type`}
                                name={`officer_type`}
                                loading={!officerType}
                                options={officerType || []}
                                getOptionLabel={type => String(type?.name || type)}
                                isOptionEqualToValue={(option, value) => option.id === value}
                                renderInput={(params) => <TextField {...params} placeholder="Select officer type"/>}
                                slotProps={{popper: {sx: {zIndex: 98}}}}
                            />}
                        />
                        
                        {!Boolean(baseStateId === 89 || baseStateId === 87 || baseStateId === 53) && 
                            <Fragment>
                                <InputField
                                    className={isShowSnnValue ? '' : 'none'}
                                    onChange={(event) => {
                                        let string = event.target.value;
                                        const test = /^[\d-]*$/.test(string)
                                        if(!test || string.length > 11) return;
                                        string = string.replace(/-/g, "");
                                        let regex = /^([^\s]{3})([^\s]{2})([^\s]{4})$/g;
                                        let match = regex.exec(string);
                                        if (match) {
                                            match.shift();
                                            string = match.join("-");
                                        }
                                        formik.setValues({
                                            ...formik.values,
                                            ssn: string
                                        })
                                        setMaskedSsnValue(string.replace(/[0-9]/g, 'X'));
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values?.ssn}
                                    error={formik.touched?.ssn && formik.errors?.ssn}
                                    required={true}
                                    id={`ssn`}
                                    name={`ssn`}
                                    label="SSN"
                                    placeholder="Enter SSN"
                                    type="text"
                                    toogleIsOpenLeatter={() => setIsShowSnnValue(!isShowSnnValue)}
                                    eye={true}
                                />
                                <InputField
                                    className={`ssnInput ${isShowSnnValue ? 'none' : ''}`}
                                    onChange={event => {
                                        makeModifySsnValue(event.target.value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={maskedSsnValue.length !== formik.values?.ssn?.length ? makeModifySsnValue() : maskedSsnValue}
                                    error={formik.touched?.ssn && formik.errors?.ssn}
                                    required={true}
                                    id={`ssn`}
                                    name={`ssn`}
                                    label="SSN"
                                    placeholder="Enter SSN"
                                    type="text"
                                    toogleIsOpenLeatter={() => setIsShowSnnValue(!isShowSnnValue)}
                                    eye={true}
                                />
                            </Fragment>
                        }
                        <InputField
                            onChange={(e) => {
                                const { target: { value } } = e;
                                const spaceCount = value.includes('  ');

                                if((/^[a-zA-Z\s]+$/.test(value) && value !== ' ' && !spaceCount) || value === '') {
                                    formik.handleChange(e);
                                } else {
                                    formik.setErrors({
                                        ...formik.errors,
                                        name: 'Must be only letters'
                                    });
                                    if(!formik.touched?.name) {
                                        formik.setTouched({
                                            ...formik.touched,
                                            name: true
                                        });
                                    };
                                };
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values?.name}
                            error={formik.touched?.name && formik.errors?.name}
                            required={true}
                            id={`name`}
                            name={`name`}
                            label="Full Name"
                            placeholder="Enter full name"
                        />
                        
                        <InputField
                            className={classNames({
                                'disabled': autoFillHomeAddress && Boolean(usdotValues?.content?.carrier?.phyStreet)
                            })}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={autoFillHomeAddress ? (
                                usdotValues?.content?.carrier?.phyStreet || formik.values?.home_address
                            ) : formik.values?.home_address}
                            error={formik.touched?.home_address && formik.errors?.home_address}
                            id={`home_address`}
                            name={`home_address`}
                            required={true}
                            label={
                                <label className="flex gap5 line24 primary pointer homeAddresCheckedLable">
                                    <input
                                        className="pointer"
                                        type="checkbox"
                                        checked={autoFillHomeAddress}
                                        onChange={autoFillHomeAddress ? selectPhysicalBgValues : selectAutoFillAdresses}
                                    />
                                    <span className="sameAsPhysicalText">Home Address Same As Physical</span>
                                </label>
                            }
                            placeholder="Enter Address"
                        />

                        <InputField
                            className={classNames('cityInputFild', {
                                'disabled': autoFillHomeAddress && Boolean(usdotValues.content.carrier.phyCity)
                            })}
                            onBlur={formik.handleBlur}
                            error={formik.touched?.city && formik.errors?.city}
                            required={true}
                            id={`city`}
                            name={`city`}
                            label="City"
                            placeholder="City"
                            {...(autoFillHomeAddress && {
                                value: usdotValues.content.carrier.phyCity || formik.values?.city,
                                disabled: Boolean(usdotValues.content.carrier.phyCity)
                            })}
                            {...(autoFillHomeAddress === false && { 
                                element: <Autocomplete
                                    onInputChange={(e) => hendleOnInputChangeZipAndCity(e, 'city')}
                                    onChange={(e, value) => hendleOnChangeZipAndCity(value, 'city')}
                                    onBlur={formik.handleBlur}
                                    value={formik.values?.city || null}
                                    forcePopupIcon={false}
                                    id={`city`}
                                    name={`city`}
                                    loading={!citiesByZipCode}
                                    options={formik.values?.city ? (citiesByZipCode || []) : []}
                                    getOptionLabel={type => type}
                                    slotProps={{popper: {sx: {zIndex: 98}}}}
                                    key={autocompleteKey}
                                    renderInput={(params) => <TextField
                                        {...params}
                                        value={formik.values?.state}
                                        placeholder="Enter City"
                                    />}
                                />
                            })}
                        />

                        <InputField
                            className={classNames("inputField", {
                                'disabled': autoFillHomeAddress && Boolean(stateAsPhysical)
                            })}
                            error={formik.touched?.state && formik.errors?.state}
                            label="State"
                            required={true}
                            {...((autoFillHomeAddress === true && Boolean(stateAsPhysical) === true) && {
                                value: stateAsPhysical,
                                disabled: Boolean(stateAsPhysical)
                            })}
                            {...((autoFillHomeAddress === false || (autoFillHomeAddress === true && Boolean(stateAsPhysical) === false)) && {
                                element: <Autocomplete
                                    onChange={(e, value) => {
                                        formik.setValues(prev => {
                                            prev.state = value;
                                            return prev;
                                        })
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values?.state || null}
                                    popupIcon={<PopupIcon/>}
                                    id={`state`}
                                    name={`state`}
                                    loading={!allStates}
                                    options={allStates || []}
                                    getOptionLabel={type => String(type.state || type)}
                                    isOptionEqualToValue={(option, value) => option.id === value}
                                    slotProps={{popper: {sx: {zIndex: 98}}}}
                                    renderInput={(params) => <TextField
                                        {...params}
                                        placeholder="State"
                                        value={formik.values?.state}
                                    />}
                                />
                            })}
                        />

                        <InputField
                            className={classNames('zipInputFild', {
                                'disabled': autoFillHomeAddress && Boolean(usdotValues.content.carrier.phyZipcode)
                            })}
                            onBlur={formik.handleBlur}
                            error={formik.touched?.zip_code && formik.errors?.zip_code}
                            type="tel"
                            required={true}
                            name={`zip_code`}
                            label="ZIP Code"
                            placeholder="Enter Zip Code"
                            params={{maxLength: 5}}
                            {...(autoFillHomeAddress && {
                                value: usdotValues.content.carrier.phyZipcode || formik.values?.zip_code,
                                disabled: Boolean(usdotValues.content.carrier.phyZipcode)
                            })}
                            {...(autoFillHomeAddress === false && {
                                element: <Autocomplete
                                    onInputChange={(e) => hendleOnInputChangeZipAndCity(e, 'zip_code')}
                                    onChange={(e, value) => hendleOnChangeZipAndCity(value, 'zip_code')}
                                    onBlur={formik.handleBlur}
                                    value={formik.values?.zip_code || null}
                                    forcePopupIcon={false}
                                    id={`zip_code`}
                                    name={`zip_code`}
                                    loading={!citiesByZipCode}
                                    options={formik.values?.zip_code ? (citiesByZipCode || []) : []}
                                    getOptionLabel={type => type}
                                    slotProps={{popper: {sx: {zIndex: 98}}}}
                                    key={autocompleteKey}
                                    renderInput={(params) => <TextField
                                        value={formik.values?.state}
                                        {...params}
                                        placeholder="Enter Zip Code"
                                    />}
                                />
                            })}
                        />
                        {edit ? ( 
                            <div className="confirmActions flexBetween gap10">
                                <NormalBtn
                                    loading={loading}
                                    onClick={formik.handleSubmit}
                                    className="filled bg-lighthouse-black"
                                >
                                    Update Info
                                </NormalBtn>
                                <NormalBtn
                                    loading={loading}
                                    onClick={() => {
                                        setFileName({});
                                        setActive(false);
                                        setEdit(false);
                                        setAutoFillHomeAddress(false);
                                        formik.resetForm();
                                    }}
                                    className="filled primary white"
                                >
                                    Cancel
                                </NormalBtn>
                            </div> 
                        ) : (
                            <Fragment>
                                { members?.length ? (
                                    <div className="flex gap5 ml-auto">
                                        <NormalBtn
                                            className="outlined secondary border-right-none w-initial"
                                            onClick={() => {
                                                setFileName({});
                                                setActive(false);
                                            }}
                                        >
                                            Cancel
                                        </NormalBtn>
                                        <NormalBtn
                                            className="outlined bg-lighthouse-black w-initial"
                                            loading={loading}
                                            onClick={(e) => {
                                                formik.handleSubmit(e);
                                            }}
                                        >
                                            Save Info
                                        </NormalBtn>
                                    </div>
                                ) : (
                                    <NormalBtn
                                        className="outlined bg-lighthouse-black ml-auto"
                                        loading={loading}
                                        onClick={(e) => {
                                            formik.handleSubmit(e);
                                        }}
                                    >
                                        Save Info
                                    </NormalBtn>
                                )}
                            </Fragment>
                        )}
                    </div>

                    { Boolean(sectionError && members.length && edit) && <span className={'section-error'}>Please update or cancel your member information. </span> }
                    { Boolean(sectionError && members.length && !edit) && <span className={'section-error'}>Please add or cancel your member information. </span> }
                    { Boolean(sectionError) && active && members.length === 0 && <span className={'section-error'}>Please add member information. </span> }

                </form> : ""}
                {!active ? (
                    <NormalBtn
                        onClick={() => {
                            width <= 768 && membersRef.current?.scrollIntoView({ behavior: "smooth" })
                            setActive(true);
                            setFileName({});
                            formik.setErrors(formik.initialErrors);
                        }}
                        className="addAnother outlined secondary bg-lighthouse-black mb20 ml-auto min-m-w-initial"
                    >
                        <span className="lighthouse-black">+</span> Add another member
                    </NormalBtn>
                ) : ""}

                <div className="rowUnderTable"/>
            </div>
        </div>
    )
}