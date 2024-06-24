import { clearStoreData, clearTaxReturnPeriod } from "../slices/resgister";
import { userLogout } from "../slices/auth";
import menuData from '@/data/menu.js';

// Middleware function to handle authentication-related actions.
const authMiddleware = (store) => (next) => (action) => {
    // Check if the action is a rejected request with status code 401 (Unauthorized),
    // and if the user is logged in and has a valid token.
    if(
        action?.meta?.requestStatus === "rejected" &&
        action.payload?.status === 401 &&
        action.payload?.result?.expired &&
        store?.getState()?.auth?.user &&
        store?.getState()?.auth?.token
    ) {
        // Dispatch logout action for the user.
        store.dispatch(userLogout())
            .finally(() => {
                // Clear additional data from the store.
                store.dispatch(clearTaxReturnPeriod());
                store.dispatch(clearStoreData());

                // Get the current pathname.
                const pathname = window.location.pathname;
                
                // Check if the current pathname belongs to a form or a profile page.
                const form = pathname.split("/")[1] === "form";
                const profile = menuData.profileLinks.find(link => link === router.pathname);;

                // Redirect to the home page if the current page is a form or a profile page.
                if(form || profile) {
                    window.location.pathname = '/';
                };
            });
    } else {
        // If the action does not meet the criteria, proceed with the next middleware.
        next(action);
    };
};

export { authMiddleware };