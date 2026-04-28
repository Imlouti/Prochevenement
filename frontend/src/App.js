import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { isLoggedIn, getUserRole } from './utils/api';
import { Navigator } from './components/Navigator';
import { PublicHeader } from './components/PublicHeader';
import { Footer } from './components/Footer';
import { EventModal } from './components/EventModal';

import Acceuil           from './pages/Acceuil';
import Connexion         from './pages/Connexion';
import Creation          from './pages/Creation';
import Oublier           from './pages/Oublier';
import Reinitialiser     from './pages/Reinitialiser';
import Magasiner         from './pages/Magasiner';
import Dashboard         from './pages/Dashboard';
import Modifier          from './pages/Modifier';
import Evenement         from './pages/Evenement';
import Parametres        from './pages/Parametres';
import Calendrier        from './pages/Calendrier';
import Annuler           from './pages/Annuler';
import Panier            from './pages/Panier';
import Acheter           from './pages/Acheter';
import Propos            from './pages/Propos';
import Vendeur           from './pages/Vendeur';
import ModifierEvenement from './pages/ModifierEvenement';
import AjouterEvenement  from './pages/AjouterEvenement';

// ── Layout ─────────────────────────────────────────────────────────────────────

function Layout({ children }) {
    const loggedIn = isLoggedIn();
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {loggedIn ? <Navigator /> : <PublicHeader />}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>
            <Footer />
        </div>
    );
}

// ── Protected route ─────────────────────────────────────────────────────────────

function ProtectedRoute({ children, vendorOnly = false, userOnly = false }) {
    if (!isLoggedIn()) {
        return <Navigate to="/Connexion" replace />;
    }
    if (vendorOnly && getUserRole() !== 'Vendeur') {
        return <Navigate to="/Dashboard" replace />;
    }
    if (userOnly && getUserRole() === 'Vendeur') {
        return <Navigate to="/Vendeur" replace />;
    }
    return children;
}

// ── Cross-tab logout watcher ────────────────────────────────────────────────────

const PUBLIC_PATHS = ['/', '/Connexion', '/Creation', '/Oublier', '/Reinitialiser'];

function SessionWatcher() {
    const location = useLocation();
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'user' && e.newValue === null) {
                if (!PUBLIC_PATHS.includes(location.pathname)) {
                    document.location.href = '/Connexion';
                }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [location.pathname]);
    return null;
}

// ── Route definitions (shared between main and background renders) ──────────────

function AppRoutes({ location }) {
    return (
        <Routes location={location}>
            {/* Standalone — manage their own layout */}
            <Route path="/"              element={<Acceuil />} />
            <Route path="/Connexion"     element={<Connexion />} />
            <Route path="/Creation"      element={<Creation />} />
            <Route path="/Oublier"       element={<Oublier />} />
            <Route path="/Reinitialiser" element={<Reinitialiser />} />

            {/* Public — shared layout */}
            <Route path="/Magasiner" element={<Layout><Magasiner /></Layout>} />
            <Route path="/Evenement" element={<Layout><Evenement /></Layout>} />
            <Route path="/Propos"    element={<Layout><Propos /></Layout>} />

            {/* Protected — shared layout */}
            <Route path="/Dashboard"  element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/Parametres" element={<ProtectedRoute><Layout><Parametres /></Layout></ProtectedRoute>} />
            <Route path="/Calendrier" element={<ProtectedRoute userOnly><Layout><Calendrier /></Layout></ProtectedRoute>} />
            <Route path="/Modifier"   element={<ProtectedRoute userOnly><Layout><Modifier /></Layout></ProtectedRoute>} />
            <Route path="/Annuler"    element={<ProtectedRoute userOnly><Layout><Annuler /></Layout></ProtectedRoute>} />
            <Route path="/Panier"     element={<ProtectedRoute userOnly><Layout><Panier /></Layout></ProtectedRoute>} />
            <Route path="/Acheter"    element={<ProtectedRoute userOnly><Layout><Acheter /></Layout></ProtectedRoute>} />

            {/* Vendor-only — shared layout */}
            <Route path="/Vendeur"           element={<ProtectedRoute vendorOnly><Layout><Vendeur /></Layout></ProtectedRoute>} />
            <Route path="/AjouterEvenement"  element={<ProtectedRoute vendorOnly><Layout><AjouterEvenement /></Layout></ProtectedRoute>} />
            <Route path="/ModifierEvenement" element={<ProtectedRoute vendorOnly><Layout><ModifierEvenement /></Layout></ProtectedRoute>} />
        </Routes>
    );
}

// ── App ─────────────────────────────────────────────────────────────────────────

function App() {
    const location = useLocation();
    // background is set when navigating to /Evenement from the shopping table
    const background = location.state?.background;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SessionWatcher />

            {/*
             * When background exists, render the BACKGROUND page (Magasiner) frozen
             * behind the modal instead of the Evenement page directly.
             * When there's no background, render normally.
             */}
            <AppRoutes location={background || location} />

            {/* Modal overlay — only rendered when coming from Magasiner */}
            {background && (
                <Routes>
                    <Route path="/Evenement" element={<EventModal />} />
                </Routes>
            )}
        </ThemeProvider>
    );
}

// App must be wrapped in a function so useLocation works — BrowserRouter lives in index.js
export default App;
