import React, { Component } from 'react';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {  Link, Grid2 } from "@mui/material";
import RegisterComp from '../components/RegisterComp';


class Creation extends Component {

        //Va afficher une fleche de retour a la page d'acceuil, le titre de la page, le formulaire de creation (voire le fichier components/RegisterComp pour plus d'explication) et un lien si le compte a deja ete creer
    render() { 
        return <div id="background">
                <IconButton href="/" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
                <h1>
        Creation d’un compte
        </h1>
        <Grid2
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        >
            <RegisterComp/>
        </Grid2>

        <a id="hidden">Les mots de passe sont different.</a>
        <a id="hidden2">Vous devez remplir tous les champs.</a>
        <Link href="Connexion">Déja un compte? Connectez-vous.</Link>


</div>
  }
}
 
export default Creation;