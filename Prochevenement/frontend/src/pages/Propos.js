import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
//import './App.css';
let nomUtilisateur = localStorage.getItem("nom");
nomUtilisateur=nomUtilisateur.split(",");
nomUtilisateur=nomUtilisateur[0].split(" ");
nomUtilisateur=nomUtilisateur[0];

function Propos() {
    
    
        
    return( <div id="background">
        
        <p id="two">

                <section id="user">
                <p id="user">Bonjour, {nomUtilisateur} </p>
        </section>
        <section id="bar">
        <Navigator/>
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