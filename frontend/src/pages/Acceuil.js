import React, { Component } from 'react';
import './styles.css';
import { Button, Box, Link, Typography } from '@mui/material';

class Acceuil extends Component {
    render() {
        return (
            <div className="landing-root">
                <div className="landing-accent" />
                <div className="landing-accent-2" />

                {/* Header */}
                <div className="landing-header">
                    <div className="landing-logo">
                        Proché<span>vénements</span>
                    </div>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Link
                            href="/Connexion"
                            sx={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '0.9rem',
                                color: '#9A9A9A',
                                textDecoration: 'none',
                                fontWeight: 500,
                                '&:hover': { color: '#FAF7F2' },
                            }}
                        >
                            Connexion
                        </Link>
                        <Link
                            href="/Creation"
                            sx={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '0.9rem',
                                color: '#FAF7F2',
                                textDecoration: 'none',
                                fontWeight: 600,
                                border: '2px solid #E85D3A',
                                padding: '6px 18px',
                                '&:hover': { backgroundColor: '#E85D3A' },
                                transition: 'background 0.15s',
                            }}
                        >
                            Créer un compte
                        </Link>
                    </Box>
                </div>

                {/* Hero */}
                <div className="landing-hero">
                    <p className="landing-eyebrow">Plateforme de billets locaux</p>

                    <Typography className="landing-h1" component="h1">
                        Les événements <em>près</em><br />de vous
                    </Typography>

                    <p className="landing-sub">
                        Découvrez et achetez des billets pour les meilleurs événements locaux — concerts, marchés, festivals et bien plus encore.
                    </p>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => { document.location.href = "Connexion"; }}
                        sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '1rem',
                            fontWeight: 700,
                            padding: '14px 48px',
                            backgroundColor: '#E85D3A',
                            color: '#FAF7F2',
                            borderRadius: 0,
                            boxShadow: '4px 4px 0px #C9A84C',
                            '&:hover': {
                                backgroundColor: '#D44E2C',
                                boxShadow: '2px 2px 0px #C9A84C',
                                transform: 'translate(2px, 2px)',
                            },
                            transition: 'all 0.15s ease',
                            mb: 3,
                        }}
                    >
                        Se connecter
                    </Button>

                    <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.9rem',
                        color: '#6B6B6B',
                    }}>
                        Pas encore de compte ?{' '}
                        <Link
                            href="/Creation"
                            sx={{
                                color: '#C9A84C',
                                fontWeight: 600,
                                textDecorationColor: '#C9A84C',
                                '&:hover': { color: '#FAF7F2' },
                            }}
                        >
                            Créer un compte gratuitement
                        </Link>
                    </Typography>
                </div>

                {/* Faint map watermark */}
                <img src="map.png" className="landing-map-img" alt="" />
            </div>
        );
    }
}

export default Acceuil;
