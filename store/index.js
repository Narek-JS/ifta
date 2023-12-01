import {combineReducers, configureStore} from "@reduxjs/toolkit";
import authReducer from './slices/auth.js';
import commonReducer from './slices/common.js';
import registerReducer from './slices/resgister.js'
import questionnaireReducer from './slices/questionnaire.js'
import paymentReducer from './slices/payment.js'
import profileReducer from './slices/profile.js'
import { postsSlice } from './slices/posts.js'
import { faqsSlice } from "./slices/faq.js";

const combineReducer = combineReducers({
    [postsSlice.reducerPath]: postsSlice.reducer,
    [faqsSlice.reducerPath]: faqsSlice.reducer,
    auth: authReducer,
    register: registerReducer,
    common: commonReducer,
    questionnaire: questionnaireReducer,
    payment: paymentReducer,
    profile: profileReducer,
});

export const store = configureStore({
    reducer: combineReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([postsSlice.middleware, faqsSlice.middleware]),
});