
import React, { Component } from 'react';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Box, Link, Grid2 } from "@mui/material";
import LoginComp from '../components/LoginComp';



class Connexion extends Component {
   
        //Va afficher une fleche de retour a la page d'acceuil, le titre de la page, le formulaire de connexion (voire le fichier components/LoginComp pour plus d'explication) et deux liens pour creer un compte et pour le mot de passe oublier
    render() { 

                return <div id="background">


                <IconButton href="/" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
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

                <a id="hidden">Ce compte n'existe pas.</a>
                <a id="hidden2">Vous devez remplir tous les champs.</a>


    
<Box sx={{display: 'flex', gap: 2}}>
<Link href="Creation">Pas de compte? Créer un compte.</Link>
<Link href="Oublier" id='oublier'>Oublier le mot de passe</Link>

</Box>


</div>

    

  }

}

 
export default Connexion;
