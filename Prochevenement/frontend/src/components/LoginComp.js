import * as React from 'react';
import { Paper, Grid2, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useTheme } from '@mui/material/styles';

// preview-start
const providers = [{ id: 'credentials', name: 'Email and Password' }];
// preview-end

const signIn = async (provider, formData) => {
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      alert(
        `Signing in with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}`,
      );
      resolve();
    }, 300);
  });
  return promise;
};

export default function LoginComp() {
  
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
      event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const theme = useTheme();
  return (
    <Paper sx={{ textAlign: "center" }}>

      <Grid2
        container
        spacing={0}
        direction="column"
        sx={{backgroundColor: "transparent"}}
      >

        <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

        <InputLabel htmlFor="email">Email</InputLabel>
        <OutlinedInput
          id="email"
          label="Email"
        />

        </FormControl>

        <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />

        </FormControl>

          <Button 
            label="Login" 
            sx={{ 
              m: 1,
              alignSelf: 'center',
              width:"25%" 
            }}
            variant="contained"
            onClick={() => {
              alert('clicked');
            }}>
              Login
            </Button>

      </Grid2>

    </Paper>
  );
}