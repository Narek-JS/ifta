import React, { Fragment } from 'react';
import { useSelector } from "react-redux";
import { selectUserData } from "@/store/slices/auth";
import ContactName from "@/components/profile/contactName";
import PhoneNumbers from "@/components/profile/phoneNumbers";
import EmailAddresses from "@/components/profile/emailAddresses";
import MobileProfile from "@/components/profile/MobileProfile";
import ChangePassword from "@/components/profile/changePassword";
import Link from "next/link";

export default function MyProfilePage (){
    const user = useSelector(selectUserData);

    return (
        <div className={`authWrapper profileWrapper`}>
            <div className="authContainer">
                <Link href="/" className="flex alignCenter gap5 lighthouse-black font20 weight700 mb20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                        <circle cx="21.0625" cy="21.0625" r="16" fill="black"/>
                        <path d="M5 21C5 29.8362 12.1638 37 21 37C29.8362 37 37 29.8362 37 21C37 12.1638 29.8362 5 21 5C12.1638 5 5 12.1638 5 21ZM21.3577 13.9723C21.4725 14.0861 21.5637 14.2215 21.6262 14.3706C21.6886 14.5197 21.7211 14.6796 21.7217 14.8413C21.7224 15.0029 21.6912 15.1631 21.6299 15.3127C21.5686 15.4623 21.4785 15.5983 21.3646 15.7131L17.34 19.7692H27.6154C27.9418 19.7692 28.2549 19.8989 28.4857 20.1297C28.7165 20.3605 28.8462 20.6736 28.8462 21C28.8462 21.3264 28.7165 21.6395 28.4857 21.8703C28.2549 22.1011 27.9418 22.2308 27.6154 22.2308H17.34L21.3646 26.2869C21.4785 26.4018 21.5686 26.5379 21.6298 26.6876C21.691 26.8373 21.7222 26.9976 21.7215 27.1593C21.7207 27.321 21.6882 27.481 21.6256 27.6301C21.5631 27.7793 21.4718 27.9146 21.3569 28.0285C21.2421 28.1423 21.1059 28.2324 20.9562 28.2936C20.8066 28.3549 20.6463 28.386 20.4846 28.3853C20.3228 28.3846 20.1629 28.352 20.0137 28.2895C19.8646 28.2269 19.7292 28.1356 19.6154 28.0208L13.5085 21.8669C13.2797 21.6364 13.1513 21.3248 13.1513 21C13.1513 20.6752 13.2797 20.3636 13.5085 20.1331L19.6154 13.9792C19.7292 13.8642 19.8647 13.7728 20.0139 13.7102C20.1632 13.6476 20.3233 13.6151 20.4851 13.6144C20.6469 13.6138 20.8073 13.645 20.957 13.7065C21.1068 13.7679 21.2429 13.8582 21.3577 13.9723Z" fill="#FFBF00"/>
                    </svg>
                    Back
                </Link>
                <div className='padding-m-dash w-100 bg-image  my-profile' style={{backgroundImage: `url(/images/banner.png)`}}>
                    <div className={'profile-boxes'}>
                        <ContactName name={user?.name+user?.lastName} />
                        <PhoneNumbers
                            phoneNumber={user?.phone}
                            withoutPass={Boolean(user?.google)}
                        />
                        { Boolean(user?.google) === false && (
                            <Fragment>
                                <ChangePassword accountDetails={user}/>
                                <EmailAddresses email={user?.email}/>
                            </Fragment>
                        )}
                    </div>
                    <MobileProfile accountDetails={user}/>
                </div>
            </div>
        </div>

    );
};

