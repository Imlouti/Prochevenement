import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs }         from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker }           from '@mui/x-date-pickers/DatePicker';
import { TimePicker }           from '@mui/x-date-pickers/TimePicker';
import { authPost } from '../utils/api';
import { LocationAutocomplete } from './LocationAutocomplete';

export default function AddEvent() {
    const [nom,         setNom]         = useState('');
    const [description, setDescription] = useState('');
    const [prix,        setPrix]        = useState('');
    const [location,    setLocation]    = useState('');
    const [billets,     setBillets]     = useState('');
    const [lat,         setLat]         = useState(null);
    const [lng,         setLng]         = useState(null);
    const [startDate,   setStartDate]   = useState(dayjs());
    const [endDate,     setEndDate]     = useState(dayjs());
    const [startTime,   setStartTime]   = useState(dayjs().hour(18).minute(0));
    const [endTime,     setEndTime]     = useState(dayjs().hour(21).minute(0));
    const [error,       setError]       = useState('');

    const handleSubmit = async () => {
        setError('');
        if (!nom || !description || !prix || !location.trim() || !billets || !startDate || !endDate || !startTime || !endTime) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        const evenement = {
            nom,
            description,
            prix,
            // Display string e.g. "12 avr. 2025"
            date:        startDate.format('D MMM. YYYY'),
            dateISO:     startDate.format('YYYY-MM-DD'),
            endDateISO:  endDate.format('YYYY-MM-DD'),
            startHour:   startTime.hour(),
            startMinute: startTime.minute(),
            endHour:     endTime.hour(),
            endMinute:   endTime.minute(),
            location,
            billets,
        };

        try {
            const res  = await authPost('/auth/event', evenement);
            const data = await res.json();
            if (res.ok) {
                document.location.href = '/Vendeur';
            } else {
                setError(data.message || "Erreur lors de la création.");
            }
        } catch (err) {
            setError('Erreur de connexion au serveur.');
        }
    };

    const fieldSx = { mb: 2, width: '100%' };
    const labelSx = {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.78rem', fontWeight: 600,
        color: '#6B6B6B', mb: 0.5,
        textTransform: 'uppercase', letterSpacing: '0.06em',
    };

    return (
        <Box sx={{ width: '100%' }}>
            <TextField label="Titre de l'événement" value={nom}
                onChange={e => setNom(e.target.value)} fullWidth sx={fieldSx} />

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
                {/* Start date + time */}
                <Typography sx={labelSx}>Début</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <DatePicker label="Date de début" value={startDate}
                        onChange={v => { setStartDate(v); if (v && v.isAfter(endDate)) setEndDate(v); }}
                        sx={{ flex: 1 }} />
                    <TimePicker label="Heure de début" value={startTime}
                        onChange={v => setStartTime(v)} sx={{ flex: 1 }}
                        ampm={false} />
                </Box>

                {/* End date + time */}
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

            {error && (
                <Typography sx={{ color: '#C0392B', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Button variant="contained" fullWidth size="large" onClick={handleSubmit}>
                Créer l'événement
            </Button>
        </Box>
    );
}
