import React, { useState, useEffect, useRef, useMemo } from 'react';
import './styles.css';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import weekday         from 'dayjs/plugin/weekday';
import isoWeek         from 'dayjs/plugin/isoWeek';
import isSameOrBefore  from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter   from 'dayjs/plugin/isSameOrAfter';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authGet } from '../utils/api';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ChevronLeftIcon  from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('fr');

// ── Constants ──────────────────────────────────────────────────────────────────
const HOUR_HEIGHT = 56;
const START_HOUR  = 6;
const END_HOUR    = 24;
const HOURS       = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);
const WEEK_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];


// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtTime(h, m) {
    const hh = h % 12 === 0 ? 12 : h % 12;
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm} ${h < 12 ? 'AM' : 'PM'}`;
}

function isoMonday(date) {
    return date.isoWeekday(1);
}

// ── Month grid component ───────────────────────────────────────────────────────
function MonthGrid({ selectedDate, onSelectDate, tickets }) {
    const today = dayjs();
    const [viewMonth, setViewMonth] = useState(selectedDate.startOf('month'));

    useEffect(() => {
        if (!selectedDate.isSame(viewMonth, 'month')) {
            setViewMonth(selectedDate.startOf('month'));
        }
    }, [selectedDate]);

    const eventDates = useMemo(() => new Set(tickets.map(t => t.dateISO || t.date)), [tickets]);

    // 42-cell grid — 6 weeks starting from the Monday before the 1st
    const gridDays = useMemo(() => {
        const first = viewMonth.startOf('month');
        // Go to Monday on or before the 1st
        // Get the Monday on or before the 1st: subtract (isoWeekday-1) days
        const start = first.subtract(first.isoWeekday() - 1, 'day');
        return Array.from({ length: 42 }, (_, i) => start.add(i, 'day'));
    }, [viewMonth]);

    const iconBtnSx = {
        color: '#FAF7F2', borderRadius: 0,
        '&:hover': { backgroundColor: '#E85D3A' },
    };

    return (
        <Box sx={{
            width: 280, flexShrink: 0,
            border: '2px solid #1A1A1A',
            boxShadow: '6px 6px 0px #E85D3A',
            backgroundColor: '#FAF7F2',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <Box sx={{ backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', px: 1, py: 0.75 }}>
                <IconButton size="small" sx={iconBtnSx} onClick={() => setViewMonth(v => v.subtract(1, 'month'))}>
                    <ChevronLeftIcon fontSize="small" />
                </IconButton>
                <Typography sx={{
                    flex: 1, textAlign: 'center',
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '0.92rem', fontWeight: 700,
                    color: '#FAF7F2', textTransform: 'capitalize',
                }}>
                    {viewMonth.format('MMMM YYYY')}
                </Typography>
                <IconButton size="small" sx={iconBtnSx} onClick={() => setViewMonth(v => v.add(1, 'month'))}>
                    <ChevronRightIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Weekday labels */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #E0DDD8' }}>
                {WEEK_LABELS.map(d => (
                    <Typography key={d} sx={{
                        textAlign: 'center', py: '6px',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.62rem', fontWeight: 700,
                        color: '#9A9A9A', textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                    }}>
                        {d}
                    </Typography>
                ))}
            </Box>

            {/* Day cells */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {gridDays.map(day => {
                    const inMonth    = day.isSame(viewMonth, 'month');
                    const isToday    = day.isSame(today, 'day');
                    const isSelected = day.isSame(selectedDate, 'day');
                    const hasEvent   = eventDates.has(day.format('YYYY-MM-DD'));

                    return (
                        <Box key={day.toString()} onClick={() => {
                            onSelectDate(day);
                            if (!day.isSame(viewMonth, 'month')) setViewMonth(day.startOf('month'));
                        }} sx={{
                            height: 34,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            borderRight: '1px solid #F0EDE8',
                            borderBottom: '1px solid #F0EDE8',
                            backgroundColor: isSelected ? '#E85D3A' : 'transparent',
                            '&:hover': { backgroundColor: isSelected ? '#D44E2C' : '#F5F2ED' },
                            transition: 'background-color 0.1s',
                        }}>
                            <Typography sx={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '0.75rem',
                                fontWeight: isToday ? 700 : 400,
                                color: isSelected ? '#FAF7F2'
                                    : isToday ? '#E85D3A'
                                    : inMonth ? '#1A1A1A' : '#C8C4BE',
                                lineHeight: 1,
                            }}>
                                {day.date()}
                            </Typography>
                            {/* Event dot */}
                            {hasEvent && (
                                <Box sx={{
                                    width: 3, height: 3,
                                    borderRadius: '50%',
                                    backgroundColor: isSelected ? '#FAF7F2'
                                        : inMonth ? '#E85D3A' : '#D0CCC8',
                                    mt: '2px',
                                }} />
                            )}
                        </Box>
                    );
                })}
            </Box>

            {/* Today shortcut */}
            <Box sx={{ borderTop: '1px solid #E0DDD8', px: 2, py: 1.25, display: 'flex', justifyContent: 'flex-end' }}>
                <Typography
                    onClick={() => { onSelectDate(today); setViewMonth(today.startOf('month')); }}
                    sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.72rem', fontWeight: 600,
                        color: selectedDate.isSame(today, 'day') ? '#B0B0B0' : '#E85D3A',
                        cursor: selectedDate.isSame(today, 'day') ? 'default' : 'pointer',
                        '&:hover': { textDecoration: selectedDate.isSame(today, 'day') ? 'none' : 'underline' },
                    }}
                >
                    Aujourd'hui
                </Typography>
            </Box>
        </Box>
    );
}

// ── Event block ────────────────────────────────────────────────────────────────
function EventBlock({ ticket, navigate }) {
    const top    = (ticket.startHour * 60 + ticket.startMinute - START_HOUR * 60) / 60 * HOUR_HEIGHT;
    const bottom = (ticket.endHour   * 60 + ticket.endMinute   - START_HOUR * 60) / 60 * HOUR_HEIGHT;
    const height = Math.max(bottom - top, HOUR_HEIGHT * 0.45);

    return (
        <Tooltip title={`${ticket.eventNom} · ${fmtTime(ticket.startHour, ticket.startMinute)}–${fmtTime(ticket.endHour, ticket.endMinute)}`} placement="top">
            <Box onClick={e => { e.stopPropagation(); navigate(ticket.eventId ? `/Evenement?id=${ticket.eventId}` : `/Evenement?@${encodeURIComponent(ticket.eventNom)}`); }}
                sx={{
                    position: 'absolute',
                    top: `${top}px`, left: '2px', right: '2px',
                    height: `${height - 1}px`,
                    backgroundColor: '#E85D3A',
                    borderLeft: '3px solid #B33A1F',
                    px: '5px', py: '2px',
                    cursor: 'pointer', overflow: 'hidden', zIndex: 1,
                    '&:hover': { backgroundColor: '#D44E2C' },
                    transition: 'background-color 0.12s',
                }}>
                <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.62rem', fontWeight: 700,
                    color: '#FAF7F2', lineHeight: 1.2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                    {ticket.eventNom}
                </Typography>
                {height > HOUR_HEIGHT * 0.7 && (
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'rgba(250,247,242,0.8)', lineHeight: 1.2 }}>
                        {fmtTime(ticket.startHour, ticket.startMinute)}
                    </Typography>
                )}
            </Box>
        </Tooltip>
    );
}

// ── Week schedule component ────────────────────────────────────────────────────
function WeekSchedule({ selectedDate, onSelectDate, tickets }) {
    const navigate    = useNavigate();
    const scheduleRef = useRef(null);
    const today       = dayjs();

    const monday   = useMemo(() => isoMonday(selectedDate), [selectedDate]);
    const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => monday.add(i, 'day')), [monday]);

    const isCurrentWeek = today.isSameOrAfter(monday, 'day') &&
        today.isSameOrBefore(monday.add(6, 'day'), 'day');

    const nowTop = isCurrentWeek
        ? (today.hour() * 60 + today.minute() - START_HOUR * 60) / 60 * HOUR_HEIGHT
        : null;

    useEffect(() => {
        if (!scheduleRef.current) return;
        const targetHour = isCurrentWeek ? Math.max(START_HOUR, today.hour() - 1) : 8;
        scheduleRef.current.scrollTop = (targetHour - START_HOUR) * HOUR_HEIGHT;
    }, [monday]);

    const ticketsByDate = useMemo(() => {
        const map = {};
        tickets.forEach(t => { const key = t.dateISO || t.date; if (!map[key]) map[key] = []; map[key].push(t); });
        return map;
    }, [tickets]);

    const TIME_W = 50;
    const iconBtnSx = { color: '#FAF7F2', borderRadius: 0, '&:hover': { backgroundColor: '#E85D3A' } };

    return (
        <Box sx={{
            flex: 1, minWidth: 0,
            border: '2px solid #1A1A1A',
            boxShadow: '6px 6px 0px #E85D3A',
            backgroundColor: '#FAF7F2',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 320px)',
        }}>
            {/* Week nav */}
            <Box sx={{ backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', px: 1, py: 0.75 }}>
                <IconButton size="small" sx={iconBtnSx} onClick={() => onSelectDate(selectedDate.subtract(1, 'week'))}>
                    <ChevronLeftIcon fontSize="small" />
                </IconButton>
                <Typography sx={{
                    flex: 1, textAlign: 'center',
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '0.88rem', fontWeight: 700, color: '#FAF7F2',
                    textTransform: 'capitalize',
                }}>
                    {monday.format('D MMM')} – {monday.add(6, 'day').format('D MMM YYYY')}
                </Typography>
                <IconButton size="small" sx={iconBtnSx} onClick={() => onSelectDate(selectedDate.add(1, 'week'))}>
                    <ChevronRightIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Day column headers */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: `${TIME_W}px repeat(7, 1fr)`,
                borderBottom: '2px solid #E0DDD8',
                flexShrink: 0,
            }}>
                <Box />
                {weekDays.map(day => {
                    const isToday    = day.isSame(today, 'day');
                    const isSelected = day.isSame(selectedDate, 'day');
                    return (
                        <Box key={day.toString()} onClick={() => onSelectDate(day)} sx={{
                            textAlign: 'center', py: '7px',
                            cursor: 'pointer',
                            borderLeft: '1px solid #E0DDD8',
                            backgroundColor: isSelected ? 'rgba(232,93,58,0.06)' : 'transparent',
                            '&:hover': { backgroundColor: 'rgba(232,93,58,0.06)' },
                            transition: 'background-color 0.1s',
                        }}>
                            <Typography sx={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '0.6rem', fontWeight: 700,
                                color: '#9A9A9A', textTransform: 'uppercase',
                                letterSpacing: '0.06em', lineHeight: 1, mb: '3px',
                            }}>
                                {WEEK_LABELS[day.isoWeekday() - 1]}
                            </Typography>
                            <Box sx={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 24, height: 24,
                                borderRadius: isToday ? '50%' : 0,
                                backgroundColor: isToday ? '#E85D3A' : 'transparent',
                            }}>
                                <Typography sx={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: '0.78rem',
                                    fontWeight: isToday || isSelected ? 700 : 400,
                                    color: isToday ? '#FAF7F2' : isSelected ? '#E85D3A' : '#1A1A1A',
                                    lineHeight: 1,
                                }}>
                                    {day.date()}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* Scrollable grid */}
            <Box ref={scheduleRef} sx={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, minHeight: 0 }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: `${TIME_W}px repeat(7, 1fr)`,
                    height: `${HOURS.length * HOUR_HEIGHT}px`,
                    position: 'relative',
                }}>
                    {/* Time labels column */}
                    <Box sx={{ position: 'relative', borderRight: '1px solid #E0DDD8' }}>
                        {HOURS.map(h => (
                            <Box key={h} sx={{
                                position: 'absolute',
                                top: `${(h - START_HOUR) * HOUR_HEIGHT - 7}px`,
                                right: 6, left: 0,
                                display: 'flex', justifyContent: 'flex-end',
                            }}>
                                <Typography sx={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: '0.6rem', color: '#B0B0B0',
                                    lineHeight: 1, userSelect: 'none',
                                }}>
                                    {h === 12 ? '12 PM' : h < 12 ? `${h} AM` : `${h - 12} PM`}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Day columns */}
                    {weekDays.map(day => {
                        const dateStr    = day.format('YYYY-MM-DD');
                        const dayTickets = (ticketsByDate[dateStr] || []).filter(t => t.startHour >= START_HOUR);
                        const isSelected = day.isSame(selectedDate, 'day');
                        const isToday    = day.isSame(today, 'day');

                        return (
                            <Box key={day.toString()} sx={{
                                borderLeft: '1px solid #E0DDD8',
                                position: 'relative',
                                backgroundColor: isSelected
                                    ? 'rgba(232,93,58,0.03)'
                                    : isToday ? 'rgba(232,93,58,0.015)' : 'transparent',
                            }}>
                                {/* Hour and half-hour lines */}
                                {HOURS.map(h => (
                                    <React.Fragment key={h}>
                                        <Box sx={{
                                            position: 'absolute',
                                            top: `${(h - START_HOUR) * HOUR_HEIGHT}px`,
                                            left: 0, right: 0,
                                            borderTop: '1px solid #F0EDE8',
                                        }} />
                                        <Box sx={{
                                            position: 'absolute',
                                            top: `${(h - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2}px`,
                                            left: 0, right: 0,
                                            borderTop: '1px dashed #F8F5F0',
                                        }} />
                                    </React.Fragment>
                                ))}

                                {/* Events */}
                                {dayTickets.map(t => (
                                    <EventBlock key={t.eventNom} ticket={t} navigate={navigate} />
                                ))}

                                {/* Current time line */}
                                {nowTop !== null && isToday && (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: `${nowTop}px`, left: 0, right: 0,
                                        height: 2, backgroundColor: '#E85D3A', zIndex: 2,
                                        '&::before': {
                                            content: '""', position: 'absolute',
                                            left: -4, top: -4,
                                            width: 10, height: 10,
                                            borderRadius: '50%', backgroundColor: '#E85D3A',
                                        },
                                    }} />
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────
const Calendrier = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const paramDate   = searchParams.get('date');
    const initialDate = paramDate && dayjs(paramDate).isValid() ? dayjs(paramDate) : dayjs();
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        authGet('/auth/userTickets')
            .then(r => r.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setTickets(data); })
            .catch(err => console.error('[Calendrier] tickets:', err));
    }, []);

    useEffect(() => {
        setSearchParams({ date: selectedDate.format('YYYY-MM-DD') }, { replace: true });
    }, [selectedDate]);

    return (
        <div className="content-container" style={{ maxWidth: 1300 }}>
            <Typography className="page-title" component="h1">
                Calendrier
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <MonthGrid
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    tickets={tickets}
                />
                <WeekSchedule
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    tickets={tickets}
                />
            </Box>
        </div>
    );
};

export default Calendrier;
