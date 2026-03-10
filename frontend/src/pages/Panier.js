import React, { Component } from 'react';
import './styles.css';
import { Navigator } from '../components/Navigator';
import { CartTable } from '../components/CartTable';
import { Button, Typography, Box } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

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

class Panier extends Component {
    render() {
        const nomUtilisateur = getNomUtilisateur();
        return (
            <div className="page-root">
                <Navigator userName={nomUtilisateur} />
                <div className="content-container">
                    <Typography className="page-title" component="h1">
                        Mon panier
                    </Typography>

                    <CartTable />

                    <Box sx={{ mt: 4, textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ShoppingBagIcon />}
                            onClick={() => { document.location.href = '/Acheter'; }}
                        >
                            Procéder à l'achat
                        </Button>
                    </Box>
                </div>
            </div>
        );
    }
}

export default Panier;
