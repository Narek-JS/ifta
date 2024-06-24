import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL } from "@/utils/constants";
import { logger } from "../logger";

const name = 'permits';

const initialState = {
    permits: null,
    permitsStatus: ''
};

export const getUserPermits = createAsyncThunk(
    `${name}/getUserPermits`,
    async (props, { rejectWithValue }) => {
        try {
            return await logger({
                method: 'GET',
                url: `${API_URL}/profile/getPermits`,
                body: props
            });
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const removePermit = createAsyncThunk(
    `${name}/removePermit`,
    async ({permitId, callback}, { rejectWithValue }) => {
        try {
            const response = await logger({
                method: 'DELETE',
                url: `${API_URL}/delete-permit?form_id=${permitId}`
            });

            if(callback) {
                callback(response);
            };

            return response;
        } catch(err) {
            return rejectWithValue(err);
        };
    }
);

export const permitsSlice = createSlice({
    name,
    initialState,
    reducers: {
        clearPermits: (state) => {
            state.permitsStatus = '';
            state.permits = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserPermits.pending, (state) => {
            state.permitsStatus = 'panding';
            state.permits = null;
        });

        builder.addCase(getUserPermits.fulfilled, (state, { payload }) => {
            if (payload?.action) {
                state.permits = payload?.data;
                state.permitsStatus = 'success';
            }
        });

        builder.addCase(getUserPermits.rejected, (state) => {
            state.permitsStatus = 'failed';
            state.permits = null;
        });

    }
});

export const selectPermits = (state) => state.permits.permits;
export const selectPermitsStatus = (state) => state.permits.permitsStatus;

export const { actions: { clearPermits } } = permitsSlice;

export default permitsSlice.reducer;