import React, { useState } from 'react';
import './styles.css';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { frFR } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/fr';
import { Navigator } from '../components/Navigator';
import { Typography, Box } from '@mui/material';

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

const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    '&.Mui-selected': {
        backgroundColor: '#E85D3A',
        color: '#FAF7F2',
        borderRadius: 0,
        '&:hover': { backgroundColor: '#D44E2C' },
    },
}));

const ServerDay = (props) => {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
    const isSelected = !props.outsideCurrentMonth &&
        highlightedDays.includes(day.format('YYYY-MM-DD'));
    return (
        <HighlightedDay
            {...other}
            outsideCurrentMonth={outsideCurrentMonth}
            day={day}
            selected={isSelected}
        />
    );
};

const Calendrier = () => {
    const nomUtilisateur = getNomUtilisateur();
    const [highlightedDays] = useState(['2025-04-22']);
    const today = dayjs();

    return (
        <div className="page-root">
            <Navigator userName={nomUtilisateur} />
            <div className="content-container">
                <Typography className="page-title" component="h1">
                    Calendrier
                </Typography>
                <Typography sx={{ color: '#9A9A9A', mb: 4, fontFamily: "'DM Sans', sans-serif" }}>
                    Les dates surlignées correspondent à des événements disponibles.
                </Typography>

                <Box sx={{
                    border: '2px solid #333',
                    boxShadow: '6px 6px 0px #E85D3A',
                    display: 'inline-block',
                    overflow: 'hidden',
                    backgroundColor: '#FAF7F2',
                }}>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
                        adapterLocale="fr"
                    >
                        <StaticDatePicker
                            defaultValue={today}
                            minDate={today}
                            maxDate={today.add(10, 'year')}
                            slots={{ day: ServerDay }}
                            slotProps={{
                                day: { highlightedDays },
                                actionBar: { actions: ['accept'] },
                            }}
                            onAccept={(date) => {
                                const d = new Date(date).toISOString().split('T')[0];
                                highlightedDays.forEach((item) => {
                                    if (item === d) alert('Concert en ' + item);
                                });
                            }}
                            localeText={{ clearButtonLabel: 'Empty' }}
                            sx={{
                                '& .MuiPickersCalendarHeader-root': {
                                    fontFamily: "'DM Sans', sans-serif",
                                },
                                '& .MuiDayCalendar-weekDayLabel': {
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontWeight: 700,
                                },
                                '& .MuiPickersDay-root': {
                                    fontFamily: "'DM Sans', sans-serif",
                                    borderRadius: 0,
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Box>
            </div>
        </div>
    );
};

export default Calendrier;
