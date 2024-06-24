import { AnimationScuareBoxes, CenterSquares } from "../universalUI/AnimationBoxes";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { RightArrowIcon } from "@/public/assets/svgIcons/RightArrowIcon";
import { Arrow } from "@/public/assets/svgIcons/Arrow";
import { useState } from "react";
import Link from "next/link";

export default function FAQwrapper({ squares, faqs }){
    const [ expanded, setExpanded ] = useState(false);

    // Function to handle Accordion panel expansion.
    const handleChange = panelIndex => (event, isExpanded) => {
        setExpanded(isExpanded ? panelIndex : false);
    };

    return (
        <div className="faqSection mPadding" id="faqs">
            {squares && <CenterSquares className="centerSquares top mb20 flexCenter alignEnd gap10"/>}
            <div className="faqHeaders textCenter">
                <h1 className="primary font20 line24 mb10">FAQ's</h1>
                <h3 className="primary60 font16 line24">Frequently Asked Questions</h3>
            </div>
            <div className="faqsContainer mb20">
                { faqs?.map((el, i) => (
                    <Accordion key={el.id} expanded={expanded === i} onChange={handleChange(i)}>
                        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<Arrow />}>
                            <div className="faqSquare" />
                            <h1 className="font20 lighthouse-black">{el.question}</h1>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="primary60 weight400" dangerouslySetInnerHTML={{__html: el.answer}} />
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
            {!squares && (
                <div className="flexColumn alignCenter gap20">
                    <Link href="/faq" className="normalLink secondary flexCenter alignCenter gap5">
                        <AnimationScuareBoxes />
                        <b className="lighthouse-black">View More FAQs</b>
                        <RightArrowIcon />
                    </Link>
                    <CenterSquares className="centerSquares back mb20 flexCenter alignEnd gap10" />
                </div>
            )}
        </div>
    );
};