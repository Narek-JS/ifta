import React, { Fragment } from 'react';
import { useSelector } from "react-redux";
import { selectUserData } from "@/store/slices/auth";
import ContactName from "@/components/profile/contactName";
import PhoneNumbers from "@/components/profile/phoneNumbers";
import MobileProfile from "@/components/profile/MobileProfile";
import ChangePassword from "@/components/profile/changePassword";
import EmailAddresses from "@/components/profile/emailAddresses";

export default function MyProfilePage () {
    const user = useSelector(selectUserData);

    return (
        <div className='authWrapper profileWrapper'>
            <div className="authContainer">
                <div className='padding-m-dash w-100 bg-image  my-profile'>
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

