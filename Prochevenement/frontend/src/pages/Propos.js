import React, { Component } from 'react';
//import './App.css';

function Propos() {
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
        <a><img src="logo.png"></img></a>

        <h1>
        Qui sommes-nous ?
                </h1>
                <h3>
                Chez Prochévénements, nous travaillons premierement pour
optimiser votre recherche d’événements locaux. On travaille avec
plusieurs vendeurs petits pour assurer que meme des petits
événements sont trouvable.
                </h3>





</div>)
  }

 
export default Propos;