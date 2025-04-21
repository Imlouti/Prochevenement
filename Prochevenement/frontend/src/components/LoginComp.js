import * as React from 'react';
import { Paper, Grid2, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useTheme } from '@mui/material/styles';


export default function LoginComp() {
  
  //ces fonctions transforment le mot de passe de texte lisable en **** et vise vera
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
      event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const theme = useTheme();
  //le formulaire de connexion a le courriel et le mot de passe
  return (
    <Paper sx={{ textAlign: "center" }}>

      <Grid2
        container
        spacing={0}
        direction="column"
        sx={{backgroundColor: "transparent"}}
      >

        <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

        <InputLabel htmlFor="email">Courriel</InputLabel>
        <OutlinedInput
          id="email"
          label="Email"
        />

        </FormControl>

        <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

          <InputLabel htmlFor="outlined-adornment-password">Mot de passe</InputLabel>
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
            onClick={async() => {
              //quand que le boutton est cliquer pour ce connecter les messages d'erreurs s'efface
              document.getElementById("hidden").style.display = "none";
              document.getElementById("hidden2").style.display = "none";
              
              const user = {
                courriel: document.getElementById("email").value,
                motpasse: document.getElementById("outlined-adornment-password").value
            };

            const isAtLeastOneNull = Object.values(user).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden2").style.display = "block"; // Afficher erreur si un ou plusieurs champs sont vides
                return;
            }

            
             // Envoi des données de connexion au backend (voire app.js route de connexion pour plus de detail) pour vérifier les identifiants
             try {
                const response = await fetch('http://localhost:4001/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                });

                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    // Si la connexion est réussie, 
                    // Enregistrez les informations de l'utilisateur dans le localStorage
                    localStorage.setItem('user', JSON.stringify({
                        nom: data.nom, // renvoyer le nom depuis le backend
                        role: data.role, // Renvoie le rôle de l'utilisateur (vendeur ou utilisateur)
                        vendeurId: data.vendeurId  // Store vendor's ID
                    }));

                    // Rediriger vers la page appropriée

                    document.location.href = data.route; // Utilise la route retournée par le serveur
                } else {
                    // En cas d'échec, afficher un message d'erreur
                    document.getElementById("hidden").style.display = "block";
                }
            } catch (error) { //pour toute autre erreurs
                console.error('There was an error logging in:', error);
            }
            }}>
              Connexion
            </Button>

      </Grid2>

    </Paper>
  );
}