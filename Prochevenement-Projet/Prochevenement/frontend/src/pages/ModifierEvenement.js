import React, { Component } from 'react';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {  Box, Button, Link, Grid2 } from "@mui/material";
import ModifyEvent from '../components/ModifyEvent';



class Evenement extends Component {
    //Va afficher une fleche de retour a la page parametres, le titre de la page, le formulaire de modification de compte (voire le fichier components/ModifyComp pour plus d'explication) et un lien pour reinitialiser le mot de passe
    render() { 
        
        return              <div id="background">
        <p id="two">

        <IconButton href="Vendeur" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
</p>

      
  
  <Grid2
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                      <ModifyEvent/>
                  </Grid2>




      <a id="hidden">Pas de billets restant.</a>






</div>
    
}
}
 
export default Evenement;
