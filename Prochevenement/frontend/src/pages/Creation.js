import React, { Component } from 'react';
//import './App.css';


class Creation extends Component {
    async Submit(event) {
        if (event) {
            event.preventDefault();
            
            console.log('Form Submitted');  // Débogage
            // Collecting user data from the form
            const vendeur = document.getElementById("slider").checked ? 1 : 0; // Check the radio button for "Vendeur"
            const user = {
                nom: document.getElementById("nom").value,
                courriel: document.getElementById("courriel").value,
                postal: document.getElementById("postal").value,
                motpasse: document.getElementById("password").value,
                vendeur: vendeur
            };

            // Check if any fields are empty
            const isAtLeastOneNull = Object.values(user).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden").style.display = "block"; // Show error if fields are empty
                return;
            }

            // Sending the user data to the backend to create the account
            try {
                const response = await fetch('http://localhost:4001/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user) // Converting user object to JSON string
                });

                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    // Redirect to login page after successful registration
                    document.location.href = "Connexion";
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
                <section id="back">
        <a href="/" id="img"><img src="fleche.png"></img></a>
        </section>
                <h1>
        Creation d’un compte
        </h1>
        <form onSubmit={this.Submit}>
        <input type="text" id="nom" class='input' placeholder="Nom"/>
            <input type="text" id="courriel" class='input' placeholder="Courriel"/>
            <input type="text" id="postal" class='input' placeholder="Code postale"/>
            <input type="text" id="password" class='input' placeholder="Mot de passe"/>
                        <button id="submit" color="primary" type="submit" class='button'>Créer le compte</button>
                        <div id="switch">
            <label class="container">Vendeur
  <input type="radio" id="slider"></input>
  <span class="checkmark"></span>
</label>

</div>
                </form>
        <a id="hidden">Vous devez remplir tous les champs.</a>

        <a href="Connexion">Déja un compte? Connectez-vous.</a>

</div>
  }
}
 
export default Creation;