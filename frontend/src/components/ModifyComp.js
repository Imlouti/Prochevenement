import React, { useState, useEffect } from 'react';
import { Grid2, Button, TextField, FormControl, CircularProgress } from '@mui/material';
import { authPost } from '../utils/api';

export default function ModifyComp() {
    const [nom,     setNom]     = useState('');
    const [postal,  setPostal]  = useState('');
    const [loading, setLoading] = useState(true);

    // FIX: was top-level await — now a proper useEffect
    useEffect(() => {
        const load = async () => {
            try {
                const res  = await authPost('/auth/search', {});
                const data = await res.json();
                if (res.ok) {
                    setNom(data.nom     ?? '');
                    setPostal(data.postal ?? '');
                } else {
                    console.error('[ModifyComp] search:', data.message);
                }
            } catch (err) {
                console.error('[ModifyComp] load error:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return <CircularProgress size={28} sx={{ color: '#E85D3A', display: 'block', mx: 'auto', my: 4 }} />;
    }

    return (
        <Grid2 container spacing={0} direction="column" sx={{ width: '100%' }}>
            <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
                <TextField
                    id="nom"
                    label="Nom"
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    variant="outlined"
                    fullWidth
                />
            </FormControl>

            <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
                <TextField
                    id="postal"
                    label="Code postal"
                    value={postal}
                    onChange={e => setPostal(e.target.value)}
                    variant="outlined"
                    fullWidth
                />
            </FormControl>

            <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 1, mb: 2 }}
                onClick={async () => {
                    document.getElementById('hidden').style.display = 'none';

                    if (!nom.trim() || !postal.trim()) {
                        document.getElementById('hidden').style.display = 'block';
                        return;
                    }

                    try {
                        const res  = await authPost('/auth/modify', { nom, postal });
                        const data = await res.json();
                        if (res.ok) {
                            document.location.href = '/Parametres';
                        } else {
                            console.error('[ModifyComp] modify:', data.message);
                        }
                    } catch (err) {
                        console.error('[ModifyComp] modify error:', err);
                    }
                }}
            >
                Modifier
            </Button>

            <Button
                variant="outlined"
                fullWidth
                size="large"
                sx={{
                    borderColor: '#C0392B', color: '#C0392B',
                    '&:hover': { backgroundColor: '#C0392B', color: '#FAF7F2', borderColor: '#C0392B', boxShadow: 'none' },
                }}
                onClick={async () => {
                    try {
                        const res = await authPost('/auth/delete', {});
                        if (res.ok) {
                            localStorage.removeItem('user');
                            document.location.href = '/';
                        } else {
                            const data = await res.json();
                            console.error('[ModifyComp] delete:', data.message);
                        }
                    } catch (err) {
                        console.error('[ModifyComp] delete error:', err);
                    }
                }}
            >
                Supprimer le compte
            </Button>
        </Grid2>
    );
}
