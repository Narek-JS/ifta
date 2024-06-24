import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logger } from "@/store/logger";
import { API_URL } from "@/utils/constants";

const name = 'questionnaire';

const initialState = {
    loading: false,
    permitId: "",
    questionnaires: null,
};

export const getPermitId = createAsyncThunk(
    `${name}/getPermitId`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'GET',
                url: `${API_URL}/getPermitDetails/id`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getQuestionnaires = createAsyncThunk(
    `${name}/getQuestionnaires`,
    async (permit_id, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'GET',
                url: `${API_URL}/questionnaires/${permit_id}`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const storeQuestionnaires = createAsyncThunk(
    `${name}/storeQuestionnaires`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'PUT',
                url: `${API_URL}/questionnaires`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getCities = createAsyncThunk(
    `${name}/getCities`,
    async ({state, country}, {rejectWithValue}) => {
        try {
            return await logger({
                method: 'GET',
                url: `https://api.countrystatecity.in/v1/countries/${country}/states/${state}/cities`,
                additionalHeaders: {"X-CSCAPI-KEY": "a25Ia2o1WTBOVmtObm1kTWVncGQ4eUVyQlJsRHFoYjRCeHhtT1R3Mg=="}
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);


export const questionnaireSlice = createSlice({
    name,
    initialState,
    reducers: {
        setQuestionnaireLoading: (state, {payload})=> {
            state.loading = payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPermitId.fulfilled, (state, {payload}) => {
            if (payload?.action) {
                state.permitId = payload?.data?.form_id;
            }
        });
        builder.addCase(getQuestionnaires.fulfilled, (state, {payload}) => {
            if (payload?.action) {
                state.questionnaires = payload?.data;
            }
        });
    }
});

export const selectPermitId = state => state?.questionnaire?.permitId;
export const selectQuestionnaires = state => state?.questionnaire?.questionnaires;
export const selectQuestionnaireLoadding = state => state?.questionnaire.loading;

export const { setQuestionnaireLoading } = questionnaireSlice.actions;

export default questionnaireSlice.reducer;