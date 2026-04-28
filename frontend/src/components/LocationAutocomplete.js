import React, { useState, useEffect, useRef } from 'react';
import {
    TextField, Box, Typography, CircularProgress, Paper,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const DEBOUNCE_MS   = 450;   // ms to wait after last keystroke before searching
const MIN_CHARS     = 3;     // minimum characters before searching

/**
 * A location TextField that shows address suggestions from Nominatim as the
 * user types. When a suggestion is selected, it calls onSelect({ address, lat, lng }).
 *
 * Props:
 *   label        - TextField label
 *   value        - controlled value (the address string)
 *   onChange     - called with new string value as user types
 *   onSelect     - called with { address, lat, lng } when a suggestion is chosen
 *   sx           - extra sx props for the TextField
 */
export function LocationAutocomplete({ label = 'Adresse / Lieu', value, onChange, onSelect, sx }) {
    const [suggestions, setSuggestions]   = useState([]);
    const [loading,     setLoading]       = useState(false);
    const [open,        setOpen]          = useState(false);
    const debounceRef                     = useRef(null);
    const containerRef                    = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        onChange(val);

        // Clear previous debounce
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (val.length < MIN_CHARS) {
            setSuggestions([]);
            setOpen(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    q:               val,
                    format:          'json',
                    limit:           '5',
                    addressdetails:  '1',
                    'accept-language': 'fr',
                });
                const res  = await fetch(`${NOMINATIM_URL}?${params}`, {
                    headers: { 'User-Agent': 'Prochevenements/1.0 (class-project)' },
                });
                const data = await res.json();
                setSuggestions(data);
                setOpen(data.length > 0);
            } catch {
                setSuggestions([]);
                setOpen(false);
            } finally {
                setLoading(false);
            }
        }, DEBOUNCE_MS);
    };

    const handleSelect = (suggestion) => {
        const address = suggestion.display_name;
        onChange(address);
        onSelect?.({
            address,
            lat: parseFloat(suggestion.lat),
            lng: parseFloat(suggestion.lon),
        });
        setSuggestions([]);
        setOpen(false);
    };

    // Format a suggestion for display — prefer shorter local name
    const formatLabel = (s) => {
        const parts = s.display_name.split(', ');
        // Show first 3 parts (street, city, region) to keep it readable
        return parts.slice(0, 3).join(', ');
    };
    const formatSub = (s) => {
        const parts = s.display_name.split(', ');
        return parts.slice(3).join(', ');
    };

    return (
        <Box ref={containerRef} sx={{ position: 'relative', ...sx }}>
            <TextField
                label={label}
                value={value}
                onChange={handleChange}
                onFocus={() => suggestions.length > 0 && setOpen(true)}
                fullWidth
                InputProps={{
                    endAdornment: loading ? (
                        <CircularProgress size={16} sx={{ color: '#E85D3A', mr: 1 }} />
                    ) : undefined,
                }}
                inputProps={{ autoComplete: 'off' }}
            />

            {/* Suggestions dropdown */}
            {open && suggestions.length > 0 && (
                <Paper elevation={4} sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0, right: 0,
                    zIndex: 1400,
                    border: '2px solid #1A1A1A',
                    borderTop: 'none',
                    borderRadius: 0,
                    maxHeight: 280,
                    overflowY: 'auto',
                    backgroundColor: '#FAF7F2',
                }}>
                    {suggestions.map((s, i) => (
                        <Box
                            key={s.place_id}
                            onClick={() => handleSelect(s)}
                            sx={{
                                px: 2, py: 1.5,
                                display: 'flex', alignItems: 'flex-start', gap: 1.5,
                                cursor: 'pointer',
                                borderBottom: i < suggestions.length - 1 ? '1px solid #E0DDD8' : 'none',
                                '&:hover': { backgroundColor: '#FFF3EE' },
                                transition: 'background-color 0.1s',
                            }}
                        >
                            <LocationOnIcon sx={{ fontSize: 16, color: '#E85D3A', mt: 0.4, flexShrink: 0 }} />
                            <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: '0.88rem', fontWeight: 600,
                                    color: '#1A1A1A',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>
                                    {formatLabel(s)}
                                </Typography>
                                {formatSub(s) && (
                                    <Typography sx={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: '0.74rem', color: '#9A9A9A',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    }}>
                                        {formatSub(s)}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Paper>
            )}
        </Box>
    );
}
