import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
//import './App.css';

class Annuler extends Component {
  async Creation(event) {
    if (event) {
        event.preventDefault(); 
        document.getElementById("hidden").style.display="block";
        document.location.href="Parametres";
    }
    }

    render() { 
        return <div>
          <Navigator/>
                      <p id="two">

                <section id="back">
                <a href="Parametres" id="img"><img src="fleche.png"></img></a>
        </section>
        
</p>
        <h1>
        Nom de l’événement
                </h1>
                <h2>
                Description
                </h2>
                    <a>Prix</a>
                    <a>Emplacement</a>
                    <a>Date</a>
                    <a>Billets Restant</a>

                    <button onClick={this.Creation}>Annuler l’achat</button>

                    <a id="hidden">Enlever du panier.</a>







</div>
  }
}
 
export default Annuler;