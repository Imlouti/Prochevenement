import * as React from 'react';
import { BASE_URL } from '../utils/api';
import { Grid2, Button, OutlinedInput, InputLabel, FormControl } from '@mui/material';

export default function ForgotComp() {
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

      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{ mt: 1 }}
        onClick={async () => {
          document.getElementById('hidden').style.display = 'none';

          const courriel = {
            courriel: document.getElementById('email').value,
          };

          const isAtLeastOneNull = Object.values(courriel).some(i => i === '');
          if (isAtLeastOneNull) {
            document.getElementById('hidden').style.display = 'block';
            return;
          }

          try {
            const response = await fetch(`${BASE_URL}/auth/forgot`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(courriel),
            });

            const data = await response.json();
            localStorage.setItem('courriel', document.getElementById('email').value);

            if (response.ok) {
              document.location.href = 'Reinitialiser';
            } else {
              console.error('Error:', data);
            }
          } catch (error) {
            console.error('There was an error:', error);
          }
        }}
      >
        Envoyer
      </Button>
    </Grid2>
  );
}
