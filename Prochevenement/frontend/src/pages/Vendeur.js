import React, { Component } from 'react';
import { IconButton, Link } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import {  Box } from "@mui/material";
import { VendorTable } from "../components/VendorTable";


class Vendeur extends Component {
    render() { 
        return <div id="background">
            <div id="two">
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
        </div>

        <h1>
            Événements
        </h1>
        <Box>
<VendorTable/>
</Box>











</div>
  }
}
 
export default Vendeur;