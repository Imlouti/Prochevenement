import React, { Component } from 'react';
//import './App.css';

class Oublier extends Component {
    async Connexion(event) {
        if (event) {
            event.preventDefault(); 
            var user=[document.getElementById("nom").value,document.getElementById("courriel").value];
            document.location.href="Reinitialiser";
        }
        }

    render() { 
        return <div id="background">
                <section id="back">
                <a href="Connexion" id="img"><img src="fleche.png"></img></a>
        </section>        <h1>
        Oublier le mot de passe
        </h1>
        <form onSubmit={this.Connexion}>
            <input type="text" id="nom" class='input' placeholder="Nom"/>
            <input type="text" id="courriel" class='input' placeholder="Courriel"/>
                        <button id="submit" color="primary" type="submit" class='button'>Envoyer un courriel</button>
                </form>



</div>
  }
}
 
export default Oublier;