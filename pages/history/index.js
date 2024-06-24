import { Accordion, AccordionDetails, AccordionSummary, CircularProgress } from "@mui/material";
import { getUserHistory, replicateOrder, selectUserHistory } from "@/store/slices/profile";
import { Fragment, useEffect, useMemo, useState } from "react";
import { selectPaymentStatus } from "@/store/slices/payment";
import { QUARTERLY_FILLING_ID } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Arrow } from "@/public/assets/svgIcons/Arrow";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import NextSvgIcon from "@/public/assets/svgIcons/NextSvgIcon";
import OrderDetails from "@/components/profile/OrderDetails";
import NormalBtn from "@/components/universalUI/NormalBtn";
import Loader from "@/components/universalUI/Loader";
import classNames from "classnames";
import Link from "next/link";

// The desired order of items.
const desiredOrder = [
    "New IFTA Registration",
    "IFTA Renewal",
    "Additional Decals",
    "Quarterly Filling"
];

function getStatusInfo(order) {
    // Completed case.
    if(order?.orderStatus === 0 && order?.permitSTATUS === '0' && !Boolean(order?.permitStatusINFO)) {
        return { className: 'completed', text: 'Completed' };
    };
    
    // Refunded case.
    if(order?.orderStatus === 0 && order?.permitSTATUS === '1' && Boolean(order?.permitStatusINFO)) {
        return { className: 'refund', text: 'Refunded' };
    };

    // Other cases.
    const statusMap = {
        '2': { className: 'red', text: 'Voided' },
        '3': { className: 'dispute', text: 'Disputed' },
        default: { className: '', text: '' },
    };
    return statusMap[order?.permitSTATUS] || statusMap.default;
};

function OrderHistoryItem({ order, index, expanded, handleChange, reContinueOrder, loadingIndex }) {
    // Get status information for the order.
    const statusInfo = getStatusInfo(order);

    // Check if the order is for quarterly filling and if the user is an admin.
    const isQuarter = order?.permit?.carrierInformation?.application_type?.id === QUARTERLY_FILLING_ID;
    const isAdmin = order?.permit?.carrierInformation?.is_admin === "1";

    return (
        <Accordion
            key={index}
            expanded={expanded === index}
            onChange={handleChange(index)}
        >
            <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                <div className={classNames("faqSquare billingHistoryRowFaqSquare", {
                    [statusInfo.className]: !!statusInfo.className,
                })} />
                <h1 className="billingHistoryRowTitle font20 lighthouse-black flex alignCenter textCenter gap5 w100">
                    <div className="font20 lighthouse-black flex alignCenter textCenter gap5">
                        <span>Order ID:</span>
                        <span>{order.order_id}</span>
                        <span>Details</span>
                        <span className={classNames('secondary printNone', { [statusInfo.className]: statusInfo.className })}>( {statusInfo.text || 'Pending'} )</span>
                    </div>


                    {order?.permitStatusINFO?.reason && ['Disputed', 'Voided', 'Refunded'].includes(statusInfo.text) && (
                        <p className='order-message'>
                            {order?.permitStatusINFO?.reason}
                        </p>
                    )}

                    {!isQuarter && !isAdmin && (
                        <button className="reContinueBtn" onClick={(e) => {
                            reContinueOrder(e, order?.permit?.carrierInformation?.form_id, index)
                        }}>
                            { loadingIndex === index ? (
                                <CircularProgress style={{ width: '20px', height: '20px', color: "#000" }}/>
                            ) : (
                                <Fragment>
                                    Duplicate Order
                                    <NextSvgIcon />
                                </Fragment>    
                            )}
                        </button>
                    )}

                    {isAdmin && (
                        <h3 className="ml-automin600 mr10 infoSubTitle textCenter weight500 font20 navyBlue">
                            <span>Created by agent</span>
                        </h3>
                    )}

                    <Arrow
                        {...(!isQuarter && { marginLeft: '0' })}
                        rotate={expanded === index ? 180 : 0}
                        stroke="#000"
                    />
                </h1>
            </AccordionSummary>
            <AccordionDetails>
                <OrderDetails data={order.permit?.carrierInformation} />
            </AccordionDetails>
        </Accordion>
    );
};

export default function History() {
    const { push } = useRouter();
    
    const dispatch = useDispatch();
    const history = useSelector(selectUserHistory);
    const paymentStatus = useSelector(selectPaymentStatus);
    
    const [ loadingIndex, setLoadingIndex ] = useState();
    const [ expanded, setExpanded ] = useState(paymentStatus === 'success' && 0);

    // Fetch user history on component mount.
    useEffect(() => {
        dispatch(getUserHistory());
    }, []);

    // Group orders by application type and reverse them.
    const historyByGroups = useMemo(() => {
        if(Array.isArray(history?.orders)) {
            return [...history?.orders].reverse().reduce((acm, order) => {
                const appType = order?.permit?.carrierInformation?.application_type?.name;
                if(acm[appType]) {
                    acm[appType].push(order);
                } else {
                    acm[appType] = [order];
                };
                return acm;
            }, {});
        };

        return {};
    }, [history]);

    // Render loader if history data is not available.
    if(!history) {
        return <Loader />;
    };

    // Handler for changing expanded panel.
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    // Handler for duplicating an order.
    const reContinueOrder = (e, form_id, index) => {
        e.stopPropagation();
        setLoadingIndex(index);

        dispatch(replicateOrder({
            callback: (permitId) => { 
                setLoadingIndex(null);
                push(`/form/carrier-info?permitId=${permitId}`);
            },
            rejectCallback: (message) => {
                setLoadingIndex(null);
                toast.error(message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            },
            body: { permitId: form_id }
        }));
    };

    // Custom sort function for ordering history groups
    const customSort = (a, b) => {
        return desiredOrder.indexOf(a) - desiredOrder.indexOf(b);
    };

    return (
        <Fragment>
            <div className="historyWrapper rowBillingHistory mPadding ">
                <div className="authContainer">
                    <h2 className="subTitle flexCenter alignCenter gap10 font20 line24 whiteBg textCenter weight500 mb20">
                        <span className="primary">Your Billing History Information</span>
                    </h2>
                    <div className="grayBG faqsContainer">
                        {!history?.orders?.length ? (
                            <div className="flexCenter alignCenter p20 primary60">
                                <h2 className="font20"> No Orders Yet</h2>
                            </div>
                        ) : (
                            Array.isArray(history?.orders) &&
                            Object.keys(historyByGroups).sort(customSort).map((groupName, index) => (
                                <Fragment key={index}>
                                    <div className="historyGroupTitle">{groupName}</div>
                                    { historyByGroups[groupName].map((el, i) => (
                                        <OrderHistoryItem
                                            key={i}
                                            order={el}
                                            index={el.id}
                                            expanded={expanded}
                                            loadingIndex={loadingIndex}
                                            handleChange={() => handleChange(el.id)}
                                            reContinueOrder={reContinueOrder}
                                        />
                                    ))}
                                </Fragment>
                            ))
                        )}
                        <div className="orderBtns flexBetween gap20">
                            <Link href="/" className="font16">
                                <NormalBtn className="prevStep gap5 primary outlined">
                                    <NextSvgIcon />
                                    Back to Home page
                                </NormalBtn>
                            </Link>
                            <Link href="/form/carrier-info" className="nextStep gap5 secondary outlined font16">
                                <NormalBtn className="gap5 bg-lighthouse-black">Fill New IFTA Form</NormalBtn>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};