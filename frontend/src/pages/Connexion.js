import React, { useEffect } from 'react';
import './styles.css';
import { Box, Link, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoginComp from '../components/LoginComp';
import { isLoggedIn, getUserRole } from '../utils/api';

function Connexion() {
    useEffect(() => {
        if (isLoggedIn()) {
            document.location.href = getUserRole() === 'Vendeur' ? '/Vendeur' : '/Dashboard';
        }
    }, []);

    return (
        <div className="auth-root">
            <IconButton href="/" className="auth-back-btn" size="large">
                <ArrowBackIosIcon />
            </IconButton>

            <div className="auth-card">
                <div className="auth-logo">Proché<span style={{color:'#6B6B6B'}}>vénements</span></div>
                <h2 className="auth-title">Connexion</h2>
                <p className="auth-subtitle">Bienvenue ! Connectez-vous pour accéder à votre compte.</p>

                <LoginComp />

                <a id="hidden"  className="error-msg">Ce compte n'existe pas.</a>
                <a id="hidden2" className="error-msg">Vous devez remplir tous les champs.</a>

                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/Creation" sx={{ fontSize: '0.88rem' }}>
                        Pas de compte ? Créer un compte.
                    </Link>
                    <Link href="/Oublier" sx={{ fontSize: '0.88rem', color: '#6B6B6B', '&:hover': { color: '#1A1A1A' } }}>
                        Mot de passe oublié
                    </Link>
                </Box>
            </div>
        </div>
    );
}

export default Connexion;
