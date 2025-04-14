import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
//import './App.css';

class Propos extends Component {
  function getNom(){
    let message = localStorage.getItem("nom");
    message=message.split(",");
    message=message[0].split(" ");
    return message[0]
    
    }
    
    
            render() { 
        return <div id="background">

        
        <p id="two">

                <section id="user">
                <p id="user">Bonjour, {getNom()} </p>
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