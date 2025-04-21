import React, { Component } from 'react';
//import './App.css';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


class Creation extends Component {
    async Submit(event) {
        if (event) {
          event.preventDefault();
      
          // Récupérer l'ID du vendeur depuis localStorage
          const vendeurId = localStorage.getItem('vendeurId');  // L'ID du vendeur doit être stocké dans localStorage
      
          // Vérifier si l'ID du vendeur est disponible
          if (!vendeurId) {
            console.error("ID du vendeur manquant");
            return;  // Arrêter le processus si l'ID du vendeur est manquant
          }
      
          // Collecter les données de l'événement
          const evenement = {
            nom: document.getElementById("nomevenement").value,
            description: document.getElementById("description").value,
            prix: document.getElementById("prix").value,
            date: document.getElementById("date").value,
            location: document.getElementById("location").value,
            billets: document.getElementById("billets").value,
            vendeurId,  // Ajouter l'ID du vendeur ici
          };
      
          // Vérifier si un champ est vide
          const isAtLeastOneNull = Object.values(evenement).some(i => i === "");
          if (isAtLeastOneNull) {
            document.getElementById("hidden").style.display = "block"; // Afficher une erreur si des champs sont vides
            return;
          }
      
          // Envoyer la requête POST pour créer un événement
          try {
            const response = await fetch('http://localhost:4001/auth/event', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(evenement),  // Convertir l'objet événement en JSON
            });
      
            const data = await response.json();
      
            if (response.ok) {
              console.log(data);
              document.location.href = "Vendeur";  // Rediriger après l'ajout réussi
            } else {
              console.error('Erreur lors de la création de l\'événement', data);
            }
          } catch (error) {
            console.error('Erreur de requête', error);
          }
        }
      }
      


    render() { 
        return <div id="background">
                               <IconButton href="Vendeur" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
                <h1>
        Creation d’un événement
        </h1>
        <form onSubmit={this.Submit}>
        <input type="text" id="nomevenement" class='input' placeholder="Nom"/>
            <input type="text" id="description" class='input' placeholder="Description"/>
            <input type="text" id="prix" class='input' placeholder="Prix"/>
            <input type="text" id="date" class='input' placeholder="YYYY-MM-DD"/>
            <input type="text" id="location" class='input' placeholder="Addresse"/>
            <input type="text" id="billets" class='input' placeholder="Billets totale"/>
                        <button id="submit" color="primary" type="submit" class='button'>Confirmer</button>
                </form>
                <a id="hidden">Vous devez remplir tous les champs.</a>


</div>
  }
}
 
export default Creation;