import React, { Component } from 'react';
import { EventTable } from "../components/EventTable";
import { Navigator } from '../components/Navigator';



class Magasiner extends Component {
  state = {
    events: [],  // Liste des événements récupérés depuis l'API
  };

  // Appel à l'API pour récupérer les événements
  async componentDidMount() {
    try {
      const response = await fetch('http://localhost:4001/auth/eventTable', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Vérifier si la réponse est ok
      if (!response.ok) {
        console.error("Erreur lors de la récupération des événements");
        return;
      }

      const data = await response.json();
      
      // Assurez-vous que les données sont bien dans un format attendu
      if (Array.isArray(data)) {
        this.setState({
          events: data,  // Sauvegarder les événements dans le state
        });
      } else {
        console.error("Les données retournées ne sont pas au format attendu");
      }

    } catch (error) {
      console.error("Erreur dans la requête fetch :", error);
    }
  }

  render() {
    const { events } = this.state;  // Récupérer les événements du state

    // Créer la liste d'événements sous forme de tableau
    const eventList = events.map((event, index) => (
      <tr key={index}>
        <td>{event.nom}</td>
        <td>{event.billets}</td>
        <td>{event.prix}</td>
      </tr>
    ));

    return (
      <div id="background">
        <p id="two">
          <section id="user">
            <p id="user">Bonjour, </p>
          </section>
          <section id="bar">
            <Navigator /> {/* Navigation */}
          </section>
        </p>
        
        <p id="two">
          <section id="user">
            {/* Tableau des événements */}
            <table id="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Billets</th>
                  <th>Prix</th>
                </tr>
              </thead>
              <tbody>
                {eventList} {/* Affichage des événements */}
              </tbody>
            </table>
            <p id="user">
              <a href="Evenement">Voir plus</a>
            </p>
          </section>
        </p>
      </div>
    );
  }
}

export default Magasiner;
