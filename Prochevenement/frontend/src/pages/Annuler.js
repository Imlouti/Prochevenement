import React, { Component } from 'react';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

class Annuler extends Component {
  async Creation(event) {
    if (event) {
        event.preventDefault(); 
        document.getElementById("hidden").style.display="block";
        document.location.href="Parametres";
    }
    }

    render() { 
        return <div>
<IconButton href="Parametres" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>

        <h1>
        Nom de l’événement
                </h1>
                <h2>
                Description
                </h2>
                    <a>Prix</a>
                    <a>Emplacement</a>
                    <a>Date</a>
                    <a>Billets Restant</a>

                    <button id="submit" class='button'>Annuler l’achat</button>

                    <a id="hidden">Enlever du panier.</a>







</div>
  }
}
 
export default Annuler;