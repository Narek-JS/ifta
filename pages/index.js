import MainBanner from "@/components/home/MainBanner";
import Shops from "@/components/home/Shops";
import Help from "@/components/home/Help";
import MoreInfo from "@/components/home/MoreInfo";
import FAQwrapper from "@/components/home/FAQwrapper";

export default function Home() {
    return (
        <main className="pageMain homePage">
            <MainBanner/>
            <Shops/>
            <Help/>
            <MoreInfo/>
            <FAQwrapper limit={5}/>
        </main>
    );
};
