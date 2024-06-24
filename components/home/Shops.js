import { AnimationScuareBoxes, LeftTopCornerScuares, RightBottomCornerScuares } from "../universalUI/AnimationBoxes";
import { RightArrowIcon } from "@/public/assets/svgIcons/RightArrowIcon";
import { CheckMarkIcon } from "@/public/assets/svgIcons/CheckMarkIcon";
import { ImageLoader } from "@/utils/helpers";
import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import shopsInfo from "@/data/shopsInfo.js"

export default memo(function Shops() {

    // Map over steps1 array to create JSX for the first list of steps
    const textList1JSX = shopsInfo.steps1.map((text, i) => (
        <li className="flex alignCenter gap5 font16 primary lh4" key={i}>
            <CheckMarkIcon />
            {text}
        </li>
    ));

    // Map over steps2 array to create JSX for the second list of steps
    const textList2JSX = shopsInfo.steps2.map((text, i) => (
        <li className="flex alignCenter font16 gap5 primary lh4" key={i}>
            <CheckMarkIcon />
            {text}
        </li>
    ));

    // Map over shopsData array to create JSX for each shop's data
    const shopsDataJSX = shopsInfo.shopsData.map((el, i) => (
        <div key={i} className="solutionCard flexColumn alignCenter gap15">
            <div className="flexCenter alignCenter gap5">
                <div className="max-h-55" dangerouslySetInnerHTML={{__html: el.icon}}></div>
                <p className="lighthouse-black font20 weight500 line34">{el.title} </p>
            </div>
            <p className="lighthouse-black-80">{el?.content}</p>
            <Link href={el.link} className="normalLink secondary flexCenter alignCenter gap5">
                <AnimationScuareBoxes />
                <b> See More</b>
                <RightArrowIcon />
            </Link>
        </div>
    ));

    // Return the JSX structure for the Shops component
    return (
        <div className="shops mPadding">
            <div className="shopsMain">
                <LeftTopCornerScuares />
                <div className="topPart flexBetween gap15 mb30">
                    <div className="texts primary">
                        <h1 className="font32 mb15 line40 weight500">Your One-Stop Shop for All Things IFTA!</h1>
                        <h3 className="lighthouse-black-80 font24 mb15 weight500">Welcome to IFTA.ONLINE</h3>
                        <p className="font14 primary80 line28 mb15">Our team has helped truckers from all over the
                            country sign up for the IFTA for over a
                            decade. We’ll make your experience filing for the IFTA simple and straightforward!
                        </p>
                        <div className="lists flexBetween alignCenter gap15">
                            <ul className="textsList flexColumn gap30">
                                {textList1JSX}
                            </ul>
                            <ul className="textsList flexColumn gap30">
                                {textList2JSX}
                            </ul>
                        </div>
                    </div>
                    <div className="iftaOffer">
                        <div className="imgArea">
                            <Image
                                src="/assets/images/distance.webp"
                                quality={100}
                                width={240}
                                height={80}
                                loader={ImageLoader}
                                alt="distance"
                            />
                        </div>
                        <div className="smallLogoPart flexBetween alignCenter gap30">
                            <Image
                                src="/assets/images/smallLogo.png"
                                quality={100}
                                width={110}
                                height={110}
                                loader={ImageLoader}
                                alt="small logo"
                            />
                            <h2 className="primary weight500 font32 line40">
                                ONE STOP SHOP FOR ALL YOUR
                                <span className="lighthouse-black-80"> IFTA NEEDS</span>
                            </h2>
                        </div>
                        <div className="offerEnd lighthouse-black font14 line28">
                            IFTA.Online is here to help you get everything you need to
                            stay in compliance. Get your IFTA decals quickly and easily with us!
                        </div>
                    </div>
                </div>
                <div className="bottomPart"> {shopsDataJSX} </div>
                <RightBottomCornerScuares />
            </div>
        </div>
    );
});