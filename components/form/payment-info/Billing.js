import { clearCityByZipCode, getCityByZipCode, getUsdotValuesByNumber, selectGetCityByZipCode, selectUsdotValues } from "@/store/slices/resgister";
import { useRef, useEffect, useState, useMemo, Fragment } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import InputField from "@/components/universalUI/InputField";
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";
import classNames from "classnames";

// Initial state for checkbox types.
const initialChecboxTypes = {
    newAddress: false,
    mailingAddress: false,
    phisicalAddress: false,
};

// Class to get new values for address fields.
class GetNewValues {
    constructor (address = '', city = '', state = '', zip_code = '', states) {
        this.address = address;
        this.city = city;
        this.state = state ? states.find(item => item.app === state) : '';
        this.zip_code = zip_code;
    };
};

export default function Billing ({ isAdmin, formik, states, usdotNumber, formRef }) {
    const citiesByZipCode = useSelector(selectGetCityByZipCode);
    const usdotValues = useSelector(selectUsdotValues);
    const dispatch = useDispatch();

    const [ physicalBgValues, setPhysicalBgValues ] = useState(null);
    
    const debounceTimeRef = useRef();

    const [ checboxTypes, setCheckboxType ] = useState({
        ...initialChecboxTypes,
        newAddress: true
    });

    // Effect to fetch USDOT values if not already fetched.
    useEffect(() => {
        if(Object.keys(usdotValues).length === 0 && usdotNumber) {
            dispatch(getUsdotValuesByNumber({ usdotNumber }));
        };
    }, [usdotNumber]);

    // Effect to set form values based on USDOT values when physical address is selected.
    useEffect(() => {
        if(Object.keys(usdotValues).length !== 0 && checboxTypes.phisicalAddress) {
            // Set physical background values.
            setPhysicalBgValues({
                address: formik.values.address,
                city: formik.values.city,
                state: formik.values.state,
                zip_code: formik.values.zip_code,
            });

            // Set form values based on USDOT values.
            formik.setValues({
                ...formik.values,
                ...new GetNewValues(
                    usdotValues?.content?.carrier?.phyStreet,
                    usdotValues?.content?.carrier?.phyCity,
                    usdotValues?.content?.carrier?.phyState,
                    usdotValues?.content?.carrier?.phyZipcode,
                    states
                )
            });
        };
    }, [usdotValues]);

    // Handler to select different address type.
    const selectOtherGroup = (event) => {
        const { target: { name } } = event;

        setCheckboxType({
            ...initialChecboxTypes,
            [name]: true
        });

        if(name === 'phisicalAddress') {
            // Set physical background values.
            setPhysicalBgValues({
                address: formik.values.address,
                city: formik.values.city,
                state: formik.values.state,
                zip_code: formik.values.zip_code,
            });

            // Set form values based on USDOT values.
            formik.setValues({
                ...formik.values,
                ...new GetNewValues(
                    usdotValues?.content?.carrier?.phyStreet,
                    usdotValues?.content?.carrier?.phyCity,
                    usdotValues?.content?.carrier?.phyState,
                    usdotValues?.content?.carrier?.phyZipcode,
                    states
                )
            });
        };

        // Restore form values to physical background values if available, otherwise, reset.
        if(name === 'newAddress') {
            formik.setValues({
                ...formik.values,
                ...(physicalBgValues === null ? new GetNewValues() : new GetNewValues(
                    physicalBgValues.address,
                    physicalBgValues.city,
                    physicalBgValues.state,
                    physicalBgValues.zip_code,
                    states
                ))
            });
        };
    };

    // Handler for input change of ZIP code and City fields with debouncing
    const hendleOnInputChangeZipAndCity = (event, name) => {
        if(event) { 
            const inputString = event.target.value;
            const regexs = { zip_code: /^(?:\d{1,5})?$/, city: /\d/ };
            const isValid = name === 'city' ? !regexs[name].test(inputString) : regexs[name].test(inputString);

            if(isValid && inputString) {
                // Set form values based on input
                formik.setValues(prev => {
                    prev[name] = event.target.value;
                    return prev;
                });

                // Debounce fetching city by ZIP code.
                clearTimeout(debounceTimeRef.current);
                debounceTimeRef.current = setTimeout(() => {
                    dispatch(inputString ? getCityByZipCode(inputString) : clearCityByZipCode());
                }, 500);
            };
        };
    };

    // Handler for changing ZIP code and City fields.
    const hendleOnChangeZipAndCity = (value, name) => {
        formik.setValues(prev => {
            if(value) {
                const [city, stateCode, zipCode] = value && value.split(',');
                const state = states?.find(oneState => oneState.app === stateCode);
                return {
                    ...prev,
                    zip_code: zipCode,
                    city: city,
                    state: state,
                };
            } else {
                return {...prev, [name]: '' }
            };
        });
    };

    // Memoized state options sorted by country.
    const stateOptions = useMemo(() => {
        const usaStates = [];
        const canadaStates = [];

        (states || []).forEach(state => {
            if(state.country === 'usa') {
                usaStates.push(state);
            } else {
                canadaStates.push(state);
            };
        });

        return [...usaStates.sort((a, b) => a - b), ...canadaStates.sort((a, b) => a - b)];

    }, [states]);

    return (
        <Fragment>
            <h2 className="subTitle font20 line24 whiteBg textCenter weight500 mb10" ref={formRef}>
                <span className="primary">Billing Address</span>
            </h2>
            <form className="flexColumn alignCenter gap20 mb20 mt20">
                <div className={classNames("flex gap20-to5 alignCenter radioGroup", {
                    none: usdotNumber === undefined
                })}>
                    <label className="flexCenter alignCenter gap5">
                        <input
                            type="radio"
                            name="newAddress"
                            checked={checboxTypes.newAddress}
                            onChange={selectOtherGroup}
                        />
                        <span className="primary">New Address</span>
                    </label>

                    <label className="flexCenter alignCenter gap5">
                        <input
                            type="radio"
                            name="phisicalAddress"
                            checked={checboxTypes.phisicalAddress}
                            onChange={selectOtherGroup}
                        />
                        <span className="primary">Same as Physical Address</span>
                    </label>
                </div>
                <div className={classNames("flexBetween formSection gap20 alignCenter mb20 w100", {
                    disabled: isAdmin
                })}>
                    <InputField
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.zip_code}
                        error={formik.touched?.zip_code && formik.errors?.zip_code}
                        type="tel"
                        required={true}
                        name='zip_code'
                        label="ZIP Code"
                        placeholder="Enter Zip Code"
                        params={{maxLength: 5}}
                        disabled={checboxTypes.phisicalAddress && formik.values?.zip_code}
                        className={classNames({
                            'disabled': checboxTypes.phisicalAddress && formik.values?.zip_code
                        })}
                        element={<Autocomplete
                            onInputChange={(e) => hendleOnInputChangeZipAndCity(e, 'zip_code')}
                            onChange={(e, value) => hendleOnChangeZipAndCity(value, 'zip_code')}
                            onBlur={formik.handleBlur}
                            value={formik.values?.zip_code || null}
                            forcePopupIcon={false}
                            id='zip_code'
                            name='zip_code'
                            loading={!citiesByZipCode}
                            options={formik.values?.zip_code ? (citiesByZipCode || []) : []}
                            getOptionLabel={type => type}
                            slotProps={{ popper: { sx: { zIndex: 98 } } }}
                            renderInput={(params) => {
                                return <TextField
                                    value={formik.values?.state}
                                    {...params}
                                    inputProps={{ ...params.inputProps, autoComplete: 'new-password' }}
                                    placeholder="Enter Zip Code"
                                />
                            }}
                        />}
                    />

                    <InputField
                        error={formik.touched?.state && formik.errors?.state}
                        className={classNames('inputField',{
                            'disabled': checboxTypes.phisicalAddress && formik.values?.state
                        })}
                        label="State"
                        required={true}
                        disabled={checboxTypes.phisicalAddress && formik.values?.state}
                        element={<Autocomplete
                            onChange={(e, value) => {
                                formik.setValues(prev => {
                                    prev.state = value;
                                    return prev;
                                })
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values?.state || null}
                            popupIcon={<PopupIcon/>}
                            id='state'
                            name='state'
                            loading={!states}
                            options={stateOptions || []}
                            getOptionLabel={type => {
                                return String(type.state || type);
                            }}
                            isOptionEqualToValue={(option, value) => option.id === value}
                            slotProps={{popper: {sx: {zIndex: 98}}}}
                            renderInput={(params) => <TextField
                                {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password',
                                }}
                                placeholder="State"
                            />}
                        />}
                    />

                    <InputField
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.city}
                        error={formik.touched?.city && formik.errors?.city}
                        required={true}
                        id='city'
                        name='city'
                        label="City"
                        placeholder="City"
                        disabled={checboxTypes.phisicalAddress && formik.values?.city}
                        className={classNames({
                            'disabled': checboxTypes.phisicalAddress && formik.values?.city
                        })}
                        element={<Autocomplete
                            onInputChange={(e) => hendleOnInputChangeZipAndCity(e, 'city')}
                            onChange={(e, value) => hendleOnChangeZipAndCity(value, 'city')}
                            onBlur={formik.handleBlur}
                            value={formik.values?.city || null}
                            forcePopupIcon={false}
                            id='city'
                            name='city'
                            loading={!citiesByZipCode}
                            options={formik.values?.city ? (citiesByZipCode || []) : []}
                            getOptionLabel={type => type}
                            slotProps={{popper: {sx: {zIndex: 98}}}}
                            renderInput={(params) => <TextField
                                {...params}
                                inputProps={{ ...params.inputProps, autoComplete: 'new-password' }}
                                value={formik.values?.state}
                                placeholder="Enter City"
                            />}
                        />}
                    />

                    <InputField
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.address}
                        error={formik.touched?.address && formik.errors?.address}
                        required={true}
                        id='address'
                        name='address'
                        label="Address"
                        placeholder="Enter Address"
                        disabled={checboxTypes.phisicalAddress && formik.values?.address}
                        className={classNames({
                            'disabled': checboxTypes.phisicalAddress && formik.values?.address
                        })}
                    />
                </div>
            </form>
        </Fragment>
    );
};