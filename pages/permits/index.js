import { getUserPermits, removePermit, selectPermits, selectPermitsStatus } from "@/store/slices/permits";
import { QUARTERLY_FILLING_ID } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useMemo } from "react";
import { setPopUp } from "@/store/slices/common";
import NextSvgIcon from "@/public/assets/svgIcons/NextSvgIcon";
import NormalBtn from "@/components/universalUI/NormalBtn";
import Loader from "@/components/universalUI/Loader";
import Link from "next/link";

const Permits = () => {
    const dispatch = useDispatch();
    const permitsAndQuarters = useSelector(selectPermits);
    const permitsStatus = useSelector(selectPermitsStatus);
    const user = useSelector(state => state?.auth?.user);

    useEffect(() => {
        dispatch(getUserPermits());
    }, []);

    const permits = useMemo(() => {
        if(Array.isArray(permitsAndQuarters)) {
            return permitsAndQuarters.reduce((acc, permit) => {
                if(permit.application_type_id !== QUARTERLY_FILLING_ID) {
                    acc.push(permit);
                };
                
                return acc;
            }, []);
        };

        return [];
    }, [permitsAndQuarters]);

    const inactivePermits = useMemo(() => {
        const initialPermits = [
            {
                id: 1,
                name: "New IFTA Registration",
            },
            {
                id: 2,
                name: "IFTA Renewal",
            },
            {
                id: 4,
                name: "Additional Decals",
            },
        ];

        return initialPermits.filter((initialPermit) => {
            const isThereActiveSamePermit = permits.find(permit => permit?.application_type_id === initialPermit.id); 
            return !Boolean(isThereActiveSamePermit);
        });
    }, [permits]);

    const paintedPermits = useMemo(() => {
        const allPermits = [...inactivePermits, ...permits];
        return allPermits.sort((b, a) => (b?.application_type_id || b?.id) - (a?.application_type_id || a?.id));
    }, [inactivePermits]);

    const removeHalfPermit = (permitId) => {
        dispatch(setPopUp({
            popUp: "removeQuarterPopup",
            popUpContent: "You are about to erase the application that has not been finished. Would you like to proceed?",
            popUpAction: () => {
                dispatch(removePermit({
                    permitId,
                    callback: () => {
                        dispatch(getUserPermits());
                    }
                }));
            }
        }));
    };

    const handelToPermitClick = (permit) => {
        if(!permit?.form_id) {
            localStorage.setItem("registerData", JSON.stringify({
                email: user?.email || "",
                phone: user?.phone || "",
                application_type: permit?.application_type || permit || "",
                state: "",
                fromPermits: true
            }));
        };
    };

    if(permitsStatus === '' || permitsStatus === 'panding') {
        return <Loader />;
    };

    return (
        <div className="historyWrapper permitWrapper mPadding">
            <div className="authContainer">
                <h2 className="subTitle flexCenter alignCenter gap10 font20 line24 whiteBg textCenter weight500 mb20">
                    <span className="primary">Start Your IFTA Applications</span>
                </h2>
                <div className="grayBG faqsContainer">
                    {paintedPermits.map((permit, index) => {
                        return (
                            <div className="permitLine " key={permit?.id || index}>
                                <div className="permitLine">
                                    <div className='faqSquare black' />
                                    <h1 className="font20 primary flex alignCenter textCenter gap5 " >
                                        <span className="weight400">
                                            {permit?.application_type?.name || permit?.name}
                                        </span>
                                        { permit?.application_type?.id === QUARTERLY_FILLING_ID && (
                                            <span className="tax">
                                                { permit?.quarter?.name }. { permit?.quarter?.year }
                                            </span>
                                        )}
                                    </h1>
                                    <Link
                                        href={`/form/carrier-info${permit?.form_id ? `?permitId=${permit?.form_id}` : ''}`}
                                        className="toPermit"
                                        onClick={() => handelToPermitClick(permit)}
                                    >
                                        {permit?.form_id ? (
                                            <Fragment>
                                                <span>Continue</span>
                                                <span>Filling</span>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <span>Start</span>
                                                <span>Filling</span>
                                            </Fragment>
                                        )}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14" fill="none">
                                            <path d="M4.76316 0H0.5L5.23684 7L0.5 14H4.76316L9.5 7L4.76316 0Z" fill="black"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14" fill="none">
                                            <path d="M4.76316 0H0.5L5.23684 7L0.5 14H4.76316L9.5 7L4.76316 0Z" fill="black"/>
                                        </svg>
                                    </Link>
                                </div>
                                { Boolean(permit?.form_id) && (
                                    <button className="removeHalfPermit" onClick={() => removeHalfPermit(permit?.form_id)}>
                                        Remove and Start Over
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    <div className="orderBtns flexBetween gap20">
                        <Link href="/" className="font16">
                            <NormalBtn className="prevStep gap5 primary outlined">
                                <NextSvgIcon />
                                Back to Home page
                            </NormalBtn>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Permits;