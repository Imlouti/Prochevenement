import React from 'react';
import { Box, Link, Typography } from '@mui/material';

/**
 * Simple footer shown on public-facing pages.
 */
export function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                mt: 'auto',
                borderTop: '2px solid #333',
                backgroundColor: '#1A1A1A',
                px: 4,
                py: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
            }}
        >
            <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.82rem',
                color: '#6B6B6B',
            }}>
                © {new Date().getFullYear()} Prochévénements
            </Typography>

            <Box sx={{ display: 'flex', gap: 3 }}>
                <Link
                    href="/Propos"
                    sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.82rem',
                        color: '#9A9A9A',
                        textDecoration: 'none',
                        '&:hover': { color: '#FAF7F2' },
                    }}
                >
                    À propos
                </Link>
            </Box>
        </Box>
    );
}
