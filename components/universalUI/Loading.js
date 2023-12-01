import {useSelector} from "react-redux";
import Loader from "@/components/universalUI/Loader";

export default function Loading() {
    const loading = useSelector(
        state => state?.common?.loading ||
            state?.register?.loading ||
            state?.questionnaire?.loading ||
            state?.payment?.loading
    );

    if (!loading) {
        return null
    }

    return (
        <Loader/>
    );
}