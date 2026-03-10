import * as React from 'react';
import { Grid2, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function ReinitializeComp() {

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
        <InputLabel htmlFor="verification">Code de vérification</InputLabel>
        <OutlinedInput id="verification" label="Code de vérification" />
      </FormControl>

      <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Nouveau mot de passe</InputLabel>
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
          label="Nouveau mot de passe"
        />
      </FormControl>

      <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-confirm-password">Confirmer le mot de passe</InputLabel>
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
          label="Confirmer le mot de passe"
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

          if (document.getElementById('outlined-adornment-password').value !==
              document.getElementById('outlined-adornment-confirm-password').value) {
            document.getElementById('hidden').style.display = 'block';
            return;
          }

          const reinitialiser = {
            courriel: localStorage.getItem('courriel'),
            verificationfe: document.getElementById('verification').value,
            password: document.getElementById('outlined-adornment-password').value,
          };

          const isAtLeastOneNull = Object.values(reinitialiser).some(i => i === '');
          if (isAtLeastOneNull) {
            document.getElementById('hidden2').style.display = 'block';
            return;
          }

          try {
            const response = await fetch('http://localhost:5000/auth/reinitialize', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(reinitialiser),
            });

            const data = await response.json();

            if (response.ok) {
              document.location.href = 'Connexion';
            } else {
              console.error('Error:', data);
            }
          } catch (error) {
            console.error('There was an error reinitializing the password:', error);
          }
        }}
      >
        Réinitialiser
      </Button>
    </Grid2>
  );
}
