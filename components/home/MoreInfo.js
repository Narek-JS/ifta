import { AnimationScuareBoxes, CenterSquares } from "../universalUI/AnimationBoxes";
import { RightArrowIcon } from "@/public/assets/svgIcons/RightArrowIcon";
import { memo } from "react";
import Link from "next/link";
import moreInfo from "@/data/moreInfo.js"

export default memo(function MoreInfo () {

    // Mapping through the cards data to create JSX elements.
    const cardsJSX = moreInfo.cards.map((el, i) => (
        <div key={i} className="moreInfoCard">
            <div className="iconTitle flexCenter alignCenter gap10">
                <div dangerouslySetInnerHTML={{__html: el.icon}} />
                <h2 className="lighthouse-black font20 weight500 line34">{el.title}</h2>
            </div>
            <p className="primary80 line28">{el.description}</p>
        </div>
    ));

    // Render the MoreInfo component.
    return (
        <div className="moreInfo mPadding">
            <div className="infoHeaders flexColumn alignCenter">
                <CenterSquares className="centerSquares mb20 flexCenter alignEnd gap10" />
                <h1 className="primary font32 weight500 line40 mb10">{moreInfo.title}</h1>
                <h3 className="lighthouse-black-80 font20 weight500 mb20">{moreInfo.description}</h3>
                <div className="moreInfoCards mb20">{cardsJSX}</div>
                <div className="textCenter">
                    <Link href="/about-us" className="normalLink  secondary flexCenter alignCenter gap5">
                        <AnimationScuareBoxes />
                        <b className="lighthouse-black">Read More About Us</b>
                        <RightArrowIcon />
                    </Link>
                </div>
            </div>
        </div>
    );
});