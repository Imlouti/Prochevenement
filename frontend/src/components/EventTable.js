import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableSortLabel, TablePagination, TextField, InputAdornment, IconButton,
    FormControlLabel, Checkbox, Chip, Typography, Divider, Slider,
    CircularProgress, Tooltip, Button, Badge,
} from '@mui/material';
import SearchIcon           from '@mui/icons-material/Search';
import ClearIcon            from '@mui/icons-material/Clear';
import TuneIcon             from '@mui/icons-material/Tune';
import ShoppingCartIcon     from '@mui/icons-material/ShoppingCart';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn, BASE_URL } from '../utils/api';

// ── Constants ─────────────────────────────────────────────────────────────────
const PRICE_MAX = 1000;  // raise later if needed
const DIST_MAX  = 100;   // km — adjust when backend provides distance

// ── Column definitions ────────────────────────────────────────────────────────
// sticky: true  →  event name column, pinned left on horizontal scroll
const COLUMNS = [
    { id: 'nom',      label: 'Événement',       sortable: true, minWidth: 220, sticky: true },
    { id: 'location', label: 'Lieu',             sortable: true, minWidth: 160 },
    { id: 'date',     label: 'Date',             sortable: true, minWidth: 130 },
    { id: 'prix',     label: 'Prix',             sortable: true, minWidth: 110 },
    { id: 'distance', label: 'Distance',         sortable: true, minWidth: 120 },
    { id: 'billets',  label: 'Billets restants', sortable: true, minWidth: 150 },
];

// ── French date parser ────────────────────────────────────────────────────────
const FR_MONTHS = {
    'jan':0,'fév':1,'fev':1,'mar':2,'avr':3,
    'mai':4,'juin':5,'juil':6,'aoû':7,'aou':7,
    'sep':8,'oct':9,'nov':10,'déc':11,'dec':11,
};
function parseDate(str) {
    if (!str) return new Date(0);
    const parts = str.toLowerCase().replace(/\./g, '').trim().split(/\s+/);
    if (parts.length < 3) return new Date(0);
    return new Date(parseInt(parts[2], 10), FR_MONTHS[parts[1]] ?? 0, parseInt(parts[0], 10));
}

// ── Sort comparator ───────────────────────────────────────────────────────────
function compareRows(a, b, orderBy) {
    if (orderBy === 'date')
        return parseDate(a.date) - parseDate(b.date);
    if (['prix','billets','distance'].includes(orderBy))
        return (a[orderBy] ?? 0) - (b[orderBy] ?? 0);
    return (a[orderBy] ?? '').toString().toLowerCase()
        .localeCompare((b[orderBy] ?? '').toString().toLowerCase());
}
function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => -compareRows(a, b, orderBy)
        : (a, b) =>  compareRows(a, b, orderBy);
}

// ── Placeholder data (replaced once backend responds) ─────────────────────────
const PLACEHOLDER_ROWS = [
    { _id:'1', nom:'Concert Jazz au Parc',           location:'Parc Lafontaine',  date:'12 avr. 2025', prix:12, billets:80,  distance:2.1  },
    { _id:'2', nom:'Marché Artisanal du Printemps',  location:'Place des Arts',   date:'19 avr. 2025', prix:0,  billets:200, distance:5.4  },
    { _id:'3', nom:'Festival de Cinéma Indépendant', location:'Cinéma Beaubien',  date:'3 mai 2025',   prix:18, billets:45,  distance:3.0  },
    { _id:'4', nom:'Trivia Night au Vieux-Port',     location:'Bar Le Balcon',    date:'8 avr. 2025',  prix:10, billets:30,  distance:7.8  },
    { _id:'5', nom:'Exposition Photo Urbaine',       location:'Galerie Zéro1',    date:'15 avr. 2025', prix:5,  billets:150, distance:1.3  },
    { _id:'6', nom:'Tournoi de Pétanque',            location:'Parc Maisonneuve', date:'26 avr. 2025', prix:0,  billets:64,  distance:12.5 },
];

// ── Filter panel section label ─────────────────────────────────────────────────
function FilterLabel({ children }) {
    return (
        <Typography sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#9A9A9A', mb: 1,
        }}>
            {children}
        </Typography>
    );
}

// ── Slider formatters ─────────────────────────────────────────────────────────
const prixLabel = v => v >= PRICE_MAX ? `$${PRICE_MAX}+` : `$${v}`;
const distLabel = v => v >= DIST_MAX  ? `${DIST_MAX}+ km` : `${v} km`;

const sliderSx = {
    color: '#E85D3A',
    '& .MuiSlider-thumb':       { borderRadius: 0, width: 12, height: 12 },
    '& .MuiSlider-track':       { height: 3 },
    '& .MuiSlider-rail':        { height: 3 },
    '& .MuiSlider-valueLabel':  { borderRadius: 0, backgroundColor: '#1A1A1A', fontSize: '0.72rem' },
};

// ── Sticky column styles ──────────────────────────────────────────────────────
const stickyHead = {
    position: 'sticky', left: 0, zIndex: 4,
    backgroundColor: '#1A1A1A',
    borderRight: '2px solid #333',
};
const stickyBody = {
    position: 'sticky', left: 0, zIndex: 1,
    backgroundColor: '#FAF7F2',
    borderRight: '2px solid #E0DDD8',
    '.MuiTableRow-root:hover &':                   { backgroundColor: '#F0EDE8' },
    '.MuiTableRow-root:nth-of-type(even) &':       { backgroundColor: '#F5F2ED' },
    '.MuiTableRow-root:nth-of-type(even):hover &': { backgroundColor: '#F0EDE8' },
};


// ── Haversine distance (km) between two lat/lng points ────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
    const R    = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a    = Math.sin(dLat / 2) ** 2 +
                 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                 Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Geocode a postal code via Nominatim (fallback when GPS is denied)
async function geocodePostal(postal) {
    if (!postal) return null;
    try {
        const res  = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(postal)}&format=json&limit=1`,
            { headers: { 'User-Agent': 'Prochevenements/1.0' } }
        );
        const data = await res.json();
        if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } catch {}
    return null;
}

// Get user position.
// Postal code first (no browser prompt, works immediately), then GPS fallback.
async function getUserPosition() {
    try {
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        const postal = (stored.postal || '').trim();
        if (postal) {
            const coords = await geocodePostal(postal);
            if (coords) return coords;
        }
    } catch {}
    // Fall back to GPS if no postal code or geocoding failed
    return new Promise((resolve) => {
        if (!navigator.geolocation) { resolve(null); return; }
        navigator.geolocation.getCurrentPosition(
            pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(null),
            { timeout: 5000, maximumAge: 60000 }
        );
    });
}

// ── Cart badge count helper ───────────────────────────────────────────────────
function getCartCount() {
    if (!isLoggedIn()) return 0;
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!Array.isArray(cart)) return 0;
        return cart.reduce((s, i) => s + (typeof i === 'object' ? (i.quantity || 1) : 1), 0);
    } catch { return 0; }
}

// ── Main component ────────────────────────────────────────────────────────────
export const EventTable = () => {
    const navigate   = useNavigate();
    const location_  = useLocation();
    const [rows,         setRows]         = useState(PLACEHOLDER_ROWS);
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    const [order,   setOrder]   = useState('asc');
    const [orderBy, setOrderBy] = useState('date');

    const [page,        setPage]        = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [search, setSearch] = useState('');

    const [filterOpen,  setFilterOpen]  = useState(false);
    const [priceRange,  setPriceRange]  = useState([0, PRICE_MAX]);
    const [distRange,   setDistRange]   = useState([0, DIST_MAX]);
    const [filterAvail, setFilterAvail] = useState(false);

    const [cartCount, setCartCount] = useState(getCartCount);

    // Refresh badge if localStorage changes in same tab
    useEffect(() => {
        const onStorage = () => setCartCount(getCartCount());
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // Events load independently — geolocation can't crash the table
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${BASE_URL}/auth/eventTable`, {
                    method: 'GET', headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                const fetched = Object.values(data).filter(Boolean).map(e => ({
                    _id:      e._id,
                    nom:      e.nom      ?? '',
                    location: e.location ?? '',
                    date:     e.date     ?? '',
                    dateISO:  e.dateISO  ?? '',
                    prix:     e.prix     ?? 0,
                    billets:  e.billets  ?? 0,
                    lat:      e.lat      ?? null,
                    lng:      e.lng      ?? null,
                    distance: null,
                }));
                setRows(fetched);
            } catch {
                setError('Impossible de charger les événements.');
            } finally {
                setLoading(false);
            }
        };
        load();

        // Geolocation independent — updates distances once position resolves
        getUserPosition().then(pos => {
            if (!pos) return;
            setUserLocation(pos);
            setOrderBy('distance');
            setRows(prev => prev.map(e => ({
                ...e,
                distance: (e.lat && e.lng)
                    ? Math.round(haversine(pos.lat, pos.lng, e.lat, e.lng) * 10) / 10
                    : null,
            })));
        }).catch(() => {});
    }, []);

    const visibleRows = useMemo(() => {
        let f = rows;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            f = f.filter(r =>
                r.nom.toLowerCase().includes(q) ||
                r.location.toLowerCase().includes(q)
            );
        }
        f = f.filter(r => {
            const p = r.prix ?? 0;
            return p >= priceRange[0] && (priceRange[1] >= PRICE_MAX || p <= priceRange[1]);
        });
        f = f.filter(r => {
            if (r.distance === null) return true;
            return r.distance >= distRange[0] && (distRange[1] >= DIST_MAX || r.distance <= distRange[1]);
        });
        if (filterAvail) f = f.filter(r => r.billets > 0);
        return [...f].sort(getComparator(order, orderBy));
    }, [rows, search, priceRange, distRange, filterAvail, order, orderBy]);

    const activeFilters =
        (priceRange[0] !== 0 || priceRange[1] !== PRICE_MAX ? 1 : 0) +
        (distRange[0]  !== 0 || distRange[1]  !== DIST_MAX  ? 1 : 0) +
        (filterAvail ? 1 : 0);

    const resetFilters = () => {
        setPriceRange([0, PRICE_MAX]);
        setDistRange([0, DIST_MAX]);
        setFilterAvail(false);
    };

    const handleSort = col => {
        setOrder(orderBy === col ? (order === 'asc' ? 'desc' : 'asc') : 'asc');
        setOrderBy(col);
        setPage(0);
    };

    const formatPrix = v => v === 0 ? 'Gratuit' : `$${Number(v).toFixed(2)}`;
    const formatDist = v => v === null ? '—' : `${Number(v).toFixed(1)} km`;

    return (
        <Box sx={{
            border: '2px solid #1A1A1A',
            boxShadow: '8px 8px 0px #E85D3A',
            overflow: 'hidden',
            backgroundColor: '#FAF7F2', 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
        }}>
            {/* ── Toolbar ── */}
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                px: 2, py: 1.5,
                borderBottom: '2px solid #1A1A1A',
                backgroundColor: '#FAF7F2',
            }}>
                {/* Search */}
                <TextField
                    size="small"
                    placeholder="Rechercher un événement ou un lieu…"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(0); }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#9A9A9A', fontSize: 18 }} />
                            </InputAdornment>
                        ),
                        endAdornment: search ? (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setSearch('')} sx={{ borderRadius: 0 }}>
                                    <ClearIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                    }}
                    sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />

                {/* Result count */}
                {!loading && (
                    <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.78rem', color: '#9A9A9A',
                        whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                        {visibleRows.length} résultat{visibleRows.length !== 1 ? 's' : ''}
                    </Typography>
                )}

                {/* Cart button */}
                <Tooltip title="Voir mon panier">
                    <Button
                        variant="outlined"
                        size="small"
                        href="/Panier"
                        startIcon={
                            <Badge
                                badgeContent={cartCount}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: '#E85D3A',
                                        color: '#FAF7F2',
                                        fontSize: '0.6rem',
                                        minWidth: 16, height: 16,
                                        borderRadius: 0,
                                    },
                                }}
                            >
                                <ShoppingCartIcon fontSize="small" />
                            </Badge>
                        }
                        sx={{
                            flexShrink: 0,
                            fontSize: '0.82rem', py: '5px',
                            borderColor: '#1A1A1A', color: '#1A1A1A',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#1A1A1A', color: '#FAF7F2',
                                transform: 'none', boxShadow: 'none',
                            },
                        }}
                    >
                        Panier
                    </Button>
                </Tooltip>

                {/* Filter toggle */}
                <Tooltip title={filterOpen ? 'Masquer les filtres' : 'Afficher les filtres'}>
                    <IconButton
                        onClick={() => setFilterOpen(v => !v)}
                        size="small"
                        sx={{
                            borderRadius: 0,
                            border: '2px solid',
                            borderColor: filterOpen || activeFilters > 0 ? '#E85D3A' : '#1A1A1A',
                            color:       filterOpen || activeFilters > 0 ? '#E85D3A' : '#1A1A1A',
                            p: '5px', flexShrink: 0,
                            position: 'relative',
                            '&:hover': { backgroundColor: '#FFF3EE', borderColor: '#E85D3A', color: '#E85D3A' },
                        }}
                    >
                        <TuneIcon fontSize="small" />
                        {activeFilters > 0 && (
                            <Box sx={{
                                position: 'absolute', top: -6, right: -6,
                                width: 14, height: 14,
                                backgroundColor: '#E85D3A', color: '#FAF7F2',
                                fontSize: '0.6rem', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: "'DM Sans', sans-serif",
                            }}>
                                {activeFilters}
                            </Box>
                        )}
                    </IconButton>
                </Tooltip>
            </Box>

            {/* ── Body: table + filter panel (right) ── */}
            <Box sx={{ display: 'flex', alignItems: 'stretch', flex: 1, minHeight: 0 }}>

                {/* Table area — always fills available width */}
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <TableContainer sx={{ flex: 1, overflowX: 'auto', overflowY: 'auto', minHeight: 0 }}>
                        <Table stickyHeader sx={{ minWidth: 700 }}>
                            <TableHead>
                                <TableRow>
                                    {COLUMNS.map(col => (
                                        <TableCell
                                            key={col.id}
                                            style={{ minWidth: col.minWidth }}
                                            sortDirection={orderBy === col.id ? order : false}
                                            sx={col.sticky ? stickyHead : {}}
                                        >
                                            {col.sortable ? (
                                                <TableSortLabel
                                                    active={orderBy === col.id}
                                                    direction={orderBy === col.id ? order : 'asc'}
                                                    onClick={() => handleSort(col.id)}
                                                    sx={{
                                                        color: '#FAF7F2 !important',
                                                        '& .MuiTableSortLabel-icon':            { color: '#FAF7F2 !important' },
                                                        '&.Mui-active':                          { color: '#E85D3A !important' },
                                                        '&.Mui-active .MuiTableSortLabel-icon': { color: '#E85D3A !important' },
                                                    }}
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
                                    <TableRow>
                                        <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 6, border: 0 }}>
                                            <CircularProgress size={28} sx={{ color: '#E85D3A' }} />
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 4, color: '#C0392B', fontFamily: "'DM Sans', sans-serif" }}>
                                            {error}
                                        </TableCell>
                                    </TableRow>
                                ) : visibleRows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 6 }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: '#9A9A9A', fontSize: '0.95rem' }}>
                                                Aucun événement trouvé.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    visibleRows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map(row => (
                                            <TableRow
                                                key={row._id}
                                                hover
                                                onClick={() => navigate(`/Evenement?id=${row._id}`, { state: { background: { pathname: location_.pathname, search: location_.search } } })}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell sx={{ ...stickyBody, fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '0.9rem' }}>
                                                    {row.nom}
                                                </TableCell>
                                                <TableCell sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: '#6B6B6B' }}>
                                                    {row.location}
                                                </TableCell>
                                                <TableCell sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                                    {row.date}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={formatPrix(row.prix)}
                                                        size="small"
                                                        sx={{
                                                            borderRadius: 0,
                                                            fontFamily: "'DM Sans', sans-serif",
                                                            fontWeight: 700, fontSize: '0.75rem',
                                                            backgroundColor: row.prix === 0 ? '#E8F5E9' : '#FFF3EE',
                                                            color:           row.prix === 0 ? '#2E7D32' : '#E85D3A',
                                                            border: `1px solid ${row.prix === 0 ? '#A5D6A7' : '#FFBFA9'}`,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: row.distance === null ? '#B0B0B0' : 'inherit' }}>
                                                    {formatDist(row.distance)}
                                                </TableCell>
                                                <TableCell sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem' }}>
                                                    {row.billets > 0
                                                        ? row.billets
                                                        : <Typography sx={{ color: '#C0392B', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Complet</Typography>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ borderTop: '1px solid #E0DDD8' }}>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={visibleRows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(_, p) => setPage(p)}
                            onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
                            labelRowsPerPage="Lignes par page :"
                            labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
                            sx={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                    </Box>
                </Box>

                {/* ── Filter panel (right side) ── */}
                <Box sx={{
                    width: filterOpen ? 260 : 0,
                    flexShrink: 0,
                    overflow: 'hidden',
                    transition: 'width 0.22s ease',
                    borderLeft: filterOpen ? '2px solid #1A1A1A' : 'none',
                    backgroundColor: '#FAF7F2',
                }}>
                    {/* Fixed-width inner box so content doesn't squish during transition */}
                    <Box sx={{ width: 260, px: 2.5, pt: 3, pb: 2 }}>

                        <FilterLabel>Prix</FilterLabel>
                        <Box sx={{ px: 1, mb: 0.5 }}>
                            <Slider value={priceRange} onChange={(_, v) => { setPriceRange(v); setPage(0); }}
                                min={0} max={PRICE_MAX} step={5}
                                valueLabelDisplay="auto" valueLabelFormat={prixLabel} sx={sliderSx} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6B6B6B' }}>{prixLabel(priceRange[0])}</Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6B6B6B' }}>{prixLabel(priceRange[1])}</Typography>
                        </Box>

                        <Divider sx={{ borderColor: '#E0DDD8', mb: 2.5 }} />

                        <FilterLabel>Distance</FilterLabel>
                        <Box sx={{ px: 1, mb: 0.5 }}>
                            <Slider value={distRange} onChange={(_, v) => { setDistRange(v); setPage(0); }}
                                min={0} max={DIST_MAX} step={1}
                                valueLabelDisplay="auto" valueLabelFormat={distLabel} sx={sliderSx} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6B6B6B' }}>{distLabel(distRange[0])}</Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6B6B6B' }}>{distLabel(distRange[1])}</Typography>
                        </Box>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: '#B0B0B0', fontStyle: 'italic', mb: 2.5 }}>
                            Nécessite une adresse enregistrée.
                        </Typography>

                        <Divider sx={{ borderColor: '#E0DDD8', mb: 2.5 }} />

                        <FilterLabel>Disponibilité</FilterLabel>
                        <FormControlLabel
                            control={
                                <Checkbox checked={filterAvail} onChange={e => { setFilterAvail(e.target.checked); setPage(0); }}
                                    size="small" sx={{ color: '#1A1A1A', '&.Mui-checked': { color: '#E85D3A' } }} />
                            }
                            label={<Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem' }}>Billets disponibles seulement</Typography>}
                        />

                        {activeFilters > 0 && (
                            <>
                                <Divider sx={{ borderColor: '#E0DDD8', mt: 2.5, mb: 1.5 }} />
                                <Typography onClick={resetFilters} sx={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: '0.8rem', color: '#E85D3A',
                                    cursor: 'pointer', fontWeight: 600, textAlign: 'center',
                                    '&:hover': { textDecoration: 'underline' },
                                }}>
                                    Réinitialiser les filtres
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
