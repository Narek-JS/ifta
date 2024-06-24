import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NotFound() {
    const router = useRouter();
    const [message, setMessage] = useState('This page could not be found.');

    useEffect(() => {
        // Check if the router query contains a message parameter
        if(router.query.message) {
            setMessage(router.query.message);
        };

        // Clear the query parameters from the URL while keeping the same pathname
        router.push({
            pathname: router.pathname,
            query: {}
        }, undefined, { shallow: true })
    }, [router.query]);

    // Render the 404 page with the message
    return (
        <div className="notFoundPage">
            <h1>404</h1>
            <p>{message}</p>
        </div>  
    );
};