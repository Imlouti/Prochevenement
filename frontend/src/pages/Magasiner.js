import React, { Component } from 'react';
import './styles.css';
import { EventTable } from '../components/EventTable';
import { Navigator } from '../components/Navigator';
import { Box, Typography } from '@mui/material';

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

class Magasiner extends Component {
    render() {
        const nomUtilisateur = getNomUtilisateur();
        return (
            <div className="page-root">
                <Navigator userName={nomUtilisateur} />
                <div className="content-container">
                    <Typography className="page-title" component="h1">
                        Événements
                    </Typography>
                    <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: '#9A9A9A',
                        mb: 4,
                        fontSize: '1rem',
                    }}>
                        Parcourez les événements disponibles près de chez vous.
                    </Typography>
                    <EventTable />
                </div>
            </div>
        );
    }
}

export default Magasiner;
