import InputField from "@/components/universalUI/InputField";
import PhoneMask from "@/components/universalUI/PhoneMask";
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";
import { Autocomplete, TextField } from "@mui/material";

export default function Register({
    formik,
    appTypes,
    baseStates,
    setVerified,
    setIsUnVerifyedState,
    loading,
    irpFormik
}) {

    return (
        <div className="formRegister">
            <h2 className="subTitle font20 line24 whiteBg textCenter weight500">
                <span className="primary">Additional Carrier Information</span>
            </h2>
            <form className={`flexBetween formSection gap20 alignCenter ${loading ? 'sectionLoading' : ''}`}>
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
                    select={true}
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
                <InputField
                    error={formik.touched.state && formik.errors.state}
                    label="Base State"
                    select={true}
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