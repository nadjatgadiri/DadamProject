import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Button, Typography, OutlinedInput, InputAdornment, Select, MenuItem } from '@mui/material';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
    height: 50,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
    width: 150,
    height: 35,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
        width: 300,
        boxShadow: theme.customShadows.z8,
    },
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
    },
}));

// ----------------------------------------------------------------------

UserListToolbarP.propTypes = {
    title: PropTypes.string,
    isFilterd: PropTypes.bool,
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onDeleteSelected: PropTypes.func,
    onGroupSelected: PropTypes.func,
    selectList: PropTypes.array
};

export default function UserListToolbarP({ isFilterd, selectList, title, numSelected, filterName, onFilterName, onDeleteSelected, isSub, onClearSelected, onGroupSelected }) {
    const [open, setOpen] = useState(null);
    const [filterGroup, setFilterGroup] = useState("");
    return (
        <StyledRoot
            className="card-header"
            sx={{
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',

                }),
            }}
        >

            {numSelected > 0 ? (
                <Typography className="mb-0 " variant="h6">
                    {numSelected} selected
                </Typography>
            ) :
                (
                    <>
                        <Typography className="mb-0 " variant="h6" >
                            {title}
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <StyledSearch
                                value={filterName}
                                onChange={onFilterName}
                                placeholder=" Chercher ..."
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                                    </InputAdornment>
                                }
                            />
                            {isFilterd && (
                                <>
                                    <Button onClick={(e) => { setOpen(!open) }}>
                                        <Iconify icon="ion:filter" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                                    </Button>
                                    {open && (
                                        <Select

                                            value={filterGroup}
                                            onChange={(e) => {
                                                setFilterGroup(e.target.value);
                                                onGroupSelected(e.target.value);
                                            }}
                                            displayEmpty
                                            sx={{
                                                width: 150,
                                                height: 35,
                                                '& .MuiInputLabel-root': {
                                                    color: 'black',
                                                },
                                            }}
                                        >
                                            <MenuItem key="" value="" selected="true">
                                                Tous les groupes
                                            </MenuItem>
                                            <MenuItem key="aucun" value="aucun">
                                                Non spécifié
                                            </MenuItem>
                                            {selectList.map((option) => (
                                                <MenuItem key={option.name} value={option.name}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                </>
                            )}

                        </div>
                    </>
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
