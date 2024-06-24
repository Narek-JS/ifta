import { MenuItem, Autocomplete, TextField } from "@mui/material";
import { styled } from '@mui/system';
import { useMemo } from "react";
import Checkbox from '@mui/material/Checkbox';
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";

// Styling for the group header in the Autocomplete component.
const GroupHeader = styled('div')(() => ({
  position: 'sticky',
  top: '-8px',
  padding: ' 6px 10px',
  color: 'black',
  backgroundColor: '#F5F5F5',
  fontWeight: '700',
  zIndex: 9999
}));

const MultipleSelectCheckmarks = ({ items, setChecks, checks, dataIndex }) => {

  // Memoizing stateByCategorys to avoid unnecessary recalculations.
  const stateByCategorys = useMemo(() => (
    // Grouping items by country (USA and Canada).
    items.reduce((acc, item) => {
      acc[item.country].push({ 
          state: item.state,
          category: item.country,
          groupName: item.country === 'canada' ? 'Canada' : 'USA'
      });

      return acc;
    }, { canada: [], usa: [] })
  ), [items]);

  // Memoizing options to avoid unnecessary recalculations.
  const options = useMemo(() => {
    // Sorting options alphabetically by state.
    return [
      ...stateByCategorys.usa.sort((a, b) => a.state.localeCompare(b.state)),
      ...stateByCategorys.canada.sort((a, b) => a.state.localeCompare(b.state))
    ];
  }, [stateByCategorys]);

  // Handler function for onChange event of Autocomplete.
  const handleOnChange = (_, value) => {
    setChecks(prev => {
      prev[dataIndex] = [...value];
      return [...prev];
    });
  };

  // Function to arrange groups for the Autocomplete component.
  const arrangeGroupBy = (option) => {
    const isUSA = options.find(item => item.state === option);
    return isUSA.groupName || '';
  };

  // Function to render individual options with checkboxes.
  const renderOption = (props, option) => (
    <MenuItem key={option} value={option} sx={{ justifyContent: "space-between" }} {...props} >
      <Checkbox checked={checks[dataIndex]?.includes(option)} />
      {option}
    </MenuItem>
  );

  // Function to render the input field of Autocomplete.
  const renderInput = (params) => (
    <TextField
      {...params}
      variant="outlined"
      placeholder={checks[dataIndex]?.length ? "" : "Select one or multiple states"}
    />
  );

  // Function to render group headers in the Autocomplete dropdown.
  const renderGroup = (params) => (
    <li key={params.key}>
      <GroupHeader>{params.group}</GroupHeader>
      <ul>{params.children}</ul>
    </li>
  );

  return (
    <Autocomplete
      className="multipleSelectWrapper"
      multiple
      disableCloseOnSelect
      id="tags-standard"
      options={options.map(item => item.state)}
      popupIcon={<PopupIcon />}
      getOptionLabel={option => option}
      onChange={handleOnChange}
      slotProps={{ popper: { sx: { zIndex: 98 } } }}
      value={checks[dataIndex]}
      groupBy={arrangeGroupBy}
      renderOption={renderOption}
      renderInput={renderInput}
      renderGroup={renderGroup}
    />
  );
};

export { MultipleSelectCheckmarks };
