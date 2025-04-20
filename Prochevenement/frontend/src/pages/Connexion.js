
import React, { Component } from 'react';
import { Grid2 } from "@mui/material";
//import './App.css';

import LoginComp from '../components/LoginComp';

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.37.1:4001";


class Connexion extends Component {
    async Submit(event) {

        if (event) {
            event.preventDefault(); 
            document.location.href="Magasiner";
                    
        }
    }

    

        
    render() { 
        return(
            
        <div id="background">

        <section id="back">
        <a href="/" id="img"><img src="fleche.png"></img></a>
</section>
<h1>
Connexion
</h1>

<Grid2
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justifyContent="center"
>
    <LoginComp/>
</Grid2>
<form onSubmit={this.Submit}>
    <input type="text" id="nom" class="input" placeholder="Nom"/>
    <input type="text" id="courriel" class="input" placeholder="Courriel"/>
    <input type="text" id="password" class="input" placeholder="Mot de passe"/>
                <button id="submit" class="button" color="primary" type="submit">Connexion</button>
                

        </form>
        <a id="hidden">Ce compte n'existe pas.</a>
        <p id="two">

<a href="Creation">Pas de compte? Créer un compte.</a>
<a href="Oublier">Oublier le mot de passe</a>

</p>


</div>

    );

  }

}

 
export default Connexion;
