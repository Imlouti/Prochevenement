import React from "react";
import { FormControlLabel, Checkbox, Paper, Grid2, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useTheme } from '@mui/material/styles';

export default function RegisterComp() {

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
      //le formulaire de creation a le nom, courriel, postal, le mot de passe, mot de passe encore et une case à cocher
    return (
        <Paper sx={{ textAlign: "center" }}>

        <Grid2
            container
            spacing={0}
            direction="column"
            sx={{backgroundColor: "transparent"}}
        >

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

            <InputLabel htmlFor="email">Nom</InputLabel>
            <OutlinedInput
            id="nom"
            label="nom"
            />

            </FormControl>

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

                <InputLabel htmlFor="email">Courriel</InputLabel>
                <OutlinedInput
                id="email"
                label="Email"
                />

            </FormControl>

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

<InputLabel htmlFor="postal">Code postale</InputLabel>
<OutlinedInput
id="postal"
label="postal"
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


            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }}>

                <FormControlLabel control={<Checkbox id="slider"/>} label="Vendeur" />

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
                    
                    localStorage.setItem('nom',document.getElementById("nom").value); //garde le nom pour l'affichage dans le site web
        
                        if(document.getElementById("outlined-adornment-password").value!=document.getElementById("outlined-adornment-confirm-password").value){
                        document.getElementById("hidden").style.display = "block"; // si les mots de passes sont differents donc il va avoir un message d'erreur
                    }
                    else{
                    console.log('Form Submitted');  // Débogage
        
                    // Collecte des données utilisateur à partir du formulaire
                    const vendeur = document.getElementById("slider").checked ? 1 : 0; // si la case a chocher est "Vendeur" ou non
                    const user = {
                        nom: document.getElementById("nom").value,
                        courriel: document.getElementById("email").value,
                        postal: document.getElementById("postal").value,
                        motpasse: document.getElementById("outlined-adornment-password").value,
                        vendeur: vendeur
                    };
        
                    // Vérifiez si des champs sont vides
                    const isAtLeastOneNull = Object.values(user).some(i => i === "");
                    if (isAtLeastOneNull) {
                        document.getElementById("hidden2").style.display = "block"; // Afficher erreur si un ou plusieurs champs sont vides
                        return;
                    }
        
                    // Envoi des données utilisateur au backend pour créer le compte
                    try {
                        const response =  await fetch('http://localhost:4001/auth/register', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(user) // Conversion d'un objet utilisateur en chaîne JSON
                        });
        
                        const data =  await response.json();
                        console.log(data);
        
                        if (response.ok) {
                        // Redirection vers la page de connexion après une inscription réussie
                            document.location.href = "Connexion";
                        } else {
                        // Gérer les erreurs du serveur
                            console.error('Error:', data);
                        }
                    } catch (error) {
                        console.error('There was an error creating the account:', error);
                    }
                }
                }}>
                Creation
                </Button>

        </Grid2>

        </Paper>
    );

}