import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { logger } from "@/store/logger";
import { API_URL } from "@/utils/constants";
import Cookies from 'js-cookie';

const name = 'auth';

const initialState = {
    user: null,
    token: "",
    authStatus: "initial" 
};

export const googleLogin = createAsyncThunk(
    `${name}/googleLogin`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/googleLogin`,
                body: props,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const userRegister = createAsyncThunk(
    `${name}/userRegister`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/register`,
                body: props,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const userLogin = createAsyncThunk(
    `${name}/userLogin`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/login`,
                body: props,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const userRefresh = createAsyncThunk(
    `${name}/userRefresh`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "GET",
                url: `${API_URL}/refresh`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const userLogout = createAsyncThunk(
    `${name}/userLogout`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "GET",
                url: `${API_URL}/logout`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getUser = createAsyncThunk(
    `${name}/getUser`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'GET',
                url: `${API_URL}/me`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const forgotPassword = createAsyncThunk(
    `${name}/forgotPassword`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/resetEmail`,
                body: props,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const resetPassword = createAsyncThunk(
    `${name}/resetPassword`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/reset`,
                body: props,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const ContactUs = createAsyncThunk(
    `${name}/ContactUs`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/contact`,
                body: props,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const postComment = createAsyncThunk(
    `${name}/postComment`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/comments`,
                body: props,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const resendEmailVerify = createAsyncThunk(
    `${name}/resendEmailVerify`,
    async (props, { rejectWithValue }) => {
        try {
            return await logger({
                method: 'POST',
                url: `${API_URL}/resendEmail`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

export const authSlice = createSlice({
    name,
    initialState,
    reducers: {
        setAuth: (state, { payload }) => {
            if(payload?.access_token && payload?.expires_in) {
                Cookies.set("authorized", payload?.access_token, {
                    expires: payload?.expires_in,
                });
                state.token = payload?.access_token;
                const date = new Date();
                localStorage.setItem("expires_date", (date.getTime() + (payload?.expires_in * 1000)));
                state.authStatus = 'fulfilled';
            } else {
                state.token = payload;
            };
        },
        deleteUserDetails : state => {
            Cookies.remove("authorized");
            localStorage.removeItem("expires_date")
            state.user = null
            state.token = ""
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUser.fulfilled, (state, {payload}) => {
            if (payload?.action) {
                state.user = {...payload?.data?.user, role: payload?.data?.user?.is_admin ? 'admin' : ''};
                state.authStatus = 'success';
            };
        });
        builder.addMatcher(isAnyOf(userLogout.fulfilled, userLogout.rejected), (state, {payload}) => {
            Cookies.remove("authorized");
            localStorage.removeItem("expires_date");
            state.user = null;
            state.token = "";
            state.authStatus = "";
        });
        builder.addMatcher(isAnyOf(userLogin.fulfilled, userRefresh.fulfilled, googleLogin.fulfilled), (state, {payload}) => {
            Cookies.set("authorized", payload?.data?.access_token, {
                expires: payload?.data?.expires_in,
            });
            state.token = payload?.data?.access_token;
            const date = new Date();
            localStorage.setItem("expires_date", (date.getTime() + (payload?.data?.expires_in * 1000)))
            state.authStatus = 'fulfilled'
        });
    }
});

export const selectAuthStatus = state => state?.auth?.authStatus
export const selectUserData = state => state?.auth?.user;
export const selectIsUser = state => !!state?.auth?.user;
export const selectAuth = state => state?.auth?.token;

export const {setAuth, deleteUserDetails} = authSlice.actions;

export default authSlice.reducer;