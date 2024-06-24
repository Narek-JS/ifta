import Image from "next/image";
import classNames from "classnames";
import { ImageLoader } from "@/utils/helpers";

const InfoSection = ({ title, subTitle, content, img, dir }) => (
    <div className="infoSection mb30">
        {title && <h1>{title}</h1>}

        <div className={classNames('flexBetween gap30', { rowReverse: dir })}>
            <div className="infoContent primary">
                <h2 className="subTitle font20 mb20 ">{subTitle}</h2>
                <div className="text mb20" dangerouslySetInnerHTML={{ __html: content }} />
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

export default InfoSection;