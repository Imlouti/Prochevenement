

import React, { Component } from 'react';
import "./styles.css";
import Map from "./map";

//https://ujjwaltiwari2.medium.com/a-guide-to-using-openstreetmap-with-react-70932389b8b1 guide to map, doesnt work
class Acceuil extends Component {
    async Connexion(event) {
        if (event) {
            event.preventDefault(); 
            document.location.href="Connexion";
        }
        }

    render() { 
        return <div>
        <a><img src="logo.png"></img></a>
        <h1>
        Bienvenue a Prochévénements
        </h1>
        <h2>
        Les événements proche de vous
        </h2>
        <Map />
        <form onSubmit={this.Connexion}>
            <input type="submit" id="submit" value="Se connecter"/>
        </form>
        <a href="Creation">Pas de compte? Créer un compte.</a>

</div>

  }
}
 
export default Acceuil;