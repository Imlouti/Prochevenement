import * as React from 'react';
import { Grid2, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function LoginComp() {

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => { event.preventDefault(); };
  const handleMouseUpPassword = (event) => { event.preventDefault(); };

  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      sx={{ width: '100%' }}
    >
      <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
        <InputLabel htmlFor="email">Courriel</InputLabel>
        <OutlinedInput id="email" label="Courriel" />
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
        />
      </FormControl>

      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{ mt: 1 }}
        onClick={async () => {
          document.getElementById('hidden').style.display = 'none';
          document.getElementById('hidden2').style.display = 'none';

          const user = {
            courriel: document.getElementById('email').value,
            motpasse: document.getElementById('outlined-adornment-password').value,
          };

          const isAtLeastOneNull = Object.values(user).some(i => i === '');
          if (isAtLeastOneNull) {
            document.getElementById('hidden2').style.display = 'block';
            return;
          }

          try {
            const response = await fetch('http://localhost:5000/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(user),
            });

            const data = await response.json();

            if (response.ok) {
              localStorage.setItem('user', JSON.stringify({
                nom: data.nom,
                role: data.role,
              }));
              // Vendors go to /Vendeur; regular users go to the dashboard
              const route = data.role === 'Vendeur' ? data.route : '/Dashboard';
              document.location.href = route;
            } else {
              document.getElementById('hidden').style.display = 'block';
            }
          } catch (error) {
            console.error('There was an error logging in:', error);
          }
        }}
      >
        Connexion
      </Button>
    </Grid2>
  );
}
