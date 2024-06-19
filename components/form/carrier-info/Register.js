import InputField from "@/components/universalUI/InputField";
import PhoneMask from "@/components/universalUI/PhoneMask";
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";
import { getQuarter, selectTaxReturnPeriodStatus } from "@/store/slices/resgister";
import { QUARTERLY_FILLING_ID } from "@/utils/constants";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { styled } from '@mui/system';
import { useContext, useMemo } from "react";
import classNames from "classnames";
import { VerificationContext } from "@/contexts/VerificationCarrierInfoContext";

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

    const quarterlyPariodInput = useMemo(() => {
        return isQuarterlyApplicationType && Array.isArray(taxReturnPeriod?.lastTwoYearsQuarters) && (
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
                    renderGroup={(params) => (
                        <li key={params.key}>
                            <GroupHeader>{params.group}</GroupHeader>
                            <ul>{params.children}</ul>
                        </li>
                    )}

                    getOptionLabel={(option) => {
                        return option.name;
                    }}

                    renderOption={(props, option, state) => {
                        const defaultSelected = formik.values?.quarterly_pariod?.find(pariod => pariod.id === option.id);
                        return (
                            <li {...props}>
                                <Checkbox
                                    style={{ width: '10px', height: '10px', marginLeft: '-10px', marginRight: '5px' }}
                                    checked={Boolean(defaultSelected)}
                                />
                                {option.name}
                            </li>
                        );
                    }}

                    renderInput={(params) => {
                        let shortStrValue = '';
                        if(Array.isArray(formik.values?.quarterly_pariod)) {
                            shortStrValue = formik.values?.quarterly_pariod?.map(pariod => pariod?.name?.split(' ')[0]).join(', ');
                        };

                        return (
                            <TextField {...params} inputProps={{ ...params?.inputProps, value: shortStrValue}} placeholder="Return Period" />
                        );
                    }}

                    onChange={(event_, value, reason, details) => {
                        setVerified(false);
                        let newValues = [...(formik.values?.quarterly_pariod || [])];
                        const isSelected = formik.values?.quarterly_pariod?.find(pariod => pariod.id === details?.option?.id);
                        if(Array.isArray(newValues)) {
                            if(isSelected === undefined) {
                                newValues.push(details.option);
                            } else {
                                newValues = newValues?.filter(pariod => pariod?.id !== details?.option?.id) || [];
                            };
                            formik.setValues({
                                ...formik.values,
                                quarterly_pariod: newValues
                            });
                        }
                    }}
                    slotProps={{popper: {sx: {zIndex: 98}}}}
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
                        onChange={(e, applyingFor) => {
                            setVerified(false);
                            setIsUnVerifyedState(true);
                            irpFormik.setValues(prev => {
                                prev.irpAccount = '1';
                                return prev;
                            });

                            formik.setValues(prev => {
                                prev.application_type = applyingFor;
                                return prev;
                            });

                            if(applyingFor?.id === QUARTERLY_FILLING_ID) {
                                setIsQuarterlyApplicationType(true);
                                if(taxReturnPeriod === null && taxReturnPeriodStatus === '') {
                                    dispatch(getQuarter());
                                };
                            } else {
                                setIsQuarterlyApplicationType(false);
                            };

                        }}
                        onInputChange={(e)=> {
                            if(e?.target){
                                e.target.value = formik.values.application_type?.name || ""
                            }
                        }}
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
                        slotProps={{popper: {sx: {zIndex: 98}}}}
                    />}
                />

                {quarterlyPariodInput}

                <InputField
                    error={formik.touched.state && formik.errors.state}
                    label="Base State"
                    required={true}
                    element={<Autocomplete
                        onChange={(e, state) => {
                            setVerified(false);
                            setIsUnVerifyedState(true);
                            formik.setValues({
                                ...formik.values,
                                state: state || ""
                            })
                        }}
                        loading={!baseStates}
                        onBlur={formik.handleBlur}
                        value={formik.values.state || null}
                        popupIcon={<PopupIcon/>}
                        options={baseStates || []}
                        getOptionLabel={type => {
                            return String(type.state || type);
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        id="state"
                        name="state"
                        renderInput={(params) => <TextField {...params} placeholder="Select Base State"/>}
                        slotProps={{popper: {sx: {zIndex: 98}}}}
                    />}
                />
            </form>
        </div>
    );
};