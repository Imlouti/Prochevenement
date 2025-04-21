import React from "react";
import {  Paper, Grid2, Button, TextField, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';

import { useTheme } from '@mui/material/styles';

var eventInfo=[];

const event = {
    courriel: localStorage.getItem('courriel')
};

try {
    const response = await fetch('http://localhost:4001/auth/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        // Si la connexion est réussie, 
        // Enregistrez les informations de l'utilisateur dans le localStorage
        eventInfo.push(data.nom);
        eventInfo.push(data.postal);
    } 
} catch (error) { //pour toute autre erreurs
    console.error('There was an error logging in:', error);
}


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

                <TextField id='nom' label="Nom" defaultValue={eventInfo[0]} variant="outlined"/>

            </FormControl>


            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

            <TextField id='postal' label="Code postale" defaultValue={eventInfo[1]} variant="outlined"/>

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

                                <Button 
                                label="Login" 
                                sx={{ 
                                m: 1,
                                alignSelf: 'center',
                                width:"25%" 
                                }}
                                variant="contained"
                                onClick={async() => {
                
                                    let courriel=localStorage.getItem('courriel');
                        
                                    console.log('Form Submitted');  // Débogage
                            // Donnees a modifier du formulaire
                            const supprimer = {
                                courriel: courriel,
                            };
                
                            // Voire si un des champs est vide
                
                
                            // Envoie les donnees au backend pour le mettre a jour
                            try {
                                const response = await fetch('http://localhost:4001/auth/delete', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(supprimer) 
                                });
                
                                const data = await response.json();
                                console.log(data);    
                
                                if (response.ok) {
                                    // Redirection vers la page parametres apres une modification reussi
                                    document.location.href = "/";
                                } else {
                                    // Gerer les erreurs du serveur 
                                    console.error('Error:', data);
                                }
                            } catch (error) {
                                console.error('There was an error reinitializing the password:', error);
                            }
                                }}>
                                Supprimer
                                </Button>

        </Grid2>

        </Paper>
    );

}