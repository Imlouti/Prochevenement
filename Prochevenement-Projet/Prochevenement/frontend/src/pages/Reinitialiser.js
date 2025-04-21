
import React, { Component } from 'react';
import './styles.css';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Grid2 } from "@mui/material";
import ReinitializeComp from '../components/ReinitializeComp';

class Reinitialiser extends Component {
        //Va afficher une fleche de retour a la page oublier, le titre de la page, le formulaire de reinitialisation (voire le fichier components/ReinitializeComp pour plus d'explication) 
    render() { 
        return <div id='background'>
                
                <IconButton href="Oublier" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
        <h1>
        Réinitialiser le mot de passe
        </h1>
        <Grid2
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                    <ReinitializeComp/>
                </Grid2>
        <a id="hidden">Les mots de passe sont different.</a>
        <a id="hidden2">Vous devez remplir tous les champs.</a>

        


</div>
  }
}

export default Reinitialiser;

