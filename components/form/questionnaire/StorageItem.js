import { getCities } from "@/store/slices/questionnaire";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { styled } from '@mui/system';

import InputField from "@/components/universalUI/InputField";
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";
import NormalBtn from "@/components/universalUI/NormalBtn";

// Styled component for group header.
const GroupHeader = styled('div')(() => ({
  position: 'sticky',
  top: '-8px',
  padding: ' 4px 10px',
  color: 'black',
  backgroundColor: '#F5F5F5',
  fontWeight: '700'
}));

export default function StorageItem({ data, storageErrors, setStorageErrors, dataStates, setStorage, i, states, storage }) {
    const dispatch = useDispatch();
    const [cities, setCities] = useState(null);
    const state = data.state;

    // Fetch cities when the state changes.
    useEffect(() => {
        if(state) {
            // Find the short state code.
            const shortState = dataStates.find(el => el.state === state);
            if(shortState) {
                // Dispatch action to get cities.
                dispatch(getCities({state: shortState.app, country: shortState.country === 'usa' ? 'US' : 'CA'}))
                    .then(res => {
                        // collect all selected cities.
                        const selectedCities = storage.reduce((acc, { city, state }) => {
                            if(acc[state]) {
                                acc[state].push(city);
                            } else {
                                acc[state] = [city];
                            };
                            return acc;
                        }, {});

                        // Set the selected cities.
                        setCities(res?.payload?.map(el => el.name).filter(city => !selectedCities[shortState.state].includes(city)))
                    });
            };
        };
    }, [state]);

    // Prepare options for the Autocomplete component.
    const options = useMemo(() => {
        // seperate staets by Canada and USA.
        const stateByCategorys = states.reduce((acc, item) => {
            acc[item.country].push({ 
                state: item.state,
                category: item.country,
                groupName: item.country === 'canada' ? 'Canada' : 'USA'
            });
            return acc;
        }, { canada: [], usa: [] });

        // return sorted states from top are USA.
        return [
            ...stateByCategorys.usa.sort((a, b) => a.state.localeCompare(b.state)),
            ...stateByCategorys.canada.sort((a, b) => a.state.localeCompare(b.state))
        ];
    }, [states]);

    // Handle state change
    const handleStateChange = (e, value) => {
        // Reset cities.
        setCities(null);

        // Update storage state error.
        setStorageErrors(prev => {
            let newErrors = [...prev];
            newErrors[i] = { ...newErrors[i], state: (value?.state || value) ? "" : "Required" };
            return newErrors;
        });

        // Update storage state values.
        setStorage(prev => {
            let newValues = [...prev];
            newValues[i] = { state: (value?.state || value), city: "" };
            return newValues;
        });
    };

    // Handle city change.
    const handleCityChange = (e, value) => {
        // Update storage state error.
        setStorageErrors(prev => {
            let newErrors = [...prev];
            newErrors[i] = { ...newErrors[i], city: value ? "" : "Required" };
            return newErrors;
        });

        // Update storage state values.
        setStorage(prev => {
            let newValues = [...prev];
            newValues[i] = { ...newValues[i], city: value };
            return newValues;
        });
    };

    // Handle remove question item.
    const handleRemoveQuestionItem = () => {
        // Update Storage state value, with deleted question.
        setStorage((prev) => {
            let newValues = [...prev];
            const removeIndex = newValues.findIndex(el => el === data);
            newValues.splice(removeIndex, 1);
            return newValues;
        });

        // Update Storage state errores, with deleted question.
        setStorageErrors((prev) => {
            let newValues = [...prev];
            const removeIndex = newValues.findIndex(el => el === prev[i]);
            newValues.splice(removeIndex, 1);
            return newValues;
        });
    };

    return (
        <div className="storageItem flex gap20 mb20">
            <InputField
                error={storageErrors?.[i]?.state}
                className="inputField"
                label="Jurisdiction"
                required={true}
                element={<Autocomplete
                    onChange={handleStateChange}
                    value={data.state || ""}
                    popupIcon={<PopupIcon />}
                    name="state"
                    slotProps={{popper: {sx: {zIndex: 98}}}}
                    renderInput={(params) => <TextField {...params} placeholder="Select Jurisdiction"/>}
                    options={options.sort((a, b) => - a.groupName.localeCompare(b.groupName))}
                    groupBy={(option) => option.groupName}
                    getOptionLabel={(option) => option.state || option || ''}
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
                    onChange={handleCityChange}
                    value={data.city || null}
                    popupIcon={<PopupIcon />}
                    name="city"
                    loading={!cities}
                    options={cities || []}
                    slotProps={{ popper: { sx: { zIndex: 98 } } }}
                    renderInput={(params) => <TextField {...params} placeholder="Select city"/>}
                />}
            />
            {i !== 0 && (
                <NormalBtn onClick={handleRemoveQuestionItem} className="filled primary">
                    Remove
                </NormalBtn>
            )}
        </div>
    );
};