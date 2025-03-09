"use server"
import React, { Component } from 'react';
//import './App.css';
/*import { connect } from 'mongoose';

const mongoose = require('mongoose');


var joueurs; //collection joueurs
mongoose.connect('mongodb://127.0.0.1:27017/Prochevenement');
  joueurs = mongoose.model('Evenement', new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    nom: String,
    description: String,
    emplacement: String,
    date: String,
    prix: Number,
    billets: Number
  }));


  async function trouverQuestion(id){
    var questionTrouver = await joueurs.findById(id).exec();
    var listeQuestionTrouver = [questionTrouver.nom, questionTrouver.description];
    return listeQuestionTrouver
  }
  
  var promise=trouverQuestion("67cca05f62124f6c704c3c7d");
  var listeQuestionTrouver;
  */


class Evenement extends Component {
  async Creation(event) {
    if (event) {
        event.preventDefault(); 
        document.getElementById("hidden").style.display="block";
        document.location.href="Magasiner";
    }
    }

    render() { 
        return <div id="background">
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

                    <button onClick={this.Creation} class="button">Acheter</button>

                    <a id="hidden">Ajouter au panier.</a>






</div>
  }
}
 
export default Evenement;