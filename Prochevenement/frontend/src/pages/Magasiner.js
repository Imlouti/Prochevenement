import React, { Component } from 'react';
import { EventTable } from "../components/EventTable";
import { Navigator } from '../components/Navigator';

class Magasiner extends Component {

  render() {
    // Récupérer les informations de l'utilisateur du localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        window.location.href = '/Connexion';
    }

    return (
      <div id="background">
        <Navigator />
        <section>
          <a href="Magasiner" id="img"><img src="acceuil.png" alt="Accueil" /></a>
          <a href="Parametres" id="img"><img src="parametres.png" alt="Paramètres" /></a>
          <a href="Calendrier" id="img"><img src="calendrier.png" alt="Calendrier" /></a>
          <a href="Panier" id="img"><img src="panier.png" alt="Panier" /></a>
          <a href="Propos" id="img"><img src="info.png" alt="Info" /></a>
        </section>
        <EventTable />
        <a href="Evenement">Evenement</a>
      </div>
    );
  }
}

export default Magasiner;