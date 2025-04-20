import React from "react";
import Nav from 'react-bootstrap/Nav'
import Tooltip from '@mui/material/Tooltip'
import { Box } from "@mui/material";


// Icon related things
import { IconButton } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import 'bootstrap/dist/css/bootstrap.min.css';

// home, gear, calendar, cart, info

export const Navigator = () => {

    return (
        <Box sx={{marginRight: '10px'}}>
            <Nav className="justify-content-end">
                <Nav.Item>
                    <Tooltip title="Acceuil">
                        <IconButton href="Magasiner" sx={{color:"black", padding:0 }} size="large">
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>
                </Nav.Item>
                <Nav.Item>
                    <Tooltip title="Paramètres">
                        <IconButton href="Parametres" sx={{color:"black", padding: 0}} size="large">
                            <SettingsIcon/>
                        </IconButton>
                    </Tooltip>
                </Nav.Item>
                <Nav.Item>
                <Tooltip title="Calendrier">
                    <IconButton href="Calendrier" sx={{color:"black", padding: 0}} size="large">
                        <CalendarMonthIcon/>
                    </IconButton>
                    </Tooltip>
                </Nav.Item>
                <Nav.Item>
                <Tooltip title="Panier">
                    <IconButton href="Magasiner" sx={{color:"black", padding: 0}} size="large">
                        <ShoppingCartIcon/>
                    </IconButton>
                    </Tooltip>
                </Nav.Item>
                <Nav.Item>
                <Tooltip title="À propos">
                    <IconButton href="Propos" sx={{color:"black", padding: 0}} size="large">
                        <InfoOutlinedIcon/>
                    </IconButton>
                    </Tooltip>
                </Nav.Item>
                <Nav.Item>
                <Tooltip title="Déconnectez">
                    <IconButton href="/" sx={{color:"black", padding: 0}} size="large">
                        <ExitToAppIcon/>
                    </IconButton>
                    </Tooltip>
                </Nav.Item>
            </Nav>
        </Box>

    );

};
/*
                <Tooltip title="Panier">
                    <IconButton href="Panier" sx={{color:"black", padding: 0}} size="large">
                        <ShoppingCartIcon/>
                    </IconButton>
                    </Tooltip>
changer a:
                <Tooltip title="Panier">
                    <IconButton href="Magasiner" sx={{color:"black", padding: 0}} size="large">
                        <ShoppingCartIcon/>
                    </IconButton>
                    </Tooltip>
a cause le panier n'est pas fini
*/