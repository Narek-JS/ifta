import { createContext, useState } from 'react';

// Create the context.
const VerificationContext = createContext();

// Create the provider component.
const VerificationProvider = ({ children }) => {
    const [loader, setLoader] = useState(false);
    const [verified, setVerified] = useState(false);
    const [isVerifyUsdot, setIsVerifyUsdot] = useState(false);
    const [nextStapeLoading, setNextStapeLoading] = useState(false);
    const [isUnVerifyedState, setIsUnVerifyedState] = useState(false);

    return (
        <VerificationContext.Provider value={{
            loader, setLoader,
            verified, setVerified,
            isVerifyUsdot, setIsVerifyUsdot,
            nextStapeLoading, setNextStapeLoading,
            isUnVerifyedState, setIsUnVerifyedState
        }}>
            {children}
        </VerificationContext.Provider>
    );
};

export { VerificationContext, VerificationProvider };