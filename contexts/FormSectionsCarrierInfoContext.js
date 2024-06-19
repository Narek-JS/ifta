import { createContext, useState } from 'react';

// Create the context
const FormSectionsCarrierInfoContext = createContext();

// Create the provider component
const FormSectionsCarrierInfoProvider = ({ children }) => {
    const [ownerOfficerSectionError, setOwnerOfficerSectionError] = useState(false);
    const [vehiclesSectionError, setVehiclesSectionError] = useState(false);
    const [ownerOfficerActive, setOwnerOfficerActive] = useState(false);
    const [vehiclesActive, setVehiclesActive] = useState(false);

    return (
        <FormSectionsCarrierInfoContext.Provider value={{
            ownerOfficerSectionError, setOwnerOfficerSectionError,
            vehiclesSectionError, setVehiclesSectionError,
            ownerOfficerActive, setOwnerOfficerActive,
            vehiclesActive, setVehiclesActive
        }}>
            {children}
        </FormSectionsCarrierInfoContext.Provider>
    );
};

export { FormSectionsCarrierInfoContext, FormSectionsCarrierInfoProvider };