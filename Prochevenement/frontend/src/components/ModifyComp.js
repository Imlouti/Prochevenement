import React from "react";
import {  Paper, Grid2, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';

import { useTheme } from '@mui/material/styles';

export default function ModifyComp() {

  //le formulaire de modification a le nom, courriel et le mot de passe (la modification du courriel nest pas possible)
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
            let courriel=localStorage.getItem('courriel');
            console.log(courriel);
            // Donnees a modifier du formulaire
            const modifier = {
                courriel: courriel,
                newcourriel: document.getElementById("email").value,
                nom: document.getElementById("nom").value,
                postal: document.getElementById("postal").value,
            };

            // Voire si un des champs est vide
            const isAtLeastOneNull = Object.values(modifier).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden").style.display = "block"; // Message d'erreur si vide
                return;
            }


            // Envoie les donnees au backend pour le mettre a jour
            try {
                const response = await fetch('http://localhost:4001/auth/modify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(modifier) 
                });

                const data = await response.json();
                console.log(data);    

                if (response.ok) {
                    // Redirection vers la page parametres apres une modification reussi
                    document.location.href = "Parametres";
                } else {
                    // Gerer les erreurs du serveur 
                    console.error('Error:', data);
                }
            } catch (error) {
                console.error('There was an error reinitializing the password:', error);
            }
                }}>
                Modifier
                </Button>

        </Grid2>

        </Paper>
    );

}