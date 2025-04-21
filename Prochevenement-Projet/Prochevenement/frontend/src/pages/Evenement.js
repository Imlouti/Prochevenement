

import React, { Component } from 'react';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {  Box, Button, Link, Grid2 } from "@mui/material";
import ModifyComp from '../components/ModifyComp';

var idx = document.URL.indexOf('@');
var list = document.URL.split("");
var params = new Array();
  for (var i=idx+1; i<list.length; i++) {
    params.push(list[i]);
     }
  
  params=params.join("");

  var eventInfo=[];
  eventInfo.push(params);

  const event = {
    nom: params
};


if(event.nom!=undefined){
 // Envoi des données de connexion au backend (voire app.js route de connexion pour plus de detail) pour vérifier les identifiants
 try {
    const response = await fetch('http://localhost:4001/auth/eventSearch', {
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
        eventInfo.push(data.description);
        eventInfo.push(data.prix);
        eventInfo.push(data.date);
        eventInfo.push(data.location);
        eventInfo.push(data.billets);
    } 
} catch (error) { //pour toute autre erreurs
    console.error('There was an error logging in:', error);
}
}
else{
  eventInfo=[0,0,0,0,0,0]
}

class Evenement extends Component {
    //Va afficher une fleche de retour a la page parametres, le titre de la page, le formulaire de modification de compte (voire le fichier components/ModifyComp pour plus d'explication) et un lien pour reinitialiser le mot de passe
    render() { 
        
        return              <div id="background">
        <p id="two">

        <IconButton href="Magasiner" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
</p>

      
      <h1>
{eventInfo[0]}
  </h1>
  <h2>{eventInfo[1]}</h2>
  <h3>Prix: ${eventInfo[2]}</h3>
  <h3>Date: {eventInfo[3]}</h3>
  <h3>Location: {eventInfo[4]}</h3>
  <h3>Billets: {eventInfo[5]}</h3>
  <Box textAlign='center'>
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
                    
                    console.log('Form Submitted');  // Débogage
            // Collecting event data from the form
            const evenement = {
                nom: eventInfo[0],
                description: eventInfo[1],
                prix: eventInfo[2],
                date: eventInfo[3],
                location: eventInfo[4],
                billets: eventInfo[5]
            };

            // Check if any fields are empty
            const isAtLeastOneNull = Object.values(evenement).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden").style.display = "block"; // Show error if fields are empty
                return;
            }

            // Sending the user data to the backend to create the account
            try {
                const response = await fetch('http://localhost:4001/auth/panier', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(evenement) // Converting user object to JSON string
                });

                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    // Redirect to vendor page after successful addition
                    document.location.href = "Magasiner";
                } else {
                    // Handle errors from the server 
                    console.error('Error:', data);
                }
            } catch (error) {
                console.error('There was an error creating the account:', error);
            }
                }}>
                Acheter
                </Button>
</Box>




      <a id="hidden">Pas de billets restant.</a>






</div>
    
}
}
 
export default Evenement;
