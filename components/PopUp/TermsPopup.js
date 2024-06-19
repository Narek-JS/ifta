import { CenterSquares } from "../universalUI/AnimationBoxes";
import { IFTA_EMAIL, IFTA_PHONE } from "@/utils/constants";
import Link from "next/link";

export const TermsPopup = ({ handleClose }) => {

    return (
        <div className="privacyPolicy termsPopupContent">
            <div className="fixed">
                <CenterSquares className="centerSquares top mb20 mt20 flexCenter alignEnd gap10 none1024" />
                <div className="faqHeaders textCenter">
                    <h1 className="primary font20 line24 mb10 m-18px">Terms and Conditions</h1>
                    <h3 className="primary60 font16 line24 weight400">IFTA.ONLINE</h3>
                </div>
                <svg onClick={handleClose} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_1716_16763)">
                        <rect width="40" height="40" fill="#FFBF00"/>
                        <g clipPath="url(#clip1_1716_16763)">
                            <path d="M28.6275 13.2541C29.0181 12.8636 29.0181 12.2304 28.6275 11.8399L28.1617 11.3741C27.7712 10.9836 27.1381 10.9836 26.7475 11.3741L20.7084 17.4132C20.3179 17.8037 19.6847 17.8037 19.2942 17.4132L13.2551 11.3741C12.8646 10.9836 12.2314 10.9836 11.8409 11.3741L11.3751 11.8399C10.9846 12.2304 10.9846 12.8636 11.3751 13.2541L17.4142 19.2932C17.8047 19.6837 17.8047 20.3169 17.4142 20.7074L11.3751 26.7466C10.9846 27.1371 10.9846 27.7702 11.3751 28.1608L11.8409 28.6266C12.2314 29.0171 12.8646 29.0171 13.2551 28.6266L19.2942 22.5874C19.6847 22.1969 20.3179 22.1969 20.7084 22.5874L26.7475 28.6266C27.1381 29.0171 27.7712 29.0171 28.1617 28.6266L28.6275 28.1608C29.0181 27.7702 29.0181 27.1371 28.6275 26.7466L22.5884 20.7074C22.1979 20.3169 22.1979 19.6837 22.5884 19.2932L28.6275 13.2541Z" fill="black"/>
                        </g>
                    </g>
                    <defs>
                        <clipPath id="clip0_1716_16763">
                            <rect width="40" height="40" fill="white"/>
                        </clipPath>
                        <clipPath id="clip1_1716_16763">
                            <rect width="32" height="32" fill="white" transform="translate(4 4)"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>
            <div className="privacyContent primary60 line24 content">
                <p>
                    These terms and conditions govern the use of ifta.online. This site is owned and operated by IFTA
                    ONLINE. This site is an ecommerce website.
                </p>
                <p>
                    By using this site, you indicate that you have read and understand these terms and conditions and
                    agree to abide by them at all times.
                </p>
                <h2>
                    Intellectual Property
                </h2>
                <p>
                    All Content published and made available on our site is the property of IFTA ONLINE and the site’s
                    creators. This includes, but is not limited to images, text, logos, documents, downloadable files,
                    and anything that contributes to the composition of our site.
                </p>
                <h2>
                    Acceptable Use
                </h2>
                <p className="mb10">
                    As a user of our site, you agree to use our site legally, not to use our site for illegal purposes,
                    and not to:
                </p>
                <ul>
                    <li>
                        Harass or mistreat other users of our site;
                    </li>
                    <li>
                        Violate the rights of other users of our site; or
                    </li>
                    <li>
                        Act in any way that could be considered fraudulent.
                    </li>
                </ul>
                <p>
                    If we believe you are using our site illegally or in a manner that violates these terms and
                    conditions, we reserve the right to limit, suspend, or terminate your access to our site. We also
                    reserve the right to take any legal steps necessary to prevent you from accessing our site.
                </p>
                <h2>
                    Accounts
                </h2>
                <p>
                    When you register your information on our site, you agree to the following:
                </p>
                <ol>
                    <li>
                        You are solely responsible for your account and the security and privacy of your account,
                        including passwords or sensitive information attached to that account; and
                    </li>
                    <li>
                        All personal information you provide to us through your account is up to date, accurate, and
                        truthful and you will update your personal information if it changes.
                    </li>
                </ol>
                <h2>
                    Sales of Services
                </h2>
                <p>
                    These terms and conditions govern the sale of services available on our site.
                </p>
                <p>
                    The following services are available on our site:
                </p>
                <ul>
                    <li>
                        Tax Filing and Reporting
                    </li>
                    <li>
                        Permit Submission
                    </li>
                </ul>
                <p>
                    The services will be paid for in full when the services are ordered.
                    These terms and conditions apply to all the services that are displayed on our site at the time you
                    access it. All information, descriptions, or images that we provide about our services are as
                    accurate as possible. However, we are not legally bound by such information, descriptions, or
                    images, as we cannot guarantee the accuracy of all services we provide. You agree to purchase
                    services from our site at your own risk.
                </p>
                <p>
                    We reserve the right to modify, reject or cancel your order whenever it becomes necessary. If we
                    cancel your order and have already processed your payment, we will give you a refund equal to the
                    amount you paid. You agree that it is your responsibility to monitor your payment instrument to
                    verify receipt of any refund.
                </p>
                <h2>
                    Payments
                </h2>
                <p>
                    We accept the following payment methods on our site:
                </p>
                <ul>
                    <li>
                        Credit Card
                    </li>
                    <li>
                        Debit Card
                    </li>
                </ul>
                <p>
                    When you provide us with your payment information, you authorize our use of and access to the
                    payment instrument you have chosen to use. By providing us with your payment information, you
                    authorize us to charge the amount due to this payment instrument.
                </p>
                <p>
                    If we believe your payment has violated any law or these terms and conditions, we reserve the right
                    to cancel or reverse your transaction.
                </p>
                <h2>
                    Consumer Protection Law
                </h2>
                <p>
                    Where any consumer protection legislation in your jurisdiction applies and cannot be excluded, these
                    terms and conditions will not limit your legal rights and remedies under that legislation. These
                    terms and conditions will be read subject to the mandatory provisions of that legislation. If there
                    is a conflict between these terms and conditions, the mandatory provisions of the legislation will
                    apply.
                </p>
                <h2>
                    Limitation of Liability
                </h2>
                <p>
                    IFTA ONLINE and our directors, officers, agents, employees, subsidiaries, and affiliates will not be
                    liable for any actions, claims, losses, damages, liabilities, and expenses including legal fees from
                    your use of the site.
                </p>
                <h2>
                    Indemnity
                </h2>
                <p>
                    Except where prohibited by law, by using this site you indemnify and hold harmless IFTA ONLINE and
                    our directors, officers, agents, employees, subsidiaries, and affiliates from any actions, claims,
                    losses, damages, liabilities, and expenses including legal fees arising out of your use of our site
                    or your violation of these terms and conditions.
                </p>
                <h2>
                    Applicable Law
                </h2>
                <p>
                    These terms and conditions are governed by the laws of the state of California.
                </p>
                <h2>
                    Severability
                </h2>
                <p>
                    If at any time any of the provisions set forth in these terms and conditions are found to be
                    inconsistent or invalid under applicable laws, those provisions will be deemed void and will be
                    removed from these terms and conditions. All other provisions will not be affected by the removal
                    and the rest of these terms and conditions will still be considered valid.
                </p>
                <h2>
                    Changes
                </h2>
                <p>
                    These terms and conditions may be amended from time to time in order to maintain compliance with the
                    law and to reflect any changes to the way we operate our site and the way we expect users to behave
                    on our site. We will post a notice on our site if any change occurs to our terms and conditions.
                </p>
                <h2>
                    Contact Details
                </h2>
                <p>
                    Please contact us if you have any questions or concerns. Our contact details are as follows:
                </p>
                <ul className="secondary mb20">
                    <li>
                        <Link className="secondary" href={`tel:${IFTA_PHONE}`}>
                            (800) 341-2870
                        </Link>
                    </li>
                    <li>
                        <Link className="secondary" href={`mailto: ${IFTA_EMAIL}`}>
                            {IFTA_EMAIL}
                        </Link>
                    </li>
                </ul>
                <h2 style={{ fontSize: "21px" }}>
                    I agree to receive text messages regarding the completion of and future reminders for this filing.
                </h2>
            </div>
        </div>
    )
};