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
        return <div>
        <img src="comment-choisir-jeux.jpg" ></img>
        <h1>
        Oublier le mot de passe
        </h1>
        <form onSubmit={this.Connexion}>
            <input type="text" id="nom"/>
            <br></br>
            <input type="text" id="courriel"/>
                               <br></br>
                        <button id="submit" color="primary" type="submit">Envoyer un courriel</button>
                </form>



</div>
  }
}
 
export default Oublier;