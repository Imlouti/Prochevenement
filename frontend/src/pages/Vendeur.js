import React, { Component } from 'react';
import './styles.css';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import { VendorTable } from '../components/VendorTable';

class Vendeur extends Component {
    render() {
        return (
            <div className="page-root">
                {/* Vendor-specific AppBar */}
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{ backgroundColor: '#1A1A1A', borderBottom: '2px solid #E85D3A' }}
                >
                    <Toolbar sx={{ minHeight: '64px !important', px: 3 }}>
                        <Typography sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.25rem',
                            fontWeight: 900,
                            color: '#FAF7F2',
                            letterSpacing: '-0.02em',
                            flexGrow: 1,
                        }}>
                            Proché<span style={{ color: '#E85D3A' }}>vénements</span>
                            <Typography component="span" sx={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '0.75rem',
                                color: '#C9A84C',
                                ml: 2,
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                            }}>
                                Espace vendeur
                            </Typography>
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            href="/AjouterEvenement"
                            sx={{
                                mr: 2,
                                fontFamily: "'DM Sans', sans-serif",
                                borderRadius: 0,
                                backgroundColor: '#E85D3A',
                                boxShadow: 'none',
                                '&:hover': { backgroundColor: '#D44E2C', boxShadow: 'none' },
                            }}
                        >
                            Ajouter un événement
                        </Button>

                        <IconButton
                            href="/"
                            sx={{
                                color: '#FAF7F2',
                                borderRadius: 0,
                                '&:hover': { backgroundColor: '#E85D3A' },
                            }}
                        >
                            <ExitToAppIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <div className="content-container">
                    <Typography className="page-title" component="h1">
                        Mes événements
                    </Typography>
                    <Typography sx={{ color: '#9A9A9A', mb: 4, fontFamily: "'DM Sans', sans-serif" }}>
                        Gérez vos événements et billets disponibles.
                    </Typography>
                    <VendorTable />
                </div>
            </div>
        );
    }
}

export default Vendeur;
