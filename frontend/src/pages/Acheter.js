import React, { useState } from 'react';
import './styles.css';
import {
    IconButton, Typography, Box, Button, Alert, Divider, TextField,
} from '@mui/material';
import ArrowBackIosIcon       from '@mui/icons-material/ArrowBackIos';
import LockIcon               from '@mui/icons-material/Lock';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { authPost } from '../utils/api';
import { LocationAutocomplete } from '../components/LocationAutocomplete';

function Acheter() {
    const [fields, setFields] = useState({
        nom: '', numerocarte: '',
        expiration: '', codesecurite: '', addresse: '',
    });
    const [loading,      setLoading]      = useState(false);
    const [error,        setError]        = useState(null);
    const [confirmation, setConfirmation] = useState(null); // holds purchased achats on success

    const set = (key) => (e) => setFields(f => ({ ...f, [key]: e.target.value }));

    const validate = () => {
        const { nom, numerocarte, expiration, codesecurite, addresse } = fields;
        if (!nom || !numerocarte || !expiration || !codesecurite || !addresse)
            return 'Veuillez remplir tous les champs.';
        if (numerocarte.replace(/\s/g, '').length < 13)
            return 'Numéro de carte invalide.';
        if (!/^\d{2}\/\d{2}$/.test(expiration))
            return "Format d'expiration invalide — utilisez MM/AA.";
        if (codesecurite.length < 3)
            return 'Code de sécurité invalide.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);
        try {
            const res  = await authPost('/auth/purchase', {});
            const data = await res.json();

            if (res.ok) {
                // Clear cart from localStorage
                localStorage.setItem('cart', JSON.stringify([]));
                window.dispatchEvent(new Event('storage'));
                // Use the real confirmation code from the first purchased ticket
                const code = data.achats?.[0]?.confirmationCode
                    || data.achats?.[0]?.eventId?.slice(0, 12).toUpperCase()
                    || 'CONFIRMED';
                setConfirmation({
                    code,
                    achats: data.achats || [],
                });
            } else {
                setError(data.message || "Erreur lors de l'achat.");
            }
        } catch {
            setError('Erreur de connexion au serveur.');
        } finally {
            setLoading(false);
        }
    };

    // ── Confirmation screen ─────────────────────────────────────────────────────
    if (confirmation) {
        const total = confirmation.achats.reduce((s, a) => s + (a.prix || 0), 0);
        return (
            <div className="auth-inner">
                <div className="auth-card" style={{ maxWidth: 560 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 56, color: '#4CAF50', mb: 1 }} />
                        <Typography sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.6rem', fontWeight: 700, color: '#1A1A1A',
                        }}>
                            Achat confirmé !
                        </Typography>
                        <Typography sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.88rem', color: '#6B6B6B', mt: 1,
                        }}>
                            Un reçu a été envoyé à votre adresse courriel.
                        </Typography>
                    </Box>

                    {/* Confirmation code */}
                    <Box sx={{
                        border: '2px solid #1A1A1A',
                        backgroundColor: '#1A1A1A',
                        p: 2, mb: 3, textAlign: 'center',
                    }}>
                        <Typography sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.7rem', color: '#9A9A9A',
                            textTransform: 'uppercase', letterSpacing: '0.12em', mb: 0.5,
                        }}>
                            Code de confirmation
                        </Typography>
                        <Typography sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '1.4rem', fontWeight: 700,
                            color: '#E85D3A', letterSpacing: '0.12em',
                        }}>
                            {confirmation.code}
                        </Typography>
                    </Box>

                    {/* Purchased tickets */}
                    <Box sx={{ mb: 3 }}>
                        {confirmation.achats.map((a, i) => (
                            <Box key={i} sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                py: 1.5, borderBottom: '1px solid #E0DDD8',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <ConfirmationNumberIcon sx={{ fontSize: 16, color: '#E85D3A' }} />
                                    <Box>
                                        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '0.95rem', color: '#1A1A1A' }}>
                                            {a.eventNom}
                                        </Typography>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6B6B6B' }}>
                                            {a.date}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: '#1A1A1A' }}>
                                    {a.prix === 0 ? 'Gratuit' : `$${Number(a.prix).toFixed(2)}`}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Divider sx={{ borderColor: '#E0DDD8', mb: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
                            Total
                        </Typography>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: '#1A1A1A' }}>
                            {total === 0 ? 'Gratuit' : `$${total.toFixed(2)}`}
                        </Typography>
                    </Box>

                    <Button variant="contained" fullWidth size="large"
                        onClick={() => { document.location.href = '/Dashboard'; }}>
                        Retour au tableau de bord
                    </Button>
                </div>
            </div>
        );
    }

    // ── Payment form ────────────────────────────────────────────────────────────
    const inputSx = { mb: 2, width: '100%' };
    const inputProps = { autoComplete: 'off' };

    return (
        <div className="auth-inner">
            <IconButton href="/Panier" className="auth-back-btn" size="large">
                <ArrowBackIosIcon />
            </IconButton>

            <div className="auth-card" style={{ maxWidth: 560 }}>
                <div className="auth-logo">
                    Proché<span style={{ color: '#6B6B6B' }}>vénements</span>
                </div>
                <h2 className="auth-title">Paiement</h2>
                <p className="auth-subtitle">
                    Remplissez vos informations de paiement en toute sécurité.
                </p>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} autoComplete="off">
                    <TextField label="Nom complet" value={fields.nom}
                        onChange={set('nom')} fullWidth sx={inputSx}
                        inputProps={inputProps} />

                    <TextField label="Numéro de carte de crédit"
                        value={fields.numerocarte}
                        onChange={e => {
                            // Format with spaces every 4 digits
                            const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                            const fmt = raw.match(/.{1,4}/g)?.join(' ') || raw;
                            setFields(f => ({ ...f, numerocarte: fmt }));
                        }}
                        fullWidth sx={inputSx}
                        inputProps={{ ...inputProps, inputMode: 'numeric', maxLength: 19 }} />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Expiration (MM/AA)"
                            value={fields.expiration}
                            onChange={e => {
                                let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                                if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                                setFields(f => ({ ...f, expiration: v }));
                            }}
                            sx={{ ...inputSx, flex: 1 }}
                            inputProps={{ ...inputProps, inputMode: 'numeric', maxLength: 5 }} />

                        <TextField label="CVV" type="password"
                            value={fields.codesecurite}
                            onChange={e => setFields(f => ({ ...f, codesecurite: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                            sx={{ ...inputSx, flex: 1 }}
                            inputProps={{ ...inputProps, inputMode: 'numeric', maxLength: 4 }} />
                    </Box>

                    <LocationAutocomplete
                        label="Adresse de facturation"
                        value={fields.addresse}
                        onChange={val => setFields(f => ({ ...f, addresse: val }))}
                        onSelect={({ address }) => setFields(f => ({ ...f, addresse: address }))}
                        sx={inputSx}
                    />

                    <Box sx={{ mt: 1 }}>
                        <Button type="submit" variant="contained" fullWidth
                            size="large" startIcon={<LockIcon />}
                            disabled={loading}>
                            {loading ? 'Traitement...' : 'Confirmer le paiement'}
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, justifyContent: 'center' }}>
                    <LockIcon sx={{ fontSize: 14, color: '#9A9A9A' }} />
                    <Typography sx={{
                        fontSize: '0.78rem', color: '#9A9A9A',
                        fontFamily: "'DM Sans', sans-serif",
                    }}>
                        Paiement sécurisé — Un reçu sera envoyé par courriel
                    </Typography>
                </Box>
            </div>
        </div>
    );
}

export default Acheter;
