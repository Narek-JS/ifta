import { selectPopUpAction } from "@/store/slices/common";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ImageLoader } from "@/utils/helpers";
import Image from "next/image";
import NormalBtn from "../universalUI/NormalBtn";
import Link from "next/link";

const UpdatedPopup = ({ handleClose }) => {
    const [loading, setLoading] = useState(false);
    const popUpAction = useSelector(selectPopUpAction);

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
                In order to enhance your experience with <Link href='/' className="lighthouse-black underline">IFTA.Online</Link>, we have made significant updates to our platform. If you need any assistance, please feel free to reach out to us! In the meantime, we invite you to explore our newly updated website. Thank you!
            </p>

            <NormalBtn
                loading={loading}
                onClick={() => {
                    localStorage.setItem('isUpdate', true);
                    handleClose();
                }}
                className="border-btn flex"
            >
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.2071 8.70711C21.5976 8.31658 21.5976 7.68342 21.2071 7.29289L14.8431 0.928932C14.4526 0.538408 13.8195 0.538408 13.4289 0.928932C13.0384 1.31946 13.0384 1.95262 13.4289 2.34315L19.0858 8L13.4289 13.6569C13.0384 14.0474 13.0384 14.6805 13.4289 15.0711C13.8195 15.4616 14.4526 15.4616 14.8431 15.0711L21.2071 8.70711ZM0.5 9H20.5V7H0.5V9Z" fill="black"/>
                </svg>
                Explore IFTA.ONLINE
            </NormalBtn>
            <NormalBtn
                loading={loading}
                onClick={()=> {
                    setLoading(true);
                    popUpAction()
                        .then(() => {
                            setLoading(false);
                            handleClose();
                        });
                }}
                className="fill-btn bg-lighthouse-black"
            >
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21.2071 8.70711C21.5976 8.31658 21.5976 7.68342 21.2071 7.29289L14.8431 0.928932C14.4526 0.538408 13.8195 0.538408 13.4289 0.928932C13.0384 1.31946 13.0384 1.95262 13.4289 2.34315L19.0858 8L13.4289 13.6569C13.0384 14.0474 13.0384 14.6805 13.4289 15.0711C13.8195 15.4616 14.4526 15.4616 14.8431 15.0711L21.2071 8.70711ZM0.5 9H20.5V7H0.5V9Z"
                        fill="#000"
                    />
                </svg>
                Go to Log In
            </NormalBtn>
        </div>
    );
};

export { UpdatedPopup };