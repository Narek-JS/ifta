import { useMemo } from 'react';
import { useRouter } from 'next/router';

// Define a mapping of steps by pathname.
const stepsByPathname = {
    '/form/carrier-info': '1',
    '/form/questionnaire': '2',
    '/form/payment-info': '3'
};

// Custom hook to check the current step based on the pathname.
const useStep = () => {
    const { pathname } = useRouter();

    // Use useMemo to memoize the result based on the pathname.
    return useMemo(() => stepsByPathname[pathname], [pathname]);
};

export { useStep };