import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
//import './App.css';

class Modifier extends Component {
    async Modifier(event) {
        if (event) {
            event.preventDefault(); 
            var user=[document.getElementById("nom").value,document.getElementById("courriel").value, document.getElementById("postal").value];
            document.location.href="Parametres";
        }
        }

    render() { 
        return <div id="background">
            <Navigator/>
                        <p id="two">

                <section id="back">
                <a href="Parametres" id="img"><img src="fleche.png"></img></a>
        </section>
        </p>
        <h1>
        Modification
        </h1>
        <form onSubmit={this.Modifier}>
            <input type="text" id="nom" class="input" placeholder="Nom"/>
            <input type="text" id="courriel" class="input" placeholder="Courriel"/>
            <input type="text" id="postal" class="input" placeholder="Code postal"/>
                        <button id="submit" color="primary" type="submit" class="button">Confirmer</button>
                </form>
        <a href="Reinitialiser">Reinitialiser le mot de passe</a>


</div>
  }
}
 
export default Modifier;