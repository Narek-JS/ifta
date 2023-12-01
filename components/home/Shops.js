import Link from "next/link";
import Fade from "react-reveal/Fade";
import { ImageLoader } from "@/utils/helpers";
import Image from "next/image";
import shopsInfo from "../../data/shopsInfo.json"

export default function Shops() {

    return (
        <div className="shops mPadding">
            <div className="shopsMain">
                <Fade left>
                    <div className="squares first">
                        <span className="largeSquare top"></span>
                        <span className="smallSquare"></span>
                        <span className="largeSquare left"></span>
                    </div>
                </Fade>
                <div className="topPart flexBetween gap15 mb30">
                    <div className="texts primary">
                        <Fade left>
                            <h1 className="font32 mb15 line40 weight500">Your One-Stop Shop for All Things IFTA!</h1>
                            <h3 className="lighthouse-black-80 font24 mb15 weight500">Welcome to IFTA.ONLINE</h3>
                            <p className="font14 primary80 line28 mb15">Our team has helped truckers from all over the
                                country
                                sign up for the IFTA for over a
                                decade. We’ll make your experience filing for the IFTA simple and straightforward!
                            </p>
                        </Fade>
                        <div className="lists flexBetween alignCenter gap15">
                            <Fade bottom>
                                <ul className="textsList flexColumn gap30">
                                    {(shopsInfo?.steps1 || []).map((text, i) => (
                                        <li className="flex alignCenter gap5 font16 primary lh4" key={i}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_2_122)">
                                                    <circle cx="12" cy="12" r="12" fill="#FFBF00"/>
                                                    <path d="M4 11L11 17.5L19 7" stroke="#F4F4F3" strokeWidth="2"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2_122">
                                                        <rect width="24" height="24" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </Fade>
                            <Fade bottom delay={300}>
                                <ul className="textsList flexColumn gap30">
                                    {(shopsInfo?.steps2 || []).map((text, i) => (
                                        <li className="flex alignCenter font16 gap5 primary lh4" key={i}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_2_122)">
                                                    <circle cx="12" cy="12" r="12" fill="#FFBF00"/>
                                                    <path d="M4 11L11 17.5L19 7" stroke="#F4F4F3" strokeWidth="2"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2_122">
                                                        <rect width="24" height="24" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </Fade>
                        </div>
                    </div>
                    <Fade right>
                        <div className="iftaOffer">
                            <div className="imgArea">
                                <Image src="/assets/images/distance.webp" quality={100} width={240} height={80}
                                       loader={ImageLoader}
                                       alt="distance"/>
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
                                    ONE STOP SHOP
                                    FOR ALL YOUR
                                    <span className="lighthouse-black-80"> IFTA NEEDS</span>
                                </h2>
                            </div>
                            <div className="offerEnd lighthouse-black font14 line28">
                                IFTA.Online is here to help you get everything you need to
                                stay in compliance. Get your IFTA decals quickly and easily with us!
                            </div>
                        </div>
                    </Fade>
                </div>
                <div className="bottomPart">
                    {shopsInfo.shopsData.map((el, i) => (
                        <Fade key={i} bottom delay={i % 3 * 300}>
                            <div className="solutionCard flexColumn alignCenter gap15">
                                <div className="flexCenter alignCenter gap5">
                                    <div style={{ maxHeight: '55px' }} dangerouslySetInnerHTML={{__html: el.icon}}></div>
                                    <p className="lighthouse-black font20 weight500 line34">{el.title} </p>
                                </div>
                                <p className="lighthouse-black-80">
                                    The IFTA helps states and provinces spread their fuel tax revenue across
                                    jurisdictions. If you’re a trucker who leaves your base state often, you’ll want to
                                    sign up for the IFTA. </p>
                                {/* <Link href={el.link} className="normalLink secondary flexCenter alignCenter gap5">
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <b> See More</b>
                                    <svg width="11" height="16" viewBox="0 0 11 16" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 2L9 8.26087L1 14" stroke="#FFBF00" strokeWidth="3"
                                              strokeLinejoin="round"/>
                                    </svg>
                                </Link> */}
                            </div>
                        </Fade>
                    ))}
                </div>
                <Fade right>
                    <div className="squares last">
                        <span className="largeSquare right"></span>
                        <span className="smallSquare"></span>
                        <span className="largeSquare bottom"></span>
                    </div>
                </Fade>
            </div>
        </div>
    )
}