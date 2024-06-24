import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL } from "@/utils/constants";
import { logger } from "../logger";

const name = 'vehicles';

const initialState = {
    vehicles: null,
    vehiclesStatus: ''
};

export const getUserVehicles = createAsyncThunk(
    `${name}/getUserVehicles`,
    async (props, { rejectWithValue }) => {
        try {
            return await logger({
                method: 'GET',
                url: `${API_URL}/profile/getVehicles`,
                body: props
            });
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const vehiclesSlice = createSlice({
    name,
    initialState,
    reducers: {
        clearVehicles: (state) => {
            state.vehiclesStatus = '';
            state.vehicles = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserVehicles.pending, (state) => {
            state.vehiclesStatus = 'panding';
            state.vehicles = null;
        });

        builder.addCase(getUserVehicles.fulfilled, (state, { payload }) => {
            if (payload?.action) {
                state.vehicles = payload?.data;
                state.vehiclesStatus = 'success';
            }
        });

        builder.addCase(getUserVehicles.rejected, (state) => {
            state.vehiclesStatus = 'failed';
            state.vehicles = null;
        });

    }
});

export const selectVehicles = (state) => state.vehicles.vehicles;
export const selectVehiclesStatus = (state) => state.vehicles.vehiclesStatus;

export const { actions: { clearVehicles } } = vehiclesSlice;

export default vehiclesSlice.reducer;