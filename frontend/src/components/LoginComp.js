import * as React from 'react';
import { Grid2, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { publicPost } from '../utils/api';

export default function LoginComp() {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword(s => !s);
    const handleMouseDownPassword = e => e.preventDefault();
    const handleMouseUpPassword   = e => e.preventDefault();

    const handleSubmit = async () => {
        document.getElementById('hidden').style.display  = 'none';
        document.getElementById('hidden2').style.display = 'none';

        const user = {
            courriel: document.getElementById('email').value,
            motpasse: document.getElementById('outlined-adornment-password').value,
        };

        if (Object.values(user).some(v => v === '')) {
            document.getElementById('hidden2').style.display = 'block';
            return;
        }

        try {
            const response = await publicPost('/auth/login', user);
            const data     = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify({
                    nom:    data.nom,
                    role:   data.role,
                    postal: data.postal || '',
                    token:  data.token,
                }));
                const route = data.role === 'Vendeur' ? data.route : '/Dashboard';
                document.location.href = route;
            } else {
                document.getElementById('hidden').style.display = 'block';
            }
        } catch (err) {
            console.error('[login] Erreur:', err);
        }
    };
    const handleKeyDown = e => { if (e.key === 'Enter') handleSubmit(); };

    return (
        <Grid2 container spacing={0} direction="column" sx={{ width: '100%' }}>
            <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
                <InputLabel htmlFor="email">Courriel</InputLabel>
                <OutlinedInput id="email" label="Courriel" onKeyDown={handleKeyDown} />
            </FormControl>

            <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Mot de passe</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={showPassword ? 'hide the password' : 'display the password'}
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Mot de passe"
                    onKeyDown={handleKeyDown}
                />
            </FormControl>

            <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 1 }}
                onClick={handleSubmit}
            >
                Connexion
            </Button>
        </Grid2>
    );
}
