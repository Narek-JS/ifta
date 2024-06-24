import { useState } from "react";
import { useSelector } from "react-redux";
import { ImageLoader } from "@/utils/helpers";
import { selectPopUpAction } from "@/store/slices/common";
import { GoToIconForButtons } from "@/public/assets/svgIcons/GoToIconForButtons";

import NormalBtn from "../universalUI/NormalBtn";
import Image from "next/image";
import Link from "next/link";

const UpdatedPopup = ({ handleClose }) => {
    const [loading, setLoading] = useState(false);
    const popUpAction = useSelector(selectPopUpAction);

    // Function to handle Explore button click.
    const handleExploreClick = () => {
        // Set a flag in localStorage to indicate that the user has seen the update and Close the pop-up.
        localStorage.setItem('isUpdate', true);
        handleClose();
    };

    // Function to handle "Go to Login" button click.
    const handleGoToLoginClick = () => {
        setLoading(true);

        // Trigger the pop-up action.
        popUpAction().then(() => {
            setLoading(false);
            handleClose();
        });
    };

    return (
        <div className='updatedPopup'>
            <Image
                alt="log out popup Image"
                src='/assets/images/updatePopup.png'
                width={300}
                height={260}
                loader={ImageLoader}
            />

            <h2 className="popUpContent">
                <span className="carrierTooltipRoot">!</span>
                IFTA.ONLINE Is Updated Now
            </h2>

            <p className="content">
                Hello Valued Customer!
                In order to enhance your experience with&nbsp;
                <Link href='/' className="lighthouse-black underline">IFTA.Online</Link>,
                we have made significant updates to our platform. 
                If you need any assistance, please feel free to reach out to us! In the meantime,
                we invite you to explore our newly updated website. Thank you!
            </p>

            <NormalBtn
                loading={loading}
                onClick={handleExploreClick}
                className="border-btn flex"
            >
                Explore IFTA.ONLINE
            </NormalBtn>
            <NormalBtn
                loading={loading}
                onClick={handleGoToLoginClick}
                className="fill-btn bg-lighthouse-black"
            >
                <GoToIconForButtons />
                Go to Log In
            </NormalBtn>
        </div>
    );
};

export { UpdatedPopup };