import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Reusable card with a dark header bar and cream body.
 * Used on Dashboard, VendeurDashboard, and any page that needs
 * a titled section with the site's brutalist card style.
 *
 * Props:
 *   title     — uppercase label shown in the header
 *   icon      — MUI icon element shown left of the title
 *   children  — body content
 *   action    — optional element rendered on the right side of the header
 *               (e.g. a button or link)
 *   flex      — if true, adds flex:1 + minWidth:0 for use in flex rows
 */
export function SectionCard({ title, icon, children, action, flex = false }) {
    return (
        <Box sx={{
            backgroundColor: '#FAF7F2',
            border: '2px solid #1A1A1A',
            boxShadow: '6px 6px 0px #E85D3A',
            overflow: 'hidden',
            ...(flex ? { flex: 1, minWidth: 0 } : {}),
        }}>
            {/* Header */}
            <Box sx={{
                backgroundColor: '#1A1A1A',
                px: 3, py: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {icon && (
                        <Box sx={{ color: '#E85D3A', display: 'flex', alignItems: 'center' }}>
                            {icon}
                        </Box>
                    )}
                    <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.75rem', fontWeight: 700,
                        color: '#FAF7F2',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>
                        {title}
                    </Typography>
                </Box>
                {action && <Box>{action}</Box>}
            </Box>

            {/* Body */}
            <Box sx={{ px: 3, py: 2 }}>
                {children}
            </Box>
        </Box>
    );
}
