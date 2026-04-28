import React, { Component } from 'react';
import './styles.css';
import { IconButton, Link } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ModifyComp from '../components/ModifyComp';

class Modifier extends Component {
    render() {
        return (
            <div className="auth-inner">
                <IconButton href="/Parametres" className="auth-back-btn" size="large">
                    <ArrowBackIosIcon />
                </IconButton>

                <div className="auth-card">
                    <div className="auth-logo">Proché<span style={{color:'#6B6B6B'}}>vénements</span></div>
                    <h2 className="auth-title">Modifier le compte</h2>
                    <p className="auth-subtitle">Mettez à jour vos informations personnelles.</p>

                    <ModifyComp />

                    <a id="hidden" className="error-msg">Vous devez remplir tous les champs.</a>

                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <Link href="/Reinitialiser" sx={{ fontSize: '0.88rem' }}>
                            Réinitialiser le mot de passe
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modifier;
