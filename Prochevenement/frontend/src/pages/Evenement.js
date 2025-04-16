"use server"
import React, { Component } from 'react';
import { Table } from '@mui/material';
import { Navigator } from '../components/Navigator';
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


function Evenement() {
     /*
          let message = localStorage.getItem("event");
          0-6
          arg billets restant -1
          localStorage.getItem("event", arg)
    Nom de l’événement
Description
Prix
Emplacement
Date
Billets Restant
      let message = localStorage.getItem("event");


    */
  function Creation(event) {
    if (event) {
        event.preventDefault(); 
        document.location.href="Magasiner";

        /*
        let massage = localStorage.getItem("event");
      
          massage=massage.split(",");
          console.log(massage);
          if(massage[5]>0){
            massage[5]=massage[5]-1;
            localStorage.setItem("event",massage);
            document.location.href="Magasiner";
          }
          else{
          document.getElementById("hidden").style.display="block";
        }*/
  
    }
    }


    function getEvent(){
      let message = localStorage.getItem("event");
      if(message!=null){
      message=message.split(",");
      return [message[0],message[1], message[2],message[3],message[4],message[5]]
      }
      else{
        return ["","","","",""]
      }

    }

        return(
        
         <div id="background">
                      <p id="two">

                <section id="back">
                <a href="Magasiner" id="img"><img src="fleche.png"></img></a>
        </section>
        
</p>
        
                    
                    <form onSubmit={Creation()}>
                    <h1>
        {getEvent()[0]}
                </h1>
                <h2>
                {getEvent()[1]}
                </h2>
                <a>  {getEvent()[2]}</a>
                    <a>  {getEvent()[3]}</a>
                    <a>  {getEvent()[4]}</a>
                    <a>  {getEvent()[5]}</a>
                        <button id="submit" color="primary" type="submit" class='button'>Acheter</button>
                </form>



                    <a id="hidden">Pas de billets restant.</a>






</div>
    )
}
 
export default Evenement;