import { clearQarterRowData, getQuarterlyFillings, quarterDelete, removeQuarterPeriod, selectBaseStatesWithCanada, selectExtraData, selectPermitDetails, selectQuarterlyFillingsList, updateQuarter } from "@/store/slices/resgister";
import { QuarterlyQuestionsTable } from "./QuarterlyQuestionsTable";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getQuarterPeriodDate } from "@/utils/helpers";
import { setPopUp } from "@/store/slices/common";
import { Fragment, useMemo } from "react";
import { styled } from '@mui/system';
import InputField from "@/components/universalUI/InputField";
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";
import NormalBtn from "@/components/universalUI/NormalBtn";
import classNames from "classnames";

const GroupHeader = styled('div')(() => ({
    position: 'sticky',
    top: '-8px',
    padding: ' 4px 10px',
    color: 'black',
    backgroundColor: '#F5F5F5',
    fontWeight: '700'
}));

const QuarterlyQuestions = ({ formik, currentPeriodRange, quartersRef, index }) => {
    const quarterlyFillingsList = useSelector(selectQuarterlyFillingsList);
    const extraData = useSelector(selectExtraData);
    const allStates = useSelector(selectBaseStatesWithCanada);
    const permitDetails = useSelector(selectPermitDetails);
    const dispatch = useDispatch();

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
    }, []);

    const quarterlyFillingsListById = useMemo(() => {
        if(Array.isArray(quarterlyFillingsList)) {
            const result = quarterlyFillingsList?.find((quarterlyFilling) => quarterlyFilling.id === currentPeriodRange.id) || {};
            return result;
        };

        return [];
    }, [quarterlyFillingsList, currentPeriodRange]);

    const options = useMemo(() => {
        if(stateByCategorys) {
            const sortedStates = [
                ...stateByCategorys.usa.sort((a, b) => a.state.localeCompare(b.state)),
                ...stateByCategorys.canada.sort((a, b) => a.state.localeCompare(b.state))
            ];

            if(Boolean(quarterlyFillingsListById?.data?.length)) {
                return sortedStates.filter(state => {
                    const findStateFromSelecteds = quarterlyFillingsListById?.data.find(selectedQuarter => selectedQuarter?.state_id === state?.id)
                    return !Boolean(findStateFromSelecteds);
                });
            };
            return sortedStates;
        } else {
            return [];
        };
    }, [stateByCategorys, quarterlyFillingsListById]); 

    const handleEditCallback = (data) => {
        const newValues = {
            ...formik.values,
            ...(data?.fuel_type && { [`fuel_type${currentPeriodRange.id}`]: data.fuel_type }),
            ...(data?.state && { [`state${currentPeriodRange.id}`]: data.state }),
            ...(Boolean(data?.txbl_miles || data?.txbl_miles === 0) && { [`txbl_miles${currentPeriodRange.id}`]: data.txbl_miles }),
            ...(Boolean(data?.tax_paid_gal || data?.tax_paid_gal === 0) && { [`tax_paid_gal${currentPeriodRange.id}`]: data.tax_paid_gal }),
            [`isOperate${currentPeriodRange.id}`]: 'edit',
        };
        formik.setValues(newValues);
    };

    const handleDelete = (id) => {
        function updateQuarters() {
            dispatch(getQuarterlyFillings({
                permit_id: permitDetails?.form_id,
                callback: (data) => {
                    const quarterPeriodRange = data?.find(period => period?.id === currentPeriodRange.id);
                    if(quarterPeriodRange?.data?.length === 0) {
                        formik.setValues({
                            ...formik.values,
                            [`isOperate${currentPeriodRange.id}`]: 'no',
                        });
                    };
                }
            }));
        };

        dispatch(setPopUp({
            popUp: "removeQuarterPopup",
            popUpContent: "Are You Sure You Want to Remove This Report?",
            popUpAction: () => dispatch(quarterDelete({ id, callback: updateQuarters }))
        }));
    };

    const handleChangeOperateNo = (event) => {
        if(quarterlyFillingsListById?.data?.length) {
            dispatch(setPopUp({
                popUp: "removeQuarterPopup",
                popUpContent: "By clicking the 'Yes' button, your saved report will be removed. Are you sure you want to proceed with these changes?",
                popUpAction: () => {
                    const payload = {
                        permit_id: permitDetails?.form_id,
                        quarter_id: quarterlyFillingsListById?.id,
                        quarter_condition: '0'
                    };

                    const rejectCallback = (message = 'server Error, please try again after one minutes') => {
                        toast.error(message);
                    };

                    const callBackForDoneRemoveProcess = (response) => {
                        formik.handleChange(event);
                        dispatch(getQuarterlyFillings({ permit_id: permitDetails?.form_id }));
                        dispatch(setPopUp({}));
                    };
                    
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
    
    return (
        <div
            className="ownerOfficer"
            ref={index === 0 ? quartersRef : null}
        >
            <h2 className="subTitle font20 mb5 whiteBg textCenter weight500">
                <span className="primary flexCenter gap4">
                    Reporting IFTA miles and gallons for the {getQuarterPeriodDate(currentPeriodRange)}
                </span>
            </h2>
            <div className="ownerOfficerMain quarterlyQuestions">
                <Fragment>
                    <p className="primary mb5">
                        Did you operate in any jurisdiction this period?
                        <sup className="red"> * </sup>
                    </p>
                    <div className="radioGroup flex gap20 alignCenter">
                        <label className="flexCenter alignCenter gap5">
                            <input
                                type="radio"
                                value="yes"
                                name={`isOperate${currentPeriodRange.id}`}
                                onChange={formik.handleChange}
                                checked={['yes', 'added', 'edit'].includes(formik.values[`isOperate${currentPeriodRange.id}`])}
                            />
                            <span className="primary">Yes</span>
                        </label>
                        <label className="flexCenter alignCenter gap5">
                            <input
                                type="radio"
                                value="no"
                                name={`isOperate${currentPeriodRange.id}`}
                                onChange={handleChangeOperateNo}
                                checked={formik.values[`isOperate${currentPeriodRange.id}`] === 'no'}
                            />
                            <span className="primary">No</span>
                        </label>
                    </div>
                    <p className="err-message">
                        
                    </p>
                </Fragment>

                { Boolean(quarterlyFillingsListById?.data?.length && ['yes', 'added', 'edit'].includes(formik.values[`isOperate${currentPeriodRange.id}`])) && (
                    <QuarterlyQuestionsTable
                        quarterlyFillingsList={[...quarterlyFillingsListById?.data].map((_, index, array) => array[array.length - 1 - index])}
                        handleEditCallback={handleEditCallback}
                        handleDelete={handleDelete}
                        totalCost={quarterlyFillingsListById?.cost}
                    />
                )}

                { Boolean(quarterlyFillingsListById?.data?.length && formik.values[`isOperate${currentPeriodRange.id}`] === 'added') && (
                    <NormalBtn className="filled bg-lighthouse-black gap10 min-m-w-initial ml-auto" onClick={() => {
                        formik.setValues({
                            ...formik.values,
                            [`isOperate${currentPeriodRange.id}`]: "yes"
                        })
                    }}>
                        <span className="lighthouse-black" style={{ fontSize: '30px' }}>+</span>
                        Add another state
                    </NormalBtn>
                )}

                <div className={classNames("radioQuestion checkIrpAccount", {
                    'justifyEnd': quarterlyFillingsListById?.data?.length 
                })}>
                    { Boolean(['yes', 'edit'].includes(formik.values[`isOperate${currentPeriodRange.id}`])) && (
                        <form className="inputsContainer flex wrap alignEnd gap20 justifyEnd w100">
                            <InputField
                                error={formik.touched?.[`fuel_type${currentPeriodRange.id}`] && formik.errors?.[`fuel_type${currentPeriodRange.id}`]}
                                label="Type of fuel used"
                                required={true}
                                className='inputField'
                                element={<Autocomplete
                                    onChange={(e, value) => {
                                        formik.setValues({
                                            ...formik.values,
                                            [`fuel_type${currentPeriodRange.id}`]: value || ""
                                        })
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values?.[`fuel_type${currentPeriodRange.id}`] || null}
                                    popupIcon={<PopupIcon />}
                                    name={`fuel_type${currentPeriodRange.id}`}
                                    loading={!extraData?.fuelType}
                                    options={extraData?.fuelType || []}
                                    getOptionLabel={type => String(type?.name || type)}
                                    isOptionEqualToValue={(option, value) => option.id === value}
                                    slotProps={{popper: {sx: {zIndex: 98}}}}
                                    renderInput={(params) => <TextField {...params} placeholder="Select Fuel Type"/>}
                                />}
                            />

                            <InputField
                                error={formik.touched?.[`state${currentPeriodRange.id}`] && formik.errors?.[`state${currentPeriodRange.id}`]}
                                label="Jurisdiction"
                                className="inputField"
                                required={true}
                                element={<Autocomplete
                                    onChange={(e, state) => {
                                        formik.setValues({
                                            ...formik.values,
                                            [`state${currentPeriodRange.id}`]: state || ""
                                        })
                                    }}
                                    loading={false}
                                    onBlur={formik.handleBlur}
                                    value={formik.values?.[`state${currentPeriodRange.id}`] || null}
                                    popupIcon={<PopupIcon />}
                                    options={options.sort((a, b) => - a.groupName.localeCompare(b.groupName)) || []}
                                    slotProps={{popper: {sx: {zIndex: 98}}}}
                                    renderInput={(params) => <TextField {...params} placeholder="Select Jurisdiction"/>}
                                    groupBy={(option) => option.groupName}
                                    name={`state${currentPeriodRange.id}`}
                                    id={`state${currentPeriodRange.id}`}
                                    getOptionLabel={(option) => {
                                        return option.state || option || '';
                                    }}
                                    renderGroup={(params) => (
                                        <li key={params.key}>
                                            <GroupHeader>{params.group}</GroupHeader>
                                            <ul>{params.children}</ul>
                                        </li>
                                    )}
                                />}
                            />

                            <InputField
                                onChange={(event) => {
                                    let string = event.target.value;
                                    if ((/^[0-9]+(\.[0-9]*)?$/.test(string) && string.length < 7) || string === '') {
                                        formik.setValues({
                                            ...formik.values,
                                            [`txbl_miles${currentPeriodRange.id}`]: string
                                        });
                                    };
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values?.[`txbl_miles${currentPeriodRange.id}`]}
                                error={formik.touched?.[`txbl_miles${currentPeriodRange.id}`] && formik.errors?.[`txbl_miles${currentPeriodRange.id}`]}
                                required={true}
                                id={`txbl_miles${currentPeriodRange.id}`}
                                name={`txbl_miles${currentPeriodRange.id}`}
                                label="Txbl Miles"
                                placeholder="Enter Txbl Miles"
                                type='text'
                            />

                            <InputField
                                onChange={(event) => {
                                    let string = event.target.value;
                                    if ((/^[0-9]+(\.[0-9]*)?$/.test(string) && string.length < 7) || string === '') {
                                        formik.setValues({
                                            ...formik.values,
                                            [`tax_paid_gal${currentPeriodRange.id}`]: string
                                        });
                                    };
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values?.[`tax_paid_gal${currentPeriodRange.id}`]}
                                error={formik.touched?.[`tax_paid_gal${currentPeriodRange.id}`] && formik.errors?.[`tax_paid_gal${currentPeriodRange.id}`]}
                                required={true}
                                id={`tax_paid_gal${currentPeriodRange.id}`}
                                name={`tax_paid_gal${currentPeriodRange.id}`}
                                label="Tax Paid Gal"
                                placeholder="Enter Tax Paid Gal"
                                type='text'
                            />

                            <Fragment>
                                { quarterlyFillingsListById?.data?.length ? (
                                    <div className="confirmActions flexBetween gap10">
                                        <NormalBtn
                                            onClick={formik.handleSubmit}
                                            className="filled bg-lighthouse-black"
                                        >
                                            Save Info
                                        </NormalBtn>

                                        <NormalBtn
                                            className="filled primary white"
                                            onClick={() => {
                                                formik.resetForm();
                                                formik.setFieldValue(`isOperate${currentPeriodRange.id}`, 'added');
                                                dispatch(clearQarterRowData());
                                            }}
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

                {/* <p className="sec-err-message">invalide section error</p> */}
            </div>
        </div>
    );
};

export { QuarterlyQuestions };