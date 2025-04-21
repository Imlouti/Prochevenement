

import React, { Component } from 'react';
import "./styles.css";
import Map from "./map";
import { Button, Box, Link } from "@mui/material";


//https://ujjwaltiwari2.medium.com/a-guide-to-using-openstreetmap-with-react-70932389b8b1 guide to map, doesnt work
class Acceuil extends Component {

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