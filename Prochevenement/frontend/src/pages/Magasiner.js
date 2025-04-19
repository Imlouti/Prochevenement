import React, { Component } from 'react';
import { EventTable } from "../components/EventTable";
import { Navigator } from '../components/Navigator';
import { Button, Box, Link } from "@mui/material";

const response = await fetch('http://localhost:4001/auth/eventTable', {
  method: 'GET',
  headers: {
      'Content-Type': 'application/json'
  }});

const data = await response.json();
var result = Object.keys(data).map((key) => [key, data[key]]);

console.log(result[0][1].nom);

var i;
var list =[];
for (i = 0; i < result.length; i++) {

var nom =result[i][1].nom;
var billets =result[i][1].billets;
var prix =result[i][1].prix;


list.push(<td>{nom} {billets} {prix}</td>);

}
let nomUtilisateur = localStorage.getItem("nom");
nomUtilisateur=nomUtilisateur.split(",");
nomUtilisateur=nomUtilisateur[0].split(" ");
nomUtilisateur=nomUtilisateur[0];
//import './App.css';
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
<tr id='table'>{list}</tr>
</Box>







</div>
)
}
}

export default Magasiner;