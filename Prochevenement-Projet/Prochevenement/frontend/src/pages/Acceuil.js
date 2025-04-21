

import React, { Component } from 'react';
import "./styles.css";
import { Button, Box, Link } from "@mui/material"; //mui pour le boutton et le lien

class Acceuil extends Component {

    //Va afficher des titres, une image, un boutton pour se connecter et un link pour creer un compte
    render() { 
        return     <div id="background">
        <a><img src="logo.png"></img></a> 
        <h1>
        Bienvenue a Prochévénements
        </h1>
        <h2>
        Les événements proche de vous
        </h2>
        <img src="map.png" id="map"></img>
        <Box textAlign='center'>
        <Button variant='contained' size='large'
  onClick={() => {
    document.location.href="Connexion";

  }}
>
  Se conntecter
</Button>
<Link href="Creation">Pas de compte? Créer un compte.</Link>

</Box>




</div>

  }
}
 
export default Acceuil;