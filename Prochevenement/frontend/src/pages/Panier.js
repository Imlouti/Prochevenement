import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
import { CartTable } from '../components/CartTable';
import { Button, Box } from "@mui/material";

let nomUtilisateur = localStorage.getItem("nom");
nomUtilisateur=nomUtilisateur.split(",");
nomUtilisateur=nomUtilisateur[0].split(" ");
nomUtilisateur=nomUtilisateur[0];

class Panier extends Component {

    render() { 
        return <div id="background">
                  <p id="two">

        <section id="user">
                        <p id="user">Bonjour, {nomUtilisateur} </p>
                </section>
                <section id="bar">
                <Navigator/>
                </section></p>
        <CartTable/>
        <Box textAlign='center'>
<Button variant='contained' size='large'
onClick={() => {
document.location.href="Acheter";

}}
>
Acheter
</Button>

</Box>


    </div>
  }
}
 
export default Panier;