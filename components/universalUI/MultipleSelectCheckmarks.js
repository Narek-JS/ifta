import { MenuItem, Autocomplete, TextField } from "@mui/material";
import { styled } from '@mui/system';
import Checkbox from '@mui/material/Checkbox';
import PopupIcon from "@/public/assets/svgIcons/PopupIcon";

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
  const stateByCategorys = items.reduce((acc, item) => {
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

  return (
    <Autocomplete
      className="multipleSelectWrapper"
      multiple
      disableCloseOnSelect
      id="tags-standard"
      options={options.map(item => item.state)}
      popupIcon={<PopupIcon />}
      getOptionLabel={(option) => option}
      onChange={(_, value) => {
        setChecks(prev => {
          prev[dataIndex] = [...value];
          return [...prev];
        });
      }}
      slotProps={{
        popper: {sx: {
          zIndex: 98,
        }}}}
      value={checks[dataIndex]}
      groupBy={(option) => {
        const isUSA = options.find((item) => item.state === option);
        return isUSA.groupName || '';
      }}
      renderOption={(props, option) => {
        return (
          <MenuItem
            key={option}
            value={option}
            sx={{
              justifyContent: "space-between",
            }}
            {...props}
          >
            <Checkbox checked={checks[dataIndex]?.includes(option)} />
            {option}
          </MenuItem>
        );
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            variant="outlined"
            placeholder={checks[dataIndex]?.length ? "" : "Select one or multiple states"}
          />
        )
      }}
      renderGroup={(params) => {
        return (
          <li key={params.key}>
              <GroupHeader>{params.group}</GroupHeader>
              <ul>{params.children}</ul>
          </li>
        );
      }}
    />
  );
};

export { MultipleSelectCheckmarks };
