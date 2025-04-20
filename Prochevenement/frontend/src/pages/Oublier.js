import React, { Component } from 'react';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Grid2 } from "@mui/material";
import ForgotComp from '../components/ForgotComp';

class Oublier extends Component {
    //Va afficher une fleche de retour a la page de connexion, le titre de la page, le formulaire qui demande pour le courriel (voire le fichier components/ForgotComp pour plus d'explication) 
    render() { 
        return <div id="background">
                <IconButton href="Connexion" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
                <h1>
        Oublier le mot de passe
        </h1>
        <Grid2
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
            <ForgotComp/>
        </Grid2>

        <a id="hidden">Vous devez remplir tous les champs.</a>




</div>
  }
}
 
export default Oublier;


