import { useGetFaqsQuery } from "@/store/slices/faq";
import MainBanner from "@/components/home/MainBanner";
import FAQwrapper from "@/components/home/FAQwrapper";
import MoreInfo from "@/components/home/MoreInfo";
import Shops from "@/components/home/Shops";
import Help from "@/components/home/Help";

export default function Home() {
    const { data } = useGetFaqsQuery(5);
    
    return (
        <main className="pageMain homePage">
            <MainBanner />
            <Shops />
            <Help />
            <MoreInfo />
            <FAQwrapper faqs={data?.data} />
        </main>
    );
};
