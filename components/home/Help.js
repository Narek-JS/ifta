import {useEffect, useRef, useState} from "react";
import {useWindowSize} from "@/utils/hooks/useWindowSize";
import {useRouter} from "next/router";
import {ImageLoader} from "@/utils/helpers";
import Link from "next/link";
import Fade from "react-reveal/Fade";
import Image from "next/image";

export default function Help({ width: titleWidth }) {
    const ref = useRef(null);
    const {pathname} = useRouter();
    const { width } = useWindowSize();
    const [position, setPosition] = useState(0)

    useEffect(() => {
        if(pathname === "/"){
            const handleScroll = () => {
                const pos = ref.current.getBoundingClientRect().top + document.body.getBoundingClientRect().top;
                setPosition(pos)
            };
            if (ref) {
                handleScroll();
                window.addEventListener("scroll", handleScroll);
                return () => {
                    window.removeEventListener("scroll", handleScroll);
                };
            }
        }
    }, [ref, pathname]);

    return (
        <div className="helpSection flexColumn flexBetween" >
            <Image
                className="bgi"
                src="/assets/images/help.webp"
                quality={100}
                width={240}
                height={80}
                loader={ImageLoader}
                alt="distance"
                priority
            />
            <Fade top>
                <p className="white font16 textCenter">If you need to file your quarterly return, just call our team today!
                    We’d be happy to help you file your
                    IFTA returns in no time at all.
                </p>
            </Fade>
            <div
                className="helpTitle"
                ref={ref}
                style={{
                    transform: `translateX(${(-position / 5)< (width *600)/1920 ? (-position / 5): (width *600)/1920}px)`,
                    ...(titleWidth && {width: titleWidth})
                }}>
               <Fade left>
                   <div className='flexCenter alignEnd'>
                       <h1 className="secondary">Your Helpful Team for All Things IFTA!</h1>
                       <svg width="278" height="96" viewBox="0 0 278 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M145.452 75.4619H70.8966" stroke="#FFBF00" strokeOpacity="0.3" strokeWidth="2"
                                 strokeLinejoin="round"/>
                           <path
                               d="M274.759 58.7627C279.802 58.7627 274.759 81.5 274.759 81.5H271C264.5 65 247.5 71 246.8 81.5V76.0377H235.151V78.3411H243.888C245.752 81.1051 244.665 84.0994 243.888 85.2511H213.6V78.3411H220.589C222.453 77.4197 221.366 76.4216 220.589 76.0377H204.863C196.475 67.285 187.813 72.3908 184.706 76.0377C183.309 77.8804 182.62 76.8544 181.794 76.0377C172.941 67.285 164.565 72.3908 161.653 76.0377H155.353V65.6727H167.585C170.381 66.1334 170.692 64.3291 170.497 63.3694H147.781V76.0377H145.451V71.4311H70.3133V76.0377C69.1484 76.0377 61.5764 64.521 49.3446 76.0377H47.5972C38.2778 66.2485 28.7641 72.5827 25.4635 76.0377C24.0656 75.5771 24.8811 72.7747 25.4635 71.4311C24.5316 69.5884 22.357 70.6633 21.3863 71.4311L1 80.0686L21.3863 65.6727H133V57.611H178.5C181.296 62.6784 177.136 63.3694 175 63.3694V65.6727H210.105V25.3643H212.435V30.5468C212.435 30.5468 229.571 31.2762 236.316 37.4568C243.061 43.6374 246.8 58.7627 246.8 58.7627H274.759Z"
                               fill="#FFBF00" stroke="#FFBF00"/>
                           <path d="M233.404 43.2152H230.492V49.5494H233.404V52.4286H214.765V40.9119H233.404V43.2152Z"
                                 fill="#2B2B2E" stroke="#FFBF00" strokeLinejoin="round"/>
                           <circle cx="11" cy="11" r="9" transform="matrix(-1 0 0 1 205.445 73.1584)" fill="#2B2B2E"
                                   stroke="#FFBF00" strokeWidth="4"/>
                           <circle cx="11" cy="11" r="9" transform="matrix(-1 0 0 1 269.518 73.1584)" fill="#2B2B2E"
                                   stroke="#FFBF00" strokeWidth="4"/>
                           <circle cx="11" cy="11" r="9" transform="matrix(-1 0 0 1 182.147 73.1584)" fill="#2B2B2E"
                                   stroke="#FFBF00" strokeWidth="4"/>
                           <circle cx="11" cy="11" r="9" transform="matrix(-1 0 0 1 70.3135 73.1584)" fill="#2B2B2E"
                                   stroke="#FFBF00" strokeWidth="4"/>
                           <circle cx="11" cy="11" r="9" transform="matrix(-1 0 0 1 47.0156 73.1584)" fill="#2B2B2E"
                                   stroke="#FFBF00" strokeWidth="4"/>
                           <path d="M202.636 23.1082H208.103V15.2124H202.636V23.1082Z" fill="#FFBF00" stroke="#FFBF00"
                                 strokeLinejoin="round"/>
                           <path d="M208.103 66.4789V25.0823H202.636V66.4789H208.103Z" fill="#FFBF00" stroke="#FFBF00"
                                 strokeLinejoin="round"/>
                           <path
                               d="M203.018 12.8437H208.236C209.801 6.52707 203.417 1 202.112 1H182.546L186.46 5.73749H198.851C203.025 5.73749 203.236 10.7382 203.018 12.8437Z"
                               fill="#FFBF00" stroke="#FFBF00" strokeLinejoin="round"/>
                       </svg>
                   </div>
               </Fade>
            </div>
            <Fade bottom>
                <div className="flexCenter">
                    <Link href="tel: +8003412870" className="callUs flexCenter alignCenter secondary">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16 5.58333C13.7899 5.58333 11.6702 6.41741 10.1074 7.90207C8.54464 9.38673 7.66667 11.4004 7.66667 13.5V15.0833H9.33333C9.77536 15.0833 10.1993 15.2501 10.5118 15.5471C10.8244 15.844 11 16.2467 11 16.6667V21.4167C11 21.8366 10.8244 22.2393 10.5118 22.5363C10.1993 22.8332 9.77536 23 9.33333 23H7.66667C7.22464 23 6.80072 22.8332 6.48816 22.5363C6.17559 22.2393 6 21.8366 6 21.4167V13.5C6 12.2524 6.25866 11.0171 6.7612 9.86451C7.26375 8.71191 8.00035 7.66464 8.92893 6.78249C9.85752 5.90033 10.9599 5.20056 12.1732 4.72314C13.3864 4.24572 14.6868 4 16 4C17.3132 4 18.6136 4.24572 19.8268 4.72314C21.0401 5.20056 22.1425 5.90033 23.0711 6.78249C23.9997 7.66464 24.7362 8.71191 25.2388 9.86451C25.7413 11.0171 26 12.2524 26 13.5V21.4167C26 21.8366 25.8244 22.2393 25.5118 22.5363C25.1993 22.8332 24.7754 23 24.3333 23H22.6667C22.2246 23 21.8007 22.8332 21.4882 22.5363C21.1756 22.2393 21 21.8366 21 21.4167V16.6667C21 16.2467 21.1756 15.844 21.4882 15.5471C21.8007 15.2501 22.2246 15.0833 22.6667 15.0833H24.3333V13.5C24.3333 11.4004 23.4554 9.38673 21.8926 7.90207C20.3298 6.41741 18.2101 5.58333 16 5.58333Z"
                                fill="#F3BD1B"/>
                            <path
                                d="M17.8734 25.6471C18.4304 25.6471 21.7722 26.1765 22.8861 23H24C23.443 26.1765 20.6582 26.7059 17.8734 26.7059C17.8734 26.7059 18.0591 27.5882 17.8734 27.7647C14.5316 28.2941 13.4177 27.7647 13.4177 27.7647C12.8608 26.7059 12.8608 25.1176 13.4177 24.5882H17.3165C17.8734 24.5882 17.8734 25.1176 17.8734 25.6471Z"
                                fill="#F3BD1B"/>
                        </svg>
                        Call Us
                    </Link>
                </div>
            </Fade>
        </div>
    )
}