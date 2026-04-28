import React from 'react';
import './styles.css';
import { EventTable } from '../components/EventTable';
import { Typography } from '@mui/material';

function Magasiner() {
    return (
        <div style={{
            maxWidth: 1400,
            margin: '0 auto',
            padding: '40px 24px 24px',
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
        }}>
            <Typography className="page-title" component="h1" sx={{ flexShrink: 0 }}>
                Événements
            </Typography>
            <EventTable />
        </div>
    );
}

export default Magasiner;
