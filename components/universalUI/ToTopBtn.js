import { Button } from "@mui/material";
import { useEffect, useRef } from "react";

export default function ToTopBtn (){
    const toTopRef = useRef(null);

    const handleScroll = () => {
        const position = window.pageYOffset;
        if (position > 100) {
            toTopRef.current.classList.add("available")
        } else {
            if (toTopRef.current.classList.contains("available")) {
                toTopRef.current.classList.remove("available")
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, {passive: true});
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return(
        <Button
            ref={toTopRef}
            onClick={() => {
                window.scrollTo({top: 0, behavior: "smooth"})
            }}
            className="btnToTop"
        >
            <svg width="26" height="19" viewBox="0 0 26 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 18L13.4783 2L24 18" stroke="#000" strokeWidth="3" strokeLinejoin="round"/>
            </svg>
        </Button>
    )
}