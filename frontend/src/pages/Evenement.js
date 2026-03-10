import React, { Component } from 'react';
import './styles.css';
import { IconButton, Button, Typography, Box, Chip } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

var idx = document.URL.indexOf('@');
var list = document.URL.split('');
var params = new Array();
for (var i = idx + 1; i < list.length; i++) { params.push(list[i]); }
params = params.join('');

var eventInfo = [];
eventInfo.push(params);

const event = { nom: params };

try {
    const response = await fetch('http://localhost:5000/auth/eventSearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    });
    const data = await response.json();
    if (response.ok) {
        eventInfo.push(data.description);
        eventInfo.push(data.prix);
        eventInfo.push(data.date);
        eventInfo.push(data.location);
        eventInfo.push(data.billets);
    }
} catch (error) {
    console.error('There was an error loading the event:', error);
}

class Evenement extends Component {
    render() {
        return (
            <div className="auth-root" style={{ justifyContent: 'flex-start', paddingTop: 80 }}>
                <IconButton href="/Magasiner" className="auth-back-btn" size="large">
                    <ArrowBackIosIcon />
                </IconButton>

                <Box sx={{
                    width: '100%',
                    maxWidth: 640,
                    border: '2px solid #1A1A1A',
                    boxShadow: '8px 8px 0px #E85D3A',
                    backgroundColor: '#FAF7F2',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Header band */}
                    <Box sx={{ backgroundColor: '#1A1A1A', px: 4, py: 3 }}>
                        <Typography sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.8rem',
                            fontWeight: 700,
                            color: '#FAF7F2',
                        }}>
                            {eventInfo[0]}
                        </Typography>
                    </Box>

                    <Box sx={{ p: 4 }}>
                        {/* Description */}
                        <Typography sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '1rem',
                            color: '#6B6B6B',
                            mb: 4,
                            lineHeight: 1.7,
                        }}>
                            {eventInfo[1]}
                        </Typography>

                        {/* Details grid */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 4 }}>
                            {[
                                { icon: <AttachMoneyIcon />, label: 'Prix', value: `$${eventInfo[2]}` },
                                { icon: <CalendarTodayIcon />, label: 'Date', value: eventInfo[3] },
                                { icon: <LocationOnIcon />, label: 'Location', value: eventInfo[4] },
                                { icon: <ConfirmationNumberIcon />, label: 'Billets restants', value: eventInfo[5] },
                            ].map(({ icon, label, value }) => (
                                <Box key={label} sx={{
                                    border: '1px solid #E0DDD8',
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.5,
                                }}>
                                    <Box sx={{ color: '#E85D3A', mt: 0.25 }}>{icon}</Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A9A9A', fontWeight: 600 }}>
                                            {label}
                                        </Typography>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
                                            {value}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<ConfirmationNumberIcon />}
                            onClick={() => { document.location.href = '/Magasiner'; }}
                        >
                            Acheter des billets
                        </Button>

                        <a id="hidden" className="error-msg">Pas de billets restants.</a>
                    </Box>
                </Box>
            </div>
        );
    }
}

export default Evenement;
