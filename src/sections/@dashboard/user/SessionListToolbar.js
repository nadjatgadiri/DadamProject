import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, TextField, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center', // Center align items vertically
  padding: theme.spacing(0, 1, 0, 3),
}));

// Update the propTypes accordingly
SessionListToolbar.propTypes = {
  selectedDate: PropTypes.instanceOf(Date), // Define selectedDate prop
  onDateChange: PropTypes.func, // Define onDateChange prop
  onClearDate: PropTypes.func, // Define onClearDate prop
};

export default function SessionListToolbar({ selectedDate, onDateChange, onClearDate }) {
  const handleClearDate = () => {
    onClearDate(); // Call the onClearDate function when clear button is clicked
  };

  return (
    <StyledRoot>
      <TextField
        style={{ width: 300 }}
        type="date"
        value={selectedDate}
        onChange={onDateChange}
        InputProps={{
          endAdornment: selectedDate !== '' && (
            <IconButton onClick={handleClearDate}>
              <ClearIcon />
            </IconButton>
          ),
        }}
      />
    </StyledRoot>
  );
}
