import React from 'react';
import './styles.css';
import { Navigator } from '../components/Navigator';
import { Typography, Box, Button, Chip, Divider, Link } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

function getNomUtilisateur() {
    const stored = localStorage.getItem('nom');
    if (!stored) return '';
    try {
        const parsed = JSON.parse(stored);
        return parsed.nom ? parsed.nom.split(' ')[0] : stored.split(',')[0].split(' ')[0];
    } catch {
        return stored.split(',')[0].split(' ')[0];
    }
}

// ── Placeholder data — replace with API calls later ──────────────────────────

const ticketsAVenir = [
    { nom: 'Concert Jazz au Parc', date: '12 avril 2025', location: 'Parc Lafontaine, Montréal', billets: 2 },
    { nom: 'Marché Artisanal du Printemps', date: '19 avril 2025', location: 'Place des Arts, Montréal', billets: 1 },
    { nom: 'Festival de Cinéma Indépendant', date: '3 mai 2025', location: 'Cinéma Beaubien, Montréal', billets: 2 },
];

const achatsRecents = [
    { nom: 'Concert Jazz au Parc', date: 'Acheté le 2 mars 2025', prix: '$24.00', billets: 2 },
    { nom: 'Marché Artisanal du Printemps', date: 'Acheté le 28 février 2025', prix: '$0.00', billets: 1 },
    { nom: 'Soirée Comédie Stand-Up', date: 'Acheté le 14 février 2025', prix: '$18.00', billets: 1 },
];

const evenementsDisponibles = [
    { nom: 'Trivia Night au Vieux-Port', date: '8 avril 2025', location: 'Bar Le Balcon', prix: '$10.00' },
    { nom: 'Exposition Photo Urbaine', date: '15 avril 2025', location: 'Galerie Zéro1', prix: '$5.00' },
    { nom: 'Tournoi de Pétanque', date: '26 avril 2025', location: 'Parc Maisonneuve', prix: '$0.00' },
];

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

function TicketRow({ nom, date, location, billets }) {
    return (
        <Box>
            <Box sx={{ py: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
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

function PurchaseRow({ nom, date, prix, billets }) {
    return (
        <Box>
            <Box sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
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
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#9A9A9A' }}>
                        {date} · {billets} billet{billets > 1 ? 's' : ''}
                    </Typography>
                </Box>
                <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: prix === '$0.00' ? '#4CAF50' : '#1A1A1A',
                    flexShrink: 0,
                }}>
                    {prix === '$0.00' ? 'Gratuit' : prix}
                </Typography>
            </Box>
            <Divider sx={{ borderColor: '#E0DDD8' }} />
        </Box>
    );
}

function DiscoverRow({ nom, date, location, prix }) {
    return (
        <Box>
            <Box sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
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
    const nomUtilisateur = getNomUtilisateur();

    return (
        <div className="page-root">
            <Navigator userName={nomUtilisateur} />
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
                        {ticketsAVenir.length === 0 ? (
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: '#9A9A9A', fontSize: '0.9rem', py: 2 }}>
                                Aucun billet à venir.
                            </Typography>
                        ) : (
                            ticketsAVenir.map((t) => (
                                <TicketRow key={t.nom} {...t} />
                            ))
                        )}
                    </SectionCard>

                    {/* Recent purchases */}
                    <SectionCard
                        title="Achats récents"
                        icon={<ShoppingBagIcon fontSize="small" />}
                    >
                        {achatsRecents.length === 0 ? (
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: '#9A9A9A', fontSize: '0.9rem', py: 2 }}>
                                Aucun achat récent.
                            </Typography>
                        ) : (
                            achatsRecents.map((a) => (
                                <PurchaseRow key={a.nom} {...a} />
                            ))
                        )}
                    </SectionCard>
                </Box>

                {/* Bottom row — discover events */}
                <SectionCard
                    title="Événements à venir près de vous"
                    icon={<CalendarTodayIcon fontSize="small" />}
                >
                    {evenementsDisponibles.map((e) => (
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
        </div>
    );
}

export default Dashboard;
