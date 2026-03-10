import React, { Component } from 'react';
import './styles.css';
import { IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ReinitializeComp from '../components/ReinitializeComp';

class Reinitialiser extends Component {
    render() {
        return (
            <div className="auth-root">
                <IconButton href="/Oublier" className="auth-back-btn" size="large">
                    <ArrowBackIosIcon />
                </IconButton>

                <div className="auth-card">
                    <div className="auth-logo">Proché<span style={{color:'#6B6B6B'}}>vénements</span></div>
                    <h2 className="auth-title">Réinitialiser le mot de passe</h2>
                    <p className="auth-subtitle">Entrez le code reçu par courriel et choisissez un nouveau mot de passe.</p>

                    <ReinitializeComp />

                    <a id="hidden" className="error-msg">Les mots de passe sont différents.</a>
                    <a id="hidden2" className="error-msg">Vous devez remplir tous les champs.</a>
                </div>
            </div>
        );
    }
}

export default Reinitialiser;
