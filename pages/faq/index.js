import { API_URL } from "@/utils/constants";
import FAQwrapper from "@/components/home/FAQwrapper";

export default function FAQ({ faqs }) {
    return (
        <FAQwrapper squares={true} faqs={faqs?.data} />
    );
};

export async function getStaticProps() {
    const LIMIT = 100;  // You can set this to any limit you need.
    const res = await fetch(`${API_URL}/faqs?offset=0&limit=${LIMIT}`);
    const data = await res.json();

    // Return the fetched data as props, with a revalidation interval.
    return {
        props: { faqs: data },
        revalidate: 120,
    };
}