import React, { useState } from 'react';
import './styles.css';
import { CartTable } from '../components/CartTable';
import { Button, Typography, Box } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

function Panier() {
    const [cartCount, setCartCount] = useState(0);

    return (
        <div className="content-container">
            <Typography className="page-title" component="h1">
                Mon panier
            </Typography>

            {/* CartTable calls onCartChange whenever items change */}
            <CartTable onCartChange={setCartCount} />

            <Box sx={{ mt: 4, textAlign: 'right' }}>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingBagIcon />}
                    disabled={cartCount === 0}
                    onClick={() => { document.location.href = '/Acheter'; }}
                >
                    Procéder à l'achat
                </Button>
            </Box>
        </div>
    );
}

export default Panier;
