
import React, { Component } from 'react';
import './styles.css';

class Reinitialiser extends Component {
    async Submit(event) {
        if (event) {
            event.preventDefault(); 
            if(document.getElementById("newpassword").value!=document.getElementById("newpasswordagain").value){
                document.getElementById("hidden").style.display = "block"; // Show error if fields are empty
            }
            console.log('Form Submitted');  // Débogage
            // Collecting event data from the form
            const reinitialiser = {
                courriel: localStorage.getItem('courriel'),
                verificationfe: document.getElementById("verification").value,
                password: document.getElementById("newpassword").value
            };

            // Check if any fields are empty
            const isAtLeastOneNull = Object.values(reinitialiser).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden").style.display = "block"; // Show error if fields are empty
                return;
            }


            // Sending the user data to the backend to create the account
            try {
                const response = await fetch('http://localhost:4001/auth/reinitialize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reinitialiser) // Converting user object to JSON string
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
        return <div id='background'>
                <section id="back">
                <a href="Oublier" id="img"><img src="fleche.png"></img></a>
        </section>
        <h1>
        Réinitialiser le mot de passe
        </h1>
        <form onSubmit={this.Submit}>
            <input type="text" id="verification" class='input' placeholder="Code de verification"/>
            <input type="text" id="newpassword" class='input' placeholder="Nouveau mot de passe"/>
            <input type="text" id="newpasswordagain" class='input' placeholder="Mot de passe encore"/>
                        <button id="submit" color="primary" type="submit" class='button'>Réinitialiser</button>
                </form>
        <a id="hidden">Les mots de passe sont different.</a>


</div>
  }
}

export default Reinitialiser;