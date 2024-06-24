import { ComeBackLeftArrowIcon } from "@/public/assets/svgIcons/ComeBackLeftArrowIcon";
import { ClosePopupIcon } from "@/public/assets/svgIcons/ClosePopupIcon";
import { selectPopUpAction } from "@/store/slices/common";
import { ImageLoader } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { useState } from "react";

import Image from "next/image";
import NormalBtn from "../universalUI/NormalBtn";

const DeleteMember = ({ handleClose }) => {
    const [loading, setLoading] = useState(false);
    const popUpAction = useSelector(selectPopUpAction);

    // Handle delete Member click.
    const handleAcceptDeleteClick = () => {
        setLoading(true);
        popUpAction().then(() => setLoading(false))
    };

    return (
        <div className='logoutPopup'>
            <ClosePopupIcon
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    cursor: 'pointer'
                }}
            />
            <Image
                alt="log out popup Image"
                src='/assets/images/memberPopup.png'
                width={300}
                height={260}
                loader={ImageLoader}
            />

            <h2 className="popUpContent">
                Are You Sure You Want to Remove This Member?
            </h2>

            <NormalBtn
                loading={loading}
                onClick={handleAcceptDeleteClick}
                className="border-btn"
            >
                Yes
            </NormalBtn>
            <NormalBtn
                loading={loading}
                onClick={handleClose}
                className="fill-btn bg-lighthouse-black"
            >
                <ComeBackLeftArrowIcon />
                Cancel
            </NormalBtn>
        </div>
    );
};

export { DeleteMember };