import { clearPaymentStatus, selectPaymentStatus } from "@/store/slices/payment";
import { clearTaxReturnPeriod } from "@/store/slices/resgister";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect } from 'react';
import { useRouter } from "next/router";

import { IFTA_EMAIL, IFTA_PHONE } from "@/utils/constants";
import Link from "next/link";

import styles from './styles.module.scss';

export default function ThankYou() {
    const dispatch = useDispatch();
    const paymentStatus = useSelector(selectPaymentStatus);

    const router = useRouter();
 
    useEffect(() => {
        if(paymentStatus !== 'success') {
            router.back();
        };

        return () => {
            dispatch(clearPaymentStatus());
            dispatch(clearTaxReturnPeriod());
        };
    }, []);

    return (
        <Fragment>
            <div className={styles.container}>
                <div className={styles.thankYou}>
                    <h2>Thank You for Your Order!</h2>
                    <h4>We’re grateful that you chose us.</h4>
                    <p>
                        From the whole team at IFTA Registration Services, thank you for working with us! Our team is
                        currently processing your order, and you can expect to hear back from us within the next few days.
                    </p>
                    <p>
                        If you have any questions about our work or want to check on the status of your order, feel free to
                        get in touch with our team! You can contact us via phone at <Link href={`tel:${IFTA_PHONE}`}>(800) 341 - 2870</Link>, email
                        at &nbsp;
                        <Link href={`mailto:${IFTA_EMAIL}`}>{IFTA_EMAIL}</Link>, or our <Link href="/contact-us">Contact us page</Link>.
                        We’ll be happy to help you resolve any
                        questions you may have.
                    </p>
                    <h4>Thank You for Choosing IFTA Registration Services!</h4>
                    <Link href="/history" className={styles.goBackBtn}>Go to Billing History</Link>
                </div>
            </div>
            <script dangerouslySetInnerHTML={{
                __html: `
                    gtag('event', 'conversion', {
                        'send_to': 'AW-414658176/L5bGCMOCr_EYEIDd3MUB',
                        'value': 0.0,
                        'currency': 'USD',
                        'transaction_id': ''
                    });
                `,
            }} />
        </Fragment>
    );
};
