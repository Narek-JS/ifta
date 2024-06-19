import { API_URL } from "@/utils/constants";
import FAQwrapper from "@/components/home/FAQwrapper";

export default function FAQ({ faqs }) {
    return (
        <FAQwrapper squares={true} faqs={faqs?.data} />
    );
};

// Fetch FAQ data on the server side.
export async function getStaticProps() {
    const LIMIT = 100;  // You can set this to any limit you need.
    const res = await fetch(`${API_URL}/faqs?offset=0&limit=${LIMIT}`);
    const data = await res.json();

    return {
        props: { faqs: data },
        revalidate: 120, // Revalidate every 120 seconds to get fresh data
    };
}