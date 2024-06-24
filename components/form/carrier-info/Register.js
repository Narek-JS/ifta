import { getQuarter, selectTaxReturnPeriodStatus } from "@/store/slices/resgister";
import { VerificationContext } from "@/contexts/VerificationCarrierInfoContext";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { QUARTERLY_FILLING_ID } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useMemo } from "react";
import { styled } from '@mui/system';

import InputField from "@/components/universalUI/InputField";
import PhoneMask from "@/components/universalUI/PhoneMask";
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";
import classNames from "classnames";

// Styled component for group header in Autocomplete.
const GroupHeader = styled('div')(() => ({
    position: 'sticky',
    top: '-8px',
    padding: ' 4px 10px',
    color: 'black',
    backgroundColor: '#F5F5F5',
    fontWeight: '700'
}));

export default function Register({
    formik,
    appTypes,
    baseStates,
    irpFormik,
    setIsQuarterlyApplicationType,
    isQuarterlyApplicationType,
    taxReturnPeriod
}) {
    const taxReturnPeriodStatus = useSelector(selectTaxReturnPeriodStatus);
    const dispatch = useDispatch();

    const { loader, setVerified, setIsUnVerifyedState } = useContext(VerificationContext);

    // Memoized quarterly period input.
    const quarterlyPariodInput = useMemo(() => {
        // Check if it's a quarterly application and tax return period data exists.
        if(!isQuarterlyApplicationType || !Array.isArray(taxReturnPeriod?.lastTwoYearsQuarters)) {
            return null;
        };

        // Functions for rendering groups, options, and input.
        const renderGroup = (params) => (
            <li key={params.key}>
                <GroupHeader>{params.group}</GroupHeader>
                <ul>{params.children}</ul>
            </li>
        );

        // Function to render each option in Autocomplete.
        const renderOption = (props, option) => (
            <li {...props}>
                <Checkbox
                    style={{ width: '10px', height: '10px', marginLeft: '-10px', marginRight: '5px' }}
                    checked={Boolean(formik.values?.quarterly_pariod?.find(pariod => pariod.id === option.id))}
                />
                {option.name}
            </li>
        );

        // Function to render the input field in Autocomplete.
        const renderInput = (params) => {
            // Get short string value for display.
            let shortStrValue = '';
            if(Array.isArray(formik.values?.quarterly_pariod)) {
                shortStrValue = formik.values?.quarterly_pariod?.map(pariod => pariod?.name?.split(' ')[0]).join(', ');
            };

            // Return the input field with the short string value.
            return (
                <TextField
                    {...params}
                    inputProps={{ ...params?.inputProps, value: shortStrValue}}
                    placeholder="Return Period"
                />
            );
        };

        // Handler for change in selection in the Autocomplete component.
        const onChange = (event_, value_, reason_, details) => {
            // Reset verification status.
            setVerified(false);

            // Copy the current values of quarterly period selection.
            let newValues = [...(formik.values?.quarterly_pariod || [])];
            const isSelected = formik.values?.quarterly_pariod?.find(pariod => pariod.id === details?.option?.id);

            // Add or remove the selected option to the values array.
            if(Array.isArray(newValues)) {
                if(isSelected === undefined) {
                    newValues.push(details.option);
                } else {
                    newValues = newValues?.filter(pariod => pariod?.id !== details?.option?.id) || [];
                };

                // Set the formik values with the updated quarterly period selection.
                formik.setValues({
                    ...formik.values,
                    quarterly_pariod: newValues
                });
            };
        };

        return (
            <InputField
                error={formik?.touched?.quarterly_pariod && formik?.errors?.quarterly_pariod}
                label="Tax Return Period"
                required={true}
                className="inputField taxPariod"
                element={<Autocomplete
                    multiple
                    size="small"
                    options={taxReturnPeriod?.lastTwoYearsQuarters}
                    disableCloseOnSelect
                    clearIcon={null}
                    popupIcon={<PopupIcon />}
                    id="quarterly_pariod"
                    name="quarterly_pariod"
                    onBlur={formik.handleBlur}
                    groupBy={(option) => option.year}
                    renderGroup={renderGroup}
                    getOptionLabel={(option) => option.name}
                    renderOption={renderOption}
                    renderInput={renderInput}
                    onChange={onChange}
                    slotProps={{ popper: { sx: { zIndex: 98 } } }}
                />}
            />
        );
    }, [formik.values.quarterly_pariod,
        formik?.touched?.quarterly_pariod,
        formik?.errors?.quarterly_pariod,
        formik?.values,
        isQuarterlyApplicationType,
        taxReturnPeriod
    ]);

    // Handler for application type change
    const handleAppTypeChange = (e, applyingFor) => {
        setVerified(false);
        setIsUnVerifyedState(true);

        // Set IRP account value.
        irpFormik.setValues(prev => {
            prev.irpAccount = '1';
            return prev;
        });

        // Set application type value.
        formik.setValues(prev => {
            prev.application_type = applyingFor;
            return prev;
        });

        // Check if the application type is quarterly filing and if, set flag for quarterly application type.
        if(applyingFor?.id === QUARTERLY_FILLING_ID) {
            setIsQuarterlyApplicationType(true);

            // Fetch quarterly data if not fetched already.
            if(taxReturnPeriod === null && taxReturnPeriodStatus === '') {
                dispatch(getQuarter());
            };
        } else {
            // Clear flag for quarterly application type.
            setIsQuarterlyApplicationType(false);
        };
    };

    // Handler for application type input change.
    const handleAppTypeInputChange = (e) => {
        if(e?.target){
            e.target.value = formik.values.application_type?.name || ""
        };
    };

    // Handler for state change
    const hadnleStateChange = (e, state) => {
        setVerified(false);
        setIsUnVerifyedState(true);
        
        // Set new state values.
        formik.setValues({
            ...formik.values,
            state: state || ""
        });
    };

    return (
        <div className={classNames("formRegister", { 'pointer-eventsNone': loader })}>
            <h2 className="subTitle font20 line24 whiteBg textCenter weight500">
                <span className="primary">Additional Carrier Information</span>
            </h2>
            <form className={classNames('formPaddingLeft-8 flexBetween formSection gap15 alignCenter', { sectionLoading: loader })}>
                <InputField
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    error={formik.touched.email && formik.errors.email}
                    required={true}
                    id="email"
                    name="email"
                    label="Email Address"
                    placeholder="Enter your contact email"
                />
                <InputField
                    className='phoneMask'
                    label="Business Phone"
                    required={true}
                    placeholder="( 999 ) 999 - 999"
                    error={formik.touched.phone && formik.errors.phone}
                    element={<PhoneMask
                        type="tel"
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        id="phone"
                        name="phone"
                        placeholder="Enter your contact number"
                    />}
                />
                <InputField
                    error={formik.touched.application_type && formik.errors.application_type}
                    className='m-only-select'
                    label="Application Type"
                    required={true}
                    disabled={true}
                    element={<Autocomplete
                        onChange={handleAppTypeChange}
                        onInputChange={handleAppTypeInputChange}
                        inputValue={formik.values.application_type?.name || ''}
                        filterOptions={(options) => options}
                        loading={!appTypes}
                        onBlur={formik.handleBlur}
                        value={formik.values.application_type || null}
                        popupIcon={<PopupIcon/>}
                        id="application_type"
                        name="application_type"
                        options={appTypes || []}
                        getOptionLabel={type => String(type?.name || type)}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        renderInput={(params) => <TextField {...params} placeholder="Select type"/>}
                        slotProps={{ popper: { sx: { zIndex: 98 } } }}
                    />}
                />

                {quarterlyPariodInput}

                <InputField
                    error={formik.touched.state && formik.errors.state}
                    label="Base State"
                    required={true}
                    element={<Autocomplete
                        onChange={hadnleStateChange}
                        loading={!baseStates}
                        onBlur={formik.handleBlur}
                        value={formik.values.state || null}
                        popupIcon={<PopupIcon/>}
                        options={baseStates || []}
                        getOptionLabel={type => String(type.state || type)}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        id="state"
                        name="state"
                        renderInput={(params) => <TextField {...params} placeholder="Select Base State"/>}
                        slotProps={{ popper: { sx: { zIndex: 98 } } }}
                    />}
                />
            </form>
        </div>
    );
};