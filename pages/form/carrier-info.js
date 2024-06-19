import {
    getExtraData, getOtherExtraFields, selectUsdotValuesStatus, selectBaseStates,
    selectTaxReturnPeriodStatus, selectQuarterlyFillingsList, getPermitDetails,
    selectExtraData, selectPermitDetails, selectStoreData, setRegisterLoading,
    getUsdotValuesByNumber, clearQuarterlyFillings, selectUsdotValues,
    selectAppTypesWithoutTemp, getBaseStates, getQuarter, update,
    selectTaxReturnPeriod, getQuarterlyFillings, verify, 
    clearQarterRowData,
} from "@/store/slices/resgister";
import { clearPermits, getUserPermits, selectPermits, selectPermitsStatus } from "@/store/slices/permits";
import { FormSectionsCarrierInfoContext } from "@/contexts/FormSectionsCarrierInfoContext";
import { VerificationContext } from "@/contexts/VerificationCarrierInfoContext";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AllQuarters } from "@/components/form/carrier-info/AllQuarters";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import { QUARTERLY_FILLING_ID } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "@/store/slices/auth";
import { setPopUp } from "@/store/slices/common";
import { useRouter } from "next/router";
import { useFormik } from "formik";

import OwnerOfficer from "@/components/form/carrier-info/OwnerOfficer";
import Register from "@/components/form/carrier-info/Register";
import CheckIRP from "@/components/form/carrier-info/CheckIRP";
import AddUSDOT from "@/components/form/carrier-info/AddUSDOT";
import Vehicles from "@/components/form/carrier-info/Vehicles";
import NextSvgIcon from "@/public/assets/svgIcons/NextSvgIcon";
import StepController from "@/components/form/StepController";
import Others from "@/components/form/carrier-info/Others";
import NormalBtn from "@/components/universalUI/NormalBtn";
import schemas from "@/utils/schemas";
import classNames from "classnames";
import * as yup from "yup";

export default function CarrierInfo() {
    const router = useRouter();
    const dispatch = useDispatch();
    const appTypes = useSelector(selectAppTypesWithoutTemp);
    const baseStates = useSelector(selectBaseStates);
    const extraData = useSelector(selectExtraData);
    const storeData = useSelector(selectStoreData);
    const permitDetails = useSelector(selectPermitDetails);
    const statusUsdotValues = useSelector(selectUsdotValuesStatus);
    const usdotValuesFromStore = useSelector(selectUsdotValues);
    const taxReturnPeriod = useSelector(selectTaxReturnPeriod);
    const taxReturnPeriodStatus = useSelector(selectTaxReturnPeriodStatus);
    const quarterlyFillingsList = useSelector(selectQuarterlyFillingsList);
    const permitsStatus = useSelector(selectPermitsStatus);
    const permitsAndQuarters = useSelector(selectPermits);
    const user = useSelector(selectUserData);

    const { width } = useWindowSize();

    const {
        loader, setLoader,
        verified, setVerified,
        isVerifyUsdot, setIsVerifyUsdot,
        nextStapeLoading, setNextStapeLoading,
        isUnVerifyedState, setIsUnVerifyedState
    } = useContext(VerificationContext);

    const {
        setOwnerOfficerSectionError,
        setVehiclesSectionError,
        ownerOfficerActive,
        vehiclesActive
    } = useContext(FormSectionsCarrierInfoContext);

    const [isCallGetPermits, setIsCallGetPermits] = useState(false);
    const [isQuarterlyApplicationType, setIsQuarterlyApplicationType] = useState(false);
    const [submit, setSubmit] = useState(false);

    const quarterRangeFormiksRefIntoTop = useRef(null);
    const permitIdUpdatedRef = useRef(null);
    const validUsdotNumberRef = useRef(null);
    const quartersRef = useRef(null);
    const einRef = useRef(null);
    const iftaAccountNumberRef = useRef(null);

    const regFormik = useFormik({
        initialValues: {
            email: user?.email || '',
            phone: user?.phone || '',
            application_type: "",
            ...(isQuarterlyApplicationType && { quarterly_pariod: [] }),
            state: "",
        },
        validationSchema: yup.object({
            email: schemas.email,
            phone: schemas.phone,
            application_type: schemas.select,
            ...(isQuarterlyApplicationType && { quarterly_pariod: schemas.arrayOrString.required("Required") }),
            state: schemas.select
        })
    });

    const irpFormik = useFormik({
        initialValues: {
            irpAccount: "1",
            irpAccountNumber: '',
            ...(isIftaAccountNumber() && { iftaAccountNumber: "" })
        },
        validationSchema: yup.object({
            ...(isIrpAccount() && { irpAccount: schemas.required }),
            ...(isIrpAccountNumber() && { irpAccountNumber: schemas.irpAccountNumber }),
            ...(isIftaAccountNumber() && { iftaAccountNumber: schemas.iftaAccountNumber })
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

    const isOpenedQuarterForms = Boolean(
        isQuarterAppType() &&
        Array.isArray(regFormik.values.quarterly_pariod) &&
        statusUsdotValues === 'success' &&
        quarterlyFillingsList !== null &&
        storeData &&
        verified
    );

    useEffect(() => {
        if(permitIdUpdatedRef.current !== null) {
            return;
        };
        dispatch(setRegisterLoading(true))
        dispatch(getBaseStates());
        dispatch(getPermitDetails(router?.query?.permitId))
            .then(async (res) => {
                let lastTwoYearsQuartersFromCallback = null;
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
                        irp_account,
                        USDOT,
                        EIN,
                        application_type_id,
                        quarters_with_relations
                    } = res.payload.data;

                    const formData = {
                        email,
                        phone,
                        application_type,
                        state
                    };

                    if (registerData && !registerData?.fromPermits) {
                        dispatch(setRegisterLoading(false));
                        regFormik.setValues({ ...registerData });
                        if(registerData?.application_type?.id !== QUARTERLY_FILLING_ID) {
                            setIsQuarterlyApplicationType(false);
                        };
                    } else {
                        if(application_type_id === QUARTERLY_FILLING_ID) {
                            setIsQuarterlyApplicationType(true);
                            if(!taxReturnPeriod && taxReturnPeriodStatus === '') {
                                await dispatch(getQuarter({
                                    callback: (data) => {
                                        if(Array.isArray(data?.lastTwoYearsQuarters)) {
                                            lastTwoYearsQuartersFromCallback = data?.lastTwoYearsQuarters;
                                            const selectedQuarterPariods = data?.lastTwoYearsQuarters.filter((pariod) => {
                                                return quarters_with_relations.find((selectedPeriod) => selectedPeriod.quarter_id === pariod.id);
                                            });
                                            formData.quarterly_pariod = selectedQuarterPariods;
                                            regFormik.setValues(formData);
                                        };
                                    }
                                }));
                            } else {
                                lastTwoYearsQuartersFromCallback = taxReturnPeriod?.lastTwoYearsQuarters;
                                const selectedQuarterPariods = taxReturnPeriod?.lastTwoYearsQuarters.filter((pariod) => {
                                    return quarters_with_relations.find((selectedPeriod) => selectedPeriod.quarter_id === pariod.id);
                                });
                                formData.quarterly_pariod = selectedQuarterPariods;
                                regFormik.setValues(formData);
                            };
                            
                        } else {
                            regFormik.setValues(formData);
                        };
                    };

                    irpFormik.setValues({
                        irpAccount: irp_account === '0' ? '0': "1",
                        iftaAccountNumber: ifta_account_number || "",
                        irpAccountNumber: irp_account_number
                    })

                    usdotFormik.setValues({
                        isUSDOT: "yes",
                        usdotNumber: USDOT,
                        ein: EIN
                    });

                    if (!registerData || registerData?.fromPermits) {
                        if(!usdotValuesFromStore || !Object.values(usdotValuesFromStore)?.length) {
                            await dispatch(getUsdotValuesByNumber({
                                usdotNumber: USDOT,
                                callback: (usdotValues) => {
                                    const legal_name = usdotValues?.content?.carrier?.legalName;
                                    const { phyStreet, phyCity, phyState, phyZipcode } = usdotValues?.content?.carrier;
                                    const business_address = `${phyStreet}, ${phyCity}, ${phyState}, ${phyZipcode}`;

                                    let selectedQuarterPariods = [];

                                    if(Array.isArray(lastTwoYearsQuartersFromCallback)) {
                                        selectedQuarterPariods = lastTwoYearsQuartersFromCallback?.filter((pariod) => {
                                            return quarters_with_relations.find((selectedPeriod) => selectedPeriod.quarter_id === pariod.id);
                                        });
                                    } else {
                                        if(Array.isArray(quarters_with_relations)) {
                                            selectedQuarterPariods = quarters_with_relations.map((pariod) => ({ id: pariod?.quarter_id }))
                                        };
                                    };

                                    dispatch(update({
                                        email,
                                        phone,
                                        application_type: application_type_id,
                                        state: state.id,
                                        USDOT,
                                        EIN,
                                        ...(Boolean(ifta_account_number) && { ifta_account_number }),
                                        ...(Boolean(irp_account_number) && { irp_account_number }),
                                        irp_account,
                                        permit_id: res.payload.data.form_id,
                                        quarters: selectedQuarterPariods?.map(pariod => pariod.id) || [],
                                        ...(legal_name && { legal_name }),
                                        ...(business_address && { business_address }),
                                    })).then(res => {
                                        dispatch(setRegisterLoading(false));
                                        if (res?.payload?.action) {
                                            dispatch(getOtherExtraFields(res.payload.data.form_id));
                                            dispatch(getExtraData(1));
                                            verified !== true && setVerified(true);
                                            isUnVerifyedState !== false  && setIsUnVerifyedState(false);
                                            regFormik.setValues(formData);
                                        };
                                    });
                                }
                            }))
                        } else {
                            const { phyStreet, phyCity, phyState, phyZipcode } = usdotValuesFromStore?.content?.carrier;
                            const business_address = `${phyStreet}, ${phyCity}, ${phyState}, ${phyZipcode}`;

                            let selectedQuarterPariods = [];

                            if(Array.isArray(lastTwoYearsQuartersFromCallback)) {
                                selectedQuarterPariods = lastTwoYearsQuartersFromCallback?.filter((pariod) => {
                                    return quarters_with_relations?.find((selectedPeriod) => selectedPeriod.quarter_id === pariod.id);
                                });
                            } else {
                                if(Array.isArray(quarters_with_relations)) {
                                    selectedQuarterPariods = quarters_with_relations.map((pariod) => ({ id: pariod?.quarter_id }))
                                };
                            };

                            dispatch(update({
                                email,
                                phone,
                                application_type: application_type_id,
                                state: state.id,
                                USDOT,
                                EIN,
                                ...(Boolean(ifta_account_number) && { ifta_account_number }),
                                ...(Boolean(irp_account_number) && { irp_account_number }),
                                irp_account,
                                permit_id: res.payload.data.form_id,
                                quarters: selectedQuarterPariods?.map(pariod => pariod.id) || [],
                                ...(usdotValuesFromStore?.content?.carrier?.legalName && { legal_name: usdotValuesFromStore?.content?.carrier?.legalName }),
                                ...(business_address && { business_address }),
                            })).then(res => {
                                dispatch(setRegisterLoading(false));
                                if (res?.payload?.action) {
                                    dispatch(getUsdotValuesByNumber({ usdotNumber: USDOT }));
                                    dispatch(getOtherExtraFields(res.payload.data.form_id));
                                    dispatch(getExtraData(1));
                                    verified !== true && setVerified(true);
                                    isUnVerifyedState !== false  && setIsUnVerifyedState(false);
                                    regFormik.setValues(formData);
                                };
                            });
                        };
                    };

                    localStorage.removeItem("registerData");
                } else {
                    if(res?.payload?.newPermit) {
                        if (registerData && !registerData?.fromPermits) {
                            dispatch(setRegisterLoading(false));
                            regFormik.setValues({ ...registerData });
                            if(registerData?.application_type?.id !== QUARTERLY_FILLING_ID) {
                                setIsQuarterlyApplicationType(false);
                            };
                        }
                    };

                    dispatch(setRegisterLoading(false))
                    if (registerData) {
                        let findedTaxReturnPariods = []
                        if(router?.query?.taxReturnPeriodId && taxReturnPeriod?.lastTwoYearsQuarters) {
                            const findedTaxReturnPariod = taxReturnPeriod?.lastTwoYearsQuarters?.find((pariod) => pariod?.id === Number(router?.query?.taxReturnPeriodId)); 
                            findedTaxReturnPariods.push(findedTaxReturnPariod);
                        };

                        regFormik.setValues({
                            ...regFormik.values,
                            ...registerData,
                            ...(findedTaxReturnPariods.length && { quarterly_pariod: findedTaxReturnPariods })
                        });
                    };
                };
            });
    }, [router.query]);

    useEffect(() => {
        if(localStorage.getItem('fromPermitsPage') && isOpenedQuarterForms) {
            if(quartersRef.current) {
                quartersRef.current.scrollIntoView({ behavior: 'smooth' });
            };
            localStorage.removeItem('fromPermitsPage');
            if(loader) {
                setLoader(false);
            };
        } else if(localStorage.getItem('fromPermitsPage') && !isOpenedQuarterForms) {
            setLoader(true);
        };
    }, [isOpenedQuarterForms]);

    useEffect(() => {
        const registerData = JSON.parse(localStorage.getItem("registerData") || "{}");
        const quarterlyApplication_type = appTypes?.find((appType) => appType?.id === QUARTERLY_FILLING_ID);
        const isQuarterly = (
            (user?.is_quarterly === '1' || router?.query?.taxReturnPeriodId) &&
            quarterlyApplication_type &&
            (permitDetails?.application_type_id === QUARTERLY_FILLING_ID || permitDetails?.action === false || JSON.stringify(permitDetails) === '{}')
        ) && ( registerData?.application_type?.id === QUARTERLY_FILLING_ID || registerData?.application_type?.id === undefined );

        if(isQuarterly) {
            if(taxReturnPeriod === null && taxReturnPeriodStatus === '') {
                dispatch(getQuarter());
            };
            if(registerData?.application_type?.id === QUARTERLY_FILLING_ID || registerData?.application_type === undefined) {
                setIsQuarterlyApplicationType(true);
            };
        };

        if(Boolean(user?.email) || Boolean(user?.phone) || user?.is_quarterly === '1' || router?.query?.taxReturnPeriodId) {
            if(isQuarterly) {
                setIsQuarterlyApplicationType(true);
            };
            let findedTaxReturnPariods = []
            if(router?.query?.taxReturnPeriodId && taxReturnPeriod?.lastTwoYearsQuarters) {
                const findedTaxReturnPariod = taxReturnPeriod?.lastTwoYearsQuarters?.find((pariod) => pariod?.id === Number(router?.query?.taxReturnPeriodId)); 
                findedTaxReturnPariods.push(findedTaxReturnPariod);
            };

            regFormik.setValues({
                ...regFormik.values,
                email: regFormik.values.email || (user?.email || ''),
                phone: regFormik.values.phone || (user?.phone || ''),
                ...(isQuarterly && {
                    application_type: quarterlyApplication_type
                }),
                ...(router?.query?.taxReturnPeriodId && Boolean((regFormik.values.quarterly_pariod || [])?.length === 0 || ((regFormik.values.quarterly_pariod || [])?.length === 1 && (regFormik.values.quarterly_pariod || [])?.[0]?.id === findedTaxReturnPariods?.[0]?.id)) && {
                    quarterly_pariod: findedTaxReturnPariods
                })
            });
        };
    }, [user, permitDetails, router?.query, taxReturnPeriod]);

    useEffect(() => {
        if(isQuarterlyApplicationType && !isQuarterAppType()) {
            setIsQuarterlyApplicationType(false);
        };
    }, [regFormik.values.application_type]);

    useEffect(() => {        
        if(
            isQuarterAppType() &&
            verified &&
            statusUsdotValues === 'success' &&
            storeData &&
            quarterlyFillingsList === null
        ) {
            dispatch(getQuarterlyFillings({ permit_id: permitDetails?.form_id}));
        };
    }, [regFormik.values, verified, statusUsdotValues, storeData, quarterlyFillingsList]);

    useEffect(() => {
        if(usdotFormik.values.usdotNumber === storeData?.usdot) {
            isVerifyUsdot && setIsVerifyUsdot(false);
        };
    }, [usdotFormik.values]);

    useEffect(() => {
        if(Array.isArray(permitsAndQuarters) && isCallGetPermits) {
            setIsCallGetPermits(false);
            handleVerify();
        };
    }, [permitsAndQuarters]);

    const { others, members, vehicles } = useMemo(() => {
        return (storeData?.fields?.extra_fields || []).reduce((acm, el) => {
            switch(el.group?.name) {
                case 'Other': {
                    acm.others.push(el);
                    break;
                };
                case 'Member': {
                    acm.members.push(el);
                    break;
                };
                case 'Vehicle': {
                    acm.vehicles.push(el);
                    break;
                };
            }

            return acm;
        }, { others: [], members: [], vehicles: [] });
    }, [storeData]);

    async function handleVerify(usdotLoader = true) {
        setLoader(usdotLoader);
        if(permitsStatus === '') {
            setIsCallGetPermits(true);
            await dispatch(getUserPermits());
            return;
        };

        const handleVerifyBody = async () => {
            let findedEin = '';
            let usdotValuesFromStore = null;
            if(usdotFormik.values.usdotNumber) {
                await dispatch(getUsdotValuesByNumber({
                    usdotNumber: usdotFormik.values.usdotNumber,
                    callback: (usdotValues) => {
                        findedEin = usdotValues?.content?.carrier?.ein;
                        usdotValuesFromStore = usdotValues;
                        
                        usdotFormik.setValues({
                            ...usdotFormik.values,
                            ein: findedEin || ''
                        });
                        const { ein, ...errors } = usdotFormik.errors;
                        usdotFormik.setErrors({
                            ...errors
                        });
                        validUsdotNumberRef.current = usdotValues?.content?.carrier ? usdotFormik.values.usdotNumber : null; 
                    }
                }));
            };
    
            const regValidation   = await regFormik.validateForm();
            const irpValidation   = await irpFormik.validateForm();
            const usdotValidation = await usdotFormik.validateForm();

            regFormik.handleSubmit();
            irpFormik.handleSubmit();
            usdotFormik.handleSubmit();
            delete usdotValidation.ein;
            if(Object.keys(regValidation)?.length) {
                const keys = Object.keys({...regValidation});
                const touched = keys.reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {});

                regFormik.setTouched({
                    ...regFormik.touched,
                    ...touched
                });
            };

            if (!(Object.keys(regValidation)?.length) &&
                !(Object.keys(irpValidation)?.length) &&
                !(Object.keys(usdotValidation)?.length)
            ) {
                let method = permitDetails?.form_id ? update : verify;
                const { phyStreet = '', phyCity = '', phyState = '', phyZipcode = '' } = usdotValuesFromStore?.content?.carrier || {};
                const business_address = `${phyStreet}, ${phyCity}, ${phyState}, ${phyZipcode}`;

                const payload = {
                    email: regFormik.values.email,
                    phone: regFormik.values.phone.replaceAll(" ", ""),
                    application_type: regFormik.values.application_type?.id,
                    USDOT: validUsdotNumberRef.current ? usdotFormik.values.usdotNumber : (storeData?.usdot || ''),
                    state: regFormik.values?.state.id,
                    EIN: findedEin || usdotFormik.values.ein,
                    ...(Boolean(irpFormik.values.iftaAccountNumber) && {
                        ifta_account_number: irpFormik.values.iftaAccountNumber
                    }),
                    ...(Boolean(irpFormik.values.irpAccountNumber) && {
                        irp_account_number: irpFormik.values.irpAccountNumber
                    }),
                    irp_account: irpFormik.values.irpAccount,
                    ...(usdotValuesFromStore?.content?.carrier?.legalName && { legal_name: usdotValuesFromStore?.content?.carrier?.legalName }),
                    ...(business_address && { business_address }),
                    ...(permitDetails.form_id && { permit_id: permitDetails?.form_id })
                };

                if(regFormik.values?.quarterly_pariod !== undefined) {
                    if(Array.isArray(regFormik.values?.quarterly_pariod)) {
                        payload.quarters = regFormik.values?.quarterly_pariod?.map(pariod => pariod.id);
                    } else {
                        payload.quarters = [];
                    };
                } else {
                    payload.quarters = [];
                };

                const res = validUsdotNumberRef.current ? await dispatch(method(payload)) : null;

                if (res?.payload?.action) {
                    dispatch(clearQuarterlyFillings());
                    localStorage.removeItem("registerData");
                    await dispatch(getOtherExtraFields(res.payload.data.form_id));
                    await dispatch(getExtraData(2));
                    await dispatch(getPermitDetails(permitDetails?.form_id ? permitDetails?.form_id : res?.payload?.data?.form_id));
                    isVerifyUsdot !== false && setIsVerifyUsdot(false);
                    verified !== true && setVerified(true);
                    isUnVerifyedState !== false && setIsUnVerifyedState(false);

                    if(permitDetails?.form_id === undefined) {
                        const updatedQuery = { permitId: res?.payload?.data?.form_id };
                        permitIdUpdatedRef.current = res?.payload?.data?.form_id;
                        router.replace({ query: updatedQuery });
                    };
                } else {
                    const errors = res?.payload?.result?.data
                    if (errors) {
                        regFormik.setErrors({
                            email: errors.email || "",
                            phone: errors.phone || "",
                        });
                        irpFormik.setErrors({
                            irpAccount: errors.irp_account_number,
                            iftaAccountNumber: errors.ifta_account_number
                        });
                        usdotFormik.setErrors({
                            usdotNumber: errors.USDOT,
                            ein: errors.EIN
                        });
                    }
                };

                setLoader(false);
    
                return new Promise(resolve => {
                    resolve(res)
                })
            } else {
                setVerified(false);
            }
            setLoader(false);
        };

        if(Array.isArray(permitsAndQuarters)) {
            const sameApplicationHalfDone = permitsAndQuarters.find(permit => permit?.application_type_id === regFormik.values.application_type?.id);
            const isQuarter = Boolean(sameApplicationHalfDone?.application_type_id === QUARTERLY_FILLING_ID);

            if(isQuarter === false && sameApplicationHalfDone && sameApplicationHalfDone?.form_id !== permitDetails?.form_id) {
                await dispatch(setPopUp({
                    popUp: "permitReContinue",
                    popUpAction: (condition) => {
                        localStorage.removeItem("registerData");
                        if(condition === 'no') {
                            dispatch(clearPermits());
                            handleVerifyBody();
                        } else {
                            dispatch(clearPermits());
                            const updatedQuery = {
                                permitId: sameApplicationHalfDone?.form_id
                            };

                            permitIdUpdatedRef.current = null;
                            setLoader(false);
                            return router.replace({ query: updatedQuery });
                        };
                    }
                }))
            } else {
                handleVerifyBody();
            };
        } else {
            handleVerifyBody();
        };
    };

    const handleNextStep = async () => {
        setNextStapeLoading(true);
        let ifQuarterIsItValidSections = true;
        const isThereQuarterSections = Array.isArray(quarterRangeFormiksRefIntoTop.current);
        if(regFormik.values?.application_type?.id === QUARTERLY_FILLING_ID) {
            localStorage.removeItem('registerData');
            if(isThereQuarterSections) {
                quarterRangeFormiksRefIntoTop.current.forEach((quarterRange) => {
                    const formik = quarterRange?.formik;
                    const currentPeriodRange = quarterRange?.currentPeriodRange;

                    const isOperate = formik?.values?.[`isOperate${currentPeriodRange?.id}`];

                    if(isOperate === 'yes') {
                        ifQuarterIsItValidSections = false;
                        quarterRange.sectionError = true;
                        formik.handleSubmit();
                    } else {
                        if(quarterRange?.sectionError) {
                        delete quarterRange.sectionError;
                        };
                    };
                });
            };
        };

        if( usdotFormik.values.usdotNumber === storeData.usdot &&
            ((!usdotFormik.errors.ein || usdotFormik.values.ein) && usdotFormik.values.ein) &&  
            (
                (regFormik.values?.application_type?.id !== QUARTERLY_FILLING_ID && !ownerOfficerActive) ||
                (regFormik.values?.application_type?.id === QUARTERLY_FILLING_ID && ifQuarterIsItValidSections)
            ) &&
            (
                (regFormik.values?.application_type?.id !== QUARTERLY_FILLING_ID && !vehiclesActive) ||
                (regFormik.values?.application_type?.id === QUARTERLY_FILLING_ID && ifQuarterIsItValidSections)
            ) && 
            (
                (Number(regFormik.values.application_type?.id) !== 1 && regFormik.values.state.require_ifta === '1') ?
                (irpFormik.values.iftaAccountNumber === '0' ? false : Boolean(irpFormik.values.iftaAccountNumber)) : true
            )
        ) {
            if(others && others?.length) {
                setSubmit(true);
            } else {
                await handleVerify(false);
                if(isQuarterAppType()) {
                    router.push("/form/payment-info");
                    dispatch(clearQarterRowData());
                } else {
                    router.push("/form/questionnaire");
                };

                setNextStapeLoading(false);
            };
            setOwnerOfficerSectionError(false);
            setVehiclesSectionError(false);
        } else {
            setNextStapeLoading(false);
            if(Boolean(usdotFormik.errors.ein) === true || Boolean(usdotFormik.values.ein) === false) {
                if(einRef.current?.element) {
                    einRef.current?.element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    })
                };

                usdotFormik.setTouched({
                    ...usdotFormik.touched,
                    ein: true
                });
            };
            if(
                (Number(regFormik.values.application_type?.id) !== 1 && regFormik.values.state.require_ifta === '1') ?
                (irpFormik.values.iftaAccountNumber === '0' ? true : !Boolean(irpFormik.values.iftaAccountNumber)) : false
            ) {
                if(iftaAccountNumberRef.current) {
                    iftaAccountNumberRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                };

                irpFormik.setTouched({
                    ...irpFormik.touched,
                    iftaAccountNumber: true
                });
            } else if(
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
    };

    // condition Check functions.
    function isQuarterAppType() {
        return regFormik.values.application_type?.id === QUARTERLY_FILLING_ID;
    };

    function isIftaAccountNumber() {
        return regFormik.values.application_type?.id !== 1 && regFormik.values.state.require_ifta === '1';
    };

    function isIrpAccount() {
        return Boolean(
            Boolean(!(regFormik.values.application_type?.id !== 2) || regFormik.values.application_type?.id === 4) &&
            regFormik.values.application_type?.id !== 1
        ) === false;
    };

    function isIrpAccountNumber() {
        return Boolean(
            (!isQuarterAppType() && (Boolean(!(regFormik.values.application_type?.id !== 2) || regFormik.values.application_type?.id === 4) && regFormik.values.application_type?.id !== 1) === false) &&
            regFormik.values.state?.require_irp === '1'
        );
    };

    return (
        <main className={classNames("formPage mPadding grayBG", { 'pointer-eventsNone': nextStapeLoading })}>
            <div className="formPageCard grayBG">
                <h1 className="formTitle font24 line24 whiteBg textCenter">
                    <span className="primary">IFTA Application Form</span>
                </h1>

                <StepController withoutAdditionalQuestion={isQuarterAppType()}/>

                <Register
                    irpFormik={irpFormik}
                    formik={regFormik}
                    appTypes={appTypes}
                    baseStates={baseStates}
                    setIsQuarterlyApplicationType={setIsQuarterlyApplicationType}
                    isQuarterlyApplicationType={isQuarterlyApplicationType}
                    taxReturnPeriod={taxReturnPeriod}
                />

                <CheckIRP
                    require_ifta={regFormik.values.state.require_ifta}
                    formik={irpFormik}
                    newApp={regFormik.values.application_type?.id !== 2}
                    state={regFormik.values.state}
                    application_typeId={regFormik.values.application_type?.id}
                    iftaAccountNumberRef={iftaAccountNumberRef}
                />

                <AddUSDOT
                    formik={usdotFormik}
                    irpFormik={irpFormik}
                    einRef={einRef}
                    newApp={regFormik.values.application_type?.id !== 2}
                    state={regFormik.values.state?.state}
                    application_typeId={regFormik.values.application_type?.id}
                    handleVerify={handleVerify}
                />

                {verified && statusUsdotValues === 'success' && <Others
                    sendFileByEmail={storeData?.sendFileByEmail}
                    permit_id={permitDetails?.form_id}
                    others={others}
                    submit={submit}
                    setSubmit={setSubmit}
                    handleVerify={handleVerify}
                    applicationTypeId={regFormik.values.application_type?.id}
                    stateId={regFormik.values.state?.id}
                    ein={usdotFormik.values.ein}
                />}

                {verified &&
                    statusUsdotValues === 'success' &&
                    storeData &&
                    regFormik.values.application_type?.id !== QUARTERLY_FILLING_ID ? (
                    <OwnerOfficer
                        baseStateId={regFormik?.values?.state?.id}
                        width={width}
                        permit_id={permitDetails?.form_id}
                        allStates={extraData?.allStates}
                        officerType={extraData?.officerType}
                        extraFields={members}
                    />
                ) : ""}

                {regFormik.values.application_type?.id !== QUARTERLY_FILLING_ID &&
                    verified &&
                    statusUsdotValues === 'success' &&
                    storeData ? (
                    <Vehicles
                        width={width}
                        cost={permitDetails.cost}
                        permit_id={permitDetails?.form_id}
                        fuelType={extraData?.fuelType}
                        extraFields={vehicles}
                    />
                ) : ""}

                {isOpenedQuarterForms && <AllQuarters
                    quartersRef={quartersRef}
                    selectedQuarterPariods={regFormik.values.quarterly_pariod}
                    quarterRangeFormiksRefIntoTop={quarterRangeFormiksRefIntoTop}
                />}

                { verified &&
                    statusUsdotValues === 'success' && (
                    <div className="steBtns">
                        <NormalBtn
                            className="nextStep secondary outlined"
                            loading={nextStapeLoading}
                            onClick={handleNextStep}
                        >
                            Next Step
                            <NextSvgIcon/>
                        </NormalBtn>
                    </div>
                )}
            </div>
        </main>
    );
};