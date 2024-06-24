import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import classNames from "classnames";
import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";

export default function AuthWrapper({ children, user }) {
    const router = useRouter();
    const [ backLinkAvailable, setBackLinkAvailable ] = useState(false);

    // Check if the browser history has more than one entry.
    useEffect(() => {
        if(window?.history?.length > 1) {
            setBackLinkAvailable(true);
        };
    }, []);

    // Redirect to home page if user is authenticated.
    useEffect(() => {
        if(user && router) {
            router.push("/");
        };
    }, [user, router]);

    // Function to navigate to the previous page.
    const navigateToBack = () => router.back();

    return (
        <div className='authWrapper'>
            <div className="authContainer">
                {backLinkAvailable && (
                    <Button
                        onClick={navigateToBack}
                        className="backBtn flex alignCenter gap5 lighthouse-black font20 weight700 mb20"
                    >
                        <BackSvgIcon />
                        Back
                    </Button>
                )}
                {children}
            </div>
        </div>
    );
};