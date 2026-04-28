import React, { Component } from 'react';
import './styles.css';
import { IconButton, Button, Typography, Box } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EventBusyIcon from '@mui/icons-material/EventBusy';

class Annuler extends Component {
    render() {
        return (
            <div className="auth-inner">
                <IconButton href="/Parametres" className="auth-back-btn" size="large">
                    <ArrowBackIosIcon />
                </IconButton>

                <div className="auth-card">
                    <div className="auth-logo">Proché<span style={{color:'#6B6B6B'}}>vénements</span></div>
                    <h2 className="auth-title">Annuler un achat</h2>
                    <p className="auth-subtitle">Détails de votre billet.</p>

                    <Box sx={{ border: '1px solid #E0DDD8', p: 3, mb: 3 }}>
                        {['Nom de l\'événement', 'Description', 'Prix', 'Emplacement', 'Date', 'Billets restants'].map((field) => (
                            <Typography key={field} sx={{
                                fontFamily: "'DM Sans', sans-serif",
                                color: '#6B6B6B',
                                fontSize: '0.95rem',
                                mb: 1,
                            }}>
                                {field}
                            </Typography>
                        ))}
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<EventBusyIcon />}
                        onClick={() => {
                            document.getElementById('hidden').style.display = 'block';
                            document.location.href = '/Parametres';
                        }}
                        sx={{ backgroundColor: '#C0392B', '&:hover': { backgroundColor: '#A93226' } }}
                    >
                        Annuler l'achat
                    </Button>

                    <a id="hidden" className="error-msg">Enlever du panier.</a>
                </div>
            </div>
        );
    }
}

export default Annuler;
