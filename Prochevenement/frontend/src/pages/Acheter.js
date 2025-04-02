import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
//import './App.css';

class Acheter extends Component {
    async Creation(event) {
        if (event) {
            event.preventDefault(); 
            document.location.href="Magasiner";
        }
        }
    render() { 
        return <div id="background">
            <p id="two">
                <section id="back">
                <a href="Panier" id="img"><img src="fleche.png"></img></a>
        </section>
        <Navigator/>
        </p>

        <form onSubmit={this.Creation}>
            <input type="text" id="nom" class='input' placeholder="Nom"/>
            <input type="text" id="courriel" class='input' placeholder="Courriel"/>
            <input type="text" id="numerocarte" class='input' placeholder="Numéro carte crédit"/>
            <input type="text" id="expiration" class='input' placeholder="Expiration"/>
            <input type="text" id="codesecurite" class='input' placeholder="Code de securité"/>
            <input type="text" id="addresse" class='input' placeholder="Addresse"/>
                        <button id="submit" class='button' color="primary" type="submit">Confimer

</button>
                </form>








</div>
  }
}
 
export default Acheter;