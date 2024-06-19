import { authMiddleware } from "./middlewares/auth-middlewares.js";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import { faqsSlice } from "./slices/faq.js";
import authReducer from './slices/auth.js';
import commonReducer from './slices/common.js';
import profileReducer from './slices/profile.js';
import paymentReducer from './slices/payment.js';
import permitsReducer from './slices/permits.js';
import vehiclesReducer from './slices/vehicles.js';
import registerReducer from './slices/resgister.js';
import questionnaireReducer from './slices/questionnaire.js';

const combineReducer = combineReducers({
    [faqsSlice.reducerPath]: faqsSlice.reducer,
    auth: authReducer,
    register: registerReducer,
    common: commonReducer,
    questionnaire: questionnaireReducer,
    payment: paymentReducer,
    profile: profileReducer,
    vehicles: vehiclesReducer,
    permits: permitsReducer,
});

export const store = configureStore({
    reducer: combineReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat([faqsSlice.middleware, authMiddleware]),
});