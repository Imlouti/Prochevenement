import React, { Component } from 'react';
//import './App.css';

function Panier() {
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
        <a href="Magasiner" id="img"><img src="acceuil.png"></img></a>
        <a href="Parametres" id="img"><img src="parametres.png" ></img></a>
        <a href="Calendrier" id="img"><img src="calendrier.png" ></img></a>
        <a href="Panier" id="img"><img src="panier.png" ></img></a>
        <a href="Propos" id="img"><img src="info.png" ></img></a>
        </section></p>
        <a href="Acheter">Acheter</a>






</div>)
  }

 
export default Panier;