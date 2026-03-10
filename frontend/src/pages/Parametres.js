import React from 'react';
import './styles.css';
import { Navigator } from '../components/Navigator';
import { Button, Typography, Box, Divider } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EventBusyIcon from '@mui/icons-material/EventBusy';

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

function Parametres() {
    const nomUtilisateur = getNomUtilisateur();

    return (
        <div className="page-root">
            <Navigator userName={nomUtilisateur} />
            <div className="content-container">
                <Typography className="page-title" component="h1">
                    Paramètres
                </Typography>

                <Box sx={{
                    backgroundColor: '#FAF7F2',
                    border: '2px solid #1A1A1A',
                    boxShadow: '8px 8px 0px #E85D3A',
                    maxWidth: 480,
                    overflow: 'hidden',
                }}>
                    {/* Header band */}
                    <Box sx={{
                        backgroundColor: '#1A1A1A',
                        px: 4,
                        py: 2.5,
                    }}>
                        <Typography sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: '#FAF7F2',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            fontSize: '0.8rem',
                        }}>
                            Mon compte
                        </Typography>
                    </Box>

                    <Box sx={{ px: 4, py: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ManageAccountsIcon />}
                            onClick={() => { document.location.href = '/Modifier'; }}
                            fullWidth
                        >
                            Modifier le compte
                        </Button>

                        <Divider sx={{ borderColor: '#E0DDD8' }} />

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<EventBusyIcon />}
                            onClick={() => { document.location.href = '/Annuler'; }}
                            fullWidth
                        >
                            Annuler un événement
                        </Button>
                    </Box>
                </Box>
            </div>
        </div>
    );
}

export default Parametres;
