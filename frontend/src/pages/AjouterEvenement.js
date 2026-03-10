import React, { Component } from 'react';
import './styles.css';
import { IconButton, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddEvent from '../components/AddEvent';

class AjouterEvenement extends Component {
    render() {
        return (
            <div className="auth-root">
                <IconButton href="/Vendeur" className="auth-back-btn" size="large">
                    <ArrowBackIosIcon />
                </IconButton>

                <div className="auth-card" style={{ maxWidth: 620 }}>
                    <div className="auth-logo">Proché<span style={{color:'#6B6B6B'}}>vénements</span></div>
                    <h2 className="auth-title">Créer un événement</h2>
                    <p className="auth-subtitle">Remplissez les informations de votre événement.</p>

                    <AddEvent />

                    <a id="hidden" className="error-msg">Vous devez remplir tous les champs.</a>
                </div>
            </div>
        );
    }
}

export default AjouterEvenement;
