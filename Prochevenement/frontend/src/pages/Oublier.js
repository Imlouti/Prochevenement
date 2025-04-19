import React, { Component } from 'react';
//import './App.css';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

class Oublier extends Component {
    async Submit(event) {
        if (event) {
            event.preventDefault();
            
            console.log('Form Submitted');  // Débogage
            // Collecting event data from the form
            const courriel = {
                courriel: document.getElementById("courriel").value
            };

            // Check if any fields are empty
            const isAtLeastOneNull = Object.values(courriel).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden").style.display = "block"; // Show error if fields are empty
                return;
            }


            // Sending the user data to the backend to create the account
            try {
                const response = await fetch('http://localhost:4001/auth/forgot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(courriel) // Converting user object to JSON string
                });

                const data = await response.json();
                console.log(data);

                localStorage.setItem('courriel', document.getElementById("courriel").value) // renvoyer le courriel a la page reinitialiser

    

                if (response.ok) {
                    // Redirect to vendor page after successful addition
                    document.location.href = "Reinitialiser";
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
                <IconButton href="Connexion" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
                <h1>
        Oublier le mot de passe
        </h1>
        <form onSubmit={this.Submit}>
            <input type="text" id="courriel" class='input' placeholder="Courriel"/>
                        <button id="submit" color="primary" type="submit" class='button'>Envoyer un courriel</button>
                </form>



</div>
  }
}
 
export default Oublier;


