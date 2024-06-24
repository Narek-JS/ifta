import { ImageLoader } from "@/utils/helpers";
import Image from "next/image";

const Loader = () => (
    <div className="loadingContainer">
        <div className="imgArea">
            <Image
                src="/assets/images/logo3.png"
                quality={100}
                width={240}
                height={80}
                loader={ImageLoader}
                alt="logo"
            />
        </div>
    </div>
);

export default Loader;