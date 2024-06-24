import { ClosePopupIcon } from "@/public/assets/svgIcons/ClosePopupIcon";
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
                <ClosePopupIcon onClick={handleClose} />
            </div>
            <div className="privacyContent primary60 line24 content">
                <p>
                    IFTA Online operates under www.ifta.online, which provides the service of filing the International Fuel Tax Agreement for our customers.
                </p>
                <p>
                    This page is to inform visitors to our website the policies regarding the collection, use, and disclosure of personal information, should one use our service via our website. If you choose to file with IFTA Online, you agree to the collection and use of information in relation to this policy. The personal information we collect is used for providing and improving our service. We will not share or use your information with anyone, except as explained in this privacy policy.
                </p>
                <h2>Collection and Use of Information</h2>
                <p>
                    In order to have a better experience with using IFTA Online, we may ask you to provide certain personal information, such as your name, phone number, email address, and more. This information will be used to contact and/or identify you.
                </p>

                <h2>Log Data</h2>
                <p>
                    When you visit our website, we collect information known as Log Data from your browser. This information can include your Internet Protocol (aka IP) address, browser version, what pages of our website you visit, when you visit our website, how long you spend on each page, and other collected statistical information.
                </p>
                <h2>Cookies</h2>
                <p>
                    Cookies are files that hold a small amount of data used most commonly to create an identity of anonymity. Your browser sends these from the websites you visit and then stores this information on your computer’s hard drive. This information is used by IFTA Online as a means to collect information in order to improve our services. You can accept or reject these and are able to know when a cookie is sent to your computer. If you opt to reject our website’s cookies, you may lose access to some parts of what we offer.
                </p>
                <h2>Service Providers</h2>
                <p className="mb10">
                    There are a few instances in which we may employ third-party companies. These instances are as follows:
                </p>
                <ul>
                    <li>To better facilitate our service;</li>
                    <li>To have the service provided on our behalf;</li>
                    <li>To perform other services related to our service,</li>
                    <li>To analyze how our service is used.</li>
                </ul>
                <p>
                  These third parties may have access to your personal information in order for them to best complete the services assigned by us to them. They are obligated to follow our privacy policy and are not to disclose or use any information obtained for any purpose other than the intended service.
                </p>
                <h2>Information Protection</h2>
                <p>
                    We honor your trust in providing personal information to us. However, due to the nature of information being collected, we cannot guarantee the 100% safe protection of your information, as transmission over the internet is never 100% secure.
                </p>
                <h2>Changes to Our Privacy Policy</h2>
                <p>
                    Occasionally, we may need to update this privacy policy. When any changes are made, this web page will be updated and effective immediately.
                </p>
            </div>
        </div>
    );
};