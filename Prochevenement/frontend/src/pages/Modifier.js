import React, { Component } from 'react';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {  Link, Grid2 } from "@mui/material";
import ModifyComp from '../components/ModifyComp';


class Modifier extends Component {
        
    //Va afficher une fleche de retour a la page parametres, le titre de la page, le formulaire de modification de compte (voire le fichier components/ModifyComp pour plus d'explication) et un lien pour reinitialiser le mot de passe
    render() { 
        
        return             <div id="background">

                <IconButton href="Parametres" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
        <h1>
        Modification
        </h1>
        <Grid2
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                    <ModifyComp/>
                </Grid2>
                <a id="hidden">Vous devez remplir tous les champs.</a>
                <Link href="Reinitialiser">Reinitialiser le mot de passe
        </Link>



</div>
    
}
}
 
export default Modifier;