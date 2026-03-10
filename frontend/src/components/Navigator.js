import React from "react";
import { AppBar, Toolbar, Tooltip, IconButton, Typography, Box } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export const Navigator = ({ userName }) => {
    const iconSx = {
        color: '#FAF7F2',
        borderRadius: 0,
        padding: '8px',
        '&:hover': {
            backgroundColor: '#E85D3A',
            color: '#FAF7F2',
        },
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                backgroundColor: '#1A1A1A',
                borderBottom: '2px solid #E85D3A',
            }}
        >
            <Toolbar sx={{ minHeight: '64px !important', px: 3 }}>
                {/* Logo */}
                <Typography
                    component="a"
                    href="/Magasiner"
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: '#FAF7F2',
                        textDecoration: 'none',
                        letterSpacing: '-0.02em',
                        flexGrow: 1,
                        '& span': { color: '#E85D3A' },
                    }}
                >
                    Proché<span>vénements</span>
                </Typography>

                {/* Username */}
                {userName && (
                    <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.88rem',
                        color: '#C9A84C',
                        fontWeight: 500,
                        mr: 1,
                    }}>
                        Bonjour, {userName}
                    </Typography>
                )}

                {/* Nav icons */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Accueil">
                        <IconButton href="/Dashboard" sx={iconSx} size="medium">
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Paramètres">
                        <IconButton href="/Parametres" sx={iconSx} size="medium">
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Calendrier">
                        <IconButton href="/Calendrier" sx={iconSx} size="medium">
                            <CalendarMonthIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Panier (bientôt disponible)">
                        <IconButton href="/Magasiner" sx={iconSx} size="medium">
                            <ShoppingCartIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="À propos">
                        <IconButton href="/Propos" sx={iconSx} size="medium">
                            <InfoOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Déconnexion">
                        <IconButton href="/" sx={{ ...iconSx, ml: 1 }} size="medium">
                            <ExitToAppIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
