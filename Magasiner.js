import React, { Component } from 'react';
//import './App.css';

class Magasiner extends Component {

    render() { 

       // Récupérer les informations de l'utilisateur du localStorage
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
            window.location.href = '/Connexion';
        }


        return <div id="background">
        
        <section>
        <a href="Magasiner" id="img"><img src="acceuil.png"></img></a>
        <a href="Parametres" id="img"><img src="parametres.png" ></img></a>
        <a href="Calendrier" id="img"><img src="calendrier.png" ></img></a>
        <a href="Panier" id="img"><img src="panier.png" ></img></a>
        <a href="Propos" id="img"><img src="info.png" ></img></a>
        </section>
        <a href="Evenement">Evenement</a>






</div>
  }
}
 
export default Magasiner;