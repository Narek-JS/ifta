import * as yup from "yup";
import schemas, { getExtraFieldValidation } from "@/utils/schemas";
import InputField from "@/components/universalUI/InputField";
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";
import NormalBtn from "@/components/universalUI/NormalBtn";
import VehicleTable from "@/components/form/carrier-info/VehicleTable";
import VehicleTableMobile from "@/components/form/carrier-info/VehicleTableMobile";
import { useFormik } from "formik";
import { Autocomplete, TextField } from "@mui/material";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPopUp } from "@/store/slices/common";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    clearVehiclesErrorMessage,
    deleteVehicle,
    editVehicle, getDataByVin, getPermitDetails,
    getVehicles, removeVehicle,
    selectOtherExtraValues,
    selectVehicles,
    selectVehiclesErrorMessage,
    storeVehicle,
    updateVehicle
} from "@/store/slices/resgister";
import dayjs from 'dayjs';
import classNames from "classnames";
import InputFile from "@/components/universalUI/InputFile";
import { FormSectionsCarrierInfoContext } from "@/contexts/FormSectionsCarrierInfoContext";

const HtmlDynamicElm = ({ children, isDiv }) => isDiv ? (
    <Fragment>{children}</Fragment>
) : (
    <div className="inputsContainer w100 flex alignEnd gap20">{children}</div>
);

const initialValue = {
    vin: "",
    fuel_type: "",
    year: "",
    model: "",
    make: "",
    vehicles_leased: "",
    decal_set: 1
}

export default function Vehicles({
    width,
    fuelType,
    extraFields,
    permit_id,
    cost
}) {
    const dispatch = useDispatch();
    const vehicles = useSelector(selectVehicles);
    const vehiclesErrorMessage = useSelector(selectVehiclesErrorMessage); 
    const otherExtraValues = useSelector(selectOtherExtraValues);
    const vehicleRef = useRef();
    const debounceTimeRef = useRef();
    const ownerOfficerRef = useRef(null);
    const formRef = useRef(null);
    const [active, setActive] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sectionError, setSectionError ] = useState(false);
    const [datePicker, setDatePicker] = useState(false);
    const [extraDatePicker, setExtraDatePicker] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [fileName, setFileName] = useState({});

    const { vehiclesSectionError, setVehiclesActive } = useContext(FormSectionsCarrierInfoContext);

    const extraInitialValues = extraFields.reduce((acc, el) => {
        acc[`extra_field_${el.id}`] = "";
        return acc;
    }, {});

    const extraFaildValidation = extraFields.reduce((acc, el) => {
        if(el?.type?.name === 'file') {
            if(el?.validation?.find(({ conditions }) => conditions === 'required')) {
                acc[`extra_field_${el.id}`] = schemas.text;
            };
        } else if(el?.validation?.[0]?.conditions) {
            acc[`extra_field_${el.id}`] = getExtraFieldValidation(el?.validation);
        };
        return acc;
    }, {});

    useEffect(() => {
        if (permit_id) {
            dispatch(getVehicles(permit_id))
                .then(res => {
                    if (!res?.payload?.data?.length) {
                        setActive(true);
                    };
                })
        }
    }, []);

    useEffect(() => {
        if(!active) {
            setSectionError(false);
        };
        setVehiclesActive(active)
    }, [active]);

    useEffect(() => {
        if(vehiclesSectionError) {
            ownerOfficerRef.current?.scrollIntoView({ behavior: "smooth" });
            if(active) {
                setSectionError(true);
            };
        };
    }, [vehiclesSectionError]);

    const formik = useFormik({
        initialValues: {
            ...extraInitialValues,
            ...initialValue
        },
        onSubmit: (values, { resetForm }) => {
            if (edit) {
                handleUpdate(resetForm);
            } else {
                handleStoreVehicle(values, resetForm);
            };
        },
        validationSchema: yup.object({
            ...extraFaildValidation,
            vin: schemas.vin,
            fuel_type: schemas.select,
            year: schemas.required,
            model: schemas.required,
            make: schemas.required,
            vehicles_leased: schemas.text,
        })
    });

    const handleStoreVehicle = (values, resetForm) => {
        setLoading(true);

        const {fuel_type, ...rest} = values;

        const bodyEntries = Object.entries({
            ...rest,
            fuel_type_id: fuel_type.id,
            permit_id,
            decal_set: 1
        });

        const formData = new FormData();

        bodyEntries.forEach(([ key, value ]) => {
            formData.append(key, value);
        });

        dispatch(storeVehicle(formData))
            .then(res => {
                dispatch(getPermitDetails(permit_id));
                setLoading(false);
                if (res?.payload?.action) {
                    setFileName({});
                    setActive(false);
                    formik.resetForm();
                } else {
                    if(res?.payload?.result?.data?.reload) {
                        dispatch(setPopUp({popUp: "extraFaild"}))
                    };
                    formik.setErrors(res?.payload?.result?.data);
                };
            });
    };

    const handleEdit = (el) => {
        setLoading(true);
        dispatch(editVehicle(el.id))
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

                    formik.setValues({
                        ...extraInitialValues.values,
                        year: String(data.year),
                        make: data.make,
                        model: data.model,
                        permit_id,
                        fuel_type: data.fuel_type,
                        vin: data.vin,
                        id: data.id,
                        vehicles_leased: data.vehicles_leased
                    });

                    setActive(true);
                    setEdit(true);
                } else if(res?.payload?.result?.data?.reload) {
                    dispatch(setPopUp({popUp: "extraFaild"}))
                };

                setLoading(false);
            });
    };

    const handleUpdate = (resetForm) => {
        setLoading(true);

        const { fuel_type, ...rest } = formik.values;

        const bodyEntries = Object.entries({
            ...rest,
            fuel_type_id: fuel_type.id,
            decal_set: 1
        });

        const formData = new FormData();

        bodyEntries.forEach(([key, value]) => {
            formData.append(key, value);
        });
        formData.append("_method", "PUT");

        dispatch(updateVehicle(formData))
            .then(res => {
                setLoading(false);
                
                if (res?.payload?.action) {
                    dispatch(getPermitDetails(permit_id));
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

                    dispatch(getVehicles(permit_id));
                    resetForm();
                } else {
                    if(res?.payload?.result?.data?.reload) {
                        dispatch(setPopUp({popUp: "extraFaild"}))
                    };
                    formik.setErrors(res?.payload?.result?.data);
                };
            });
    };

    const handleDelete = (id) => {
        dispatch(setPopUp({
            popUp: "deleteVehicle",
            popUpContent: "Are You sure to delete the vehicle?",
            popUpAction: () =>
                dispatch(deleteVehicle({id, permit_id}))
                    .then(res => {
                        dispatch(getPermitDetails(permit_id));
                        if (formik.values.id === id) {
                            formik.resetForm();
                            setEdit(false);
                        };
                        dispatch(setPopUp({}));
                        if (res?.payload?.action) {
                            dispatch(removeVehicle(id));
                            if(vehicles.length === 1 && active === false) {
                                formik.resetForm();
                                setActive(true);
                            };
                        } else if(res?.payload?.result?.data?.reload) {
                            dispatch(setPopUp({popUp: "extraFaild"}))
                        };
                    })
        }));
    };

    const hendleOnInputChangeVin = (event) => {
        if(event) {
            const inputString = event?.target?.value;

            if(/[^A-Za-z0-9]+/g.test(inputString)) {
                return;
            };

            dispatch(clearVehiclesErrorMessage());
            formik.setValues({
                ...formik.values,
                vin: inputString ? inputString.toUpperCase() : ''
            });

            const callBackForFind = (data) => {
                const fullType = data?.FuelTypePrimary 
                    ? (fuelType || []).find(type => (type?.name || '').toUpperCase() === data.FuelTypePrimary.toUpperCase())
                    : null;

                formik.setValues({
                    ...formik.values,
                    vin: inputString.toUpperCase(),
                    year: data?.ModelYear || formik.values.year,
                    make: data?.Make || formik.values.make,
                    model: data?.Model || formik.values.model,
                    fuel_type: fullType || formik.values.fuel_type
                });
                setDisabled(false);
            };

            if(inputString?.length === 17) {
                clearTimeout(debounceTimeRef.current);
                debounceTimeRef.current = setTimeout(() => {
                    setDisabled(true);
                    dispatch(getDataByVin({
                        vinCode: inputString,
                        callback: callBackForFind
                    }))
                }, 300);
            };
        };
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
            <h2 ref={vehicleRef} className="subTitle font20 line24 whiteBg textCenter weight500">
                <span className="primary">Vehicle Details </span>
            </h2>
            <div className="ownerOfficerMain">
                {width > 768 ?
                    <VehicleTable
                        cost={cost}
                        loading={loading}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        vehicles={vehicles}
                        {...(formik.values?.id && { activeEditLineId: formik.values?.id })}
                    /> :
                    <VehicleTableMobile 
                        cost={cost}
                        loading={loading}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        vehicles={vehicles}
                    />
                }
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
                                    onClick={(e) => {
                                        if(e?.target?.value) {
                                            e.target.value = null;
                                        };
                                    }}
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
                                            [name]: ''
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
                                    value={formik.values?.[`extra_field_${el.id}`]}
                                    error={formik.touched?.[`extra_field_${el.id}`] && formik.errors?.[`extra_field_${el.id}`]}
                                    required={el.validation?.length && el.validation?.find(({ conditions }) => conditions === 'required')}
                                    name={`extra_field_${el.id}`}
                                    label={el.label || "[ NO LABEL ]"}
                                    placeholder={el.placeholder || "[ NO PLACEHOLDER ]"}
                                    type={el.type?.name}
                                />
                            )
                        )}
                        <InputField
                            onChange={hendleOnInputChangeVin}
                            onBlur={formik.handleBlur}
                            value={formik.values?.vin}
                            error={vehiclesErrorMessage || formik.touched?.vin && formik.errors?.vin}
                            required={true}
                            id={`vin`}
                            name={`vin`}
                            label="VIN"
                            placeholder="Enter VIN"
                            type="text"
                            params={{maxLength: 17}}
                            disabled={disabled}
                            className={classNames({ disabled })}
                        />
                        <InputField
                            error={formik.touched?.fuel_type && formik.errors?.fuel_type}
                            label="Type of fuel used"
                            required={true}
                            disabled={disabled}
                            className={classNames('inputField', { disabled })}
                            element={<Autocomplete
                                onChange={(e, value) => {
                                    formik.setValues(prev => {
                                        prev.fuel_type = value;
                                        return prev;
                                    })
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values?.fuel_type || null}
                                popupIcon={<PopupIcon/>}
                                name={`fuel_type`}
                                loading={!fuelType}
                                options={fuelType || []}
                                getOptionLabel={type => String(type?.name || type)}
                                isOptionEqualToValue={(option, value) => option.id === value}
                                slotProps={{popper: {sx: {zIndex: 98}}}}
                                renderInput={(params) => <TextField {...params} placeholder="Select Fuel Type"/>}
                            />}
                        />
                        <InputField
                            error={formik.touched?.vehicles_leased && formik.errors?.vehicles_leased}
                            className="inputField m-only-select"
                            label="Leased vehicle?"
                            required={true}
                            element={<Autocomplete
                                onChange={(e, value) => {
                                    formik.setValues(prev => {
                                        prev.vehicles_leased = value;
                                        return prev;
                                    });
                                }}
                                onInputChange={(e) => {
                                    if(e?.target){
                                        e.target.value = formik.values.vehicles_leased || ""
                                    }
                                }}
                                inputValue={formik.values.vehicles_leased || ''}
                                filterOptions={(options) => options}
                                onBlur={formik.handleBlur}
                                value={formik.values?.vehicles_leased || null}
                                popupIcon={<PopupIcon/>}
                                options={['Yes', 'No']}
                                name='vehicles_leased'
                                slotProps={{popper: {sx: {zIndex: 98}}}}
                                renderInput={(params) => <TextField {...params} placeholder="Select"/>}
                            />}
                        />
                        <HtmlDynamicElm isDiv={Boolean(extraFields.length)}>
                            <div className={classNames("inputField dateInput m-year-Input", { disabled })}>
                                <p className="helper mb5 bold500 font16 line24">
                                    Year <sup className="red font16">*</sup>
                                </p>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        disabled={disabled}
                                        className={classNames({ disabled })}
                                        label={'"Year*"'}
                                        views={['year']}
                                        open={datePicker}
                                        onOpen={() => setDatePicker(true)}
                                        onClose={() => setDatePicker(false)}
                                        onChange={(value) => {
                                            const date = new Date(value);
                                            const year = date.getUTCFullYear();
                                            formik.setFieldValue('year', String(year + 1), true);
                                        }}
                                        slotProps={{
                                            textField: {
                                                readOnly: true,
                                                onClick: () => setDatePicker(true)
                                            }
                                        }}
                                        format="YYYY" 
                                        value={formik.values?.year ? dayjs(formik.values.year) : ''}
                                        minDate={dayjs('1990')}
                                        maxDate={dayjs(String(new Date().getUTCFullYear() + 2))}
                                        renderInput={params => (
                                            <TextField
                                                error={formik.touched?.year && formik.errors?.year}
                                                label="Year"
                                                margin="normal"
                                                name='year'
                                                id={`year`}
                                                placeholder="Enter YEAR"
                                                inputProps={{
                                                    readOnly: false,
                                                }}
                                                {...params}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                                <p className="err-message">{formik.touched?.year && formik.errors?.year}</p>
                            </div>
                            <InputField
                                onChange={(e) => {
                                    formik.setValues({  
                                        ...formik.values,
                                        make: e.target.value.toUpperCase()
                                    });
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values?.make}
                                error={formik.touched?.make && formik.errors?.make}
                                required={true}
                                disabled={disabled}
                                className={classNames({ disabled })}
                                id={`make`}
                                name={`make`}
                                label="Make"
                                placeholder="Enter MAKE"
                                type="text"
                            />
                            <InputField
                                onChange={(e) => {
                                    formik.setValues({
                                        ...formik.values,
                                        model: e.target.value.toUpperCase()
                                    });
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values?.model}
                                error={formik.touched?.model && formik.errors?.model}
                                required={true}
                                disabled={disabled}
                                className={classNames({ disabled })}
                                id={`model`}
                                name={`model`}
                                label="Model"
                                placeholder="Enter Model"
                                type="text"
                            />
                            {edit ? (
                                <div className="confirmActions flexBetween gap10">
                                    <NormalBtn
                                        loading={loading}
                                        onClick={formik.handleSubmit}
                                        className="filled bg-lighthouse-black"
                                    >
                                        Update Vehicle
                                    </NormalBtn>
                                    <NormalBtn
                                        loading={loading}
                                        onClick={() => {
                                            setFileName({});
                                            setActive(false);
                                            setEdit(false);
                                            formik.resetForm();
                                        }}
                                        className="filled primary white"
                                    >
                                        Cancel
                                    </NormalBtn>
                                </div> 
                            ) : (
                                <Fragment>
                                    { vehicles?.length ? (
                                        <div className="flex gap5 vehicle ml-auto">
                                            <NormalBtn
                                                onClick={() => {
                                                    setFileName({});
                                                    setActive(false);
                                                    formik.resetForm();
                                                    formik.setValues({
                                                        ...formik.values,
                                                        ...initialValue
                                                    });
                                                }}
                                                className="outlined secondary border-right-none"
                                            >
                                                Cancel
                                            </NormalBtn>
                                            <NormalBtn
                                                loading={loading}
                                                onClick={() => {
                                                    formik.handleSubmit();
                                                }}
                                                className="outlined bg-lighthouse-black w-initial ml-auto mx-140"
                                            >
                                                Save Vehicle
                                            </NormalBtn>
                                        </div>
                                    ) : (
                                        <NormalBtn
                                            loading={loading}
                                            onClick={() => {
                                                formik.handleSubmit();
                                            }}
                                            className="outlined bg-lighthouse-black ml-auto"
                                        >
                                            Save Vehicle
                                        </NormalBtn>
                                    )}
                                </Fragment>
                            )}
                        </HtmlDynamicElm>
                    </div>
                    { Boolean(sectionError && vehicles.length && edit) && <span className={'section-error'}>Please update or cancel your Vehicle Details. </span> }
                    { Boolean(sectionError && vehicles.length && !edit) && <span className={'section-error'}>Please add or cancel your Vehicle Details. </span> }
                    { Boolean(sectionError) && active && vehicles.length === 0 && <span className={'section-error'}>Please add Vehicle Details. </span>}
                </form> : ""}
                {!active ? <NormalBtn
                    onClick={() => {
                        width <= 768 && vehicleRef.current?.scrollIntoView({ behavior: "smooth" });
                        setActive(true);
                        setFileName({});
                        formik.setValues({
                            ...extraInitialValues,
                            ...initialValue
                        })
                    }}
                    className="addAnother outlined secondary bg-lighthouse-black mb20 ml-auto min-m-w-initial"
                >
                    <span>+</span> Add another vehicle
                </NormalBtn> : ""}
                <div className="rowUnderTable" />
            </div>
        </div>
    )
}