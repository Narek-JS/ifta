import { useFormik } from "formik";
import { registerSchema } from "@/utils/schemas";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getBaseStates, selectAppTypes, selectBaseStates } from "@/store/slices/resgister";
import InputField from "@/components/universalUI/InputField";
import PhoneMask from "@/components/universalUI/PhoneMask";
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";


export default function RegisterForm({mobile}) {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(state => state?.auth?.user);
    const isUser = !!user;
    const baseStates = useSelector(selectBaseStates);
    const appTypes = useSelector(selectAppTypes);

    const formik = useFormik({
        initialValues: {
            email: "",
            phone: "",
            application_type: "",
            state: ""
        },
        onSubmit: (values) => {
            localStorage.setItem("registerData", JSON.stringify(values));
            if (isUser) {
                router.push("/form/carrier-info");
            } else {
                localStorage.setItem("toForm", "true");
                router.push("/sign-up");
            }
        },
        validationSchema: registerSchema
    });

    useEffect(() => {
        dispatch(getBaseStates());
    }, [])

    useEffect(() => {
        if (user) {
            formik.setValues({
                ...formik.values,
                ...(user?.email && { email: user?.email }),
                ...(user?.phone && { phone: user?.phone })
            })
        }
    }, [user]);

    return (
        <div className="registerForm">
            <div className="registerTitle">
                <h3 className="lighthouse-black font20 textCenter">Register for IFTA Now</h3>
            </div>
            <form className="flexColumn" onSubmit={formik.handleSubmit}>
                <InputField
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    error={formik.touched.email && formik.errors.email}
                    required={true}
                    id="email"
                    name="email"
                    label="Email Address"
                    placeholder="example@domain.com"
                />
                <InputField
                    className="phoneMask"
                    label="Business Phone"
                    required={true}
                    placeholder="Enter your contact number"
                    error={formik.touched.phone && formik.errors.phone}
                    element={<PhoneMask
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
                    className="inputField m-only-select applyingFor"
                    label="Applying For"
                    select={true}
                    required={true}
                    disabled={true}
                    element={<Autocomplete
                        className="getIfta"
                        onChange={(option, value) => {
                            const isTemporaryPermits = (value?.name || "").toLowerCase().replaceAll(' ', '_') === 'temporary_permits';
                            if(isTemporaryPermits) {
                                if(typeof window !== 'undefined') { 
                                    window.open('https://www.tripsandfuel.com/#tripAndFuelNationWide', '_blank'); 
                                }
                            } else {
                                formik.setValues({
                                    ...formik.values,
                                    application_type: value || ""
                                })
                            }
                        }}
                        onInputChange={(e)=> {
                            if(e?.target){
                                e.target.value = formik.values?.application_type?.name || ""
                            };
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
                        getOptionLabel={type => String(type.name || type)}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        renderInput={(params) => <TextField {...params} placeholder="IFTA Renewal/Additional Decals"/>}
                        slotProps={{popper: {sx: {zIndex: mobile ? 99999: 98}}}}
                    />}
                />
                <InputField
                    error={formik.touched.state && formik.errors.state}
                    className="inputField baseState"
                    label="Base State"
                    select={true}
                    required={true}
                    element={<Autocomplete
                        onChange={(e, value) => {
                            formik.setValues({
                                ...formik.values,
                                state: value || ""
                            })
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.state || null}
                        popupIcon={<PopupIcon/>}
                        id="state"
                        name="state"
                        options={baseStates || []}
                        loading={!baseStates}
                        getOptionLabel={type => {
                            return String(type.state || type);
                        }}
                        // getOptionalSelected={(option, value) => option.id === value}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        slotProps={{popper: {sx: {zIndex: mobile ? 99999: 98}}}}
                        renderInput={(params) => <TextField {...params} placeholder="Select Base State"/>}
                    />}
                />
                <Button onClick={formik.handleSubmit} className="registerBtn normalBtn outlined secondary">
                    Next
                    <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.26316 0.5H0L4.73684 7.5L0 14.5H4.26316L9 7.5L4.26316 0.5Z" fill="#FFBF00"/>
                    </svg>
                    <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.26316 0.5H0L4.73684 7.5L0 14.5H4.26316L9 7.5L4.26316 0.5Z" fill="#FFBF00"/>
                    </svg>
                </Button>
            </form>
        </div>
    )
}