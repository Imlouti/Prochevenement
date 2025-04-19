import React, { Component } from 'react';
//import './App.css';
import { IconButton, Link } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';


class Acheter extends Component {
    render() { 
        return <div id="background">
            <p id="two">
                <section id="back">
                <IconButton href="AjouterEvenement" sx={{color:"black", padding: 0}} size="large">
                        <AddIcon/>
                    </IconButton>

        </section>
        <section>
        <IconButton href="/" sx={{color:"black", padding: 0}} size="large">
                        <ExitToAppIcon/>
                    </IconButton>
        </section>
        </p>

        <h1>
            Événements
        </h1>
        <Link href="ModifierEvenement">Modifier Evenement</Link>











</div>
  }
}
 
export default Acheter;