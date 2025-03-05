
import React, { Component } from 'react';
//import './App.css';

class Connexion extends Component {
    async Connexion(event) {
        if (event) {
            event.preventDefault(); 
            var user=[document.getElementById("nom").value,document.getElementById("courriel").value, document.getElementById("password").value];
            document.location.href="Magasiner";
        }
        }

    render() { 
        return <div>
                <section id="back">
                <a href="/" id="img"><img src="fleche.png"></img></a>
        </section>
        <h1>
        Connexion
        </h1>
        <form onSubmit={this.Connexion}>
            <input type="text" id="nom" placeholder="Nom"/>
            <input type="text" id="courriel" placeholder="Courriel"/>
            <input type="text" id="password" placeholder="Mot de passe"/>
                        <button id="submit" color="primary" type="submit">Connexion</button>
                </form>
                <p id="two">

        <a href="Creation">Pas de compte? Créer un compte.</a>
        <a href="Oublier">Oublier le mot de passe</a>
        </p>


</div>
  }
}
 
export default Connexion;