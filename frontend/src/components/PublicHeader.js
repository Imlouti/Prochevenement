import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

/**
 * Minimal header for pages accessible without a session.
 * Shows the site logo on the left and login/register buttons on the right.
 */
export function PublicHeader() {
    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{ backgroundColor: '#1A1A1A', borderBottom: '2px solid #E85D3A' }}
        >
            <Toolbar sx={{ minHeight: '64px !important', px: 3 }}>
                <Typography
                    component="a"
                    href="/"
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: '#FAF7F2',
                        textDecoration: 'none',
                        letterSpacing: '-0.02em',
                        '& span': { color: '#E85D3A' },
                    }}
                >
                    Proché<span>vénements</span>
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                        href="/Connexion"
                        variant="outlined"
                        size="small"
                        sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            borderRadius: 0,
                            borderColor: '#FAF7F2',
                            color: '#FAF7F2',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#FAF7F2',
                                color: '#1A1A1A',
                                borderColor: '#FAF7F2',
                                transform: 'none',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        Connexion
                    </Button>
                    <Button
                        href="/Creation"
                        variant="contained"
                        size="small"
                        sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            borderRadius: 0,
                            backgroundColor: '#E85D3A',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#D44E2C',
                                transform: 'none',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        Créer un compte
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
