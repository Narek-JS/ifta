import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL } from "@/utils/constants";
import { logger }  from "@/store/logger";

const name = 'profile';

const initialState = {
    history: null
};

export const changeContactName = createAsyncThunk(
    `${name}/changeContactName`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'PUT',
                url: `${API_URL}/profile/contactName`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const changePassword = createAsyncThunk(
    `${name}/changePassword`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'POST',
                url: `${API_URL}/profile/changePassword`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const sendVerificationCode  = createAsyncThunk(
    `${name}/sendVerificationCode`,
    async (type, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'GET',
                url: `${API_URL}/profile/sendVerificationCode/${type}`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const checkVerificationCode = createAsyncThunk(
    `${name}/checkVerificationCode`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'POST',
                url: `${API_URL}/profile/checkVerificationCode`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const changePhone = createAsyncThunk(
    `${name}/changePhone`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'PUT',
                url: `${API_URL}/profile/changePhone`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const verifyPhone = createAsyncThunk(
    `${name}/verifyPhone`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'PUT',
                url: `${API_URL}/profile/verifyPhone`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const changeEmail = createAsyncThunk(
    `${name}/changeEmail`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'PUT',
                url: `${API_URL}/profile/changeEmail`,
                body: props
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
                method: 'POST',
                url: `${API_URL}/profile/resetPassword`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getUserHistory  = createAsyncThunk(
    `${name}/getUserHistory`,
    async (callback, {rejectWithValue}) => {
        try {
            const res = await logger({
                method: 'GET',
                url: `${API_URL}/profile/orderHistory`,
            });
            if(res?.action && typeof callback === 'function') {
                callback();
            };
            return res;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const replicateOrder = createAsyncThunk(
    `${name}/replicateOrder`,
    async (props, { rejectWithValue }) => {
        try {
            const res = await logger({
                method: 'POST',
                url: `${API_URL}/order/replicateOrder`,
                body: props?.body
            });
            if(props?.callback && res.data) {
                props?.callback(res.data);
            };

            return res;

        } catch (res) {
            if(props?.rejectCallback && res?.result?.data && Object.values(res?.result?.data)?.length) {
                const message = Object.values(res?.result?.data)?.[0]?.[0];
                if(message) {
                    props?.rejectCallback(message);
                };
            };
            return rejectWithValue(res);
        }
    }
);

export const profileSlice = createSlice({
    name,
    initialState,
    reducers: {
        setProfileLoading: (state, { payload })=> {
            state.loading = payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserHistory.fulfilled, (state, { payload }) => {
            if (payload?.action) {
                state.history = payload?.data;
            }
        });

        builder.addCase(replicateOrder.fulfilled, (state, { payload }) => {
            if(payload?.action) {
                
            };
        });
    }
});

export const selectUserHistory = state => state.profile?.history;


export default profileSlice.reducer;