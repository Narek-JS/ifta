import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { getUserHistory, selectUserHistory } from "@/store/slices/profile";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { Tooltip } from "@/components/universalUI/Tooltip";
import OrderDetails from "@/components/profile/OrderDetails";
import NormalBtn from "@/components/universalUI/NormalBtn";
import NextSvgIcon from "@/public/assets/svgIcons/NextSvgIcon";
import Link from "next/link";
import classNames from "classnames";
import { selectPaymentStatus, setPaymentStatus } from "@/store/slices/payment";
import { setPopUp } from "@/store/slices/common";

function getStatusInfo(order) {
    // Completed case.
    if(order?.orderStatus === 0 && order?.permitSTATUS === '0' && !Boolean(order?.permitStatusINFO)) {
        return { className: 'completed', text: 'Completed' }; // replace
    };
    
    if(order?.orderStatus === 0 && order?.permitSTATUS === '1' && Boolean(order?.permitStatusINFO)) {
        return { className: 'refund', text: 'Refunded' }; // replace
    }

    const statusMap = {
        '2': { className: 'red', text: 'Voided' },
        '3': { className: 'dispute', text: 'Disputed' },
        default: { className: '', text: '' },
    };
    return statusMap[order?.permitSTATUS] || statusMap.default;
};

function OrderHistoryItem({ order, index, expanded, handleChange }) {
    const statusInfo = getStatusInfo(order);

    return (
        <Accordion
            key={index}
            expanded={expanded === index}
            onChange={handleChange(index)}
        >
            <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                <div
                    className={classNames("faqSquare", {
                        [statusInfo.className]: !!statusInfo.className,
                    })}
                />
                <h1
                    className={classNames(
                        "font20 secondary flex alignCenter textCenter gap5 w100",
                        [statusInfo.className] && statusInfo.className
                    )}
                >
                        Order ID: <span className={classNames(".secondary", statusInfo.className)}> {order.order_id} </span>
                        <span className={classNames("weight500 .secondary", statusInfo.className)}> Details </span>
                        <span>( {statusInfo.text || 'Pending'} )</span>
                        {order?.permitStatusINFO?.reason && ['Disputed', 'Voided', 'Refunded'].includes(statusInfo.text) && (
                            <p className='order-message'>
                                {order?.permitStatusINFO?.reason}
                            </p>
                        )}
                    <svg
                        width="18"
                        height="13"
                        viewBox="0 0 18 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            marginLeft: 'auto',
                            transform: `rotate(${expanded === index ? 180 : 0}deg)`
                        }}
                    >
                        <path
                            d="M15.8574 1.42843L8.70214 10.5713L2.14314 1.42843"
                            stroke={
                                statusInfo.className === "completed"
                                ? "#00B74A"
                                : statusInfo.className === "refund"
                                ? "#001D4A"
                                : statusInfo.className === "red"
                                ? "red"
                                : statusInfo.className === "dispute"
                                ? "#F59720"
                                : "#FFBF00"
                            }
                            strokeWidth="3"
                            strokeLinejoin="round"
                        />
                    </svg>
                </h1>
            </AccordionSummary>
            <AccordionDetails>
                <OrderDetails data={order.permit?.carrierInformation} />
            </AccordionDetails>
        </Accordion>
    );
};

export default function History() {
    const dispatch = useDispatch();
    const history = useSelector(selectUserHistory);
    const paymentStatus = useSelector(selectPaymentStatus);
    const [expanded, setExpanded] = useState(paymentStatus === 'success' && 0);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        const clearPaymentStatus = () => {
            if(paymentStatus === 'success') {
                dispatch(setPopUp({ popUp: "payment-success" }));
                dispatch(setPaymentStatus(''));
            };
        };
        dispatch(getUserHistory(clearPaymentStatus));
    }, []);



    return (
        <Fragment>
            {paymentStatus === 'success' && (
                <script
                    dangerouslySetInnerHTML = {{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){
                                dataLayer.push(arguments);
                            }
                            gtag('event', 'conversion', { 
                                'send_to': 'AW-414658176/L5bGCMOCr_EYEIDd3MUB',
                                'transaction_id': ''
                            });
                        `,
                    }}
                />
            )}
            <div className="historyWrapper mPadding">
                <div className="authContainer">
                    <h2
                        className="subTitle flexCenter alignCenter gap10 font20 line24 whiteBg textCenter weight500 mb20"
                        onClick={() => 'nothing happens'}
                    >
                        <span className="secondary">Your Billing History </span>
                        <span className="primary"> Information</span>
                        <Tooltip content='In this page you can see your all IFTA Registrations forms details'>
                            <span className="carrierTooltipRoot">!</span>
                        </Tooltip>
                    </h2>
                    <div className="grayBG faqsContainer">
                        {!history?.length ? (
                            <div className="flexCenter alignCenter p20 primary60">
                                <h2 className="font20"> No Orders Yet</h2>
                            </div>
                        ) : (
                            Array.isArray(history) &&
                            Array.from(history)
                            .reverse()
                            .map((el, i) => (
                                <OrderHistoryItem
                                    key={i}
                                    order={el}
                                    index={i}
                                    expanded={expanded}
                                    handleChange={handleChange}
                                />
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
                                <NormalBtn className="gap5 secondary outlined">Fill New IFTA Form</NormalBtn>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};