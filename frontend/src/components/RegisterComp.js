import React from 'react';
import { BASE_URL } from '../utils/api';
import { FormControlLabel, Checkbox, Grid2, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function RegisterComp() {

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => { e.preventDefault(); };
  const handleMouseUpPassword = (e) => { e.preventDefault(); };

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownConfirmPassword = (e) => { e.preventDefault(); };
  const handleMouseUpConfirmPassword = (e) => { e.preventDefault(); };

  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      sx={{ width: '100%' }}
    >
      <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
        <InputLabel htmlFor="nom">Nom</InputLabel>
        <OutlinedInput id="nom" label="Nom" />
      </FormControl>

      <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
        <InputLabel htmlFor="email">Courriel</InputLabel>
        <OutlinedInput id="email" label="Courriel" />
      </FormControl>

      <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
        <InputLabel htmlFor="postal">Code postal</InputLabel>
        <OutlinedInput id="postal" label="Code postal" />
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

      <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-confirm-password">Mot de passe encore</InputLabel>
        <OutlinedInput
          id="outlined-adornment-confirm-password"
          type={showConfirmPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={showConfirmPassword ? 'hide the password' : 'display the password'}
                onClick={handleClickShowConfirmPassword}
                onMouseDown={handleMouseDownConfirmPassword}
                onMouseUp={handleMouseUpConfirmPassword}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Mot de passe encore"
        />
      </FormControl>

      <FormControl sx={{ mb: 2, width: '100%' }}>
        <FormControlLabel
          control={<Checkbox id="slider" />}
          label="Vendeur"
          sx={{ fontFamily: "'DM Sans', sans-serif" }}
        />
      </FormControl>

      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{ mt: 1 }}
        onClick={async () => {
          document.getElementById('hidden').style.display = 'none';

          if (document.getElementById('outlined-adornment-password').value !==
              document.getElementById('outlined-adornment-confirm-password').value) {
            document.getElementById('hidden').style.display = 'block';
            return;
          }

          const vendeur = document.getElementById('slider').checked ? 1 : 0;
          const user = {
            nom: document.getElementById('nom').value,
            courriel: document.getElementById('email').value,
            postal: document.getElementById('postal').value,
            motpasse: document.getElementById('outlined-adornment-password').value,
            vendeur,
          };

          const isAtLeastOneNull = Object.values(user).some(i => i === '');
          if (isAtLeastOneNull) {
            document.getElementById('hidden2').style.display = 'block';
            return;
          }

          try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(user),
            });

            const data = await response.json();

            if (response.ok) {
              // If the guest had events in their cart, send them back to the
              // shopping page so their cart is still there
              try {
                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                document.location.href = cart.length > 0 ? '/Magasiner' : '/Connexion';
              } catch {
                document.location.href = '/Connexion';
              }
            } else {
              const errEl = document.getElementById('hidden');
              if (errEl) {
                errEl.textContent = data.message || 'Erreur lors de la création du compte.';
                errEl.style.display = 'block';
              }
            }
          } catch (error) {
            const errEl = document.getElementById('hidden');
            if (errEl) {
              errEl.textContent = 'Erreur de connexion au serveur.';
              errEl.style.display = 'block';
            }
          }
        }}
      >
        Créer le compte
      </Button>
    </Grid2>
  );
}
