import React, { Component } from 'react';
//import './App.css';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


class Creation extends Component {
    async Submit(event) {
        if (event) {
            event.preventDefault();
            
            console.log('Form Submitted');  // Débogage
            // Collecting event data from the form
            const evenement = {
                nom: document.getElementById("nomevenement").value,
                description: document.getElementById("description").value,
                prix: document.getElementById("prix").value,
                date: document.getElementById("date").value,
                location: document.getElementById("location").value,
                billets: document.getElementById("billets").value
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
                               <IconButton href="Vendeur" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
                <h1>
        Creation d’un événement
        </h1>
        <form onSubmit={this.Submit}>
        <input type="text" id="nomevenement" class='input' placeholder="Nom"/>
            <input type="text" id="description" class='input' placeholder="Description"/>
            <input type="text" id="prix" class='input' placeholder="Prix"/>
            <input type="text" id="date" class='input' placeholder="YYYY-MM-DD"/>
            <input type="text" id="location" class='input' placeholder="Addresse"/>
            <input type="text" id="billets" class='input' placeholder="Billets totale"/>
                        <button id="submit" color="primary" type="submit" class='button'>Confirmer</button>
                </form>
                <a id="hidden">Vous devez remplir tous les champs.</a>


</div>
  }
}
 
export default Creation;