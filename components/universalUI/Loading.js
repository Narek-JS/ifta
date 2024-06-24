import { useSelector } from "react-redux";
import Loader from "@/components/universalUI/Loader";

export default function Loading() {
    // Using useSelector hook to access loading states from Redux store.
    const loading = useSelector((state) => {
        // Converting loading states to boolean values and combining them.
        return Boolean(
            state?.common?.loading ||
            state?.register?.loading ||
            state?.questionnaire?.loading ||
            state?.payment?.loading
        );
    });

    // If loading is false, return null (nothing to render).
    if (!loading) {
        return null;
    };

    // Displaying the Loader component while data is being fetched.
    return <Loader />;
};