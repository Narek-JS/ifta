import Image from "next/image";
import { ImageLoader } from "@/utils/helpers";

export default function InfoSection({
    title,
    subTitle,
    content,
    img,
    dir
}) {
    return (
        <div className="infoSection mb30">
            {title ? <h1>{title}</h1> : ""}
            <div className={`flexBetween gap30 ${dir ? "rowReverse" : ""}`}>
                <div className="infoContent primary">
                    <h2 className="subTitle font20 mb20 ">{subTitle}</h2>
                    <div className="text mb20" dangerouslySetInnerHTML={{__html: content}} />
                </div>
                <div className="infoImg">
                    <Image
                        src={img}
                        alt="info"
                        width={410}
                        height={250}
                        loader={ImageLoader}
                    />
                </div>
            </div>
        </div>
    );
};