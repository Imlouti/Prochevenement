import React, { Component } from 'react';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

class Acheter extends Component {
    async Creation(event) {
        if (event) {
            event.preventDefault(); 
            document.location.href="Magasiner";
        }
        }
    render() { 
        return <div id="background">
                <IconButton href="Panier" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>

        <form onSubmit={this.Creation}>
            <input type="text" id="nom" class='input' placeholder="Nom"/>
            <input type="text" id="courriel" class='input' placeholder="Courriel"/>
            <input type="text" id="numerocarte" class='input' placeholder="Numéro carte crédit"/>
            <input type="text" id="expiration" class='input' placeholder="Expiration"/>
            <input type="text" id="codesecurite" class='input' placeholder="Code de securité"/>
            <input type="text" id="addresse" class='input' placeholder="Addresse"/>
                        <button id="submit" class='button' color="primary" type="submit">Confimer

</button>
                </form>








</div>
  }
}
 
export default Acheter;