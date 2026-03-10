import React, { Component } from 'react';
import './styles.css';
import { Box, Link, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import RegisterComp from '../components/RegisterComp';

class Creation extends Component {
    render() {
        return (
            <div className="auth-root">
                <IconButton href="/" className="auth-back-btn" size="large">
                    <ArrowBackIosIcon />
                </IconButton>

                <div className="auth-card">
                    <div className="auth-logo">Proché<span style={{color:'#6B6B6B'}}>vénements</span></div>
                    <h2 className="auth-title">Créer un compte</h2>
                    <p className="auth-subtitle">Rejoignez-nous pour découvrir les événements près de chez vous.</p>

                    <RegisterComp />

                    <a id="hidden" className="error-msg">Les mots de passe sont différents.</a>
                    <a id="hidden2" className="error-msg">Vous devez remplir tous les champs.</a>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Link href="/Connexion" sx={{ fontSize: '0.88rem' }}>
                            Déjà un compte ? Connectez-vous.
                        </Link>
                    </Box>
                </div>
            </div>
        );
    }
}

export default Creation;
