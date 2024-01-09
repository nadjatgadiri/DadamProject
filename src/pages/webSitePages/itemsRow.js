import React, { useState, useEffect } from 'react';
import {
    ListItemButton,
    ListItemText,
    Collapse,
    List,
} from '@mui/material';
import { ExpandLess, ExpandMore, Inbox as InboxIcon } from '@mui/icons-material';

export default function Item(props) {
    const { row, level = 0 } = props;
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    useEffect(() => {
        setOpen(row.open);
    }, [row]);
    return (
        <>
            <ListItemButton onClick={handleClick} style={{ paddingLeft: `${20 * level}px` }}>
                {/* <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon> */}
                <ListItemText primary={
                    !Object.values(row.subCategories).length ?
                        <button
                            onClick={() => props.handelUploudData(row.ID_ROWID, row.title)}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#FFFFFF',
                                fontSize: "20px"
                            }}
                        >
                            {row.subCategories && Object.values(row.subCategories).length ? row.title : row.title}
                        </button> :
                        <button
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#FFFFFF',
                                fontSize: "20px"
                            }}
                        >
                            {row.subCategories && Object.values(row.subCategories).length ? row.title : row.title}
                        </button>} />
                {Object.values(row.subCategories).length ? (
                    open ? <ExpandLess /> : <ExpandMore />
                ) : null}
            </ListItemButton>
            {Object.values(row.subCategories).length ? (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {Object.values(row.subCategories).map((cat) => (
                            <Item key={cat.ID_ROWID} row={cat} level={level + 1} handelUploudData={props.handelUploudData} />
                        ))}
                    </List>
                </Collapse>
            ) : null}
        </>
    );
}
