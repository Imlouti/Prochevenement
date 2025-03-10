import React, { Component } from 'react';
//import './App.css';

class Creation extends Component {
    async Creation(event) {
        if (event) {
            event.preventDefault(); 
            document.location.href="Vendeur";
        }
        }

    render() { 
        return <div id="background">
                <section id="back">
        <a href="Vendeur" id="img"><img src="fleche.png"></img></a>
        </section>
                <h1>
Modification d'un événement        </h1>
        <form onSubmit={this.Creation}>
        <input type="text" id="nomevenement" class='input' placeholder="Nom"/>
            <input type="text" id="description" class='input' placeholder="Description"/>
            <input type="text" id="prix" class='input' placeholder="Prix"/>
            <input type="text" id="date" class='input' placeholder="Date"/>
            <input type="text" id="billets" class='input' placeholder="Billets totale"/>
                        <button id="submit" color="primary" type="submit" class='button'>Confirmer</button>
                </form>


</div>
  }
}
 
export default Creation;