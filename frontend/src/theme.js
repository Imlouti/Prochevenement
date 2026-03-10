import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E85D3A',
      contrastText: '#FAF7F2',
    },
    secondary: {
      main: '#C9A84C',
    },
    background: {
      default: '#FAF7F2',
      paper: '#FAF7F2',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#6B6B6B',
    },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h1: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h2: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h3: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h4: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    button: { fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontSize: '1rem',
          padding: '10px 28px',
          transition: 'all 0.15s ease',
        },
        contained: {
          backgroundColor: '#E85D3A',
          color: '#FAF7F2',
          boxShadow: '4px 4px 0px #1A1A1A',
          '&:hover': {
            backgroundColor: '#D44E2C',
            boxShadow: '2px 2px 0px #1A1A1A',
            transform: 'translate(2px, 2px)',
          },
        },
        outlined: {
          borderColor: '#1A1A1A',
          borderWidth: '2px',
          color: '#1A1A1A',
          boxShadow: '4px 4px 0px #1A1A1A',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: '#1A1A1A',
            color: '#FAF7F2',
            boxShadow: '2px 2px 0px #1A1A1A',
            transform: 'translate(2px, 2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid #1A1A1A',
          boxShadow: '6px 6px 0px #1A1A1A',
          backgroundColor: '#FAF7F2',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1A1A1A',
            borderWidth: '2px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E85D3A',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E85D3A',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "'DM Sans', sans-serif",
          '&.Mui-focused': { color: '#E85D3A' },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#1A1A1A',
            color: '#FAF7F2',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#F0EDE8 !important' },
          '&:nth-of-type(even)': { backgroundColor: '#F5F2ED' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "'DM Sans', sans-serif",
          borderColor: '#E0DDD8',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          transition: 'all 0.15s ease',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 0,
          backgroundColor: '#1A1A1A',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.8rem',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#E85D3A',
          fontWeight: 600,
          textDecorationColor: '#E85D3A',
          '&:hover': { color: '#1A1A1A' },
        },
      },
    },
  },
});

export default theme;
