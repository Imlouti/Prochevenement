import React, { Component } from 'react';
import { EventTable } from "../components/EventTable";
import { Navigator } from '../components/Navigator';
import {  Box } from "@mui/material";


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
  }//import './App.css';
class Magasiner extends Component {
    
    render(){
    return( <div id="background">
        <Box sx={{display: 'flex', gap: 2}}> 
        <section id="user">
              <p id="user">Bonjour, {nomUtilisateur} </p>
      </section>
      <section id="bar">
<Navigator/>      </section></Box>
<Box>
<EventTable/>
</Box>







</div>
)
}
}

export default Magasiner;