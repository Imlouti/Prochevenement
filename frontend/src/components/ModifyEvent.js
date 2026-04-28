import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, CircularProgress, Alert } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs }         from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker }           from '@mui/x-date-pickers/DatePicker';
import { TimePicker }           from '@mui/x-date-pickers/TimePicker';
import { publicPost, authPost } from '../utils/api';
import { LocationAutocomplete } from './LocationAutocomplete';

function getEventIdFromUrl() {
    return new URLSearchParams(window.location.search).get('id') || '';
}
function getEventNameFromUrl() {
    const idx = document.URL.indexOf('@');
    return idx !== -1 ? decodeURIComponent(document.URL.slice(idx + 1)) : '';
}

export default function ModifyEvent() {
    const eventId  = getEventIdFromUrl();
    const eventNom = getEventNameFromUrl();

    const [description, setDescription] = useState('');
    const [prix,        setPrix]        = useState('');
    const [location,    setLocation]    = useState('');
    const [billets,     setBillets]     = useState('');
    const [startDate,   setStartDate]   = useState(dayjs());
    const [endDate,     setEndDate]     = useState(dayjs());
    const [startTime,   setStartTime]   = useState(dayjs().hour(18).minute(0));
    const [endTime,     setEndTime]     = useState(dayjs().hour(21).minute(0));
    const [nomDisplay,  setNomDisplay]  = useState(eventNom);
    const [loading,     setLoading]     = useState(true);
    const [lat,         setLat]         = useState(null);
    const [lng,         setLng]         = useState(null);
    const [error,       setError]       = useState('');
    const [success,     setSuccess]     = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const res  = await publicPost('/auth/eventSearch', eventId ? { id: eventId } : { nom: eventNom });
                const data = await res.json();
                if (res.ok) {
                    setNomDisplay(data.nom || eventNom);
                    setDescription(data.description || '');
                    setPrix(String(data.prix ?? ''));
                    setLocation(data.location || '');
                    setBillets(String(data.billets ?? ''));
                    setStartDate(data.dateISO ? dayjs(data.dateISO) : dayjs());
                    setEndDate(data.endDateISO ? dayjs(data.endDateISO) : data.dateISO ? dayjs(data.dateISO) : dayjs());
                    setStartTime(dayjs().hour(data.startHour ?? 18).minute(data.startMinute ?? 0));
                    setEndTime(dayjs().hour(data.endHour ?? 21).minute(data.endMinute ?? 0));
                }
            } catch (err) {
                console.error('[ModifyEvent] load error:', err);
            } finally {
                setLoading(false);
            }
        };
        if (eventId || eventNom) load();
        else setLoading(false);
    }, []);

    const handleSave = async () => {
        setError(''); setSuccess('');
        try {
            const res = await authPost('/auth/eventModify', {
                id:          eventId || undefined,
                nom:         nomDisplay,
                description, prix,
                date:        startDate.format('D MMM. YYYY'),
                dateISO:     startDate.format('YYYY-MM-DD'),
                endDateISO:  endDate.format('YYYY-MM-DD'),
                startHour:   startTime.hour(),
                startMinute: startTime.minute(),
                endHour:     endTime.hour(),
                endMinute:   endTime.minute(),
                location, billets,
                ...(lat !== null ? { lat, lng } : {}),
            });
            if (res.ok) document.location.href = '/Vendeur';
            else setError((await res.json()).message || 'Erreur lors de la modification.');
        } catch { setError('Erreur de connexion.'); }
    };

    const handleDelete = async () => {
        setError('');
        try {
            const res = await authPost('/auth/eventDelete', { id: eventId || undefined, nom: nomDisplay });
            if (res.ok) document.location.href = '/Vendeur';
            else setError((await res.json()).message || 'Erreur lors de la suppression.');
        } catch { setError('Erreur de connexion.'); }
    };

    if (loading) return <CircularProgress size={28} sx={{ color: '#E85D3A', display: 'block', mx: 'auto', my: 4 }} />;

    const fieldSx = { mb: 2, width: '100%' };
    const labelSx = {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.78rem', fontWeight: 600,
        color: '#6B6B6B', mb: 0.5,
        textTransform: 'uppercase', letterSpacing: '0.06em',
    };

    return (
        <Box sx={{ width: '100%' }}>
            <TextField label="Description" value={description}
                onChange={e => setDescription(e.target.value)}
                fullWidth multiline rows={3} sx={fieldSx} />

            <TextField label="Prix ($)" value={prix} type="number"
                onChange={e => setPrix(e.target.value)} fullWidth sx={fieldSx} />

            <LocationAutocomplete
                label="Adresse / Lieu"
                value={location}
                onChange={val => { setLocation(val); setLat(null); setLng(null); }}
                onSelect={({ address, lat: la, lng: lo }) => { setLocation(address); setLat(la); setLng(lo); }}
                sx={fieldSx}
            />

            <TextField label="Nombre de billets" value={billets} type="number"
                onChange={e => setBillets(e.target.value)} fullWidth sx={fieldSx} />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                <Typography sx={labelSx}>Début</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <DatePicker label="Date de début" value={startDate}
                        onChange={v => { setStartDate(v); if (v && v.isAfter(endDate)) setEndDate(v); }}
                        sx={{ flex: 1 }} />
                    <TimePicker label="Heure de début" value={startTime}
                        onChange={v => setStartTime(v)} sx={{ flex: 1 }}
                        ampm={false} />
                </Box>

                <Typography sx={labelSx}>Fin</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <DatePicker label="Date de fin" value={endDate}
                        minDate={startDate}
                        onChange={v => setEndDate(v)}
                        sx={{ flex: 1 }} />
                    <TimePicker label="Heure de fin" value={endTime}
                        onChange={v => setEndTime(v)} sx={{ flex: 1 }}
                        ampm={false} />
                </Box>
            </LocalizationProvider>

            {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 0 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 0 }}>{success}</Alert>}

            <Button variant="contained" fullWidth size="large" sx={{ mb: 2 }} onClick={handleSave}>
                Enregistrer les modifications
            </Button>

            <Button variant="outlined" fullWidth size="large" onClick={handleDelete}
                sx={{
                    borderColor: '#C0392B', color: '#C0392B', borderRadius: 0,
                    '&:hover': { backgroundColor: '#C0392B', color: '#FAF7F2', borderColor: '#C0392B', boxShadow: 'none' },
                }}>
                Supprimer l'événement
            </Button>
        </Box>
    );
}
