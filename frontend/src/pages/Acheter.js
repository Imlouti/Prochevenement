import React, { Component } from 'react';
import './styles.css';
import { IconButton, Typography, Box, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LockIcon from '@mui/icons-material/Lock';

class Acheter extends Component {
    async Creation(event) {
        if (event) {
            event.preventDefault();
            document.location.href = '/Magasiner';
        }
    }

    render() {
        return (
            <div className="auth-root">
                <IconButton href="/Panier" className="auth-back-btn" size="large">
                    <ArrowBackIosIcon />
                </IconButton>

                <div className="auth-card" style={{ maxWidth: 560 }}>
                    <div className="auth-logo">Proché<span style={{color:'#6B6B6B'}}>vénements</span></div>
                    <h2 className="auth-title">Paiement</h2>
                    <p className="auth-subtitle">Remplissez vos informations de paiement en toute sécurité.</p>

                    <form onSubmit={this.Creation}>
                        {[
                            { id: 'nom', placeholder: 'Nom complet' },
                            { id: 'courriel', placeholder: 'Courriel' },
                            { id: 'numerocarte', placeholder: 'Numéro de carte de crédit' },
                            { id: 'expiration', placeholder: 'Date d\'expiration (MM/AA)' },
                            { id: 'codesecurite', placeholder: 'Code de sécurité (CVV)', type: 'password' },
                            { id: 'addresse', placeholder: 'Adresse de facturation' },
                        ].map(({ id, placeholder, type }) => (
                            <input
                                key={id}
                                type={type || 'text'}
                                id={id}
                                className="payment-input"
                                placeholder={placeholder}
                            />
                        ))}

                        <Box sx={{ mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                startIcon={<LockIcon />}
                            >
                                Confirmer le paiement
                            </Button>
                        </Box>
                    </form>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, justifyContent: 'center' }}>
                        <LockIcon sx={{ fontSize: 14, color: '#9A9A9A' }} />
                        <Typography sx={{ fontSize: '0.78rem', color: '#9A9A9A', fontFamily: "'DM Sans', sans-serif" }}>
                            Paiement sécurisé
                        </Typography>
                    </Box>
                </div>
            </div>
        );
    }
}

export default Acheter;
