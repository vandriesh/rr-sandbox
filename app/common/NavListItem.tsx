import { NavLink } from 'react-router';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import * as React from 'react';
import type { PropsWithChildren } from 'react';

function NavListItem({to, children}: PropsWithChildren<{to: string}>) {
    return (
        <ListItem disablePadding sx={{ py: 0.5, px: 1 }}>
            <NavLink
                to={to}
                className={({ isActive }) => {
                    if (isActive) {
                        return 'inline-flex items-center border-l-2 border-green-400 px-1 pt-1 text-sm font-medium text-white';
                    } else {
                        return 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-white hover:border-gray-300';
                    }
                }}
            >
                <ListItemButton>{children}</ListItemButton>
            </NavLink>
        </ListItem>
    );
}

export default NavListItem;