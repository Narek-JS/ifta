import { getBaseStates, selectAppTypes, selectBaseStates } from "@/store/slices/resgister";
import { QUARTERLY_FILLING_ID, TEMPORARY_PERMIT_ID } from "@/utils/constants";
import { BoldArrowIcon } from "@/public/assets/svgIcons/BoldArrowIcon";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { registerSchema } from "@/utils/schemas";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import InputField from "@/components/universalUI/InputField";
import PhoneMask from "@/components/universalUI/PhoneMask";
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";
import classNames from "classnames";

export default function RegisterForm() {
    const router = useRouter();

    const dispatch = useDispatch();
    const appTypes = useSelector(selectAppTypes);
    const baseStates = useSelector(selectBaseStates);
    const user = useSelector(state => state?.auth?.user);

    const formik = useFormik({
        initialValues: {
            email: "",
            phone: "",
            application_type: "",
            state: ""
        },
        onSubmit: (values) => {
            localStorage.setItem("registerData", JSON.stringify(values));
            if(user) {
                return router.push("/form/carrier-info");
            };

            localStorage.setItem("toForm", "true");
            router.push("/sign-up");
        },
        validationSchema: registerSchema
    });

    useEffect(() => {
        if(!baseStates || !appTypes) { 
            dispatch(getBaseStates());
        };
    }, []);

    useEffect(() => {
        if (user?.email || user?.phone) {
            formik.setValues({
                ...formik.values,
                ...(user?.email && { email: user?.email }),
                ...(user?.phone && { phone: user?.phone })
            });
        };
    }, [user]);

    const applicationTypeOptions = useMemo(() => {
        if(!Array.isArray(appTypes)) {
            return [];
        };

        return appTypes.filter(appType => appType.id !== QUARTERLY_FILLING_ID);
    }, [appTypes]);

    const handleApplicationTypeChange = (value) => {
        if(value?.id === TEMPORARY_PERMIT_ID) {
            return window.open('https://www.tripsandfuel.com/#tripAndFuelNationWide', '_blank'); 
        };
        formik.setValues({ ...formik.values, application_type: value || "" });
    };

    const handleStateChange = (value) => {
        formik.setValues({ ...formik.values, state: value || ""});
    };

    return (
        <div className={classNames("registerForm ifta", {
            'registerForm-ifta-withUser': user
        })}>
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
                    required={true}
                    element={<Autocomplete
                        className="getIfta"
                        onChange={(option_, value) => handleApplicationTypeChange(value)}
                        inputValue={formik.values.application_type?.name || ''}
                        filterOptions={(options) => options}
                        loading={!appTypes}
                        onBlur={formik.handleBlur}
                        value={formik.values.application_type || null}
                        popupIcon={<PopupIcon />}
                        id="application_type"
                        name="application_type"
                        options={applicationTypeOptions}
                        getOptionLabel={type => String(type.name || type)}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        renderInput={(params) => <TextField {...params} placeholder="IFTA Renewal/Additional Decals"/>}
                        slotProps={{ popper: { sx: { zIndex: 98 }} }}
                    />}
                />
                <InputField
                    error={formik.touched.state && formik.errors.state}
                    className="inputField baseState"
                    label="Base State"
                    required={true}
                    element={<Autocomplete
                        onChange={(e, value) => handleStateChange(value)}
                        onBlur={formik.handleBlur}
                        value={formik.values.state || null}
                        popupIcon={<PopupIcon/>}
                        id="state"
                        name="state"
                        options={baseStates || []}
                        loading={!baseStates}
                        getOptionLabel={type => String(type.state || type)}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        slotProps={{ popper: { sx: { zIndex: 98 }}}}
                        renderInput={(params) => <TextField {...params} placeholder="Select Base State"/>}
                    />}
                />
                <Button onClick={formik.handleSubmit} className="registerBtn normalBtn bg-lighthouse-blackHome">
                    Next <BoldArrowIcon /> <BoldArrowIcon />
                </Button>
            </form>
        </div>
    );
};