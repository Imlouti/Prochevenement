import React, { Component } from 'react';
//import './App.css';

class Acheter extends Component {
    render() { 

        // Récupérer les informations de l'utilisateur du localStorage
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
            window.location.href = '/Connexion';
        }

        return <div id="background">
            <p id="two">
                <section id="back">
                <a href="AjouterEvenement" id="img"><img src="ajouter.png"></img></a>
        </section>
        <section>
        <a href="AppercuMagasiner" id="img"><img src="appercu.png"></img></a>
        </section>
        </p>

        <h1>
            Événements
        </h1>
        <a href="ModifierEvenement">Modifier Evenement</a>










</div>
  }
}
 
export default Acheter;