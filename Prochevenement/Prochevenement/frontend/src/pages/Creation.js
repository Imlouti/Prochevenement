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
                <section id="back">
        <a href="/" id="img"><img src="fleche.png"></img></a>
        </section>
                <h1>
        Creation d’un compte
        </h1>
        <form onSubmit={this.Creation}>
        <input type="text" id="nom" placeholder="Nom"/>
            <input type="text" id="courriel" placeholder="Courriel"/>
            <input type="text" id="postal" placeholder="Code postale"/>
            <input type="text" id="password" placeholder="Mot de passe"/>
                        <button id="submit" color="primary" type="submit">Créer le compte</button>
                </form>

        <a href="Connexion">Déja un compte? Connectez-vous.</a>

</div>
  }
}
 
export default Creation;