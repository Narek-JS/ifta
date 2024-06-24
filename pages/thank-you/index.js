import { clearPaymentStatus, selectPaymentStatus } from "@/store/slices/payment";
import { clearTaxReturnPeriod } from "@/store/slices/resgister";
import { IFTA_EMAIL, IFTA_PHONE, IFTA_PHONE_MASK } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect } from 'react';
import { useRouter } from "next/router";

import Link from "next/link";
import styles from '@/styles/thankYouStyle.module.scss';
import Cookies from "js-cookie";

export default function ThankYou() {
    const router = useRouter();
    const dispatch = useDispatch();
    const paymentStatus = useSelector(selectPaymentStatus);

    // useEffect to check the payment status and clear state on unmount.
    useEffect(() => {
        if(paymentStatus !== 'success') {
            // Navigate back if the payment status is not successful.
            router.back();
        };

        return () => {
            // Clear payment status and clear tax return period on unmount.
            dispatch(clearPaymentStatus());
            dispatch(clearTaxReturnPeriod());
        };
    }, []);

    // Check if the payment is succesfuly and come from Sponsored.
    const isShowGoogleAnalitic = Boolean(paymentStatus === 'success' && Cookies.get('_gcl_aw'));

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
                        get in touch with our team! You can contact us via phone at &nbsp;
                        <Link href={`tel:${IFTA_PHONE}`}>{IFTA_PHONE_MASK}</Link>, email at &nbsp; 
                        <Link href={`mailto:${IFTA_EMAIL}`}>{IFTA_EMAIL}</Link>, or our &nbsp;
                        <Link href="/contact-us">Contact us page</Link>.
                        We’ll be happy to help you resolve any
                        questions you may have.
                    </p>
                    <h4>Thank You for Choosing IFTA Registration Services!</h4>
                    <Link href="/history" className={styles.goBackBtn}>Go to Billing History</Link>
                </div>
            </div>
            {isShowGoogleAnalitic && (
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
            )}
        </Fragment>
    );
};
