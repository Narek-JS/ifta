import Link from "next/link";
import {Drawer} from "@mui/material";
import {useState} from "react";
import RegisterForm from "@/components/home/RegisterForm";
import PhoneSvgIcon from "@/public/assets/svgIcons/PhoneSvgIcon";
import EmailSvgIcon from "@/public/assets/svgIcons/EmailSvgIcon";
import { IFTA_EMAIL } from "@/utils/constants";

export default function TopPanel({ topPanel, width, transparent}) {
    const [iftaPopUp, setIftaPopUp] = useState(false);

    const handleClose = () => {
        setIftaPopUp(false)
    }

    return (
        <div ref={topPanel} className={`topPanel mPadding flex gap40 alignCenter ${transparent === 1 ? "": "staticTopPanel"}`}>
            <div className="getIftaBtn secondary flexCenter alignCenter gap10" onClick={() => setIftaPopUp(true)}>
                Get IFTA
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_83_6455)">
                        <circle cx="12" cy="12" r="12" fill="#FFBF00"/>
                        <path d="M18 8L11.7391 16L6 8" stroke="#FDFDFF" strokeWidth="2" strokeLinejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_83_6455">
                            <rect width="24" height="24" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>
            {width < 1024 ? <Drawer
                className="mobileQuoteDrawer"
                anchor="top"
                open={iftaPopUp}
                onClose={handleClose}
            >
                <div className="topPanel quote-drawer-top flexCenter">
                    <div className="getIftaBtn secondary flexCenter alignCenter gap10"
                         onClick={() => setIftaPopUp(false)}>
                        Get IFTA
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_83_5652)">
                                <circle cx="12" cy="12" r="12" fill="#FFBF00"/>
                                <path d="M6 16L12.2609 8L18 16" stroke="#FDFDFF" strokeWidth="2"
                                      strokeLinejoin="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_83_5652">
                                    <rect width="24" height="24" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>
                <div className="getIftaMobileMain flexColumn alignCenter gap20">
                    <div className="centerSquares back mb20 flexCenter alignEnd gap10"><span
                        className="largeSquare"></span><span className="smallSquare"></span><span
                        className="largeSquare"></span>
                    </div>
                    <h1 className="font24 white weight500">Your One-Stop Shop for All Things IFTA!</h1>
                    <h3 className="font18 secondary weight500">Welcome to IFTA.ONLINE</h3>
                    <RegisterForm mobile={true} />
                </div>
            </Drawer> : ""}
            <Link href="tel: +8003412870" className="contactItem flexBetween alignCenter gap5 primary">
                <PhoneSvgIcon/>
                <b className="font18 weight500">( 800 ) 341 - 2870</b>
            </Link>
            <Link className="primary contactItem " href="/category/blogs">
                Blogs
            </Link>
            <Link className="primary contactItem " href="/category/news">
                News
            </Link>
            <Link href={`mailto: ${IFTA_EMAIL}`} className="contactItem flexBetween alignCenter gap5 primary">
                <EmailSvgIcon/>
                <b className="font18 weight500">{IFTA_EMAIL}</b>
            </Link>
        </div>
    )
}