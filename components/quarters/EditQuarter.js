import { clearQarterRowData, createQuarterPeriod, getAllQuarters, quarterDelete, removeQuarterPeriod, selectBaseStatesWithCanada, selectExtraData, updateQuarter } from "@/store/slices/resgister";
import { QuarterlyQuestionsTable } from "../form/carrier-info/QuarterlyQuestionsTable";
import { Fragment, memo, useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getQuarterPeriodDate } from "@/utils/helpers";
import { setPopUp } from "@/store/slices/common";
import { toast } from "react-toastify";
import { styled } from '@mui/system';
import { useFormik } from "formik";

import PopupIcon from "@/public/assets/svgIcons/PopupIcon";
import InputField from "../universalUI/InputField";
import NormalBtn from "../universalUI/NormalBtn";
import classNames from "classnames";
import * as yup from "yup";

// GroupHeader component styling.
const GroupHeader = styled('div')(() => ({
    position: 'sticky',
    top: '-8px',
    padding: ' 4px 10px',
    color: 'black',
    backgroundColor: '#F5F5F5',
    fontWeight: '700'
}));

const EditQuarter = memo(({ quarterDataForEdit }) => {
    const dispatch = useDispatch();
    const extraData = useSelector(selectExtraData);
    const allStates = useSelector(selectBaseStatesWithCanada);
    const [qarterRowData, setQarterRowData] = useState(null);

    const formik = useFormik({
        initialValues: {
            fuel_type: "",
            state: "",
            txbl_miles: "",
            tax_paid_gal: "",
            isOperate: Boolean(quarterDataForEdit?.data?.length) ? 'added' : 'no'
        },
        onSubmit: (values, { resetForm, setValues }) => {
            const payload = {
                permit_id: quarterDataForEdit.permit_id,
                quarter_id: quarterDataForEdit.id,
                fuel_type_id: values?.fuel_type?.id,
                state_id: values?.state?.id,
                txbl_miles: values?.txbl_miles,
                tax_paid_gal: values?.tax_paid_gal,
                quarter_condition: '1'
            };

            const callbackForRegetQuarters = () => {
                resetForm();
                // Dispatches actions to update or create quarterly periods.
                dispatch(getAllQuarters({
                    callback: () => {
                        // Resets form after successful submission.
                        dispatch(clearQarterRowData());
                        setValues({
                            fuel_type: "",
                            state: "",
                            txbl_miles: "",
                            tax_paid_gal: "",
                            isOperate: 'added'
                        });

                        // Show successfuly message after request is finishe.
                        toast.success('Report successfully saved', {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    },
                    rejectCallback: (message = 'Server Error') => {
                        return toast.error(message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                }));
            };

            // Handle server error case, and show error message.
            const rejectCallback = (message = 'server Error, please try again after one minutes') => {
                toast.error(message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            };

            // Update Quarter pariods after successfuly Reget quarter
            if(values?.isOperate === 'edit') {
                return dispatch(updateQuarter({
                    id: qarterRowData.id,
                    payload,
                    callback: callbackForRegetQuarters,
                    rejectCallback
                }));
            };

            // Create new quarter pariod.
            dispatch(createQuarterPeriod({
                payload,
                callback: callbackForRegetQuarters,
                rejectCallback
            }));
        },
        validationSchema: yup.object({
            fuel_type: yup.object().when(`isOperate`, {
                is: val => val === 'yes' || val === 'edit',
                then: () => yup.object().required("Please select option")
            }),
            state: yup.object().when(`isOperate`, {
                is: val => val === 'yes' || val === 'edit',
                then: () => yup.object().required("Please select option")
            }),
            txbl_miles: yup.string().when(`isOperate`, {
                is: val => val === 'yes' || val === 'edit',
                then: () => yup.string().required("Required").max(7, "value is so large").matches(/^[0-9]+(\.[0-9]*)?$/, "Must be only digits")
            }),
            tax_paid_gal: yup.string().when(`isOperate`, {
                is: val => val === 'yes' || val === 'edit',
                then: () => yup.string().required("Required").max(7, "value is so large").matches(/^[0-9]+(\.[0-9]*)?$/, "Must be only digits")
            }),
            isOperate: yup.string().required("Required")
        })
    });

    // Update form values when quarterDataForEdit changes.
    useEffect(() => {
        formik.setFieldValue('isOperate', Boolean(quarterDataForEdit?.data?.length) ? 'added' : 'no');
    }, [quarterDataForEdit]);

    // Memoized computation for grouping states by category (USA/Canada).
    const stateByCategorys = useMemo(() => {
        return allStates?.reduce((acc, item) => {
            acc[item.country].push({ 
                state: item.state,
                category: item.country,
                groupName: item.country === 'canada' ? 'Canada' : 'USA',
                id: item.id
            });
            return acc;
        }, { canada: [], usa: [] });
    }, [allStates]);
    
    // Memoized computation to filter available state options based on quarterDataForEdit.
    const options = useMemo(() => {
        if(stateByCategorys) {
            const sortedStates = [
                ...stateByCategorys.usa.sort((a, b) => a.state.localeCompare(b.state)),
                ...stateByCategorys.canada.sort((a, b) => a.state.localeCompare(b.state))
            ];

            // Returns an array of filtered state options.
            return sortedStates.filter((state) => {
                const selectedState = quarterDataForEdit?.data?.find((selectedQuarter) => selectedQuarter?.state_id === state?.id);
                return !Boolean(selectedState);
            });
        } else {
            return [];
        };
    }, [stateByCategorys, quarterDataForEdit]); 
    
    // Callback function for editing quarter data.
    const handleEditCallback = (data) => {
        const newValues = {
            ...formik.values,
            ...(data?.fuel_type && { fuel_type: data.fuel_type }),
            ...(data?.state && { state: data.state }),
            ...(Boolean(data?.txbl_miles || data?.txbl_miles === 0) && { txbl_miles: data.txbl_miles }),
            ...(Boolean(data?.tax_paid_gal || data?.tax_paid_gal === 0) && { tax_paid_gal: data.tax_paid_gal }),
            isOperate: 'edit',
        };

        // Sets form values based on edited data and changes isOperate to 'edit'
        formik.setValues(newValues);
        setQarterRowData(data);
    };

    // Handles the deletion of a quarterly period.
    const handleDelete = (id) => {
        // Displays a confirmation popup before deletion.
        dispatch(setPopUp({
            popUp: "removeQuarterPopup",
            popUpContent: "Are You Sure You Want to Remove This Report?",
            popUpAction: () => dispatch(quarterDelete({ id, callback: updateQuarters }))
        }));

        // Dispatches action to delete the selected quarterly period.
        function updateQuarters() {
            dispatch(getAllQuarters({
                rejectCallback: (message = 'Server Error') => {
                    return toast.error(message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            }));
        };
    };

    // Handles the change in isOperate radio button.
    const handleChangeOperateNo = (event) => {
        if(quarterDataForEdit?.data?.length) {
            // Displays a confirmation popup before deletion
            dispatch(setPopUp({
                popUp: "removeQuarterPopup",
                popUpContent: "By clicking the 'Yes' button, your saved report will be removed. Are you sure you want to proceed with these changes?",
                popUpAction: () => {
                    const payload = {
                        permit_id: quarterDataForEdit.permit_id,
                        quarter_id: quarterDataForEdit.id,
                        quarter_condition: '0'
                    };

                    // Handle request error.  
                    const rejectCallback = (message = 'server Error, please try again after one minutes') => {
                        toast.error(message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    };

                    // Handle succesfuly requesst and get updated quarters.
                    const callBackForDoneRemoveProcess = () => {
                        formik.handleChange(event);
                        dispatch(getAllQuarters({
                            rejectCallback: (message = 'Server Error') => {
                                return toast.error(message, {
                                    position: toast.POSITION.TOP_RIGHT
                                });
                            }
                        }));
                        dispatch(setPopUp({}));
                    };
                    
                    // Dispatches action to delete the selected quarterly period.
                    return dispatch(removeQuarterPeriod({
                        payload,
                        callback: callBackForDoneRemoveProcess,
                        rejectCallback
                    }));                        
                }
            }));
        } else {
            formik.handleChange(event);
        };
    };

    // Function to reverse the quarterly fillings array.
    const reversedQuarterlyFillings = () => {
       return [...quarterDataForEdit?.data].map((_, index, array) => array[array.length - 1 - index]);
    };

    // Function to close the quarter row and reset the form.
    const closeQuarterRow = () => {
        formik.resetForm();
        formik.setFieldValue('isOperate', 'added');
        dispatch(clearQarterRowData());
    };

    // Handler functions for Tax paid gal field changes.
    const handleTaxPaidGalChange = (event) => {
        let string = event.target.value;
        if ((/^[0-9]+(\.[0-9]*)?$/.test(string) && string.length < 7) || string === '') {
            formik.setValues({
                ...formik.values,
                tax_paid_gal: string
            });
        };
    };

    // Handler functions for Txbl Miles field changes.
    const handleTxblMilesChange = (event) => {
        let string = event.target.value;
        if ((/^[0-9]+(\.[0-9]*)?$/.test(string) && string.length < 7) || string === '') {
            formik.setValues({
                ...formik.values,
                txbl_miles: string
            });
        };
    };

    // Handler functions for state field changes.
    const handleStateChange = (e, state) => {
        formik.setValues({ ...formik.values, state: state || "" });
    };

    // Handler functions for fuel type field changes.
    const handleFuelTypeChange = (e, value) => {
        formik.setValues({ ...formik.values, fuel_type: value || "" });
    };

    return (
        <div className="ownerOfficer">
            <h2 className="subTitle font20 mb5 whiteBg textCenter weight500">
                <span className="primary flexCenter gap4">
                    Reporting IFTA miles and gallons for the
                    {getQuarterPeriodDate({ name: quarterDataForEdit?.period, year: quarterDataForEdit?.year })}
                </span>
            </h2>
            <div className="ownerOfficerMain quarterlyQuestions">
                <div className="mb15">
                    <p className="primary mb5">
                        Did you operate in any jurisdiction this period?
                        <sup className="red"> * </sup>
                    </p>
                    <div className="radioGroup flex gap20 alignCenter">
                        <label className="flexCenter alignCenter gap5">
                            <input
                                type="radio"
                                value="yes"
                                name='isOperate'
                                onChange={formik.handleChange}
                                checked={['yes', 'added', 'edit'].includes(formik.values.isOperate)}
                            />
                            <span className="primary">Yes</span>
                        </label>
                        <label className="flexCenter alignCenter gap5">
                            <input
                                type="radio"
                                value="no"
                                name='isOperate'
                                onChange={handleChangeOperateNo}
                                checked={formik.values.isOperate === 'no'}
                            />
                            <span className="primary">No</span>
                        </label>
                    </div>
                    <p className="err-message"/>
                </div>

                { Boolean(quarterDataForEdit?.data?.length && ['yes', 'added', 'edit'].includes(formik.values.isOperate)) && (
                    <QuarterlyQuestionsTable
                        quarterlyFillingsList={reversedQuarterlyFillings()}
                        handleEditCallback={handleEditCallback}
                        handleDelete={handleDelete}
                        totalCost={quarterDataForEdit?.cost}
                    />
                )}

                { Boolean(quarterDataForEdit?.data?.length && formik.values.isOperate === 'added') && (
                    <NormalBtn
                        className="filled bg-lighthouse-black gap10 min-m-w-initial ml-auto w100-max500"
                        onClick={() => formik.setValues({ ...formik.values, isOperate: "yes" })}
                    >
                        <span className="lighthouse-black" style={{ fontSize: '30px' }}>+</span>
                        Add another state
                    </NormalBtn>
                )}

                <div className="radioQuestion checkIrpAccount">
                    { Boolean(['yes', 'edit'].includes(formik.values.isOperate)) && (
                        <form className="inputsContainer flex wrap alignEnd gap20 w100">
                            <InputField
                                error={formik.touched?.fuel_type && formik.errors?.fuel_type}
                                label="Type of fuel used"
                                required={true}
                                select={true}
                                className='inputField'
                                element={<Autocomplete
                                    onChange={handleFuelTypeChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values?.fuel_type || null}
                                    popupIcon={<PopupIcon />}
                                    name='fuel_type'
                                    loading={!extraData?.fuelType}
                                    options={extraData?.fuelType || []}
                                    getOptionLabel={type => String(type?.name || type)}
                                    isOptionEqualToValue={(option, value) => option.id === value}
                                    slotProps={{popper: { sx: { zIndex: 98 } }}}
                                    renderInput={(params) => <TextField {...params} placeholder="Select Fuel Type" />}
                                />}
                            />

                            <InputField
                                error={formik.touched?.state && formik.errors?.state}
                                label="Jurisdiction"
                                className="inputField"
                                select={true}
                                required={true}
                                element={<Autocomplete
                                    onChange={handleStateChange}
                                    loading={false}
                                    onBlur={formik.handleBlur}
                                    value={formik.values?.state || null}
                                    popupIcon={<PopupIcon />}
                                    options={options.sort((a, b) => - a.groupName.localeCompare(b.groupName)) || []}
                                    slotProps={{ popper: { sx: { zIndex: 98 } } }}
                                    renderInput={(params) => <TextField {...params} placeholder="Select Jurisdiction" />}
                                    groupBy={(option) => option.groupName}
                                    name='state'
                                    id='state'
                                    getOptionLabel={(option) => option.state || option || ''}
                                    renderGroup={(params) => (
                                        <li key={params.key}>
                                            <GroupHeader>{params.group}</GroupHeader>
                                            <ul>{params.children}</ul>
                                        </li>
                                    )}
                                />}
                            />

                            <InputField
                                onChange={handleTxblMilesChange}
                                onBlur={formik.handleBlur}
                                value={formik.values?.txbl_miles}
                                error={formik.touched?.txbl_miles && formik.errors?.txbl_miles}
                                required={true}
                                id='txbl_miles'
                                name='txbl_miles'
                                label="Txbl Miles"
                                placeholder="Enter Txbl Miles"
                                type='text'
                            />

                            <InputField
                                onChange={handleTaxPaidGalChange}
                                onBlur={formik.handleBlur}
                                value={formik.values?.tax_paid_gal}
                                error={formik.touched?.tax_paid_gal && formik.errors?.tax_paid_gal}
                                required={true}
                                id='tax_paid_gal'
                                name='tax_paid_gal'
                                label="Tax Paid Gal"
                                placeholder="Enter Tax Paid Gal"
                                type='text'
                            />

                            <Fragment>
                                { Boolean(quarterDataForEdit?.data?.length) ? (
                                    <div className="confirmActions flexBetween gap10 mx-width268-min500 mr2">
                                        <NormalBtn
                                            onClick={formik.handleSubmit}
                                            className="filled bg-lighthouse-black mx-width130"
                                        >
                                            Save Info
                                        </NormalBtn>

                                        <NormalBtn
                                            className="filled primary white mx-width130"
                                            onClick={closeQuarterRow}
                                        >
                                            Cancel
                                        </NormalBtn>
                                    </div> 
                                ) : (
                                    <NormalBtn
                                        onClick={formik.handleSubmit}
                                        className="filled bg-lighthouse-black"
                                    >
                                        Save Info
                                    </NormalBtn>
                                )}
                            </Fragment>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
});

export { EditQuarter };