import { getUserPermits, removePermit, selectPermits, selectPermitsStatus } from "@/store/slices/permits";
import { RightArrowBlackIcon } from "@/public/assets/svgIcons/RightArrowBlackIcon";
import { QUARTERLY_FILLING_ID } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
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

    // Fetch user permits on component mount.
    useEffect(() => {
        dispatch(getUserPermits());
    }, []);

    // Filter out quarterly permits from the list of permits.
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

    // Filter out inactive permits from the list of permits
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

    // Merge inactive and active permits and sort them
    const paintedPermits = useMemo(() => {
        const allPermits = [...inactivePermits, ...permits];
        return allPermits.sort((b, a) => (b?.application_type_id || b?.id) - (a?.application_type_id || a?.id));
    }, [inactivePermits]);

    // Generate Permits JSX for Each Row.
    const permitsJSX = useMemo(() => {
        return paintedPermits.map((permit, index) => (
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
                        <span>{permit?.form_id ? "Continue" : "Start"}</span>
                        <span>Filling</span>
                        <RightArrowBlackIcon />
                        <RightArrowBlackIcon />
                    </Link>
                </div>
                { Boolean(permit?.form_id) && (
                    <button className="removeHalfPermit" onClick={() => removeHalfPermit(permit?.form_id)}>
                        Remove and Start Over
                    </button>
                )}
            </div>
        ));
    }, [paintedPermits]);

    // Function to remove a half permit
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

    // Function to handle clicking on a permit
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

    // Render Loader if permits are loading
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
                    {permitsJSX}
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