import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {logger} from "@/store/logger";
import {API_URL} from "@/utils/constants";

const name = 'payment';

const initialState = {
    loading: false,
    carrierInfo: null,
    status: '',
    message: '',
    paymentFromEmailData: null,
    paymentFromEmailStatus: ''
};

export const getCarrierInfo = createAsyncThunk(
    `${name}/getCarrierInfo`,
    async (permit_id, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'GET',
                url: `${API_URL}/order/getCarrierInformation/${permit_id}`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const createOrder = createAsyncThunk(
    `${name}/createOrder`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'POST',
                url: `${API_URL}/order/createOrder`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);


export const paymentFromEmail = createAsyncThunk(
    `${name}/paymentFromEmail`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'GET',
                url: `${API_URL}/get-permit-for-order?hash=${props.token}`
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const paymentSlice = createSlice({
    name,
    initialState,
    reducers: {
        setPaymentLoading: (state, { payload }) => {
            state.loading = payload
        },
        setPaymentStatus: (state, { payload }) => {
            state.status = payload;
        },
        clearPaymentStatus: (state) => {
            state.status = '';
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCarrierInfo.fulfilled, (state, {payload}) => {
            if (payload?.action) {
                state.carrierInfo = payload?.data;
            };
        });
        builder.addCase(createOrder.fulfilled, (state, { payload }) => {
            if(payload?.action) {
                state.status = 'success';
                state.message = payload.message;
            } else {
                state.status = 'faild';
                state.message = '';
            };
        });

        builder.addCase(createOrder.rejected, (state, { payload }) => {
            if(!payload?.action) {
                state.status = 'faild';
                state.message = '';
            };
        });

        builder.addCase(paymentFromEmail.pending, (state) => {
            state.paymentFromEmailStatus = 'pending';
        });

        builder.addCase(paymentFromEmail.fulfilled, (state, { payload }) => {
            state.paymentFromEmailData = payload?.data;
            state.paymentFromEmailStatus = 'success';
        });
    }
});

export const selectCarrierInfo = state => state?.payment?.carrierInfo;
export const selectPaymentStatus = state => state?.payment?.status;
export const selectPaymentMessage = state => state?.payment?.message;
export const selectPaymentFromEmailData = state => state?.payment?.paymentFromEmailData;
export const selectPaymentFromEmailStatus = state => state?.payment?.paymentFromEmailStatus;

export const { setPaymentLoading, setPaymentStatus, clearPaymentStatus } = paymentSlice.actions;

export default paymentSlice.reducer;