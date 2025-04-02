import React, { Component } from 'react';
//import './App.css';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.37.1:4001";


/*class Creation extends Component {
    async Submit(event) {
        if (event) {
            event.preventDefault(); 
            const socket = socketIOClient(ENDPOINT);
            //client donne le surnom de l<utilisateur au serveur
            var slider=2;
            if(document.getElementById("slider").checked==true){
                slider=1;
            }
            else{
                slider=0;
            }
            var user=[document.getElementById("nom").value,document.getElementById("courriel").value, document.getElementById("postal").value, document.getElementById("password").value, slider];
            console.log(user);
            var isAtLeastOneNull =user.some(function(i) { return i === ""; })
            if(isAtLeastOneNull===true){
                document.getElementById("hidden").style.display="block";
            }
            else{
            socket.on("utilisateur", (arg, callback) => {
                callback(user);
            });
            //serbeur donne la route pour changer de page
            setInterval(() => {
                const socket = socketIOClient(ENDPOINT);
                        socket.on("utilisateur", (arg, callback) => {
                            console.log(arg);
                            if(arg!=undefined){
                                localStorage.setItem("nom", arg);
                                document.location.href=arg;
                            }
                        });
            }, 1000);
        }
    }
}*/
class Creation extends Component {
    async Submit(event) {
        if (event) {
            event.preventDefault();
            
            console.log('Form Submitted');  // Débogage
            // Collecting user data from the form
            const vendeur = document.getElementById("vendeur").checked ? 1 : 0; // Check the radio button for "Vendeur"
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
                    // Handle errors from the server (e.g., user already exists)
                    console.error('Error:', data);
                }
            } catch (error) {
                console.error('There was an error creating the account:', error);
            }
        }
    }

    render() {
        return (
            <div id="background">
                <section id="back">
                    <a href="/" id="img"><img src="fleche.png" alt="Retour à l'accueil" /></a>
                </section>
                <h1>Création d’un compte</h1>
                <form onSubmit={this.Submit}>
                    <input type="text" id="nom" className='input' placeholder="Nom" />
                    <input type="text" id="courriel" className='input' placeholder="Courriel" />
                    <input type="text" id="postal" className='input' placeholder="Code postal" />
                    <input type="password" id="password" className='input' placeholder="Mot de passe" />
                    <button id="submit" className='button' type="submit">Créer le compte</button>

                    <div id="switch">
                        <label className="container">
                            Vendeur
                            <input type="radio" id="vendeur" name="role" />
                            <span className="checkmark"></span>
                        </label>
                        
                    </div>
                </form>
                
                <a id="hidden" style={{ display: 'none' }}>Vous devez remplir tous les champs.</a>

                <a href="Connexion">Déjà un compte ? Connectez-vous.</a>
            </div>
        );
    }
}

export default Creation;