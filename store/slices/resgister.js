import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {logger} from "@/store/logger";
import {API_URL} from "@/utils/constants";

const name = 'register';

const initialState = {
    
    loading: false,
    baseStates: null,
    appTypes: null,
    storeData: null,
    extraData: null,
    members: [],
    vehicles: [],
    vehiclesErrorMessage: '',
    getCityByZipCode: [],
    dataByVin: {},
    dataByVinStatus: '', 
    permitDetails: {},
    usdotValues: {},
    usdotValuesStatus: '',
    otherExtraValues: null
};

export const getBaseStates = createAsyncThunk(
    `${name}/getBaseStates`,
    async (props, {rejectWithValue}) =>
        logger({
            method: "GET",
            url: `${API_URL}/getFormData/0`,
        })
);

export const getExtraData = createAsyncThunk(
    `${name}/getExtraData`,
    async (id, {rejectWithValue}) =>
        logger({
            method: "GET",
            url: `${API_URL}/getFormData/1/${id || 1}`,
        })
);

export const verify = createAsyncThunk(
    `${name}/verify`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/storeData`,
                body: props,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const update = createAsyncThunk(
    `${name}/update`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "PUT",
                url: `${API_URL}/updateData`,
                body: props,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

////////// Members @###########
export const storeMember = createAsyncThunk(
    `${name}/storeMember`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/members`,
                body: props,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const editMember = createAsyncThunk(
    `${name}/editMember`,
    async (id, {rejectWithValue}) => {
        try {
            return await logger({
                method: "GET",
                url: `${API_URL}/members/${id}/edit`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const updateMember = createAsyncThunk(
    `${name}/updateMember`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "PUT",
                url: `${API_URL}/members/${props.id}`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const deleteMember = createAsyncThunk(
    `${name}/deleteMember`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "DELETE",
                url: `${API_URL}/members/${props.id}`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getMembers = createAsyncThunk(
    `${name}/getMembers`,
    async (permit_id, {rejectWithValue}) => {
        try {
            return await logger({
                method: "GET",
                url: `${API_URL}/members/${permit_id}`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

////////// Vehicles @###########
export const storeVehicle = createAsyncThunk(
    `${name}/storeVehicle`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/vehicle`,
                body: props,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const editVehicle = createAsyncThunk(
    `${name}/editVehicle`,
    async (id, {rejectWithValue}) => {
        try {
            return await logger({
                method: "GET",
                url: `${API_URL}/vehicle/${id}/edit`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const updateVehicle = createAsyncThunk(
    `${name}/updateVehicle`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "PUT",
                url: `${API_URL}/vehicle/${props.id}`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const deleteVehicle = createAsyncThunk(
    `${name}/deleteVehicle`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "DELETE",
                url: `${API_URL}/vehicle/${props.id}`,
                body: props
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getVehicles = createAsyncThunk(
    `${name}/getVehicles`,
    async (permit_id, {rejectWithValue}) => {
        try {
            return await logger({
                method: "GET",
                url: `${API_URL}/vehicle/${permit_id}`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getPermitDetails = createAsyncThunk(
    `${name}/getPermitDetails`,
    async (permit_id, {rejectWithValue}) => {
        try {
            return await logger({
                method: "GET",
                url: `${API_URL}/getPermitDetails${permit_id ? "/" + permit_id : ""}`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const addOtherExtraFields = createAsyncThunk(
    `${name}/addOtherExtraFields`,
    async (props, {rejectWithValue}) => {
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/addOtherExtraFields`,
                body: props,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getOtherExtraFields = createAsyncThunk(
    `${name}/getOtherExtraFields`,
    async (permit_id, {rejectWithValue}) => {
        try {
            return await logger({
                method: "GET",
                url: `${API_URL}/getOtherExtraFields/${permit_id}`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getCityByZipCode = createAsyncThunk(
    `${name}/getCityByZipCode`,
    async (term, {rejectWithValue}) => {
        try {
            return await logger({
                method: "GET",
                url: `https://devback.ifta.online/api/v1/zipCodeOrCity/${term || ''}`,
            })
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getDataByVin = createAsyncThunk(
    `${name}/getDataByVin`,
    async ({vinCode, callback}, rejectWithValue) => {
        try {
            return await logger({
                method: 'GET',
                url: `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vinCode}/?format=json`
            }).then((data) => {
                callback && callback(data?.Results[0] || {});
                return data?.Results[0] || {};
            })
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const getUsdotValuesByNumber = createAsyncThunk(
    `${name}/getUsdotValuesByNumber`,
    async ({ usdotNumber, callback }, rejectWithValue) => {
        try {
            const response = await logger({
                method: 'GET',
                url: `https://devback.ifta.online/api/v1/usdotVerify/${usdotNumber}`
            }).then((data) => {
                callback && callback(data?.data);
                return data?.data;
            })
            return response;
        } catch (error) {
            callback(error?.data);
            rejectWithValue(error);
            return error;
        };
    }
);

export const registerSlice = createSlice({
    name,
    initialState,
    reducers: {
        setRegisterLoading: (state, {payload}) => {
            state.loading = payload
        },
        clearPermit: (state) => {
            state.permitDetails = {}
        },
        removeVehicle: (state, {payload})=> {
            state.vehicles = state.vehicles.filter(el => el.id !== payload)
        },
        removeMember: (state, {payload})=> {
            state.members = state.members.filter(el => el.id !== payload)
        },
        clearCityByZipCode: (state) => {
            state.getCityByZipCode = [];
        },
        clearDataByVin: (state) => {
            state.dataByVin = [];
        },
        clearUsdotValues: (state) => {
            state.usdotValues = {};
            state.usdotValuesStatus = '';
        },
        clearVehiclesErrorMessage: (state) => {
            state.vehiclesErrorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getBaseStates.fulfilled, (state, {payload}) => {
            state.baseStates = payload?.data?.states;
            state.appTypes = payload?.data?.applicationTypes
        });

        builder.addCase(getExtraData.fulfilled, (state, {payload}) => {
            state.extraData = payload?.data
        });

        builder.addCase(storeMember.fulfilled, (state, {payload}) => {
            // state.members.push(payload?.data)
            state.members = payload?.data;
        });
        
        builder.addCase(getMembers.fulfilled, (state, {payload}) => {
            state.members = payload?.data;
        });

        builder.addCase(storeVehicle.fulfilled, (state, {payload}) => {
            state.vehicles = payload?.data;
        });
        builder.addCase(storeVehicle.rejected, (state, { payload }) => {
            const errorMessage = payload?.result?.data?.message;
            state.vehiclesErrorMessage = errorMessage || '';
        });
        
        builder.addCase(getVehicles.fulfilled, (state, {payload}) => {
            state.vehicles = payload?.data;
        });

        builder.addCase(getPermitDetails.fulfilled, (state, {payload}) => {
            state.permitDetails = payload?.data || {};
        });

        builder.addCase(getPermitDetails.rejected, (state, {payload}) => {
            state.permitDetails = payload?.result || {};
        });

        builder.addCase(getOtherExtraFields.fulfilled, (state, {payload}) => {
            state.otherExtraValues = payload?.data;
        });

        builder.addCase(getCityByZipCode.fulfilled, (state, {payload}) => {
            state.getCityByZipCode = [...payload?.data || []];
        });

        builder.addCase(getDataByVin.fulfilled, (state, { payload }) => {
            state.dataByVin = payload?.Results?.[0] || {};
            state.dataByVinStatus = 'fulfilled'
        });
        
        builder.addCase(getDataByVin.pending, (state, { payload }) => {
            state.dataByVin = payload?.Results?.[0] || {};
            state.dataByVinStatus = 'pending'
        });
        
        builder.addCase(getUsdotValuesByNumber.fulfilled, (state, { payload }) => {
            state.usdotValues = payload?.content?.carrier ? payload : {};
            state.usdotValuesStatus = payload?.content?.carrier ? 'success': 'failed';
        });
        builder.addCase(getUsdotValuesByNumber.rejected, (state) => {
            state.usdotValues = {};
            state.usdotValuesStatus = 'failed';
        });

        builder.addMatcher(isAnyOf(verify.fulfilled, update.fulfilled), (state, {payload}) => {
            const exampleImages = {
                'extra_article_of_organization': "/assets/images/extra_article_of_organization.png",
                'extra_confirmation_letter_from_irs': "/assets/images/extra_vehicle_registration.png",
                'extra_vehicle_registration': "/assets/images/extra_confirmation_letter_from_irs.png",
            };

            state.storeData = payload?.data && {
                ...payload.data,
                fields: {
                    ...payload.data.fields,
                    extra_fields: payload.data.fields.extra_fields.map(item => {
                        return {
                            ...item,
                            exampleImagePath: exampleImages[item.key]
                        };
                    })
                }
            };

            state.permitDetails.form_id = payload?.data?.form_id
        });
    }
});

export const {
    setRegisterLoading,
    clearPermit,
    removeVehicle,
    removeMember,
    clearCityByZipCode,
    clearDataByVin,
    clearUsdotValues,
    clearVehiclesErrorMessage
} = registerSlice.actions;

export const selectBaseStates = state => state.register.baseStates;
export const selectAppTypes = state => state.register.appTypes;
export const selectStoreData = state => state.register.storeData;
export const selectExtraData = state => state.register.extraData;
export const selectMembers = state => state.register.members;
export const selectVehicles = state => state.register.vehicles;
export const selectVehiclesErrorMessage = state => state.register.vehiclesErrorMessage;
export const selectPermitDetails = state => state.register.permitDetails;
export const selectOtherExtraValues = state => state.register.otherExtraValues;
export const selectGetCityByZipCode = state => state.register.getCityByZipCode;
export const selectDataByVin = state => state.register.dataByVin;
export const selectDataByVinStatus = state => state.register.dataByVinStatus;
export const selectUsdotValues = state => state.register.usdotValues;
export const selectUsdotValuesStatus = state => state.register.usdotValuesStatus;

export default registerSlice.reducer;