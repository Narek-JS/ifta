import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useState } from "react";
import { useGetFaqsQuery } from "@/store/slices/faq";
import Loader from "@/components/universalUI/Loader";
import Fade from "react-reveal/Fade";
import Link from "next/link";
import faq from "../../data/faq.json"

export default function FAQwrapper ({ squares, limit }){
    const [ expanded, setExpanded ] = useState(false);
    const { data, isFetching } = useGetFaqsQuery()

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    if (isFetching) return <Loader />;

    return(
        <div className="faqSection mPadding" id="faqs">
            {squares ? <div className="centerSquares top mb20 flexCenter alignEnd gap10">
                <span className="largeSquare"></span>
                <span className="smallSquare"></span>
                <span className="largeSquare"></span>
            </div>: ""}
            <div className="faqHeaders textCenter">
                <h1 className="primary font20 line24 mb10">{faq.title}</h1>
                <h3 className="primary60 font16 line24">{faq.description}</h3>
            </div>
            <div className="faqsContainer mb20">
                {(Number(limit) ? data?.data.slice(0, Number(limit)) : data?.data)?.map((el, i) => (
                    <Fade key={i} bottom>
                        <Accordion expanded={expanded === i} onChange={handleChange(i)}>
                            <AccordionSummary
                                expandIcon={<div className="expandIcon bold900"><svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.8574 1.42843L8.70214 10.5713L2.14314 1.42843" stroke="#000C33" strokeWidth="3" strokeLinejoin="round"/>
                                </svg></div>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <div className="faqSquare"></div>
                                <h1 className="font20 lighthouse-black">{el.question}</h1>
                            </AccordionSummary>
                            <AccordionDetails>
                                <p className="primary60 weight400" dangerouslySetInnerHTML={{__html: el.answer}} />
                            </AccordionDetails>
                        </Accordion>
                    </Fade>
                ))}
            </div>
            {!squares ? <div className="flexColumn alignCenter gap20">
                <Link href="/faq" className="normalLink  secondary flexCenter alignCenter gap5">
                    <span />
                    <span />
                    <span />
                    <span />
                    <b className="lighthouse-black">View More FAQs</b>
                    <svg width="11" height="16" viewBox="0 0 11 16" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 2L9 8.26087L1 14" stroke="#000" strokeWidth="3"
                              strokeLinejoin="round"/>
                    </svg>
                </Link>
                <div className="centerSquares back mb20 flexCenter alignEnd gap10">
                    <span className="largeSquare"></span>
                    <span className="smallSquare"></span>
                    <span className="largeSquare"></span>
                </div>
            </div> : ""}
        </div>
    );
};