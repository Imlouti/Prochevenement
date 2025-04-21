import React from 'react';
import { Navigator } from '../components/Navigator';
import { Button, Box, Link } from "@mui/material";

let nomUtilisateur;

if (localStorage.getItem("nom")!=undefined){


  nomUtilisateur = localStorage.getItem("nom");
  nomUtilisateur=nomUtilisateur.split(",");
  nomUtilisateur=nomUtilisateur[0].split(" ");
  nomUtilisateur=nomUtilisateur[0];
  }
  else{
          nomUtilisateur="";
  }
  if(nomUtilisateur==undefined){
        nomUtilisateur="";
  }        
function Parametres() {
    
    
    return( <div id="background">
        
        <Box sx={{display: 'flex', gap: 2}}> 
        <section id="user">
              <p id="user">Bonjour, {nomUtilisateur} </p>
      </section>
      <section id="bar">
<Navigator/>      </section></Box>


                <Box textAlign='center'>
                <Button variant='contained' size='large'
          onClick={() => {
            document.location.href="Modifier";
        
          }}
        >
          Modifier le compte
        </Button>
        <Link href="Annuler">Annuler un evenement
        </Link>
        
        </Box>
        







</div>
        )
  }
 
export default Parametres;