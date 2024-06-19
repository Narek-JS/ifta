import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NotFound() {
    const router = useRouter();
    const [message, setMessage] = useState('This page could not be found.');

    useEffect(() => {
        if(router.query.message) {
            setMessage(router.query.message);
        };

        router.push({
            pathname: router.pathname,
            query: {}
        }, undefined, { shallow: true })
    }, [router.query]);

    return (
        <div className="notFoundPage">
            <h1>404</h1>
            <p>{message}</p>
        </div>  
    );
};