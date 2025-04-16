import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
//import './App.css';

function Parametres() {
  function getNom(){
    let message = localStorage.getItem("nom");
    message=message.split(",");
    message=message[0].split(" ");
    return message[0]
    

    }
    
    
    return( <div id="background">
        
        <p id="two">

                <section id="user">
                <p id="user">Bonjour, {getNom()} </p>
        </section>
        <section id="bar">
        <Navigator/>
        </section></p>
        <a href="Modifier">Modifier le compte</a>

        <a href="Annuler">Annuler un evenement</a>







</div>
        )
  }
 
export default Parametres;