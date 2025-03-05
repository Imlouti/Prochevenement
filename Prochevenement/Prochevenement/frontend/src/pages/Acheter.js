import React, { Component } from 'react';
//import './App.css';

class Acheter extends Component {
    async Creation(event) {
        if (event) {
            event.preventDefault(); 
            document.location.href="Magasiner";
        }
        }
    render() { 
        return <div>
            <p id="two">
                <section id="back">
                <a href="Panier" id="img"><img src="fleche.png"></img></a>
        </section>
        <section>
        <a href="Magasiner" id="img"><img src="acceuil.png"></img></a>
        <a href="Parametres" id="img"><img src="parametres.png" ></img></a>
        <a href="Calendrier" id="img"><img src="calendrier.png" ></img></a>
        <a href="Panier" id="img"><img src="panier.png" ></img></a>
        <a href="Propos" id="img"><img src="info.png" ></img></a>
        </section>
        </p>

        <form onSubmit={this.Creation}>
            <input type="text" id="nom" placeholder="Nom"/>
            <input type="text" id="courriel" placeholder="Courriel"/>
            <input type="text" id="numerocarte" placeholder="Numéro carte crédit"/>
            <input type="text" id="expiration" placeholder="Expiration"/>
            <input type="text" id="codesecurite" placeholder="Code de securité"/>
            <input type="text" id="addresse" placeholder="Addresse"/>
                        <button id="submit" color="primary" type="submit">Confimer

</button>
                </form>








</div>
  }
}
 
export default Acheter;