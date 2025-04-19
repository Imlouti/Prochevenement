import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
//import './App.css';

class Modifier extends Component {
    async Submit(event) {
        if (event) {
            event.preventDefault(); 
            console.log('Form Submitted');  // Débogage
            let courriel=localStorage.getItem('courriel');
            console.log(courriel);
            // Collecting event data from the form
            const modifier = {
                courriel: courriel,
                newcourriel: document.getElementById("newcourriel").value,
                nom: document.getElementById("nom").value,
                postal: document.getElementById("postal").value,
            };

            // Check if any fields are empty
            const isAtLeastOneNull = Object.values(modifier).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden").style.display = "block"; // Show error if fields are empty
                return;
            }


            // Sending the user data to the backend to create the account
            try {
                const response = await fetch('http://localhost:4001/auth/modify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(modifier) // Converting user object to JSON string
                });

                const data = await response.json();
                console.log(data);    

                if (response.ok) {
                    // Redirect to vendor page after successful addition
                    document.location.href = "Connexion";
                } else {
                    // Handle errors from the server 
                    console.error('Error:', data);
                }
            } catch (error) {
                console.error('There was an error reinitializing the password:', error);
            }
        }
    }

    render() { 
        
        return             <div id="background">
                        <p id="two">

                <section id="back">
                <a href="Parametres" id="img"><img src="fleche.png"></img></a>
        </section>
        </p>
        <h1>
        Modification
        </h1>
        <form onSubmit={this.Submit}>
            <input type="text" id="nom" class="input" placeholder='Nom'/>
            <input type="text" id="newcourriel" class="input" placeholder='Courriel'/>
            <input type="text" id="postal" class="input" placeholder="Code postal"/>
                        <button id="submit" color="primary" type="submit" class="button">Confirmer</button>
                </form>
                <a id="hidden">Tous les champs doivent etre remplie.</a>
        <a href="Reinitialiser">Reinitialiser le mot de passe</a>


</div>
    
}
}
 
export default Modifier;