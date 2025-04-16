import React, { Component } from 'react';
import { EventTable } from "../components/EventTable";
import { Navigator } from '../components/Navigator';

//import './App.css';

function Magasiner() {
  function getNom(){
    let message = localStorage.getItem("nom");
    message=message.split(",");
    message=message[0].split(" ");
    return message[0]
    
    }
    function getEvent(){
      let message = localStorage.getItem("event");
      if(message!=null){
      message=message.split(",");
      return [message[0],message[3], message[5],message[2]]
      }
      else{
        return ["Aucun","","",""]
      }

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
      <p id="two">

<section id="user">
<p id="user">        <a href="Evenement">{getEvent()[0]}</a>
</p>
</section>
<section id="user">
<p id="bar">        <a href="Evenement">{getEvent()[1]}</a>
</p>
</section>
<section id="user">
<p id="bar">        <a href="Evenement">{getEvent()[2]}</a>
</p>
</section>
<section id="user">
<p id="bar">        <a href="Evenement">{getEvent()[3]}</a>
</p>
</section>

</p>






</div>
)
}

export default Magasiner;