import { ToTopIcon } from "@/public/assets/svgIcons/ToTopIcon";
import { useEffect, useRef } from "react";
import { Button } from "@mui/material";

export default function ToTopBtn() {
    const toTopRef = useRef(null);

    // Function to handle the scroll event.
    const handleScroll = () => {
        // Get the current scroll position.
        const position = window.pageYOffset;
        if (position > 100) {
            // If the scroll position is greater than 100, add the "available" class.
            toTopRef.current.classList.add("available")
        } else {
            // If the scroll position is less than or equal to 100, remove the "available" class.
            if (toTopRef.current.classList.contains("available")) {
                toTopRef.current.classList.remove("available")
            };
        };
    };

    // Adding and removing the scroll event listener.
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Clean up the event listener on component unmount.
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Function to scroll to the top of the page smoothly.
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return(
        <Button ref={toTopRef} onClick={scrollToTop} className="btnToTop">
            <ToTopIcon />
        </Button>
    );
};