import React, { Component } from 'react';
//import './App.css';

class Creation extends Component {
    async Creation(event) {
        if (event) {
            event.preventDefault(); 
            var user=[document.getElementById("nom").value,document.getElementById("courriel").value, document.getElementById("postal").value, document.getElementById("password").value];
            document.location.href="Magasiner";
        }
        }

    render() { 
        return <div>
        <img src="comment-choisir-jeux.jpg" ></img>
        <h1>
        Creation d’un compte
        </h1>
        <form onSubmit={this.Creation}>
            <input type="text" id="nom"/>
            <br></br>
            <input type="text" id="courriel"/>
            <br></br>
            <input type="text" id="postal"/>
            <br></br>
            <input type="text" id="password"/>
                               <br></br>
                        <button id="submit" color="primary" type="submit">Créer le compte</button>
                </form>

        <a href="Connexion">Déja un compte? Connectez-vous.</a>

</div>
  }
}
 
export default Creation;