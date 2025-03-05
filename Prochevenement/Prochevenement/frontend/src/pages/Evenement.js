import React, { Component } from 'react';
//import './App.css';

class Evenement extends Component {
  async Creation(event) {
    if (event) {
        event.preventDefault(); 
        document.getElementById("hidden").style.display="block";
        document.location.href="Magasiner";
    }
    }

    render() { 
        return <div>
                      <p id="two">

                <section id="back">
                <a href="Magasiner" id="img"><img src="fleche.png"></img></a>
        </section>
        <section>
        <a href="Magasiner" id="img"><img src="acceuil.png"></img></a>
        <a href="Parametres" id="img"><img src="parametres.png" ></img></a>
        <a href="Calendrier" id="img"><img src="calendrier.png" ></img></a>
        <a href="Panier" id="img"><img src="panier.png" ></img></a>
        <a href="Propos" id="img"><img src="info.png" ></img></a>
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

                    <button onClick={this.Creation}>Acheter</button>

                    <a id="hidden">Ajouter au panier.</a>






</div>
  }
}
 
export default Evenement;