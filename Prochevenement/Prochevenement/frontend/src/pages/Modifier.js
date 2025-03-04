import React, { Component } from 'react';
//import './App.css';

class Modifier extends Component {
    async Modifier(event) {
        if (event) {
            event.preventDefault(); 
            var user=[document.getElementById("nom").value,document.getElementById("courriel").value, document.getElementById("postal").value, document.getElementById("password").value];
            document.location.href="Magasiner";
        }
        }

    render() { 
        return <div>
        <img src="comment-choisir-jeux.jpg" ></img>
        <a href="Magasiner">Magasiner</a>
        <br></br>
        <a href="Parametres">Parametres</a>
        <br></br>
        <a href="Calendrier">Calendrier</a>
        <br></br>
        <a href="Panier">Panier</a>
        <br></br>
        <a href="Propos">Propos</a>
        <h1>
        Modification
        </h1>
        <form onSubmit={this.Modifier}>
            <input type="text" id="nom"/>
            <br></br>
            <input type="text" id="courriel"/>
            <br></br>
            <input type="text" id="postal"/>
                               <br></br>
                        <button id="submit" color="primary" type="submit">Confirmer</button>
                </form>
        <a href="Reinitialiser">Reinitialiser le mot de passe</a>


</div>
  }
}
 
export default Modifier;