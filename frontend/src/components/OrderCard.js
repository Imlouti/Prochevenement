import React, { useState } from 'react';
import {
    Box, Typography, Chip, Divider, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton,
} from '@mui/material';
import CloseIcon      from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

/**
 * Renders a single purchase order as either:
 *   - A compact clickable row (variant="row") — used on the Dashboard
 *     Clicking opens a Dialog with full order details.
 *   - An expandable accordion card (variant="card") — used in Parametres
 *     Clicking the header toggles the ticket list inline.
 *
 * Props:
 *   order    — { ts: number, items: achat[] }
 *   variant  — "row" | "card"  (default: "card")
 */
export function OrderCard({ order, variant = 'card' }) {
    const [open,     setOpen]     = useState(false);
    const [expanded, setExpanded] = useState(false);

    const total = order.items.reduce((s, t) => s + (t.prix || 0), 0);
    const date  = order.ts ? new Date(order.ts).toLocaleDateString('fr-CA') : '—';
    const code  = order.items[0]?.confirmationCode || `CMD-${date}`;
    const count = order.items.length;

    const priceChipSx = {
        borderRadius: 0,
        backgroundColor: '#FFF3EE',
        color: '#E85D3A',
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700,
        border: '1px solid #FFBFA9',
        flexShrink: 0,
    };

    const TicketRow = ({ t }) => (
        <Box sx={{
            px: 3, py: 2,
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 2,
            borderTop: '1px solid #E0DDD8',
            backgroundColor: '#FAF7F2',
        }}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600, fontSize: '0.95rem', color: '#1A1A1A',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {t.eventNom}
                </Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#6B6B6B', mt: 0.25 }}>
                    {t.date}
                </Typography>
            </Box>
            <Chip
                label={t.prix === 0 ? 'Gratuit' : `$${Number(t.prix).toFixed(2)}`}
                size="small"
                sx={priceChipSx}
            />
        </Box>
    );

    // ── Row variant (Dashboard) ────────────────────────────────────────────────
    if (variant === 'row') {
        return (
            <Box>
                <Box onClick={() => setOpen(true)} sx={{
                    py: 2, display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: 2,
                    cursor: 'pointer', mx: -3, px: 3,
                    '&:hover': { backgroundColor: 'rgba(232,93,58,0.04)' },
                    transition: 'background-color 0.1s',
                }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            {date} · {count} billet{count > 1 ? 's' : ''}
                        </Typography>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#E85D3A', letterSpacing: '0.04em', mt: 0.25 }}>
                            {code}
                        </Typography>
                    </Box>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#1A1A1A', flexShrink: 0 }}>
                        {total === 0 ? 'Gratuit' : `$${total.toFixed(2)}`}
                    </Typography>
                </Box>
                <Divider sx={{ borderColor: '#E0DDD8' }} />

                <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
                    PaperProps={{ sx: { borderRadius: 0, border: '2px solid #1A1A1A' } }}>
                    <DialogTitle sx={{ backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                        <Box>
                            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#FAF7F2', fontSize: '1rem' }}>
                                Détails de la commande
                            </Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#E85D3A', fontWeight: 700, letterSpacing: '0.06em' }}>
                                {code}
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setOpen(false)} size="small"
                            sx={{ color: '#FAF7F2', borderRadius: 0, '&:hover': { backgroundColor: '#E85D3A' } }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ backgroundColor: '#FAF7F2', p: 0 }}>
                        {order.items.map((t, i) => <TicketRow key={i} t={t} />)}
                        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: '#1A1A1A' }}>Total</Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: '#1A1A1A' }}>
                                {total === 0 ? 'Gratuit' : `$${total.toFixed(2)}`}
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: '#FAF7F2', borderTop: '1px solid #E0DDD8', px: 3, py: 2 }}>
                        <Button onClick={() => setOpen(false)} variant="contained" size="small">Fermer</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }

    // ── Card variant (Parametres HistoriquePanel) ──────────────────────────────
    return (
        <Box sx={{ border: '2px solid #1A1A1A', overflow: 'hidden' }}>
            <Box onClick={() => setExpanded(v => !v)} sx={{
                backgroundColor: '#1A1A1A', px: 3, py: 1.5,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', userSelect: 'none',
                '&:hover': { backgroundColor: '#2A2A2A' },
            }}>
                <Box>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Commande · {date}
                    </Typography>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 700, color: '#E85D3A', letterSpacing: '0.06em', mt: 0.25 }}>
                        {code}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: '#FAF7F2' }}>
                        {total === 0 ? 'Gratuit' : `$${total.toFixed(2)}`}
                    </Typography>
                    <Box sx={{ color: '#9A9A9A', display: 'flex' }}>
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Box>
                </Box>
            </Box>
            {expanded && order.items.map((t, i) => <TicketRow key={i} t={t} />)}
        </Box>
    );
}
