import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Typography, Button, CircularProgress, IconButton,
    Backdrop, Alert,
} from '@mui/material';
import CloseIcon              from '@mui/icons-material/Close';
import LocationOnIcon         from '@mui/icons-material/LocationOn';
import CalendarTodayIcon      from '@mui/icons-material/CalendarToday';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AttachMoneyIcon        from '@mui/icons-material/AttachMoney';
import AccessTimeIcon         from '@mui/icons-material/AccessTime';
import AddIcon                from '@mui/icons-material/Add';
import RemoveIcon             from '@mui/icons-material/Remove';
import { fmtTime } from '../utils/time';
import dayjs from 'dayjs';
import { publicPost, isLoggedIn, authPost, authGet } from '../utils/api';

function getEventIdFromUrl() {
    return new URLSearchParams(window.location.search).get('id') || '';
}
function getEventNameFromUrl() {
    const idx = document.URL.indexOf('@');
    return idx !== -1 ? decodeURIComponent(document.URL.slice(idx + 1)) : '';
}
function addToGuestCart(eventId, eventNom, qty) {
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(i => i.id === eventId || i.nom === eventNom);
        if (existing) existing.quantity = (existing.quantity || 1) + qty;
        else cart.push({ id: eventId, nom: eventNom, quantity: qty });
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
    } catch {
        localStorage.setItem('cart', JSON.stringify([{ id: eventId, nom: eventNom, quantity: qty }]));
    }
    document.location.href = '/Connexion';
}

export function EventModal() {
    const navigate = useNavigate();
    const location = useLocation();
    const loggedIn     = isLoggedIn();
    const hidePurchase = location.state?.hidePurchase === true;
    const eventId  = getEventIdFromUrl();
    const eventNom = getEventNameFromUrl();

    const [event,     setEvent]     = useState(null);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState(null);
    const [cartMsg,   setCartMsg]   = useState(null);
    const [cartError, setCartError] = useState(null);
    const [adding,    setAdding]    = useState(false);
    const [qty,           setQty]           = useState(1);
    const [alreadyOwned,  setAlreadyOwned]  = useState(false);

    const handleClose = () => {
        const bg = location.state?.background;
        navigate(bg ? bg.pathname + (bg.search || '') : '/Magasiner');
    };

    useEffect(() => {
        if (!eventId && !eventNom) {
            setError('Événement introuvable.');
            setLoading(false);
            return;
        }
        const load = async () => {
            try {
                const body = eventId ? { id: eventId } : { nom: eventNom };
                const res  = await publicPost('/auth/eventSearch', body);
                const data = await res.json();
                if (res.ok) setEvent(data);
                else setError(data.message || 'Événement introuvable.');
            } catch {
                setError('Impossible de charger cet événement.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [eventId, eventNom]);

    useEffect(() => {
        if (!loggedIn || !event) return;
        authGet('/auth/userTickets')
            .then(r => r.json())
            .then(tickets => {
                if (Array.isArray(tickets)) {
                    const owned = tickets.some(t =>
                        (eventId && t.eventId === eventId) ||
                        (t.eventNom && t.eventNom === event.nom)
                    );
                    setAlreadyOwned(owned);
                }
            })
            .catch(() => {});
    }, [loggedIn, event, eventId]);

    const handleAcheter = async () => {
        if (!loggedIn) {
            addToGuestCart(eventId, event?.nom || eventNom, qty);
            return;
        }
        setAdding(true);
        setCartMsg(null);
        setCartError(null);
        try {
            const res  = await authPost('/auth/cart/add', {
                id:       eventId || undefined,
                nom:      event?.nom || eventNom,
                quantity: qty,
            });
            const data = await res.json();
            if (res.ok) {
                // Sync localStorage badge
                try {
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const existing = cart.find(i => i.id === eventId || i.nom === (event?.nom || eventNom));
                    if (existing) existing.quantity = (existing.quantity || 1) + qty;
                    else cart.push({ id: eventId, nom: event?.nom || eventNom, quantity: qty });
                    localStorage.setItem('cart', JSON.stringify(cart));
                    window.dispatchEvent(new Event('storage'));
                } catch {}
                setCartMsg(`${qty} billet${qty > 1 ? 's' : ''} ajouté${qty > 1 ? 's' : ''} au panier !`);
            } else {
                setCartError(data.message || "Erreur lors de l'ajout.");
            }
            // Non-blocking schedule conflict warning
            if (res.ok && data.warning) {
                setCartMsg(prev => prev + ' ⚠ ' + data.warning);
            }
        } catch {
            setCartError('Erreur de connexion.');
        } finally {
            setAdding(false);
        }
    };

    const isExpired = event
        ? dayjs(event.endDateISO || event.dateISO).isBefore(dayjs(), 'day')
        : false;

    const title = event?.nom || eventNom || '…';
    const dateDisplay = event
        ? (event.endDateISO && event.endDateISO !== event.dateISO
            ? `${event.date} – ${event.endDateISO}`
            : event.date)
        : '—';

    return (
        <>
            <Backdrop open onClick={handleClose}
                sx={{ zIndex: 1200, backgroundColor: 'rgba(20,20,20,0.85)' }} />

            <Box onClick={e => e.stopPropagation()} sx={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1300, width: '100%', maxWidth: 620,
                maxHeight: '90vh', overflowY: 'auto',
                border: '2px solid #1A1A1A',
                boxShadow: '8px 8px 0px #E85D3A',
                backgroundColor: '#FAF7F2',
            }}>
                {/* Header */}
                <Box sx={{
                    backgroundColor: '#1A1A1A', px: 4, py: 3,
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                }}>
                    <Box sx={{ flex: 1, pr: 2 }}>
                        <Typography sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.6rem', fontWeight: 700, color: '#FAF7F2',
                        }}>
                            {title}
                        </Typography>
                        {event?.vendeurNom && (
                            <Typography sx={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '0.78rem', color: '#C9A84C', mt: 0.5,
                            }}>
                                {event.vendeurNom}
                            </Typography>
                        )}
                    </Box>
                    <IconButton onClick={handleClose} size="small" sx={{
                        color: '#FAF7F2', borderRadius: 0, flexShrink: 0,
                        '&:hover': { backgroundColor: '#E85D3A' },
                    }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ p: 4 }}>
                    {loading ? (
                        <CircularProgress size={28} sx={{ color: '#E85D3A', display: 'block', mx: 'auto', my: 4 }} />
                    ) : error ? (
                        <Typography sx={{ color: '#C0392B', fontFamily: "'DM Sans', sans-serif", textAlign: 'center', py: 4 }}>
                            {error}
                        </Typography>
                    ) : (
                        <>
                            <Typography sx={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '1rem', color: '#6B6B6B', mb: 4, lineHeight: 1.7,
                            }}>
                                {event.description}
                            </Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 4 }}>
                                {[
                                    { icon: <AttachMoneyIcon />,        label: 'Prix',             value: event.prix === 0 ? 'Gratuit' : `$${event.prix}` },
                                    { icon: <CalendarTodayIcon />,      label: 'Date',             value: dateDisplay },
                                    { icon: <AccessTimeIcon />,         label: 'Horaire',          value: `${fmtTime(event.startHour, event.startMinute)} – ${fmtTime(event.endHour, event.endMinute)}` },
                                    { icon: <LocationOnIcon />,         label: 'Lieu',             value: event.location },
                                    { icon: <ConfirmationNumberIcon />, label: 'Billets restants', value: event.billets },
                                ].map(({ icon, label, value }) => (
                                    <Box key={label} sx={{
                                        border: '1px solid #E0DDD8', p: 2,
                                        display: 'flex', alignItems: 'flex-start', gap: 1.5,
                                    }}>
                                        <Box sx={{ color: '#E85D3A', mt: 0.25 }}>{icon}</Box>
                                        <Box>
                                            <Typography sx={{
                                                fontSize: '0.7rem', textTransform: 'uppercase',
                                                letterSpacing: '0.1em', color: '#9A9A9A', fontWeight: 600,
                                            }}>
                                                {label}
                                            </Typography>
                                            <Typography sx={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontWeight: 600, color: '#1A1A1A',
                                            }}>
                                                {value}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            {/* Quantity selector */}
                            {event.billets > 0 && !isExpired && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Typography sx={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontWeight: 600, color: '#1A1A1A', fontSize: '0.9rem',
                                    }}>
                                        Quantité :
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', border: '2px solid #1A1A1A' }}>
                                        <IconButton size="small"
                                            onClick={() => setQty(q => Math.max(1, q - 1))}
                                            sx={{ borderRadius: 0, '&:hover': { backgroundColor: '#F5F2ED' } }}>
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography sx={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontWeight: 700, minWidth: 32, textAlign: 'center',
                                        }}>
                                            {qty}
                                        </Typography>
                                        <IconButton size="small"
                                            onClick={() => setQty(q => Math.min(event.billets, q + 1))}
                                            sx={{ borderRadius: 0, '&:hover': { backgroundColor: '#F5F2ED' } }}>
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    {event.prix > 0 && (
                                        <Typography sx={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            color: '#6B6B6B', fontSize: '0.88rem',
                                        }}>
                                            = ${(event.prix * qty).toFixed(2)}
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            {alreadyOwned && (
                                <Box sx={{
                                    border: '1px solid #4CAF50',
                                    p: 1.5, mb: 2,
                                    backgroundColor: '#E8F5E9',
                                }}>
                                    <Typography sx={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: '0.85rem', color: '#2E7D32',
                                    }}>
                                        ✓ Vous avez déjà un billet pour cet événement. Vous pouvez en acheter un autre.
                                    </Typography>
                                </Box>
                            )}

                            {cartMsg && (
                                <Alert severity="success" sx={{ mb: 2, borderRadius: 0 }}>
                                    {cartMsg}{' '}
                                    <a href="/Panier" style={{ color: '#2E7D32', fontWeight: 600 }}>
                                        Voir le panier →
                                    </a>
                                </Alert>
                            )}
                            {cartError && (
                                <Alert severity="warning" sx={{ mb: 2, borderRadius: 0 }}>
                                    {cartError}
                                </Alert>
                            )}

                            {!hidePurchase && (isExpired ? (
                                <Box sx={{ border: '2px solid #9A9A9A', p: 2, textAlign: 'center', backgroundColor: '#F5F5F5' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: '#6B6B6B' }}>
                                        Cet événement est terminé
                                    </Typography>
                                </Box>
                            ) : (
                                <Button
                                    variant="contained" size="large" fullWidth
                                    startIcon={<ConfirmationNumberIcon />}
                                    disabled={event.billets === 0 || adding || !!cartMsg}
                                    onClick={handleAcheter}
                                >
                                    {event.billets === 0 ? 'Complet'
                                        : adding ? 'Ajout en cours...'
                                        : cartMsg ? 'Ajouté au panier ✓'
                                        : loggedIn ? 'Ajouter au panier'
                                        : 'Connexion pour acheter'}
                                </Button>
                            ))}

                            {!hidePurchase && !loggedIn && event.billets > 0 && (
                                <Typography sx={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: '0.8rem', color: '#9A9A9A',
                                    textAlign: 'center', mt: 1.5,
                                }}>
                                    Un compte est requis. Votre sélection sera sauvegardée.
                                </Typography>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </>
    );
}
