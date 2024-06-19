import { CenterSquares } from "../universalUI/AnimationBoxes";

export const PrivacyPolicyPopup = ({ handleClose }) => {

    return (
        <div className="privacyPolicy termsPopupContent">
            <div className="fixed">
                <CenterSquares className="centerSquares top mb20 mt20 flexCenter alignEnd gap10 none1024" />
                <div className="faqHeaders textCenter">
                    <h1 className="primary font20 line24 mb10 m-18px">Privacy Policy</h1>
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
                    IFTA Online operates under www.ifta.online, which provides the service of filing the International Fuel Tax Agreement for our customers.
                </p>
                <p>
                    This page is to inform visitors to our website the policies regarding the collection, use, and disclosure of personal information, should one use our service via our website. If you choose to file with IFTA Online, you agree to the collection and use of information in relation to this policy. The personal information we collect is used for providing and improving our service. We will not share or use your information with anyone, except as explained in this privacy policy.
                </p>
                <h2>
                Collection and Use of Information

                </h2>
                <p>
                    In order to have a better experience with using IFTA Online, we may ask you to provide certain personal information, such as your name, phone number, email address, and more. This information will be used to contact and/or identify you.

                </p>

                <h2>Log Data
                </h2>
                <p>When you visit our website, we collect information known as Log Data from your browser. This information can include your Internet Protocol (aka IP) address, browser version, what pages of our website you visit, when you visit our website, how long you spend on each page, and other collected statistical information.

</p>
<h2>Cookies</h2>
<p>
Cookies are files that hold a small amount of data used most commonly to create an identity of anonymity. Your browser sends these from the websites you visit and then stores this information on your computer’s hard drive. This information is used by IFTA Online as a means to collect information in order to improve our services. You can accept or reject these and are able to know when a cookie is sent to your computer. If you opt to reject our website’s cookies, you may lose access to some parts of what we offer.

 
</p>
                <h2>
                Service Providers

                </h2>
                <p className="mb10">
                There are a few instances in which we may employ third-party companies. These instances are as follows:


                </p>
                <ul>
                    <li>
                    To better facilitate our service;

                    </li>
                    <li>
                    To have the service provided on our behalf;

                    </li>
                    <li>
                    To perform other services related to our service,

                    </li>
                    <li>
                    To analyze how our service is used.

                    </li>
                </ul>
                <p>
                  These third parties may have access to your personal information in order for them to best complete the services assigned by us to them. They are obligated to follow our privacy policy and are not to disclose or use any information obtained for any purpose other than the intended service.


                </p>
                <h2>
                Information Protection

                </h2>
                <p>
                We honor your trust in providing personal information to us. However, due to the nature of information being collected, we cannot guarantee the 100% safe protection of your information, as transmission over the internet is never 100% secure.

</p>
                
                <h2>
                Changes to Our Privacy Policy

                </h2>
                <p>
                 Occasionally, we may need to update this privacy policy. When any changes are made, this web page will be updated and effective immediately.
                </p>
                
            </div>
        </div>
    )
};