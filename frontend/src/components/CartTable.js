import React, { useState, useEffect } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, CircularProgress, Chip, IconButton,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { authGet, authPost } from '../utils/api';

function fmtTime(h, m) {
    const hh = h % 12 === 0 ? 12 : h % 12;
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm} ${h < 12 ? 'AM' : 'PM'}`;
}

export const CartTable = ({ onCartChange }) => {
    const [items,   setItems]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);
    const [removing, setRemoving] = useState(null);

    const load = async () => {
        try {
            const res  = await authGet('/auth/cart');
            const data = await res.json();
            if (res.ok) {
                setItems(data);
                if (onCartChange) onCartChange(data.length);
                // Sync localStorage so Navigator + EventTable badges reflect real cart
                const synced = data.map(i => ({ id: i.id, nom: i.nom, quantity: i.quantity || 1 }));
                localStorage.setItem('cart', JSON.stringify(synced));
                window.dispatchEvent(new Event('storage'));
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Impossible de charger le panier.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleRemove = async (nom) => {
        setRemoving(nom);
        try {
            const res = await authPost('/auth/cart/remove', { nom });
            if (res.ok) {
                const updated = items.filter(i => i.nom !== nom);
                setItems(updated);
                if (onCartChange) onCartChange(updated.length);
                // Sync localStorage badge
                localStorage.setItem('cart', JSON.stringify(updated.map(i => ({ nom: i.nom, quantity: i.quantity || 1 }))));
                window.dispatchEvent(new Event('storage'));
            }
        } catch (err) {
            console.error('[CartTable] remove error:', err);
        } finally {
            setRemoving(null);
        }
    };

    const subtotal = items.reduce((s, i) => s + (i.prix || 0) * (i.quantity || 1), 0);

    if (loading) return <CircularProgress size={28} sx={{ color: '#E85D3A', display: 'block', mx: 'auto', my: 4 }} />;
    if (error)   return <Typography sx={{ color: '#C0392B', fontFamily: "'DM Sans', sans-serif", py: 2 }}>{error}</Typography>;

    if (items.length === 0) return (
        <Box sx={{
            border: '2px solid #1A1A1A', p: 4,
            boxShadow: '6px 6px 0px #E85D3A',
            backgroundColor: '#FAF7F2', textAlign: 'center',
        }}>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: '#9A9A9A' }}>
                Votre panier est vide.
            </Typography>
        </Box>
    );

    return (
        <Box sx={{
            border: '2px solid #1A1A1A',
            boxShadow: '6px 6px 0px #E85D3A',
            backgroundColor: '#FAF7F2',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <Box sx={{ backgroundColor: '#1A1A1A', px: 3, py: 2 }}>
                <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.75rem', fontWeight: 700,
                    color: '#FAF7F2', textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                    Mon panier — {items.length} événement{items.length > 1 ? 's' : ''}
                </Typography>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Événement</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Horaire</TableCell>
                            <TableCell>Lieu</TableCell>
                            <TableCell align="center">Qté</TableCell>
                            <TableCell align="right">Prix</TableCell>
                            <TableCell align="center">Retirer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item => (
                            <TableRow key={item.nom} hover>
                                <TableCell sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
                                    {item.nom}
                                </TableCell>
                                <TableCell sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                    {item.date}
                                </TableCell>
                                <TableCell sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                                    {fmtTime(item.startHour, item.startMinute)} – {fmtTime(item.endHour, item.endMinute)}
                                </TableCell>
                                <TableCell sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#6B6B6B' }}>
                                    {item.location}
                                </TableCell>
                                <TableCell align="center" sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                                    {item.quantity || 1}
                                </TableCell>
                                <TableCell align="right">
                                    <Chip
                                        label={item.prix === 0 ? 'Gratuit' : `$${(Number(item.prix) * (item.quantity || 1)).toFixed(2)}`}
                                        size="small"
                                        sx={{
                                            borderRadius: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                                            backgroundColor: item.prix === 0 ? '#E8F5E9' : '#FFF3EE',
                                            color:           item.prix === 0 ? '#2E7D32' : '#E85D3A',
                                            border: `1px solid ${item.prix === 0 ? '#A5D6A7' : '#FFBFA9'}`,
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemove(item.nom)}
                                        disabled={removing === item.nom}
                                        sx={{ borderRadius: 0, color: '#C0392B', '&:hover': { backgroundColor: '#FDE8E6' } }}
                                    >
                                        {removing === item.nom
                                            ? <CircularProgress size={16} sx={{ color: '#C0392B' }} />
                                            : <DeleteOutlineIcon fontSize="small" />
                                        }
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Totals */}
            <Box sx={{ borderTop: '1px solid #E0DDD8', px: 3, py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: '#6B6B6B' }}>
                        Total
                    </Typography>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: '#1A1A1A' }}>
                        {subtotal === 0 ? 'Gratuit' : `$${subtotal.toFixed(2)}`}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
