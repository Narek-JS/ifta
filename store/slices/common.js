import { createSlice} from "@reduxjs/toolkit";

const name = 'register';

const initialState = {
    popUp: "",
    popUpContent: "",
    popUpAction: null
};

export const commonSlice = createSlice({
    name,
    initialState,
    reducers: {
        setLoading: (state, {payload}) => {
            state.loading = payload
        },
        setPopUp: (state, { payload }) => {
            state.popUp = payload.popUp;
            state.popUpContent = payload.popUpContent;
            state.popUpAction = payload.popUpAction;
        }
    }
});

export const {setLoading, setPopUp} = commonSlice.actions;

export const selectPopUp = state => state?.common?.popUp;
export const selectPopUpContent = state => state?.common?.popUpContent;
export const selectPopUpAction = state => state?.common?.popUpAction;

export default commonSlice.reducer;