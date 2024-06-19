import { selectPopUpAction } from "@/store/slices/common";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ImageLoader } from "@/utils/helpers";
import Image from "next/image";
import NormalBtn from "../universalUI/NormalBtn";

const DeleteQuarterPeriods = ({ handleClose }) => {
    const [loading, setLoading] = useState(false);
    const popUpAction = useSelector(selectPopUpAction);

    return (
        <div className='logoutPopup'>
            <svg style={{
                position: 'absolute',
                top: '0',
                right: '0',
                cursor: 'pointer'
            }} onClick={handleClose} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1716_16763)">
                    <rect width="40" height="40" fill="#FFBF00"/>
                    <g clipPath="url(#clip1_1716_16763)">
                        <path d="M28.6275 13.2541C29.0181 12.8636 29.0181 12.2304 28.6275 11.8399L28.1617 11.3741C27.7712 10.9836 27.1381 10.9836 26.7475 11.3741L20.7084 17.4132C20.3179 17.8037 19.6847 17.8037 19.2942 17.4132L13.2551 11.3741C12.8646 10.9836 12.2314 10.9836 11.8409 11.3741L11.3751 11.8399C10.9846 12.2304 10.9846 12.8636 11.3751 13.2541L17.4142 19.2932C17.8047 19.6837 17.8047 20.3169 17.4142 20.7074L11.3751 26.7466C10.9846 27.1371 10.9846 27.7702 11.3751 28.1608L11.8409 28.6266C12.2314 29.0171 12.8646 29.0171 13.2551 28.6266L19.2942 22.5874C19.6847 22.1969 20.3179 22.1969 20.7084 22.5874L26.7475 28.6266C27.1381 29.0171 27.7712 29.0171 28.1617 28.6266L28.6275 28.1608C29.0181 27.7702 29.0181 27.1371 28.6275 26.7466L22.5884 20.7074C22.1979 20.3169 22.1979 19.6837 22.5884 19.2932L28.6275 13.2541Z" fill="black"/>
                    </g>
                </g>
                <defs>
                    <clipPath id="clip0_1716_16763">
                        <rect width="40" height="40" fill="white"/>
                    </clipPath>
                    <clipPath id="clip1_1716_16763">
                        <rect width="32" height="32" fill="white" transform="translate(4 4)"/>
                    </clipPath>
                </defs>
            </svg>
            <Image
                alt="log out popup Image"
                src='/assets/images/vehiclePopup.png'
                width={300}
                height={260}
                loader={ImageLoader}
            />

            <h2 className="popUpContent">
                Are You Sure You Want to Remove These Periods?
            </h2>

            <NormalBtn
                loading={loading}
                onClick={()=> {
                    setLoading(true);
                    popUpAction()
                        .then(() => {
                            setLoading(false)
                        })
                }}
                className="border-btn "
            >
                Yes
            </NormalBtn>
            <NormalBtn
                loading={loading}
                onClick={handleClose}
                className="fill-btn bg-lighthouse-black"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M2.25 12C2.25 17.3845 6.61547 21.75 12 21.75C17.3845 21.75 21.75 17.3845 21.75 12C21.75 6.61547 17.3845 2.25 12 2.25C6.61547 2.25 2.25 6.61547 2.25 12ZM12.218 7.7175C12.2879 7.78687 12.3435 7.86934 12.3816 7.96019C12.4196 8.05105 12.4394 8.14851 12.4398 8.24702C12.4402 8.34552 12.4212 8.44314 12.3838 8.5343C12.3465 8.62545 12.2916 8.70836 12.2222 8.77828L9.76969 11.25H16.0312C16.2302 11.25 16.4209 11.329 16.5616 11.4697C16.7022 11.6103 16.7812 11.8011 16.7812 12C16.7812 12.1989 16.7022 12.3897 16.5616 12.5303C16.4209 12.671 16.2302 12.75 16.0312 12.75H9.76969L12.2222 15.2217C12.2916 15.2917 12.3465 15.3747 12.3838 15.4659C12.4211 15.5571 12.4401 15.6548 12.4396 15.7533C12.4392 15.8519 12.4194 15.9494 12.3812 16.0402C12.3431 16.1311 12.2875 16.2136 12.2175 16.283C12.1475 16.3523 12.0645 16.4073 11.9733 16.4446C11.8821 16.4819 11.7845 16.5009 11.6859 16.5004C11.5874 16.5 11.4899 16.4801 11.399 16.442C11.3081 16.4039 11.2256 16.3483 11.1562 16.2783L7.43484 12.5283C7.29544 12.3878 7.21722 12.1979 7.21722 12C7.21722 11.8021 7.29544 11.6122 7.43484 11.4717L11.1562 7.72172C11.2256 7.65164 11.3082 7.59593 11.3991 7.55778C11.49 7.51964 11.5876 7.4998 11.6862 7.49941C11.7849 7.49902 11.8826 7.51808 11.9738 7.5555C12.0651 7.59292 12.148 7.64797 12.218 7.7175Z"
                        fill="#000"
                    />
                </svg>
                Cancel
            </NormalBtn>
        </div>
    );
};

export { DeleteQuarterPeriods };