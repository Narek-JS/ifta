import { Autocomplete, TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCities } from "@/store/slices/questionnaire";
import { styled } from '@mui/system';
import InputField from "@/components/universalUI/InputField";
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";
import NormalBtn from "@/components/universalUI/NormalBtn";

const GroupHeader = styled('div')(() => ({
  position: 'sticky',
  top: '-8px',
  padding: ' 4px 10px',
  color: 'black',
  backgroundColor: '#F5F5F5',
  fontWeight: '700'
}));

export default function StorageItem({
    data,
    storageErrors,
    setStorageErrors,
    dataStates,
    setStorage,
    i,
    states,
    storage
}) {
    const dispatch = useDispatch();
    const [cities, setCities] = useState(null);
    const state = data.state;
    
    const stateByCategorys = states.reduce((acc, item) => {
        acc[item.country].push({ 
            state: item.state,
            category: item.country,
            groupName: item.country === 'canada' ? 'Canada' : 'USA'
        });
        return acc;
    }, { canada: [], usa: [] })

    const options = [
        ...stateByCategorys.usa.sort((a, b) => a.state.localeCompare(b.state)),
        ...stateByCategorys.canada.sort((a, b) => a.state.localeCompare(b.state))
    ];

    useEffect(() => {
        if (state) {
            const shortState = dataStates.find(el => el.state === state);
            if(shortState){
                dispatch(getCities({state: shortState.app, country: shortState.country === 'usa' ? 'US' : 'CA'}))
                    .then(res => {
                        const selectedCities = storage.reduce((acc, { city, state }) => {
                            if(acc[state]) {
                                acc[state].push(city);
                            } else {
                                acc[state] = [city];
                            };
                            return acc;
                        }, {});

                        setCities(res?.payload?.map(el => el.name).filter(city => !selectedCities[shortState.state].includes(city)))
                    });
            };
        };
    }, [state]);

    return (
        <Fragment>
            <div className="storageItem flex gap20 mb20">
                <InputField
                    error={storageErrors?.[i]?.state}
                    className="inputField"
                    label="Jurisdiction"
                    required={true}
                    element={<Autocomplete
                        onChange={(e, value) => {
                            setCities(null);
                            setStorageErrors(prev => {
                                let newErrors = [...prev];
                                newErrors[i] = {
                                    ...newErrors[i],
                                    state: (value?.state || value) ? "" : "Required"
                                }
                                return newErrors;
                            })
                            setStorage(prev => {
                                let newValues = [...prev];
                                newValues[i] = {
                                    state: (value?.state || value),
                                    city: ""
                                }
                                return newValues;
                            })
                        }}
                        value={data.state || ""}
                        popupIcon={<PopupIcon />}
                        name="state"
                        slotProps={{popper: {sx: {zIndex: 98}}}}
                        renderInput={(params) => <TextField {...params} placeholder="Select Jurisdiction"/>}
                        options={options.sort((a, b) => - a.groupName.localeCompare(b.groupName))}
                        groupBy={(option) => option.groupName}
                        getOptionLabel={(option) => {
                            return option.state || option || '';
                        }}
                        renderGroup={(params) => (
                            <li key={params.key}>
                                <GroupHeader>{params.group}</GroupHeader>
                                <ul>{params.children}</ul>
                            </li>
                        )}
                    />}
                />
                <InputField
                    error={storageErrors?.[i]?.city}
                    className={`inputField ${!state ? "disabled" : ""}`}
                    label="City"
                    required={true}
                    element={<Autocomplete
                        onChange={(e, value) => {
                            setStorageErrors(prev => {
                                let newErrors = [...prev];
                                newErrors[i] = {
                                    ...newErrors[i],
                                    city: value ? "" : "Required"
                                }
                                return newErrors;
                            })
                            setStorage(prev => {
                                let newValues = [...prev];
                                newValues[i] = {
                                    ...newValues[i],
                                    city: value
                                }
                                return newValues;
                            })
                        }}
                        value={data.city || null}
                        popupIcon={<PopupIcon />}
                        name="city"
                        loading={!cities}
                        options={cities || []}
                        slotProps={{popper: {sx: {zIndex: 98}}}}
                        renderInput={(params) => <TextField {...params} placeholder="Select city"/>}
                    />}
                />
                {i !== 0 && <NormalBtn
                    onClick={() => {
                        setStorage((prev) => {
                            let newValues = [...prev];
                            const removeIndex = newValues.findIndex(el => el === data);
                            newValues.splice(removeIndex, 1);
                            return newValues;
                        })
                        setStorageErrors((prev) => {
                            let newValues = [...prev];
                            const removeIndex = newValues.findIndex(el => el === prev[i]);
                            newValues.splice(removeIndex, 1);
                            return newValues;
                        })
                    }}
                    className="filled primary"
                >
                    Remove
                </NormalBtn>}
            </div>
        </Fragment>
    )
}