import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Button, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDeleteSelected: PropTypes.func
};

export default function UserListToolbar({ numSelected, filterName, onFilterName, onDeleteSelected, isSub, onClearSelected }) {
  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',

        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1" >
          {numSelected} selected
        </Typography>
      ) :
        (
          <StyledSearch
            value={filterName}
            onChange={onFilterName}
            placeholder="Chercher ..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
        )}

      {
        numSelected > 0 ? (
          <Tooltip title="Delete" xs={1}>
            <IconButton onClick={onDeleteSelected}>
              <Iconify icon="eva:trash-2-fill" />
            </IconButton>
          </Tooltip>
        ) : (<></>)}

      {isSub ? (<Tooltip title="Delete" xs={1}>
        <Button onClick={onClearSelected} variant="light">
          clear
        </Button>
      </Tooltip>) : (<></>)}
    </StyledRoot>
  );
}
