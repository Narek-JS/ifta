import { useMemo } from 'react';
import { useRouter } from 'next/router';

const stepsByPathname = {
    '/form/carrier-info': '1',
    '/form/questionnaire': '2',
    '/form/payment-info': '3'
};

const useStep = () => {
    const { pathname } = useRouter();
    return useMemo(() => stepsByPathname[pathname], [pathname]);
};

export { useStep };