import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import type { AppModel } from '~/AppsDiscovery/AppModel';
import { useSearchParams } from 'react-router';

interface Column {
    id: 'appId' | 'appName' | 'appSources' | 'category' | 'connection';
    label: string;
    minWidth?: number;
    align?: 'left';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'appName', label: 'Name', minWidth: 170 },
    { id: 'appSources', label: 'Connection', minWidth: 170 },
    { id: 'category', label: 'Category', minWidth: 170 },

];

type Props = {
    data: AppModel[];
    totalCount: number
};

export default function BaseData({ data , totalCount}: Props) {
    const [searchParams, setSearchParams] = useSearchParams();

    const pageNumber = searchParams.get('pageNumber') ?? '0';
    const pageSize = searchParams.get('pageSize') ?? '10';


    const [page, setPage] = React.useState(+pageNumber);
    const [rowsPerPage, setRowsPerPage] = React.useState(+pageSize);

    const rows = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        setSearchParams((searchParams) => {
            setSearchParams((searchParams) => {
                searchParams.set('pageNumber', `${newPage}`);
                return searchParams;
            });
            return searchParams;
        });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        let pageSize = event.target.value;
        setRowsPerPage(+pageSize);
        setSearchParams((searchParams) => {
            searchParams.set('pageSize', pageSize);
            return searchParams;
        });
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.appId}>
                                    {columns.map((column) => {
                                        // todo find out the issue
                                        const value = row[column.id];

                                        if (column.id === 'appSources') {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {value.join(', ')}
                                                </TableCell>
                                            );
                                        }
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
