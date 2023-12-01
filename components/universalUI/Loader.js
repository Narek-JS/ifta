import Image from "next/image";
import { ImageLoader } from "@/utils/helpers";

export default function Loader () {
    return(
        <div className="loadingContainer">
            <div className="imgArea">
                <Image
                    src="/assets/images/logo3.png"
                    quality={100}
                    width={240}
                    height={80}
                    loader={ImageLoader}
                    alt="logo"/>
            </div>
        </div>
    )
}