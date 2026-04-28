import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableSortLabel, TablePagination, TextField, InputAdornment, Typography,
    Chip, CircularProgress, Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon    from '@mui/icons-material/Add';

import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { authGet } from '../utils/api';

const headCells = [
    { id: 'nom',      label: 'ÉVÉNEMENT',       sortable: true  },
    { id: 'date',     label: 'DATE',            sortable: true  },
    { id: 'location', label: 'LIEU',            sortable: false },
    { id: 'prix',     label: 'PRIX',            sortable: true  },
    { id: 'billets',  label: 'BILLETS',          sortable: true  },
];

function stableSort(arr, cmp) {
    return arr.map((el, idx) => [el, idx])
        .sort((a, b) => { const o = cmp(a[0], b[0]); return o !== 0 ? o : a[1] - b[1]; })
        .map(el => el[0]);
}
function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0);
}

export const VendorTable = () => {
    const navigate = useNavigate();
    const [rows,        setRows]        = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [search,      setSearch]      = useState('');
    const [order,       setOrder]       = useState('asc');
    const [orderBy,     setOrderBy]     = useState('date');
    const [page,        setPage]        = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        authGet('/auth/vendorEvents')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setRows(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return rows.filter(r =>
            r.nom?.toLowerCase().includes(q) ||
            r.location?.toLowerCase().includes(q)
        );
    }, [rows, search]);

    const sorted = useMemo(() =>
        stableSort(filtered, getComparator(order, orderBy)),
    [filtered, order, orderBy]);

    const visible = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleSort = (col) => {
        setOrder(orderBy === col && order === 'asc' ? 'desc' : 'asc');
        setOrderBy(col);
        setPage(0);
    };

    const headSx = {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.72rem', fontWeight: 700,
        color: '#FAF7F2', letterSpacing: '0.08em',
        py: 1.5, borderBottom: 'none',
    };

    return (
        <Box sx={{
            border: '2px solid #1A1A1A',
            boxShadow: '6px 6px 0px #E85D3A',
            overflow: 'hidden',
            backgroundColor: '#FAF7F2',
            display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0,
        }}>
            {/* Toolbar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1.5, borderBottom: '2px solid #1A1A1A', backgroundColor: '#FAF7F2', flexShrink: 0 }}>
                <TextField
                    size="small" placeholder="Rechercher un événement…"
                    value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9A9A9A', fontSize: 18 }} /></InputAdornment> }}
                    sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: '#9A9A9A', flexShrink: 0 }}>
                    {filtered.length} événement{filtered.length !== 1 ? 's' : ''}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    href="/AjouterEvenement"
                    size="small"
                    sx={{
                        flexShrink: 0,
                        fontFamily: "'DM Sans', sans-serif",
                        borderRadius: 0,
                        backgroundColor: '#E85D3A',
                        boxShadow: 'none',
                        '&:hover': { backgroundColor: '#D44E2C', boxShadow: 'none', transform: 'none' },
                    }}>
                    Ajouter un événement
                </Button>
            </Box>

            {/* Table */}
            <Box sx={{ display: 'flex', alignItems: 'stretch', flex: 1, minHeight: 0 }}>
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <TableContainer sx={{ flex: 1, overflowX: 'auto', overflowY: 'auto', minHeight: 0 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {headCells.map(col => (
                                        <TableCell key={col.id}
                                            sx={{ ...headSx, backgroundColor: '#1A1A1A', cursor: col.sortable ? 'pointer' : 'default' }}
                                        >
                                            {col.sortable ? (
                                                <TableSortLabel
                                                    active={orderBy === col.id}
                                                    direction={orderBy === col.id ? order : 'asc'}
                                                    onClick={() => handleSort(col.id)}
                                                    sx={{ color: '#FAF7F2 !important', '& .MuiTableSortLabel-icon': { color: '#E85D3A !important' } }}
                                                >
                                                    {col.label}
                                                </TableSortLabel>
                                            ) : col.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                        <CircularProgress size={24} sx={{ color: '#E85D3A' }} />
                                    </TableCell></TableRow>
                                ) : visible.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: '#9A9A9A', fontFamily: "'DM Sans', sans-serif" }}>
                                        {search ? 'Aucun résultat.' : 'Aucun événement. Créez-en un !'}
                                    </TableCell></TableRow>
                                ) : visible.map(row => {
                                    const today = dayjs().format('YYYY-MM-DD');
                                    const rowExpired = row.dateISO && row.dateISO < today;
                                    return (
                                    <TableRow key={String(row._id)} hover={!rowExpired}
                                        onClick={() => !rowExpired && navigate(`/ModifierEvenement?id=${row._id}`)}
                                        sx={{
                                            cursor: rowExpired ? 'default' : 'pointer',
                                            opacity: rowExpired ? 0.45 : 1,
                                            '&:hover': { backgroundColor: rowExpired ? 'inherit !important' : '#FFF3EE !important' },
                                        }}>
                                        <TableCell sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '0.95rem' }}>
                                            {row.nom}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                                            {row.date}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: '#6B6B6B' }}>
                                            {row.location}
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={row.prix === 0 ? 'Gratuit' : `$${Number(row.prix).toFixed(2)}`}
                                                size="small" sx={{
                                                    borderRadius: 0,
                                                    backgroundColor: row.prix === 0 ? '#E8F5E9' : '#FFF3EE',
                                                    color: row.prix === 0 ? '#2E7D32' : '#E85D3A',
                                                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                                                    border: `1px solid ${row.prix === 0 ? '#A5D6A7' : '#FFBFA9'}`,
                                                }} />
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                                            <span>
                                                {row.billets}
                                                {row.billetsTotal != null
                                                    ? <span style={{ color: '#9A9A9A', fontWeight: 400 }}> / {row.billetsTotal}</span>
                                                    : ''}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ borderTop: '1px solid #E0DDD8', flexShrink: 0 }}>
                        <TablePagination
                            component="div"
                            count={filtered.length}
                            page={page} onPageChange={(_, p) => setPage(p)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
                            rowsPerPageOptions={[5, 10, 25]}
                            labelRowsPerPage="Lignes par page :"
                            labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
                            sx={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
