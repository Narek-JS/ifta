import Link from "next/link";
import ContactForm from "@/components/contact-us/contactForm";
import Fade from "react-reveal/Fade";
import { IFTA_EMAIL } from "@/utils/constants";

export default function ContactUs() {

    return (
        <div className="contactUs mPadding sectionPadding flexBetween gap40">
            <Fade left>
                <div className="contactContent">
                    <h1 className="primary font24 mb20 line24">We’re Glad You’ve Chosen to Contact Us!</h1>
                    <div className="texts">
                        <p className="primary60 line24 mb20">Our team of knowledgeable support staff will be happy to
                            answer
                            any questions you may have about the International Fuel Tax Agreement or any other trucking
                            filing matter. Please fill out the form to the right to send us your message.
                        </p>
                        <p className="primary60 line24 mb20">
                            You can also email us directly at <a href={`mailto:${IFTA_EMAIL}`} className="lighthouse-black"> {IFTA_EMAIL} </a>
                            or call us directly at <a href="tel: +8003412870" className="lighthouse-black"> (800) 341-2870 </a>
                            during our business hours. We are open from Monday
                            through Friday, 6:00 a.m.—5:00 p.m. PST.
                        </p>
                    </div>
                    <div className='orPart mb10'>
                        <hr/>
                        <span className='font16 primary60'>OR</span>
                        <hr/>
                    </div>
                    <Link href="/faq" className="normalBtn outlined secondary">
                        FAQ
                    </Link>
                </div>
            </Fade>
            <ContactForm />
        </div>
    )
}