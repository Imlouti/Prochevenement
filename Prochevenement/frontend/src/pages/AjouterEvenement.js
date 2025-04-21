import React, { Component } from 'react';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {  Link, Grid2 } from "@mui/material";
import AddEvent from '../components/AddEvent';


class AjouterEvenement extends Component {
    async Submit(event) {
        if (event) {
            event.preventDefault();
            

            const vendeurId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).vendeurId : null; // Récupérer l'ID du vendeur
       
            if (!vendeurId) {
                console.error("ID du vendeur manquant dans localStorage");
                return;  // Arrêter l'exécution si l'ID du vendeur est manquant
            }

            console.log('Form Submitted');  // Débogage
            // Collecting event data from the form
            const evenement = {
                nom: document.getElementById("nomevenement").value,
                description: document.getElementById("description").value,
                prix: document.getElementById("prix").value,
                date: document.getElementById("date").value,
                location: document.getElementById("location").value,
                billets: document.getElementById("billets").value,
                vendeurId:  JSON.parse(localStorage.getItem("user")).vendeurId  // Utilisation du vendeurId  // adding the vendor ID 
            };

            // Check if any fields are empty
            const isAtLeastOneNull = Object.values(evenement).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden").style.display = "block"; // Show error if fields are empty
                return;
            }

            // Sending the user data to the backend to create the account
            try {
                const response = await fetch('http://localhost:4001/auth/event', {
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
                    document.location.href = "Vendeur";
                } else {
                    // Handle errors from the server 
                    console.error('Error:', data);
                }
            } catch (error) {
                console.error('There was an error creating the account:', error);
            }
        }
    }


    render() { 
        return <div id="background">
                    <IconButton href="Vendeur" sx={{color:"black", padding: 0}} size="large">Retour                  
                        <ArrowBackIosIcon/>
                    </IconButton>
                    <h1>
                        Creation d’un événement
                    </h1>
                    <Grid2
                          container
                          spacing={0}
                          direction="column"
                          alignItems="center"
                          justifyContent="center">
                        <AddEvent/>
                    </Grid2>        
                    <a id="hidden">Vous devez remplir tous les champs.</a>

                </div>
  }
}
 
export default AjouterEvenement;