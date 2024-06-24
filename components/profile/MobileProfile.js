import { useState } from 'react';
import EmailAddresses from "@/components/profile/emailAddresses";
import ChangePassword from "@/components/profile/changePassword";
import NextSvgIcon from "@/public/assets/svgIcons/NextSvgIcon";
import UserSvgIcon from "@/public/assets/svgIcons/UserSvgIcon";
import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";
import PhoneNumbers from "@/components/profile/phoneNumbers";
import ContactName from "@/components/profile/contactName";
import Link from "next/link";

const MobileProfile = ({ accountDetails }) => {
    const [step, setStep] = useState(0);

    const accountDetailsData = [
        {
            title: 'Contact Name',
            detail: accountDetails?.name + " " + accountDetails?.last_name,
            step: 1
        },
        ...(!accountDetails?.google ? [{
            title: 'Email Address',
            detail: accountDetails?.email,
            step: 2
        }] : []),
        {
            title: 'Phone Number',
            detail: accountDetails?.phone,
            step: 3
        },
        ...(!accountDetails?.google ? [{
            title: 'Password',
            detail: '**********',
            step: 4
        }] : []),
    ];

    return (
        <div className='mobile-profile'>
            {step === 0 && (
                <div className="mobileProfile">
                    <div className='welcome-user mb20 w100'>
                        <Link href="/" className="flex backBtn alignCenter gap5 lighthouse-black font20 weight700">
                            <BackSvgIcon/>
                            Back
                        </Link>
                        <div className='icon flexCenter alignCenter gap10'>
                            <UserSvgIcon/>
                            <h2>Welcome {accountDetails?.name}</h2>
                        </div>
                    </div>
                    <div className='account-access'>
                        <h4>Account access</h4>
                        <div className='account-details'>
                            {accountDetailsData.map((item, idx) => (
                                <div key={idx} onClick={() => setStep(item.step)}>
                                    <span>{item.title + ':'}</span>
                                    <div className='detail flexBetween'>
                                        <span>{item.detail}</span>
                                        <span className="icon-keyboard_arrow_right"></span>
                                    </div>
                                    <NextSvgIcon/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div className='profile-boxes'>
                {step === 1 && <ContactName onPrimaryDetails={() => setStep(0)} />}
                {step === 2 && <EmailAddresses onPrimaryDetails={() => setStep(0)} email={accountDetails?.email}/>}
                {step === 3 && <PhoneNumbers
                    withoutPass={Boolean(accountDetails?.google)}
                    onPrimaryDetails={() => setStep(0)}
                    phoneNumber={accountDetails?.phone}
                />}
                {step === 4 && <ChangePassword onPrimaryDetails={() => setStep(0)} accountDetails={accountDetails}/>}
            </div>
        </div>
    );
};

export default MobileProfile;