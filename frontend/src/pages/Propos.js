import React from 'react';
import './styles.css';
import { Typography, Box, Divider } from '@mui/material';

function Propos() {
    return (
        <div className="content-container">
            <Typography className="page-title" component="h1">
                Qui sommes-nous ?
            </Typography>

            <Box sx={{
                backgroundColor: '#FAF7F2',
                border: '2px solid #1A1A1A',
                boxShadow: '8px 8px 0px #E85D3A',
                maxWidth: 680,
                overflow: 'hidden',
            }}>
                <Box sx={{
                    backgroundColor: '#1A1A1A',
                    px: 4, py: 3,
                    display: 'flex', alignItems: 'center', gap: 2,
                }}>
                    <img
                        src="logo.png"
                        alt="Logo"
                        style={{ width: 36, filter: 'invert(1) sepia(1) saturate(5) hue-rotate(330deg)', opacity: 0.9 }}
                    />
                    <Typography sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.3rem', fontWeight: 700,
                        color: '#FAF7F2', letterSpacing: '-0.02em',
                    }}>
                        Proché<span style={{ color: '#E85D3A' }}>vénements</span>
                    </Typography>
                </Box>

                <Box sx={{ px: 4, py: 4 }}>
                    <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '1.05rem', lineHeight: 1.8,
                        color: '#3A3A3A', mb: 4,
                    }}>
                        Chez Prochévénements, nous travaillons premièrement pour
                        optimiser votre recherche d'événements locaux. On travaille avec
                        plusieurs vendeurs petits pour assurer que même des petits
                        événements sont trouvables.
                    </Typography>

                    <Divider sx={{ borderColor: '#E0DDD8', mb: 4 }} />

                    <Box sx={{ display: 'flex', overflow: 'hidden', border: '1px solid #E0DDD8' }}>
                        {[
                            { num: '100+', label: 'Événements' },
                            { num: '50+',  label: 'Vendeurs' },
                            { num: '1000+', label: 'Billets vendus' },
                        ].map(({ num, label }, i) => (
                            <Box key={label} sx={{
                                flex: 1, px: 3, py: 3,
                                borderRight: i < 2 ? '1px solid #E0DDD8' : 'none',
                                textAlign: 'center',
                            }}>
                                <Typography sx={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '2rem', fontWeight: 700,
                                    color: '#E85D3A', lineHeight: 1,
                                }}>
                                    {num}
                                </Typography>
                                <Typography sx={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: '0.75rem', color: '#9A9A9A',
                                    textTransform: 'uppercase', letterSpacing: '0.1em',
                                    mt: 1, fontWeight: 600,
                                }}>
                                    {label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default Propos;
