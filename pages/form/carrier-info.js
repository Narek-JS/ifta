import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    getBaseStates,
    getExtraData, getOtherExtraFields, getPermitDetails,
    selectAppTypes,
    selectBaseStates,
    selectExtraData, selectPermitDetails, selectStoreData, setRegisterLoading,
    update,
    verify,
    getUsdotValuesByNumber,
    selectUsdotValuesStatus,
    selectUsdotValues
} from "@/store/slices/resgister";
import { useFormik } from "formik";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import { selectUserData } from "@/store/slices/auth";
import StepController from "@/components/form/StepController";
import Fade from "react-reveal/Fade";
import Register from "@/components/form/carrier-info/Register";
import CheckIRP from "@/components/form/carrier-info/CheckIRP";
import AddUSDOT from "@/components/form/carrier-info/AddUSDOT";
import OwnerOfficer from "@/components/form/carrier-info/OwnerOfficer";
import schemas from "@/utils/schemas";
import Vehicles from "@/components/form/carrier-info/Vehicles";
import Others from "@/components/form/carrier-info/Others";
import NormalBtn from "@/components/universalUI/NormalBtn";
import NextSvgIcon from "@/public/assets/svgIcons/NextSvgIcon";
import * as yup from "yup";

export default function CarrierInfo() {
    const router = useRouter();
    const dispatch = useDispatch();
    const appTypes = useSelector(selectAppTypes);
    const baseStates = useSelector(selectBaseStates);
    const extraData = useSelector(selectExtraData);
    const storeData = useSelector(selectStoreData);
    const permitDetails = useSelector(selectPermitDetails);
    const statusUsdotValues = useSelector(selectUsdotValuesStatus);
    const usdotValuesFromStore = useSelector(selectUsdotValues);

    const user = useSelector(selectUserData);
    
    const {width} = useWindowSize();
    const [loader, setLoader] = useState(false);
    const [verified, setVerified] = useState(false);
    const [isVerifyUsdot, setIsVerifyUsdot] = useState(false);
    const [isVerifyEin, setIsVerifyEin] = useState(false);
    const [validUsdotNumber, setValidUsdotNumber] = useState(null);
    const [ownerOfficerActive, setOwnerOfficerActive] = useState(false);
    const [vehiclesActive, setVehiclesActive] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [ownerOfficerSectionError, setOwnerOfficerSectionError ] = useState(false);
    const [vehiclesSectionError, setVehiclesSectionError ] = useState(false);
    const [isUnVerifyedState, setIsUnVerifyedState] = useState(false);
    const validUsdotNumberRef = useRef(null);

    const others = storeData?.fields?.extra_fields?.filter(el => el.group?.name === "Other");
    const permit_id = permitDetails?.form_id;

    useEffect(() => {
        dispatch(setRegisterLoading(true))
        dispatch(getBaseStates());
        dispatch(getPermitDetails())
            .then(async (res) => {
                const registerData = JSON.parse(localStorage.getItem("registerData"));
                if (res?.payload?.action) {
                    dispatch(getOtherExtraFields(res.payload.data.form_id));
                    const {
                        email,
                        phone,
                        application_type,
                        state,
                        ifta_account_number,
                        irp_account_number,
                        USDOT,
                        EIN,
                        application_type_id
                    } = res.payload.data;

                    if (registerData) {
                        dispatch(setRegisterLoading(false));
                        regFormik.setValues(registerData);
                    } else {
                        regFormik.setValues({email, phone, application_type, state});
                    };

                    irpFormik.setValues({
                        irpAccount: irp_account_number === '0' ? '0': "1",
                        iftaAccountNumber: ifta_account_number || "",
                    });

                    usdotFormik.setValues({
                        isUSDOT: "yes",
                        usdotNumber: USDOT,
                        ein: EIN
                    });

                    if (!registerData) {
                        if(!usdotValuesFromStore || !Object.values(usdotValuesFromStore)?.length) {
                            await dispatch(getUsdotValuesByNumber({
                                usdotNumber: USDOT,
                                callback: (usdotValues) => {
                                    const legal_name = usdotValues?.content?.carrier?.legalName;
                                    const business_address = usdotValues?.content?.carrier?.phyStreet;

                                    dispatch(update({
                                        email,
                                        phone,
                                        application_type: application_type_id,
                                        state: state.id,
                                        USDOT,
                                        EIN,
                                        ifta_account_number,
                                        irp_account_number,
                                        permit_id: res.payload.data.form_id,
                                        ...(legal_name && { legal_name }),
                                        ...(business_address && { business_address }),
                                    })).then(res => {
                                        dispatch(setRegisterLoading(false));
                                        if (res?.payload?.action) {
                                            dispatch(getUsdotValuesByNumber({ usdotNumber: USDOT }));
                                            dispatch(getOtherExtraFields(res.payload.data.form_id));
                                            dispatch(getExtraData(1));
                                            verified !== true && setVerified(true);
                                            isUnVerifyedState !== false  && setIsUnVerifyedState(false);
                                        };
                                    });     
                                }
                            }))
                        } else {
                            dispatch(update({
                                email,
                                phone,
                                application_type: application_type_id,
                                state: state.id,
                                USDOT,
                                EIN,
                                ifta_account_number,
                                irp_account_number,
                                permit_id: res.payload.data.form_id,
                                ...(usdotValuesFromStore?.content?.carrier?.legalName && { legal_name: usdotValuesFromStore?.content?.carrier?.legalName }),
                                ...(usdotValuesFromStore?.content?.carrier?.phyStreet && { business_address: usdotValuesFromStore?.content?.carrier?.phyStreet }),
                            })).then(res => {
                                dispatch(setRegisterLoading(false));
                                if (res?.payload?.action) {
                                    dispatch(getUsdotValuesByNumber({ usdotNumber: USDOT }));
                                    dispatch(getOtherExtraFields(res.payload.data.form_id));
                                    dispatch(getExtraData(1));
                                    verified !== true && setVerified(true);
                                    isUnVerifyedState !== false  && setIsUnVerifyedState(false);
                                };
                            });
                        };
                        
                    };

                    localStorage.removeItem("registerData");
                } else {
                    dispatch(setRegisterLoading(false))
                    if (registerData) {
                        regFormik.setValues(registerData);
                    };
                };
            });
    }, []);

    const regFormik = useFormik({
        initialValues: {
            email: user?.email || '',
            phone: user?.phone || '',
            application_type: "",
            state: "",
        },
        onSubmit: (values, {resetForm}) => {
        },
        validationSchema: yup.object({
            email: schemas.email,
            phone: schemas.phone,
            application_type: schemas.select,
            state: schemas.select
        })
    });

    const newApp = regFormik.values.application_type?.id !== 2;

    useEffect(() => {
        if(Boolean(user?.email) || Boolean(user?.phone)) {
            regFormik.setValues({
                ...regFormik.values,
                email: regFormik.values.email || (user?.email || ''),
                phone: regFormik.values.phone || (user?.phone || '')
            });
        };
    }, [user]);

    const irpFormik = useFormik({
        initialValues: {
            irpAccount: "1",
            ...(Boolean((!newApp || regFormik.values.application_type?.id === 4)) && regFormik.values.application_type?.id !== 1 && regFormik?.values?.state?.require_ifta === '1' && { iftaAccountNumber: "" })
        },
        validationSchema: yup.object({
            ...(Boolean((!newApp || regFormik.values.application_type?.id === 4)) && regFormik.values.application_type?.id !== 1 && regFormik?.values?.state?.require_ifta === '1' && { iftaAccountNumber: schemas.iftaAccountNumber }),
            ...(Boolean(Boolean(!newApp || regFormik.values.application_type?.id === 4) && regFormik.values.application_type?.id !== 1) === false && {
                irpAccount: schemas.required
            })
        })
    });

    const usdotFormik = useFormik({
        initialValues: {
            isUSDOT: "yes",
            usdotNumber: "",
            ein: ""
        },
        validationSchema: yup.object({
            isUSDOT: schemas.required,
            usdotNumber: schemas.text,
            ein: schemas.ein
        })
    });

    useEffect(() => {
        if((Boolean((!newApp || regFormik.values.application_type?.id === 4)) && regFormik.values.application_type?.id !== 1 && regFormik?.values?.state?.require_ifta) === false){
            irpFormik.setValues({
                ...irpFormik.values,
                iftaAccountNumber: ''
            });
        } else if (regFormik.values.state.require_ifta === '0') {
            irpFormik.setValues({
                ...irpFormik.values,
                iftaAccountNumber: ''
            });
        };
    }, [newApp, regFormik.values]);

    useEffect(() => {
        if(usdotFormik.values.usdotNumber === storeData?.usdot) {
            isVerifyUsdot && setIsVerifyUsdot(false);
        };
        if(usdotFormik.values.ein === storeData?.ein) {
            isVerifyEin && setIsVerifyEin(false);
        }
    }, [usdotFormik.values]);

    const handleVerify = async () => {
        setLoader(true);
        let findedEin = '';
        let usdotValuesFromStore = null;
        await dispatch(getUsdotValuesByNumber({
            usdotNumber: usdotFormik.values.usdotNumber,
            callback: (usdotValues) => {
                findedEin = usdotValues?.content?.carrier?.ein;
                usdotValuesFromStore = usdotValues;
                if(findedEin) {
                    usdotFormik.setValues({
                        ...usdotFormik.values,
                        ein: findedEin
                    });
                    const { ein, ...errors } = usdotFormik.errors;
                    usdotFormik.setErrors({
                        ...errors
                    });
                } else if(Boolean(findedEin) === false && Boolean(usdotFormik.values.ein)) {
                    usdotFormik.setValues({
                        ...usdotFormik.values,
                        ein: ''
                    });
                };
                validUsdotNumberRef.current = usdotValues?.content?.carrier ? usdotFormik.values.usdotNumber : null; 
                setValidUsdotNumber(usdotValues?.content?.carrier ? usdotFormik.values.usdotNumber : null);
            }
        }));

        const regValidation   = await regFormik.validateForm();
        const irpValidation   = await irpFormik.validateForm();
        const usdotValidation = await usdotFormik.validateForm();

        regFormik.handleSubmit();
        irpFormik.handleSubmit();
        usdotFormik.handleSubmit();
        delete usdotValidation.ein;

        if (!(Object.keys(regValidation)?.length) && !(Object.keys(irpValidation)?.length) && !(Object.keys(usdotValidation)?.length)) {
            let method = permitDetails?.form_id ? update : verify;
            
            const res = validUsdotNumberRef.current ? await dispatch(method({
                email: regFormik.values.email,
                phone: regFormik.values.phone.replaceAll(" ", ""),
                application_type: regFormik.values.application_type?.id,
                USDOT: validUsdotNumberRef.current ? usdotFormik.values.usdotNumber : (storeData?.usdot || ''),
                state: regFormik.values?.state.id,
                EIN: findedEin || usdotFormik.values.ein,
                ifta_account_number: irpFormik.values.iftaAccountNumber,
                irp_account_number: irpFormik.values.irpAccount,
                ...(usdotValuesFromStore?.content?.carrier?.legalName && { legal_name: usdotValuesFromStore?.content?.carrier?.legalName }),
                ...(usdotValuesFromStore?.content?.carrier?.phyStreet && { business_address: usdotValuesFromStore?.content?.carrier?.phyStreet }),
                ...(permitDetails?.form_id && {permit_id: permitDetails.form_id})
            })) : null;

            if (res?.payload?.action) {
                await dispatch(getOtherExtraFields(res.payload.data.form_id));
                await dispatch(getExtraData(2));
                await dispatch(getPermitDetails(permit_id))
                isVerifyUsdot !== false && setIsVerifyUsdot(false);
                isVerifyEin !== false && setIsVerifyEin(false);
                verified !== true && setVerified(true);
                isUnVerifyedState !== false && setIsUnVerifyedState(false);
            } else {
                const errors = res?.payload?.result?.data
                if (errors) {
                    regFormik.setErrors({
                        email: errors.email || "",
                        phone: errors.phone || "",
                    })
                    irpFormik.setErrors({
                        irpAccount: errors.irp_account_number,
                        iftaAccountNumber: errors.ifta_account_number
                    })
                    usdotFormik.setErrors({
                        usdotNumber: errors.USDOT,
                        ein: errors.EIN
                    })
                }
            }

            setLoader(false);

            return new Promise(resolve => {
                resolve(res)
            })
        } else {
            setVerified(false);
        }
        setLoader(false);
    };

    return (
        <main className="formPage formPage mPadding grayBG">
            <Fade>
                <div className="formPageCard grayBG">
                    <h1 className="formTitle font24 line24 whiteBg textCenter">
                        <span className="primary">IFTA Application Form</span>
                    </h1>
                    <StepController router={router}/>
                    <Register
                        irpFormik={irpFormik}
                        loading={loader}
                        formik={regFormik}
                        appTypes={(appTypes || []).filter(item => item?.name !== 'Temporary Permits')}
                        baseStates={baseStates}
                        setVerified={setVerified}
                        setIsUnVerifyedState={setIsUnVerifyedState}
                    />

                    <CheckIRP
                        require_ifta={regFormik.values.state.require_ifta}
                        loading={loader}
                        formik={irpFormik}
                        newApp={newApp}
                        state={regFormik.values.state?.state}
                        application_typeId={regFormik.values.application_type?.id}
                    />

                    <AddUSDOT
                        formik={usdotFormik}
                        irpFormik={irpFormik}
                        newApp={newApp}
                        state={regFormik.values.state?.state}
                        application_typeId={regFormik.values.application_type?.id}
                        handleVerify={handleVerify}
                        loading={loader}
                        setVerified={setVerified}
                        isUnVerifyedState={isUnVerifyedState}
                        setIsUnVerifyedState={setIsUnVerifyedState}
                        isVerifyUsdot={isVerifyUsdot}
                        isVerifyEin={isVerifyEin}
                        statusUsdotValues={statusUsdotValues}
                        isTemporaryPermits={(regFormik?.values?.application_type?.name || "").toLowerCase().replaceAll(' ', '_') === 'temporary_permits'}
                    />
                    {verified && statusUsdotValues === 'success' && <Others
                        sendFileByEmail={storeData?.sendFileByEmail}
                        permit_id={permit_id}
                        setLoading={setLoader}
                        others={others}
                        submit={submit}
                        setSubmit={setSubmit}
                        applicationTypeId={regFormik.values.application_type?.id}
                        stateId={regFormik.values.state?.id}
                        ein={usdotFormik.values.ein}
                    />}
                    {verified && statusUsdotValues === 'success' && storeData ? <OwnerOfficer
                        ownerOfficerSectionError={ownerOfficerSectionError}
                        setOwnerOfficerActive={setOwnerOfficerActive}
                        baseStateId={regFormik?.values?.state?.id}
                        width={width}
                        permit_id={permit_id}
                        allStates={extraData?.allStates}
                        officerType={extraData?.officerType}
                        extraFields={storeData?.fields?.extra_fields?.filter(el => el.group?.name === "Member")}
                    /> : ""}
                    {verified && statusUsdotValues === 'success' && storeData ? <Vehicles
                        vehiclesSectionError={vehiclesSectionError}
                        setVehiclesActive={setVehiclesActive}
                        width={width}
                        cost={permitDetails.cost}
                        permit_id={permit_id}
                        fuelType={extraData?.fuelType}
                        extraFields={storeData?.fields?.extra_fields?.filter(el => el.group?.name === "Vehicle")}
                    /> : ""}
                    { verified &&
                      statusUsdotValues === 'success' && (
                        <div className="steBtns">
                            <NormalBtn
                                className="nextStep secondary outlined"
                                loading={loader}
                                onClick={() => {
                                    if( usdotFormik.values.usdotNumber === storeData.usdot &&
                                        ((!usdotFormik.errors.ein || usdotFormik.values.ein) && usdotFormik.values.ein) &&  
                                        !ownerOfficerActive &&
                                        !vehiclesActive
                                    ) {
                                        handleVerify();
                                        setSubmit(true);
                                        setOwnerOfficerSectionError(false);
                                        setVehiclesSectionError(false);
                                    } else {
                                        if(Boolean(usdotFormik.errors.ein) === true && Boolean(usdotFormik.values.ein) === false) {
                                            window.scroll({ top: 0, behavior: 'smooth' });
                                            usdotFormik.setTouched({
                                                ...usdotFormik.touched,
                                                ein: true
                                            });
                                        };
                                        if(
                                            usdotFormik.values.usdotNumber !== storeData.usdot &&
                                            storeData.ein === usdotFormik.values.ein
                                        ) {
                                            window.scroll({ top: 0, behavior: 'smooth' });
                                            setIsVerifyUsdot(true);
                                        } else if (ownerOfficerActive) {
                                            setOwnerOfficerSectionError(true);
                                            setTimeout(setOwnerOfficerSectionError, 100);
                                            setVehiclesSectionError(false);
                                        } else if (vehiclesActive) {
                                            setVehiclesSectionError(true);
                                            setTimeout(setVehiclesSectionError, 100);
                                            setOwnerOfficerSectionError(false);
                                        };
                                    };
                                }}
                            >
                                Next Step
                                <NextSvgIcon/>
                            </NormalBtn>
                        </div>
                    )}
                </div>
            </Fade>
        </main>
    )
}