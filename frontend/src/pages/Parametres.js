import React, { useState, useEffect } from 'react';
import './styles.css';
import {
    Typography, Box, Button, TextField, Divider,
    Alert, CircularProgress,
} from '@mui/material';
import ManageAccountsIcon  from '@mui/icons-material/ManageAccounts';
import LockIcon            from '@mui/icons-material/Lock';
import DeleteForeverIcon   from '@mui/icons-material/DeleteForever';
import ReceiptIcon         from '@mui/icons-material/Receipt';
import EventBusyIcon       from '@mui/icons-material/EventBusy';
import { authPost, authGet, getUser, getUserRole, BASE_URL } from '../utils/api';
import { groupTicketsByOrder } from '../utils/orders';
import { OrderCard } from '../components/OrderCard';
import dayjs from 'dayjs';

const isVendeur = getUserRole() === 'Vendeur';

// ── Tab definitions ────────────────────────────────────────────────────────────

const USER_TABS = [
    { id: 'compte',   label: 'Mon compte',        icon: <ManageAccountsIcon fontSize="small" /> },
    { id: 'securite', label: 'Sécurité',           icon: <LockIcon fontSize="small" /> },
    { id: 'achats',   label: 'Annuler un achat',   icon: <EventBusyIcon fontSize="small" /> },
    { id: 'historique', label: 'Historique',       icon: <ReceiptIcon fontSize="small" /> },
    { id: 'danger',   label: 'Zone de danger',     icon: <DeleteForeverIcon fontSize="small" /> },
];

const VENDOR_TABS = [
    { id: 'compte',   label: 'Mon compte',    icon: <ManageAccountsIcon fontSize="small" /> },
    { id: 'securite', label: 'Sécurité',      icon: <LockIcon fontSize="small" /> },
    { id: 'danger',   label: 'Zone de danger', icon: <DeleteForeverIcon fontSize="small" /> },
];

// ── Panel: Mon compte ──────────────────────────────────────────────────────────

function ComptePanel() {
    const user = getUser() || {};
    const [nom,     setNom]     = useState(user.nom || '');
    const [postal,  setPostal]  = useState('');
    const [saving,  setSaving]  = useState(false);
    const [msg,     setMsg]     = useState(null);
    const [errMsg,  setErrMsg]  = useState(null);

    useEffect(() => {
        authGet && authPost('/auth/search', {})
            .then(r => r.json())
            .then(data => { if (data.nom) setNom(data.nom); if (data.postal) setPostal(data.postal); })
            .catch(() => {});
    }, []);

    const handleSave = async () => {
        setMsg(null); setErrMsg(null); setSaving(true);
        try {
            const res  = await authPost('/auth/modify', { nom, postal });
            const data = await res.json();
            if (res.ok) {
                // Update localStorage
                try {
                    const stored = JSON.parse(localStorage.getItem('user') || '{}');
                    stored.nom = nom;
                    localStorage.setItem('user', JSON.stringify(stored));
                } catch {}
                setMsg('Informations mises à jour avec succès.');
            } else {
                setErrMsg(data.message || 'Erreur lors de la mise à jour.');
            }
        } catch { setErrMsg('Erreur de connexion.'); }
        finally { setSaving(false); }
    };

    return (
        <Box>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#1A1A1A', mb: 3 }}>
                Mon compte
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 480 }}>
                <TextField label="Nom complet" value={nom} onChange={e => setNom(e.target.value)} fullWidth />
                <TextField label="Code postal" value={postal} onChange={e => setPostal(e.target.value)} fullWidth />

                {msg    && <Alert severity="success" sx={{ borderRadius: 0 }}>{msg}</Alert>}
                {errMsg && <Alert severity="error"   sx={{ borderRadius: 0 }}>{errMsg}</Alert>}

                <Button variant="contained" size="large" disabled={saving} onClick={handleSave}
                    sx={{ alignSelf: 'flex-start', minWidth: 180 }}>
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                </Button>
            </Box>
        </Box>
    );
}

// ── Panel: Sécurité ────────────────────────────────────────────────────────────

function SecuritePanel() {
    const [current, setCurrent] = useState('');
    const [next,    setNext]    = useState('');
    const [confirm, setConfirm] = useState('');
    const [saving,  setSaving]  = useState(false);
    const [msg,     setMsg]     = useState(null);
    const [errMsg,  setErrMsg]  = useState(null);

    const handleSave = async () => {
        setMsg(null); setErrMsg(null);
        if (!current || !next || !confirm) { setErrMsg('Veuillez remplir tous les champs.'); return; }
        if (next !== confirm)              { setErrMsg('Les nouveaux mots de passe ne correspondent pas.'); return; }
        if (next.length < 8)              { setErrMsg('Le mot de passe doit contenir au moins 8 caractères.'); return; }

        setSaving(true);
        try {
            const res  = await authPost('/auth/changePassword', { motpasseActuel: current, motpasseNouveau: next });
            const data = await res.json();
            if (res.ok) {
                setMsg('Mot de passe modifié avec succès.');
                setCurrent(''); setNext(''); setConfirm('');
            } else {
                setErrMsg(data.message || 'Erreur lors du changement.');
            }
        } catch { setErrMsg('Erreur de connexion.'); }
        finally { setSaving(false); }
    };

    return (
        <Box>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#1A1A1A', mb: 3 }}>
                Sécurité
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 480 }}>
                <TextField label="Mot de passe actuel" type="password" value={current} onChange={e => setCurrent(e.target.value)} fullWidth />
                <TextField label="Nouveau mot de passe" type="password" value={next} onChange={e => setNext(e.target.value)} fullWidth />
                <TextField label="Confirmer le nouveau mot de passe" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} fullWidth />

                {msg    && <Alert severity="success" sx={{ borderRadius: 0 }}>{msg}</Alert>}
                {errMsg && <Alert severity="error"   sx={{ borderRadius: 0 }}>{errMsg}</Alert>}

                <Button variant="contained" size="large" disabled={saving} onClick={handleSave}
                    sx={{ alignSelf: 'flex-start', minWidth: 220 }}>
                    {saving ? 'Enregistrement…' : 'Modifier le mot de passe'}
                </Button>
            </Box>
        </Box>
    );
}

// ── Panel: Annuler un achat ────────────────────────────────────────────────────

function AchatsPanel() {
    const [tickets,  setTickets]  = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [canceling, setCanceling] = useState(null);
    const [msg,      setMsg]      = useState(null);
    const [errMsg,   setErrMsg]   = useState(null);

    useEffect(() => {
        authPost('/auth/search', {})
            .then(r => r.json())
            .then(() => {
                // Fetch user tickets to list
                return fetch(`${BASE_URL}/auth/userTickets`, {
                    headers: { Authorization: `Bearer ${(getUser() || {}).token}` },
                });
            })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const today = dayjs().format('YYYY-MM-DD');
                    // Only show upcoming tickets (date is today or future)
                    setTickets(data.filter(t => t.dateISO && t.dateISO >= today));
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = async (ticket) => {
        setMsg(null); setErrMsg(null);
        setCanceling(ticket.eventNom);
        try {
            const res  = await authPost('/auth/cancelTicket', { eventNom: ticket.eventNom, dateISO: ticket.dateISO });
            const data = await res.json();
            if (res.ok) {
                setTickets(t => t.filter(x => !(x.eventNom === ticket.eventNom && x.dateISO === ticket.dateISO)));
                setMsg(`Billet annulé : ${ticket.eventNom}`);
            } else {
                setErrMsg(data.message || 'Erreur lors de l\'annulation.');
            }
        } catch { setErrMsg('Erreur de connexion.'); }
        finally { setCanceling(null); }
    };

    return (
        <Box>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#1A1A1A', mb: 1 }}>
                Annuler un achat
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: '#9A9A9A', mb: 3 }}>
                Sélectionnez un billet à annuler. Cette action est irréversible.
            </Typography>

            {msg    && <Alert severity="success" sx={{ mb: 2, borderRadius: 0 }}>{msg}</Alert>}
            {errMsg && <Alert severity="error"   sx={{ mb: 2, borderRadius: 0 }}>{errMsg}</Alert>}

            {loading ? (
                <CircularProgress size={24} sx={{ color: '#E85D3A' }} />
            ) : tickets.length === 0 ? (
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B', fontSize: '0.9rem' }}>
                    Vous n'avez aucun billet à annuler.
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 560 }}>
                    {tickets.map((t, i) => (
                        <Box key={i} sx={{
                            border: '1px solid #E0DDD8',
                            backgroundColor: '#FAF7F2',
                            p: 2.5,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
                        }}>
                            <Box>
                                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#1A1A1A', fontSize: '0.95rem' }}>
                                    {t.eventNom}
                                </Typography>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6B6B6B', mt: 0.25 }}>
                                    {t.date}
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined" size="small"
                                disabled={canceling === t.eventNom}
                                startIcon={<EventBusyIcon fontSize="small" />}
                                onClick={() => handleCancel(t)}
                                sx={{
                                    borderRadius: 0, flexShrink: 0,
                                    borderColor: '#C0392B', color: '#C0392B',
                                    '&:hover': { backgroundColor: '#C0392B', color: '#FAF7F2', borderColor: '#C0392B', boxShadow: 'none' },
                                }}>
                                {canceling === t.eventNom ? '…' : 'Annuler'}
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

// ── Panel: Zone de danger ──────────────────────────────────────────────────────

function DangerPanel() {
    const [motpasse, setMotpasse] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [errMsg,   setErrMsg]  = useState(null);

    const handleDelete = async () => {
        setErrMsg(null);
        if (!motpasse) { setErrMsg('Veuillez entrer votre mot de passe pour confirmer.'); return; }
        setDeleting(true);
        try {
            const res = await authPost('/auth/delete', { motpasse });
            if (res.ok) {
                localStorage.removeItem('user');
                localStorage.removeItem('cart');
                document.location.href = '/';
            } else {
                const data = await res.json();
                setErrMsg(data.message || 'Erreur lors de la suppression.');
            }
        } catch { setErrMsg('Erreur de connexion.'); }
        finally { setDeleting(false); }
    };

    return (
        <Box>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#C0392B', mb: 1 }}>
                Zone de danger
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: '#9A9A9A', mb: 3 }}>
                La suppression de votre compte est permanente et irréversible.
            </Typography>

            <Box sx={{
                border: '2px solid #C0392B',
                p: 3, maxWidth: 480,
                backgroundColor: '#FAF7F2',
            }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: '#1A1A1A', mb: 2 }}>
                    Entrez votre mot de passe pour confirmer la suppression définitive de votre compte.
                </Typography>
                <TextField
                    type="password"
                    label="Mot de passe"
                    value={motpasse} onChange={e => setMotpasse(e.target.value)}
                    fullWidth sx={{ mb: 2 }}
                    inputProps={{ autoComplete: 'current-password' }}
                />
                {errMsg && <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>{errMsg}</Alert>}
                <Button
                    variant="contained" fullWidth size="large"
                    disabled={deleting}
                    startIcon={<DeleteForeverIcon />}
                    onClick={handleDelete}
                    sx={{ backgroundColor: '#C0392B', '&:hover': { backgroundColor: '#A93226' } }}>
                    {deleting ? 'Suppression…' : 'Supprimer mon compte'}
                </Button>
            </Box>
        </Box>
    );
}


// ── Panel: Historique des achats ─────────────────────────────────────────────

function HistoriquePanel() {
    const [tickets,  setTickets]  = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [errMsg,   setErrMsg]   = useState(null);
    useEffect(() => {
        const user = getUser() || {};
        fetch(`${BASE_URL}/auth/userTickets`, {
            headers: { Authorization: `Bearer ${user.token}` },
        })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setTickets(data); })
            .catch(() => setErrMsg('Impossible de charger les achats.'))
            .finally(() => setLoading(false));
    }, []);

    const orders = groupTicketsByOrder(tickets);

    return (
        <Box>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#1A1A1A', mb: 1 }}>
                Historique des achats
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: '#9A9A9A', mb: 3 }}>
                Vos commandes regroupées par achat.
            </Typography>

            {errMsg && <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>{errMsg}</Alert>}

            {loading ? (
                <CircularProgress size={24} sx={{ color: '#E85D3A' }} />
            ) : orders.length === 0 ? (
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B', fontSize: '0.9rem' }}>
                    Aucun achat pour l'instant.
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 520, overflowY: 'auto', pr: 0.5 }}>
                    {orders.map(order => (
                        <OrderCard key={order.ts} order={order} variant="card" />
                    ))}
                </Box>
            )}
        </Box>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────

const PANELS = { compte: ComptePanel, securite: SecuritePanel, achats: AchatsPanel, historique: HistoriquePanel, danger: DangerPanel };
const TABS   = isVendeur ? VENDOR_TABS : USER_TABS;

function Parametres() {
    const [activeTab, setActiveTab] = useState('compte');
    const ActivePanel = PANELS[activeTab] || ComptePanel;

    return (
        <div className="content-container">
            <Typography className="page-title" component="h1">
                Paramètres
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* ── Left nav panel ── */}
                <Box sx={{
                    width: 220, flexShrink: 0,
                    border: '2px solid #1A1A1A',
                    boxShadow: '4px 4px 0px #E85D3A',
                    backgroundColor: '#1A1A1A',
                    overflow: 'hidden',
                }}>
                    {TABS.map((tab, i) => (
                        <Box key={tab.id}>
                            <Box
                                onClick={() => setActiveTab(tab.id)}
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 1.5,
                                    px: 2.5, py: 2,
                                    cursor: 'pointer',
                                    backgroundColor: activeTab === tab.id ? '#E85D3A' : 'transparent',
                                    borderLeft: activeTab === tab.id ? '3px solid #C9A84C' : '3px solid transparent',
                                    '&:hover': { backgroundColor: activeTab === tab.id ? '#D44E2C' : '#2A2A2A' },
                                    transition: 'background-color 0.12s',
                                }}>
                                <Box sx={{ color: activeTab === tab.id ? '#FAF7F2' : '#9A9A9A', display: 'flex' }}>
                                    {tab.icon}
                                </Box>
                                <Typography sx={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: '0.88rem',
                                    fontWeight: activeTab === tab.id ? 700 : 400,
                                    color: activeTab === tab.id ? '#FAF7F2' : '#C0C0C0',
                                }}>
                                    {tab.label}
                                </Typography>
                            </Box>
                            {i < TABS.length - 1 && <Divider sx={{ borderColor: '#2A2A2A' }} />}
                        </Box>
                    ))}
                </Box>

                {/* ── Right content panel ── */}
                <Box sx={{
                    flex: 1, minWidth: 280,
                    border: '2px solid #1A1A1A',
                    boxShadow: '4px 4px 0px #E85D3A',
                    backgroundColor: '#FAF7F2',
                    p: 4,
                }}>
                    <ActivePanel />
                </Box>
            </Box>
        </div>
    );
}

export default Parametres;
