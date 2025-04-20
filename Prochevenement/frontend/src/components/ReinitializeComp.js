import * as React from 'react';
import { Paper, Grid2, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useTheme } from '@mui/material/styles';


export default function ReinitializeComp() {
        //c'est fonctions transforme le mot de passe et le mot de passe encore de texte lisable en **** et vise vera

  const [showPassword, setShowPassword] = React.useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event) => {
      event.preventDefault();
  };

  const handleMouseUpConfirmPassword = (event) => {
      event.preventDefault();
  };
  

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
      event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
      event.preventDefault();
  };

  const theme = useTheme();
        //le formulaire de reinitialisation de mot de passe a le code de verification, mot de passe et mot de passe encore
  return (
    <Paper sx={{ textAlign: "center" }}>

      <Grid2
        container
        spacing={0}
        direction="column"
        sx={{backgroundColor: "transparent"}}
      >

        <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

        <InputLabel htmlFor="verification">Verification</InputLabel>
        <OutlinedInput
          id="verification"
          label="verification"
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

        <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

<InputLabel htmlFor="outlined-adornment-confirm-password">Mot de passe encore</InputLabel>
<OutlinedInput
    id="outlined-adornment-confirm-password"
    type={showConfirmPassword ? 'text' : 'password'}
    endAdornment={
    <InputAdornment position="end">
        <IconButton
        aria-label={
            showConfirmPassword ? 'hide the password' : 'display the password'
        }
        onClick={handleClickShowConfirmPassword}
        onMouseDown={handleMouseDownConfirmPassword}
        onMouseUp={handleMouseUpConfirmPassword}
        edge="end"
        >
        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              document.getElementById("hidden").style.display = "none";
              document.getElementById("hidden2").style.display = "none";

              if(document.getElementById("outlined-adornment-password").value!=document.getElementById("outlined-adornment-confirm-password").value){
                document.getElementById("hidden").style.display = "block"; // si les mots de passes sont differents donc il va avoir un message d'erreur
            }
            console.log('Form Submitted');  // Débogage
          // Collecte des données à partir du formulaire
            const reinitialiser = {
                courriel: localStorage.getItem('courriel'),
                verificationfe: document.getElementById("verification").value,
                password: document.getElementById("outlined-adornment-password").value
            };

          // Vérifiez si des champs sont vides
            const isAtLeastOneNull = Object.values(reinitialiser).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden2").style.display = "block"; // Afficher l'erreur si les champs sont vides
                return;
            }


            // Envoi des données mises à jour au backend pour mettre à jour le compte
            try {
                const response = await fetch('http://localhost:4001/auth/reinitialize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reinitialiser) // Conversion d'un objet utilisateur en chaîne JSON
                });

                const data = await response.json();
                console.log(data);    

                if (response.ok) {
                  // Redirection vers la page connexion après un ajout réussi
                    document.location.href = "Connexion";
                } else {
                        // Gérer les erreurs du serveur
                        console.error('Error:', data);
                }
            } catch (error) {
                console.error('There was an error reinitializing the password:', error);
            }
            }}>
              Réinitialiser
            </Button>

      </Grid2>

    </Paper>
  );
}