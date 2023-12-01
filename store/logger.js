import Cookies from 'js-cookie';

export const logger = ({ method, url, body, additionalHeaders }) => {
    const auth = Cookies.get("authorized")
    if (!method) {
        throw Error("Please specify method for this api call");
    }

    if (!url) {
        throw Error("Please specify url for this api call");
    }

    const config = {
        method,
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            ...(auth && {Authorization: `Bearer ${auth}`}),
            ...(additionalHeaders ? additionalHeaders : {}),
        },
        body: JSON.stringify(body)
    };

    return new Promise(async (resolve, reject) => {

        try {
            const response = await fetch(url, config);

            if (response.ok) {
                const result = await response.json();
                resolve(result);

            } else {
                const result = await response.json();
                reject({result, status: response.status});
            }
        } catch (error) {
            console.log(error, 'err');

            resolve(error);
        }
    });
};