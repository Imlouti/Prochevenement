import React, { useState, useEffect } from 'react';
import './styles.css';
import {
    Typography, Box, Divider, Chip, CircularProgress,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AttachMoneyIcon        from '@mui/icons-material/AttachMoney';
import EventIcon              from '@mui/icons-material/Event';
import TrendingUpIcon         from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon      from '@mui/icons-material/CalendarToday';
import { authGet, getNomUtilisateur } from '../utils/api';
import { SectionCard } from '../components/SectionCard';

// ── Stat tile ──────────────────────────────────────────────────────────────────

function StatTile({ icon, label, value, accent }) {
    return (
        <Box sx={{
            flex: 1, minWidth: 160,
            border: '2px solid #1A1A1A',
            boxShadow: `4px 4px 0px ${accent || '#E85D3A'}`,
            backgroundColor: '#FAF7F2',
            overflow: 'hidden',
        }}>
            <Box sx={{ backgroundColor: '#1A1A1A', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ color: accent || '#E85D3A', display: 'flex' }}>{icon}</Box>
                <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.7rem', fontWeight: 700,
                    color: '#FAF7F2', textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                    {label}
                </Typography>
            </Box>
            <Box sx={{ px: 3, py: 2.5 }}>
                <Typography sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '2rem', fontWeight: 700,
                    color: '#1A1A1A', lineHeight: 1,
                }}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}

// ── Event row ──────────────────────────────────────────────────────────────────

function EventSalesRow({ eventNom, date, billetsSold, billetsTotal, revenu }) {
    const pct = billetsTotal > 0 ? Math.round((billetsSold / billetsTotal) * 100) : 0;
    return (
        <Box>
            <Box sx={{ py: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600, fontSize: '0.95rem',
                        color: '#1A1A1A', mb: 0.5,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        {eventNom}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <CalendarTodayIcon sx={{ fontSize: 12, color: '#9A9A9A' }} />
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6B6B6B' }}>
                            {date}
                        </Typography>
                    </Box>
                </Box>

                {/* Progress bar */}
                <Box sx={{ flex: 1, minWidth: 80 }}>
                    <Box sx={{ height: 6, backgroundColor: '#E0DDD8', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: `${pct}%`,
                            backgroundColor: pct >= 80 ? '#C0392B' : pct >= 50 ? '#E85D3A' : '#C9A84C',
                            transition: 'width 0.4s ease',
                        }} />
                    </Box>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: '#9A9A9A', mt: 0.5 }}>
                        {billetsSold} / {billetsTotal} billets ({pct}%)
                    </Typography>
                </Box>

                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700, fontSize: '0.95rem',
                        color: revenu === 0 ? '#6B6B6B' : '#1A1A1A',
                    }}>
                        {revenu === 0 ? '—' : `$${revenu.toFixed(2)}`}
                    </Typography>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: '#9A9A9A' }}>
                        revenu
                    </Typography>
                </Box>

                <Chip
                    label={billetsSold === 0 ? 'Aucune vente' : billetsSold === billetsTotal ? 'Complet' : 'En vente'}
                    size="small"
                    sx={{
                        borderRadius: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.68rem',
                        flexShrink: 0,
                        backgroundColor: billetsSold === 0 ? '#F5F5F5' : billetsSold === billetsTotal ? '#FDECEA' : '#E8F5E9',
                        color:           billetsSold === 0 ? '#9A9A9A' : billetsSold === billetsTotal ? '#C0392B'  : '#2E7D32',
                    }}
                />
            </Box>
            <Divider sx={{ borderColor: '#E0DDD8' }} />
        </Box>
    );
}


// ── Main page ──────────────────────────────────────────────────────────────────

function VendeurDashboard() {
    const nomUtilisateur = getNomUtilisateur();
    const [stats,   setStats]   = useState([]);
    const [totals,  setTotals]  = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authGet('/auth/vendorStats')
            .then(r => r.json())
            .then(data => {
                if (data.stats)  setStats(data.stats);
                if (data.totals) setTotals(data.totals);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Sort by billets sold descending
    const sorted = [...stats].sort((a, b) => b.billetsSold - a.billetsSold);

    return (
        <div className="content-container">
            {/* Greeting */}
            <Box sx={{ mb: 4 }}>
                <Typography sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                    fontWeight: 700, color: '#FAF7F2', lineHeight: 1.2,
                }}>
                    Bonjour{nomUtilisateur ? `, ${nomUtilisateur}` : ''} 👋
                </Typography>
                <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.9rem', color: '#6B6B6B', mt: 1,
                }}>
                    Voici un aperçu des performances de vos événements.
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#E85D3A' }} />
                </Box>
            ) : (
                <>
                    {/* Stat tiles */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                        <StatTile
                            icon={<EventIcon fontSize="small" />}
                            label="Événements"
                            value={totals?.totalEvenements ?? 0}
                            accent="#E85D3A"
                        />
                        <StatTile
                            icon={<ConfirmationNumberIcon fontSize="small" />}
                            label="Billets vendus"
                            value={totals?.totalBillets ?? 0}
                            accent="#C9A84C"
                        />
                        <StatTile
                            icon={<AttachMoneyIcon fontSize="small" />}
                            label="Revenu total"
                            value={totals?.totalRevenu ? `$${totals.totalRevenu.toFixed(2)}` : '$0.00'}
                            accent="#4CAF50"
                        />
                    </Box>

                    {/* Events breakdown */}
                    <SectionCard
                        title="Performance par événement"
                        icon={<TrendingUpIcon fontSize="small" />}
                    >
                        {sorted.length === 0 ? (
                            <Typography sx={{
                                fontFamily: "'DM Sans', sans-serif",
                                color: '#9A9A9A', fontSize: '0.9rem', py: 4, textAlign: 'center',
                            }}>
                                Aucun événement pour l'instant.{' '}
                                <a href="/AjouterEvenement" style={{ color: '#E85D3A', fontWeight: 600 }}>
                                    Créer votre premier événement →
                                </a>
                            </Typography>
                        ) : (
                            sorted.map(row => (
                                <EventSalesRow key={row.eventNom} {...row} />
                            ))
                        )}
                    </SectionCard>
                </>
            )}
        </div>
    );
}

export default VendeurDashboard;
