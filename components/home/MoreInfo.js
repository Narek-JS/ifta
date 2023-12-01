import moreInfo from "@/data/moreInfo.json"
import Fade from "react-reveal/Fade";
import Link from "next/link";

export default function MoreInfo () {

    return(
        <div className="moreInfo mPadding">
            <div className="infoHeaders flexColumn alignCenter">
                <div className="centerSquares mb20 flexCenter alignEnd gap10">
                    <span className="largeSquare"></span>
                    <span className="smallSquare"></span>
                    <span className="largeSquare"></span>
                </div>
                <h1 className="primary font32 weight500 line40 mb10">{moreInfo.title}</h1>
                <h3 className="lighthouse-black-80 font20 weight500 mb20">{moreInfo.description}</h3>
                <div className="moreInfoCards mb20">
                    {moreInfo.cards.map((el, i)=> (
                        <Fade key={i} bottom delay={i%3*300}>
                            <div className="moreInfoCard">
                                <div className="iconTitle flexCenter alignCenter gap10">
                                    <div dangerouslySetInnerHTML={{__html: el.icon}}></div>
                                    <h2 className="lighthouse-black font20 weight500 line34">{el.title}</h2>
                                </div>
                                <p className="primary80 line28">
                                    {el.description}
                                </p>
                            </div>
                        </Fade>
                    ))}
                </div>
                <div className="textCenter">
                    <Link href="/about-us" className="normalLink  secondary flexCenter alignCenter gap5">
                        <span />
                        <span />
                        <span />
                        <span />
                        <b className="lighthouse-black">Read More About Us</b>
                        <svg
                            width="11"
                            height="16"
                            viewBox="0 0 11 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 2L9 8.26087L1 14"
                                stroke="#000"
                                strokeWidth="3"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}