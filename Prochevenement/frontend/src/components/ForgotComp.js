import * as React from 'react';
import { Paper, Grid2, Button, OutlinedInput, InputLabel, FormControl } from '@mui/material';

import { useTheme } from '@mui/material/styles';

export default function ForgotComp() {
  

  const theme = useTheme();
    //ce formulaire demande pour le courriel
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
              

              console.log('Form Submitted');  // Débogage
            // Collecte de courriels à partir du formulaire
            const courriel = {
                courriel: document.getElementById("email").value
            };

        // Vérifiez si des champs sont vides
            const isAtLeastOneNull = Object.values(courriel).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden").style.display = "block"; // Afficher l'erreur si les champs sont vides

                return;
            }


          // Envoi du courriel au backend pour créer et envoyer le code de vérification
            try {
                const response = await fetch('http://localhost:4001/auth/forgot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(courriel)// Conversion d'un objet courriel en chaîne JSON
                });

                const data = await response.json();
                console.log(data);

                localStorage.setItem('courriel', document.getElementById("email").value) // renvoyer le courriel a la page reinitialiser

    

                if (response.ok) {
                // Redirection vers la page reinitialiser après la creation du code de verification réussi
                    document.location.href = "Reinitialiser";
                } else {
                  // Gérer les erreurs du serveur
                    console.error('Error:', data);
                }
            } catch (error) {
                console.error('There was an error creating the account:', error);
            }
            }}>
              Envoyer
            </Button>

      </Grid2>

    </Paper>
  );
}