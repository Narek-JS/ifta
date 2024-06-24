import Cookies from 'js-cookie';

// Function to log API requests.
export const logger = ({ method, url, body, additionalHeaders }) => {
    // Retrieve authorization token from cookies.
    const auth = Cookies.get("authorized");

    // Check if method is specified.
    if (!method) {
        throw Error("Please specify method for this api call");
    };

    // Check if URL is specified.
    if (!url) {
        throw Error("Please specify url for this api call");
    };

    // Check if body is FormData.
    const isFormData = body instanceof FormData;

    // Configuration for the fetch request.
    const config = {
        method,
        cache: "no-cache",
        headers: {
            // Set headers based on FormData or JSON body.
            ...(!isFormData && {
                "Content-Type": "application/json",
                Accept: "application/json",
            }),

            // Set Access-Control-Allow-Origin header.
            "Access-Control-Allow-Origin": "*",

            // Set Authorization header if authorization token exists.
            ...(auth && { Authorization: `Bearer ${auth}`}),

            // Merge additional headers.
            ...(additionalHeaders ? additionalHeaders : {})
        },
        // Set body based on FormData or JSON body.
        body: isFormData ? body : JSON.stringify(body)
    };

    // Return a promise for the fetch request.
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, config);

            // Check if response is ok.
            if (response.ok) {
                // Parse response JSON and resolve the promise.
                const result = await response.json();
                resolve(result);
            } else {
                // Parse error response JSON and reject the promise.
                const result = await response.json();
                reject({ result, status: response.status });
            };
        } catch (error) {
            // Log error and resolve the promise.
            console.log(error, 'err');
            resolve(error);
        };
    });
};