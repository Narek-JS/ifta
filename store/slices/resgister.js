import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { API_URL, VEHICLE_VIN_API } from "@/utils/constants";
import { logger } from "@/store/logger";

const name = 'register';

const initialState = {
    loading: false,
    baseStates: null,
    appTypes: null,
    storeData: null,
    extraData: null,
    allFuelTypes: [],
    members: [],
    vehicles: [],
    vehiclesErrorMessage: '',
    getCityByZipCode: [],
    dataByVin: {},
    dataByVinStatus: '', 
    permitDetails: {},
    usdotValues: {},
    usdotValuesStatus: '',
    otherExtraValues: null,
    taxReturnPeriod: null,
    taxReturnPeriodStatus: '',
    quarterlyFillingsList: null,
    quarterlyFillingsListStatus: '',

    editQarterRowStatus: '',
    qarterRowData: null,

    allQuarters: null,
    allQuartersStatus: ''
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
        const isFormData = props instanceof FormData; 
        const id = isFormData && props.get('id');
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/members/${id}`,
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
        const isFormData = props instanceof FormData; 
        const id = isFormData && props.get('id');
        try {
            return await logger({
                method: "POST",
                url: `${API_URL}/vehicle/${id}`,
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
            if(!permit_id) {
                return new Promise(async (resolve, reject) => {
                    try {
                        resolve({ newPermit: true });
                    } catch (error) {
                        console.log(error, 'err');
                        resolve(error);
                    };
                });
            };

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
                url: `${API_URL}/zipCodeOrCity/${term || ''}`,
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
                url: VEHICLE_VIN_API + vinCode + '/?format=json'
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
                url: API_URL + `/usdotVerify/${usdotNumber}`
            }).then((data) => {
                callback && callback(data?.data);
                return data?.data;
            });
            return response;
        } catch (error) {
            callback(error?.data);
            rejectWithValue(error);
            return error;
        };
    }
);

export const getQuarter = createAsyncThunk(
    `${name}/getQuarter`,
    async (props, rejectWithValue) => {
        try {
            const response = await logger({
                method: 'GET',
                url: API_URL + '/getQuarter'
            }).then((data) => {
                if(props?.callback) {
                    props.callback(data?.data);
                };
                return data;
            });

            return response?.data;
        } catch (error) {
            rejectWithValue(error);
            return error;
        };
    }
);

export const createQuarterPeriod = createAsyncThunk(
    `${name}/createQuarterPeriod`,
    async ({ payload, callback, rejectCallback }, rejectWithValue) => {
        try {
            const response = await logger({
                method: 'POST',
                url: `${API_URL}/quarterly-fillings`,
                body: payload
            });

            if(response instanceof Error && rejectCallback) {
                rejectCallback();
                return response?.data;
            };


            if(!response.action && response.message && rejectCallback) {
                rejectCallback(response.message);
                return response?.data;
            };

            if(callback) {
                callback(response);
            };

            return response?.data;
        } catch (error) {
            if(rejectCallback) {
                if(error?.result?.data && Object.values(error?.result?.data)?.length) {
                    const message = Object.values(error?.result?.data)?.[0]?.[0];
                    if(message) {
                        return rejectCallback(message);
                    };
                };
                rejectCallback(error?.result?.message);
            };
            rejectWithValue(error);
            return error;
        };
    }
);

export const getQuarterlyFillings = createAsyncThunk(
    `${name}/getQuarterlyFillings`,
    async ({ permit_id, callback }, rejectWithValue) => {
        try {
            const response = await logger({
                method: 'GET',
                url: `${API_URL}/quarterly-fillings?permit_id=${permit_id}`
            });

            if(callback) {
                callback(response?.data);
            };

            return response?.data;
        } catch (error) {
            rejectWithValue(error);
            return error;
        };
    }
);

export const quarterDelete = createAsyncThunk(
    `${name}/quarterDelete`,
    async ({ id, callback }, rejectWithValue) => {
        try {
            const response = await logger({
                method: 'DELETE',
                url: `${API_URL}/quarterly-fillings/${id}` 
            });

            if(callback) {
                callback();
            };

            return response;
        } catch (error) {
            rejectWithValue(error);
            return error;
        };
    }
);

export const getQuarterRow = createAsyncThunk(
    `${name}/getQuarterRow`,
    async ({ id, callback }, rejectWithValue) => {
        try {
            const response = await logger({
                method: 'GET',
                url: `${API_URL}/quarterly-fillings/${id}`
            });

            if(callback) {
                callback(response.data);
            };

            return response.data;
        } catch (error) {
            rejectWithValue(error);
            return error;
        };
    }
);

export const getAllQuarters = createAsyncThunk(
    `${name}getAllQuarters`,
    async ({ callback, rejectCallback }, rejectWithValue) => {
        try {
            const response = await logger({
                method: 'GET',
                url: `${API_URL}/quarterly-fillings`
            });

            if(response instanceof Error && rejectCallback) {
                rejectCallback();
                return response?.data;
            };


            if(!response.action && response.message && rejectCallback) {
                rejectCallback(response.message);
                return response?.data;
            };

            if(callback) {
                callback(response);
            };

            return response;
        } catch (error) {
            rejectWithValue(error);
            if(rejectCallback) {
                rejectCallback(error?.result?.message);
            };
            return error;
        };
    }
);


export const updateQuarter = createAsyncThunk(
    `${name}/updateQuarter`,
    async ({ id, payload, callback, rejectCallback }, rejectWithValue) => {
        try {
            const response = await logger({
                method: 'PUT',
                url: `${API_URL}/quarterly-fillings/${id}`,
                body: payload
            });
            if(response instanceof Error && rejectCallback) {
                rejectCallback();
                return response?.data;
            };

            if(!response.action && response.message && rejectCallback) {
                rejectCallback(response.message);
                return response?.data;
            };

            if(callback) {
                callback(response);
            };

            return response;
        } catch (error) {
            if(rejectCallback && error?.result?.message) {
                rejectCallback(error?.result?.message);
            };
            rejectWithValue(error);
            return error;
        };
    }
);

export const removeQuarterPeriod = createAsyncThunk(
    `${name}/removeQuarterPeriod`,
    async ({ callback, rejectCallback, payload }, rejectWithValue) => {
        try {
            const response = await logger({
                method: 'DELETE',
                url: `${API_URL}/quarterly-fillings/remove-data`,
                body: payload 
            });

            if(callback) {
                callback();
            };

            return response;
        } catch (error) {
            if(rejectCallback && error?.result?.message) {
                rejectCallback(error?.result?.message);
            };
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
        },
        clearQuarterlyFillings: (state) => {
            state.quarterlyFillingsList = null;
            state.quarterlyFillingsListStatus = '';
        },
        clearQarterRowData: (state) => {
            state.editQarterRowStatus = '';
            state.qarterRowData = null;
        },
        clearStoreData: (state) => {
            state.storeData = null;
        },
        clearAllQuarters: (state) => {
            state.allQuarters = null;
            state.allQuartersStatus = 'pending';
        },
        clearTaxReturnPeriod: (state) => {
            state.taxReturnPeriod = null;
            state.taxReturnPeriodStatus = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getBaseStates.fulfilled, (state, {payload}) => {
            state.baseStates = payload?.data?.states;
            state.appTypes = payload?.data?.applicationTypes;
            state.baseStatesWithCanada = payload?.data?.allWithCanada;
        });

        builder.addCase(getExtraData.fulfilled, (state, {payload}) => {
            state.extraData = {
                ...payload?.data,
                ...(Array.isArray(payload?.data?.fuelType) && {
                    fuelType: payload.data.fuelType.filter(type => String(type?.status) === '1')
                })
            };

            if(Array.isArray(payload?.data?.fuelType)) {
                state.allFuelTypes = payload?.data?.fuelType;
            };

        });

        builder.addCase(storeMember.fulfilled, (state, {payload}) => {
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
            if(!payload?.content?.carrier) {
            };
        });
        builder.addCase(getUsdotValuesByNumber.rejected, (state) => {
            state.usdotValues = {};
            state.usdotValuesStatus = 'failed';
        });

        builder.addCase(getQuarter.fulfilled, (state, { payload }) => {
            state.taxReturnPeriod = payload || null;
            state.taxReturnPeriodStatus = payload ? 'success' : 'failed';
        });

        builder.addCase(getQuarter.rejected, (state) => {
            state.taxReturnPeriod = null;
            state.taxReturnPeriodStatus = 'failed';
        });

        builder.addCase(getQuarter.pending, (state) => {
            state.taxReturnPeriod = null;
            state.taxReturnPeriodStatus = 'panding';
        });

        builder.addCase(getQuarterlyFillings.fulfilled, (state, { payload }) => {
            state.quarterlyFillingsList = payload;
            state.quarterlyFillingsListStatus = payload ? 'success' : 'failed';
        });

        builder.addCase(getQuarterlyFillings.rejected, (state) => {
            state.quarterlyFillingsList = null;
            state.quarterlyFillingsListStatus = 'failed';
        });

        builder.addCase(getQuarterlyFillings.pending, (state) => {
            state.quarterlyFillingsListStatus = 'pending';
        });

        builder.addCase(getQuarterRow.pending, (state) => {
            state.editQarterRowStatus = 'panding';
        });

        builder.addCase(getQuarterRow.fulfilled, (state, { payload }) => {
            state.editQarterRowStatus = 'success';
            state.qarterRowData = payload;
        });

        builder.addCase(getQuarterRow.rejected, (state) => {
            state.editQarterRowStatus = 'failed';
            state.qarterRowData = null;
        });

        builder.addCase(getAllQuarters.pending, (state) => {
            state.allQuarters = null;
            state.allQuartersStatus = 'pending';
        });

        builder.addCase(getAllQuarters.fulfilled, (state, { payload }) => {
            const isAnyPaidQuarter = payload?.data?.find((quarter, index) => quarter?.is_paid && index !== 0); 

            if(Array.isArray(payload?.data)) {
                for(let i = 0; i < payload?.data?.length; i++) {
                    const quarter = payload?.data?.[i];
                    if(isAnyPaidQuarter) {
                        if(quarter?.is_paid) {
                            break;
                        };
                        quarter.is_filling_expired = false;
                    } else {
                        quarter.is_filling_expired = false;
                    };
                };
            };

            state.allQuarters = payload;
            state.allQuartersStatus = 'success';
        });


        builder.addCase(getAllQuarters.rejected, (state) => {
            state.allQuarters = null;
            state.allQuartersStatus = 'failed';
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
    clearVehiclesErrorMessage,
    clearQuarterlyFillings,
    clearQarterRowData,
    clearStoreData,
    clearAllQuarters,
    clearTaxReturnPeriod
} = registerSlice.actions;

export const selectBaseStates = state => state.register.baseStates;
export const selectAppTypes = state => state.register.appTypes;
export const selectAppTypesWithoutTemp = state => {
    if(Array.isArray(state.register.appTypes)) {
        return state.register.appTypes?.filter(appType => appType?.name !== 'Temporary Permits')
    };
    return [];
};
export const selectStoreData = state => state.register.storeData;
export const selectExtraData = state => state.register.extraData;
export const selectAllFuelTypes = state => state.register.allFuelTypes;
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
export const selectTaxReturnPeriod = state => state.register.taxReturnPeriod;
export const selectTaxReturnPeriodStatus = state => state.register.taxReturnPeriodStatus;
export const selectQuarterlyFillingsList = state => state.register.quarterlyFillingsList;
export const selectQuarterlyFillingsListStatus = state => state.register.quarterlyFillingsListStatus;
export const selectEditQarterRowStatus = state => state.register.editQarterRowStatus;
export const selectQarterRowData = state => state.register.qarterRowData;
export const selectBaseStatesWithCanada = state => state.register.baseStatesWithCanada;
export const selectAllQuarters = state => state.register.allQuarters;
export const selectAllQuartersStatus = state => state.register.allQuartersStatus;

export default registerSlice.reducer;