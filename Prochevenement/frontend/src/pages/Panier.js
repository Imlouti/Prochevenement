import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
//import './App.css';

<
class Panier extends Component {
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
               <Navigator/>

        </section></p>
        <a href="Acheter">Acheter</a>






</div>)
  }

 
export default Panier;