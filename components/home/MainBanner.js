import { ExclamationIcon } from "@/public/assets/svgIcons/ExclamationIcon";
import { CirclePhoneIcon } from "@/public/assets/svgIcons/CirclePhoneIcon";
import { AttentionIcon } from "@/public/assets/svgIcons/AttentionIcon";
import { LocationIcon } from "@/public/assets/svgIcons/LocationIcon";
import { QuarterlyRegisterForm } from "./QuarterlyRegisterForm";
import { PaperIcon } from "@/public/assets/svgIcons/PaperIcon";
import { ClockIcon } from "@/public/assets/svgIcons/ClockIcon";
import { BagIcon } from "@/public/assets/svgIcons/BagIcon";
import { selectIsUser } from "@/store/slices/auth";
import { ImageLoader } from "@/utils/helpers";
import { useSelector } from "react-redux";
import RegisterForm from "@/components/home/RegisterForm";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";

const InfoItem = ({ icon: Icon, text }) => (
    <div className="infoItem flex gap20-1900-gap5 alignCenter">
        <Icon />
        <p className="white weight500 font16">{text}</p>
    </div>
);

export default function MainBanner() {
    const isUser = useSelector(selectIsUser);

    const handleApplyNowClick = () => {
        if(!isUser) {
            localStorage.setItem("toForm", "true");
        };
    };

    return (
        <div className="mainBanner flexBetween alignCenter mPadding gap10">
            <Image
                className="bannerimage"
                src="/assets/images/banner1.webp"
                priority
                quality={100}
                width={240}
                height={80}
                loader={ImageLoader}
                alt="distance"
            />

            { !isUser && <QuarterlyRegisterForm /> }

            <div className={classNames("infoContent flexColumn", {'notUser': !isUser })}>
                <div className="infoItem textCenter">
                    <div className=" flexCenter gap10 alignCenter">
                        <ExclamationIcon />
                        <h1 className="secondary font24 line34">YOUR FUEL TAX EXPERTS</h1>
                    </div>
                    <h3 className={classNames({
                        "font20 line28 white weight500 max-w-420 m-auto": !isUser,
                        "font24 line34 white weight500": isUser
                    })}>
                        Register/Renew your IFTA License and Decals in
                        <span className="secondary"> THREE EASY STEPS! </span>
                    </h3>
                </div>

                <InfoItem icon={ClockIcon} text='Get Your IFTA Filings ONLINE in Less Than 5 Minutes!' />
                <InfoItem icon={LocationIcon} text='Quick Decals Delivered to Your Home or Business!' />
                <InfoItem icon={AttentionIcon} text='Certified E-Provider with All Jurisdictions' />
                <InfoItem icon={PaperIcon} text="Directly Connected to All States' DOT Websites" />
                <InfoItem icon={CirclePhoneIcon} text='Industry experts available M-F, 6a.m-5p.m. PST!' />
                <InfoItem icon={BagIcon} text="We've Been Helping Businesses Stay Compliant since 2006!" />

                <p className="white weight500 font20 textCenter">Instant service for an affordable price!</p>
                <div className="flexCenter">
                    <Link
                        href={isUser ? "/form/carrier-info" : "/sign-in"}
                        className="normalBtn bg-lighthouse-blackWhiteHome"
                        onClick={handleApplyNowClick}
                    >
                        Apply Now
                    </Link>
                </div>
            </div>

            <RegisterForm />
        </div>
    );
};