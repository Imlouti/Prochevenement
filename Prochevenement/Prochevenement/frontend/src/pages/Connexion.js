
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
        <img src="comment-choisir-jeux.jpg" ></img>
        <h1>
        Connexion
        </h1>
        <form onSubmit={this.Connexion}>
            <input type="text" id="nom"/>
            <br></br>
            <input type="text" id="courriel"/>
            <br></br>
            <input type="text" id="password"/>
                               <br></br>
                        <button id="submit" color="primary" type="submit">Connexion</button>
                </form>

        <a href="Creation">Pas de compte? Créer un compte.</a>
        <br></br>
        <a href="Oublier">Oublier le mot de passe</a>


</div>
  }
}
 
export default Connexion;