import React, { Component } from 'react';
import { EventTable } from "../components/EventTable"
//import './App.css';

class Magasiner extends Component {

    render() { 
        return <div id="background">
        
        <section>
        <a href="Magasiner" id="img"><img src="acceuil.png"></img></a>
        <a href="Parametres" id="img"><img src="parametres.png" ></img></a>
        <a href="Calendrier" id="img"><img src="calendrier.png" ></img></a>
        <a href="Panier" id="img"><img src="panier.png" ></img></a>
        <a href="Propos" id="img"><img src="info.png" ></img></a>
        </section>

        <EventTable></EventTable>
        
        <a href="Evenement">Evenement</a>


</div>
  }
}
 
export default Magasiner;