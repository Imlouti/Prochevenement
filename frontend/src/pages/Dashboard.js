import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { authGet } from '../utils/api';
import dayjs from 'dayjs';
import { Typography, Box, Button, Chip, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CloseIcon       from '@mui/icons-material/Close';


// ── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({ title, icon, children, action }) {
    return (
        <Box sx={{
            backgroundColor: '#FAF7F2',
            border: '2px solid #1A1A1A',
            boxShadow: '6px 6px 0px #E85D3A',
            overflow: 'hidden',
            flex: 1,
            minWidth: 0,
        }}>
            {/* Card header */}
            <Box sx={{
                backgroundColor: '#1A1A1A',
                px: 3,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: '#E85D3A', display: 'flex', alignItems: 'center' }}>
                        {icon}
                    </Box>
                    <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#FAF7F2',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                    }}>
                        {title}
                    </Typography>
                </Box>
                {action}
            </Box>

            {/* Card body */}
            <Box sx={{ px: 3, py: 2 }}>
                {children}
            </Box>
        </Box>
    );
}

function TicketRow({ nom, date, location, billets, eventId }) {
    const navigate = useNavigate();
    const handleClick = () => {
        const bg = { pathname: window.location.pathname, search: window.location.search };
        if (eventId) navigate(`/Evenement?id=${eventId}`, { state: { background: bg, hidePurchase: true } });
        else if (nom) navigate(`/Evenement?@${encodeURIComponent(nom)}`, { state: { background: bg, hidePurchase: true } });
    };
    return (
        <Box>
            <Box onClick={handleClick} sx={{ py: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, cursor: eventId || nom ? 'pointer' : 'default', '&:hover': { backgroundColor: eventId || nom ? 'rgba(232,93,58,0.04)' : 'transparent' }, borderRadius: 0, mx: -3, px: 3, transition: 'background-color 0.1s' }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        color: '#1A1A1A',
                        mb: 0.5,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        {nom}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarTodayIcon sx={{ fontSize: 12, color: '#9A9A9A' }} />
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6B6B6B' }}>
                                {date}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOnIcon sx={{ fontSize: 12, color: '#9A9A9A' }} />
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6B6B6B' }}>
                                {location}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Chip
                    label={`${billets} billet${billets > 1 ? 's' : ''}`}
                    size="small"
                    sx={{
                        borderRadius: 0,
                        backgroundColor: '#E85D3A',
                        color: '#FAF7F2',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        flexShrink: 0,
                    }}
                />
            </Box>
            <Divider sx={{ borderColor: '#E0DDD8' }} />
        </Box>
    );
}

function OrderRow({ order }) {
    const [open, setOpen] = useState(false);
    const total = order.items.reduce((s, t) => s + (t.prix || 0), 0);
    const date  = order.ts ? new Date(order.ts).toLocaleDateString('fr-CA') : '—';
    const code  = order.items[0]?.confirmationCode || `CMD-${date}`;

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
                        {date} · {order.items.length} billet{order.items.length > 1 ? 's' : ''}
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

            {/* Purchase detail modal */}
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
                    <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: '#FAF7F2', borderRadius: 0, '&:hover': { backgroundColor: '#E85D3A' } }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#FAF7F2', p: 0 }}>
                    {order.items.map((t, i) => (
                        <Box key={i} sx={{ px: 3, py: 2, borderBottom: '1px solid #E0DDD8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '0.95rem', color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {t.eventNom}
                                </Typography>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#6B6B6B', mt: 0.25 }}>
                                    {t.date}
                                </Typography>
                            </Box>
                            <Chip label={t.prix === 0 ? 'Gratuit' : `$${Number(t.prix).toFixed(2)}`} size="small"
                                sx={{ borderRadius: 0, backgroundColor: '#FFF3EE', color: '#E85D3A', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, border: '1px solid #FFBFA9', flexShrink: 0 }} />
                        </Box>
                    ))}
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

function DiscoverRow({ nom, date, location, prix, _id }) {
    const navigate = useNavigate();
    const handleClick = () => {
        if (_id) navigate(`/Evenement?id=${_id}`);
        else if (nom) navigate(`/Evenement?@${encodeURIComponent(nom)}`);
    };
    return (
        <Box>
            <Box onClick={handleClick} sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(232,93,58,0.04)' }, mx: -3, px: 3, transition: 'background-color 0.1s' }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        color: '#1A1A1A',
                        mb: 0.25,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        {nom}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarTodayIcon sx={{ fontSize: 12, color: '#9A9A9A' }} />
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6B6B6B' }}>
                                {date}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOnIcon sx={{ fontSize: 12, color: '#9A9A9A' }} />
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6B6B6B' }}>
                                {location}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Chip
                    label={prix === '$0.00' ? 'Gratuit' : prix}
                    size="small"
                    sx={{
                        borderRadius: 0,
                        backgroundColor: prix === '$0.00' ? '#E8F5E9' : '#FFF3EE',
                        color: prix === '$0.00' ? '#2E7D32' : '#E85D3A',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        flexShrink: 0,
                        border: `1px solid ${prix === '$0.00' ? '#A5D6A7' : '#E85D3A'}`,
                    }}
                />
            </Box>
            <Divider sx={{ borderColor: '#E0DDD8' }} />
        </Box>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function Dashboard() {
    const nomUtilisateur = (() => {
        try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return u.nom ? u.nom.split(' ')[0] : ''; } catch { return ''; }
    })();

    const today = dayjs();
    const [upcoming,  setUpcoming]  = useState([]);
    const [recent,    setRecent]    = useState([]);
    const [discover,  setDiscover]  = useState([]);

    useEffect(() => {
        // Fetch user's purchased tickets
        authGet('/auth/userTickets').then(r => r.json()).then(data => {
            if (Array.isArray(data)) {
                // Upcoming = events whose dateISO >= today
                setUpcoming(data
                    .filter(t => t.dateISO && dayjs(t.dateISO).isSameOrAfter(today, 'day'))
                    .sort((a, b) => dayjs(a.dateISO).diff(dayjs(b.dateISO)))
                    .slice(0, 5)
                    .map(t => ({
                        nom:      t.eventNom,
                        date:     t.date || t.dateISO,
                        location: t.location || '',
                        billets:  1,
                        eventId:  t.eventId || '',
                    })));
                // Group tickets into orders (by rounding acheteLe to the second)
                // then take the 3 most recent orders
                const orderMap = {};
                data.forEach(t => {
                    const ts = t.acheteLe
                        ? new Date(new Date(t.acheteLe).toISOString().slice(0, 19)).getTime()
                        : 0;
                    if (!orderMap[ts]) orderMap[ts] = { ts, items: [] };
                    orderMap[ts].items.push(t);
                });
                const orders = Object.values(orderMap)
                    .sort((a, b) => b.ts - a.ts)
                    .slice(0, 3);
                setRecent(orders);
            }
        }).catch(console.error);

        // Fetch all events for the discover section
        fetch('http://localhost:5000/auth/eventTable')
            .then(r => r.json()).then(data => {
                if (Array.isArray(data)) {
                    setDiscover(data.filter(e => e.dateISO && dayjs(e.dateISO).isSameOrAfter(today, 'day'))
                        .sort((a, b) => dayjs(a.dateISO).diff(dayjs(b.dateISO)))
                        .slice(0, 3)
                        .map(e => ({ ...e, _id: e._id || '' })));
                }
            }).catch(console.error);
    }, []);

    return (
        <div className="content-container">

                {/* Greeting */}
                <Box sx={{ mb: 4 }}>
                    
                    <Typography sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                        fontWeight: 700,
                        color: '#FAF7F2',
                        lineHeight: 1.2,
                    }}>
                        Bonjour{nomUtilisateur ? `, ${nomUtilisateur}` : ''} 👋
                    </Typography>

                </Box>

                {/* Top row — upcoming tickets + recent purchases */}
                <Box sx={{
                    display: 'flex',
                    gap: 3,
                    mb: 3,
                    flexWrap: 'wrap',
                }}>
                    {/* Upcoming tickets */}
                    <SectionCard
                        title="Mes billets à venir"
                        icon={<ConfirmationNumberIcon fontSize="small" />}
                    >
                        {upcoming.length === 0 ? (
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: '#9A9A9A', fontSize: '0.9rem', py: 2 }}>
                                Aucun billet à venir.
                            </Typography>
                        ) : (
                            upcoming.map((t) => (
                                <TicketRow key={t.eventNom} {...t} />
                            ))
                        )}
                    </SectionCard>

                    {/* Recent purchases */}
                    <SectionCard
                        title="Achats récents"
                        icon={<ShoppingBagIcon fontSize="small" />}
                    >
                        {recent.length === 0 ? (
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: '#9A9A9A', fontSize: '0.9rem', py: 2 }}>
                                Aucun achat récent.
                            </Typography>
                        ) : (
                            recent.map((order) => (
                                <OrderRow key={order.ts} order={order} />
                            ))
                        )}
                    </SectionCard>
                </Box>

                {/* Bottom row — discover events */}
                <SectionCard
                    title="Événements à venir près de vous"
                    icon={<CalendarTodayIcon fontSize="small" />}
                >
                    {discover.map((e) => (
                        <DiscoverRow key={e.nom} {...e} />
                    ))}

                    <Box sx={{ pt: 2, textAlign: 'center' }}>
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                            href="/Magasiner"
                            size="small"
                            sx={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '0.8rem',
                            }}
                        >
                            Explorer tous les événements
                        </Button>
                    </Box>
                </SectionCard>

        </div>
    );
}

export default Dashboard;
