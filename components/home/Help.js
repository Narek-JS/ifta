import { TrucHelpSectionIcon } from "@/public/assets/svgIcons/TruckHelpSectionIcon";
import { CallUsIcon } from "@/public/assets/svgIcons/CallUsIcon";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import { useEffect, useRef, useState } from "react";
import { IFTA_PHONE } from "@/utils/constants";
import { ImageLoader } from "@/utils/helpers";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

export default function Help({ width: titleWidth }) {
    const ref = useRef(null);
    const { pathname } = useRouter();
    const { width } = useWindowSize();
    const [ position, setPosition ] = useState(0);

    useEffect(() => {
        if(pathname === "/") {
            const handleScroll = () => {
                const position = ref.current.getBoundingClientRect().top + document.body.getBoundingClientRect().top;
                setPosition(position);
            };
            if(ref) {
                window.addEventListener("scroll", handleScroll);
                return () => window.removeEventListener("scroll", handleScroll);
            };
        };
    }, [ref, pathname]);

    const getHorizontalPosition = () => {
        const SPEED = 5;
        const SCREEN_CONTAINER = 1920;
        const MAX_DISPLACEMENT_FACTOR = 600;

        const positionTop = -position / SPEED;
        const positionBottom =  width * MAX_DISPLACEMENT_FACTOR / SCREEN_CONTAINER;

        if(positionTop < positionBottom) {
            return positionTop;
        };
        return positionBottom;
    };

    return (
        <div className="helpSection flexColumn flexBetween" >
            <Image
                className="bannerimage"
                src="/assets/images/help.webp"
                quality={100}
                width={240}
                height={80}
                loader={ImageLoader}
                alt="distance"
                priority
            />
            <p className="white font16 textCenter">
                If you need to file your quarterly return, just call our team today!
                We’d be happy to help you file your IFTA returns in no time at all.
            </p>
            <div
                className="helpTitle"
                ref={ref}
                style={{
                    transform: `translateX(${getHorizontalPosition()}px)`,
                    ...(titleWidth && { width: titleWidth })
                }}>
                <div className='flexCenter alignEnd'>
                    <h1 className="secondary">Your Helpful Team for All Things IFTA!</h1>
                    <TrucHelpSectionIcon />
                </div>
            </div>
            <div className="flexCenter">
                <Link href={`tel:${IFTA_PHONE}`} className="callUs flexCenter alignCenter secondary">
                    <CallUsIcon />
                    Call Us
                </Link>
            </div>
        </div>
    );
};