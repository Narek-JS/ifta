import { userLogout } from "../slices/auth";
import menuData from '@/data/menu.js';
import { clearStoreData, clearTaxReturnPeriod } from "../slices/resgister";

const authMiddleware = (store) => (next) => (action) => {
    if(
        action?.meta?.requestStatus === "rejected" &&
        action.payload?.status === 401 &&
        action.payload?.result?.expired &&
        store?.getState()?.auth?.user &&
        store?.getState()?.auth?.token
    ) {
        store.dispatch(userLogout())
            .finally(() => {
                store.dispatch(clearTaxReturnPeriod());
                store.dispatch(clearStoreData());

                const pathname = window.location.pathname;
                
                const form = pathname.split("/")[1] === "form";
                const profile = menuData.profileLinks.find(link => link === router.pathname);;

                if(form || profile) {
                    window.location.pathname = '/';
                };
            });
    } else {
        next(action);
    };
};

export { authMiddleware };