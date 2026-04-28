import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Tooltip, IconButton, Typography, Box, Badge } from '@mui/material';
import HomeIcon          from '@mui/icons-material/Home';
import SettingsIcon      from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingCartIcon  from '@mui/icons-material/ShoppingCart';
import ExitToAppIcon     from '@mui/icons-material/ExitToApp';
import StorefrontIcon    from '@mui/icons-material/Storefront';
import { logout, getNomUtilisateur, getUserRole, isLoggedIn } from '../utils/api';

function getCartCount() {
    if (!isLoggedIn()) return 0;
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!Array.isArray(cart)) return 0;
        return cart.reduce((s, i) => s + (typeof i === 'object' ? (i.quantity || 1) : 1), 0);
    } catch { return 0; }
}

export const Navigator = () => {
    const [cartCount, setCartCount] = useState(getCartCount);
    const nomUtilisateur = getNomUtilisateur();
    const isVendeur      = getUserRole() === 'Vendeur';

    useEffect(() => {
        const refresh = () => setCartCount(getCartCount());
        window.addEventListener('storage', refresh);
        return () => window.removeEventListener('storage', refresh);
    }, []);

    const iconSx = {
        color: '#FAF7F2', borderRadius: 0, padding: '8px',
        '&:hover': { backgroundColor: '#E85D3A', color: '#FAF7F2' },
    };

    return (
        <AppBar position="static" elevation={0}
            sx={{ backgroundColor: '#1A1A1A', borderBottom: '2px solid #E85D3A' }}>
            <Toolbar sx={{ minHeight: '64px !important', px: 3 }}>

                <Typography component="a"
                    href={isVendeur ? '/Vendeur' : '/Dashboard'}
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.25rem', fontWeight: 900,
                        color: '#FAF7F2', textDecoration: 'none',
                        letterSpacing: '-0.02em',
                        '& span': { color: '#E85D3A' },
                    }}>
                    Proché<span>vénements</span>
                </Typography>

                {isVendeur && (
                    <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.72rem', color: '#C9A84C',
                        fontWeight: 700, ml: 2,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>
                        Espace vendeur
                    </Typography>
                )}

                <Box sx={{ flexGrow: 1 }} />

                {nomUtilisateur && (
                    <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.88rem', color: '#C9A84C',
                        fontWeight: 500, mr: 1,
                    }}>
                        Bonjour, {nomUtilisateur}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    {isVendeur ? (
                        <>
                            <Tooltip title="Mes événements">
                                <IconButton href="/Vendeur" sx={iconSx} size="medium">
                                    <StorefrontIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Paramètres">
                                <IconButton href="/Parametres" sx={iconSx} size="medium">
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Déconnexion">
                                <IconButton onClick={() => { logout(); document.location.href = '/'; }}
                                    sx={{ ...iconSx, ml: 0.5 }} size="medium">
                                    <ExitToAppIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip title="Accueil">
                                <IconButton href="/Dashboard" sx={iconSx} size="medium">
                                    <HomeIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Événements">
                                <IconButton href="/Magasiner" sx={iconSx} size="medium">
                                    <Badge badgeContent={cartCount} sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: '#E85D3A', color: '#FAF7F2',
                                            fontSize: '0.62rem', minWidth: 16, height: 16,
                                            borderRadius: 0, border: '1.5px solid #1A1A1A',
                                        },
                                    }}>
                                        <ShoppingCartIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Calendrier">
                                <IconButton href="/Calendrier" sx={iconSx} size="medium">
                                    <CalendarMonthIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Paramètres">
                                <IconButton href="/Parametres" sx={iconSx} size="medium">
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Déconnexion">
                                <IconButton onClick={() => { logout(); document.location.href = '/'; }}
                                    sx={{ ...iconSx, ml: 0.5 }} size="medium">
                                    <ExitToAppIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};
