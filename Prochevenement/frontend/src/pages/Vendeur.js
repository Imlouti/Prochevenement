import React, { Component } from 'react';
//import './App.css';
import { IconButton, Link } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';


class Vendeur extends Component {
    state = {
        events: [],
    };

    async componentDidMount() {
        const vendeurId = localStorage.getItem('vendeurId');  // Récupérer l'ID du vendeur connecté
        const response = await fetch(`http://localhost:4001/auth/vendor-events/${vendeurId}`);
        const vendorEvents = await response.json();
        this.setState({ events: vendorEvents });
      }
      
      render() {
        return (
          <div>
            <h1>Mes événements</h1>
            {this.state.events.length > 0 ? (
              <ul>
                {this.state.events.map(event => (
                  <li key={event._id}>
                    <h2>{event.eventId.nom}</h2>
                    <p>{event.eventId.description}</p>
                    <p>{event.eventId.prix}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun événement trouvé.</p>
            )}
          </div>
        );
    }
}

 
export default Vendeur;