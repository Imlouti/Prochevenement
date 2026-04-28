import React, { useEffect } from 'react';
import './styles.css';
import { IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ForgotComp from '../components/ForgotComp';
import { isLoggedIn, getUserRole } from '../utils/api';

function Oublier() {
    useEffect(() => {
        if (isLoggedIn()) {
            document.location.href = getUserRole() === 'Vendeur' ? '/Vendeur' : '/Dashboard';
        }
    }, []);

    return (
        <div className="auth-root">
            <IconButton href="/Connexion" className="auth-back-btn" size="large">
                <ArrowBackIosIcon />
            </IconButton>

            <div className="auth-card">
                <div className="auth-logo">Proché<span style={{color:'#6B6B6B'}}>vénements</span></div>
                <h2 className="auth-title">Mot de passe oublié</h2>
                <p className="auth-subtitle">Entrez votre courriel et nous vous enverrons un code de vérification.</p>

                <ForgotComp />

                <a id="hidden" className="error-msg">Vous devez remplir tous les champs.</a>
            </div>
        </div>
    );
}

export default Oublier;
