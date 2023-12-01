import { selectPopUpContent, setPopUp } from "@/store/slices/common";
import { ImageLoader } from "@/utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { FileIcon } from "@/public/assets/svgIcons/FileIcon";
import { CloseIconYellow } from "@/public/assets/svgIcons/CloseIconYellow";
import Image from "next/image";

export const ExampleFilePopUp = () => {
    const { imagePath, title } = useSelector(selectPopUpContent);
    const dispatch = useDispatch();

    return (
        <div className="popupFileExample">
            <div className="popupHeader">
                <FileIcon />
                <span className="popupFileExampleText">
                    {title}
                </span>
                <span className="popupClose" onClick={() => dispatch(setPopUp({popUp: ''}))}>
                    <CloseIconYellow />
                </span>
            </div>
            <Image
                className="popupImage"
                src={imagePath}
                width={800}
                height={800}
                loader={ImageLoader}
                alt="file"
            />
        </div>
    )
};
