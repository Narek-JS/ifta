import {
    clearAllQuarters,
    getAllQuarters,
    getBaseStates,
    getExtraData, 
    selectAllQuarters,
    selectAllQuartersStatus,
    selectBaseStatesWithCanada,
    selectExtraData
} from "@/store/slices/resgister";
import { QuartersTableByYear } from "@/components/quarters/QuartersTableByYear";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Arrow } from "@/public/assets/svgIcons/Arrow";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/universalUI/Loader";

const Quarters = () => {
    const dispatch = useDispatch();
    
    const allQuartersStatus = useSelector(selectAllQuartersStatus);
    const allStates = useSelector(selectBaseStatesWithCanada);
    const allQuarters = useSelector(selectAllQuarters);
    const extraData = useSelector(selectExtraData);

    const [expanded, setExpanded] = useState(0);

    useEffect(() => {
        if(allQuarters === null && allQuartersStatus !== 'failed') {
            dispatch(getAllQuarters({
                rejectCallback: (message = 'Server Error') => toast.error(message, { position: toast.POSITION.TOP_RIGHT })
            }));
        };

        if(allStates === undefined) {
            dispatch(getBaseStates());
        };

        if(extraData === null) {
            dispatch(getExtraData(1));
        };

        return () => {
            dispatch(clearAllQuarters());
        };
    }, []);

    const allQuartersWithYearGroup = useMemo(() => {
        if(Array.isArray(allQuarters?.data)) {
            return allQuarters.data.reduce((acc, quarter) => {
                if(Array.isArray(acc?.[quarter.year])) {
                    acc[quarter.year].push(quarter);
                } else {
                    acc[quarter.year] = [quarter];
                };
                return acc;
            }, {});
        };

        return {};
    }, [allQuarters]);

    const handleChange = (panel) => () => {
        if(expanded === panel) {
            return setExpanded(false);
        };
        setExpanded(panel);
    };

    if(allQuartersStatus === 'pending') {
        return <Loader />;
    };

    const keysOfAllQuarters = Object.keys(allQuartersWithYearGroup);

    return (
        <div className="historyWrapper mPadding">
            <div className="authContainer">
                <h2 className="subTitle flexCenter alignCenter gap10 font20 line24 whiteBg textCenter weight500 mb20">
                    <span className="primary">Your Quarterly Fillings</span>
                </h2>

                <div className="wrapperQuartersGroupByYear formPage">
                    { keysOfAllQuarters.length && (
                        keysOfAllQuarters.map((quarterYear, index) => (
                            <Accordion
                                key={index}
                                expanded={expanded === index}
                                onChange={handleChange(index)}
                            >
                                <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                                    <h1 className="font20 primary flex alignCenter textCenter gap5 w100" >
                                        <div className='faqSquare black' />
                                        <span>{quarterYear} Tax Returns </span>
                                        <Arrow rotate={expanded === index ? 180 : 0} stroke="#000" />
                                    </h1>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <QuartersTableByYear
                                        quarters={Array.isArray(allQuartersWithYearGroup[quarterYear]) ? allQuartersWithYearGroup[quarterYear] : []}
                                        year={quarterYear}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quarters;