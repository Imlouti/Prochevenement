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

import 'bootstrap/dist/css/bootstrap.min.css';

// home, gear, calendar, cart, info

export const Navigator = () => {

    return (
        <Box sx={{marginRight: '10px'}}>
            <Nav className="justify-content-end">
                <Nav.Item>
                    <Tooltip title="Home">
                        <IconButton href="Magasiner" sx={{color:"black", padding:0 }} size="large">
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>
                </Nav.Item>
                <Nav.Item>
                    <Tooltip title="Settings">
                        <IconButton href="Parametres" sx={{color:"black", padding: 0}} size="large">
                            <SettingsIcon/>
                        </IconButton>
                    </Tooltip>
                </Nav.Item>
                <Nav.Item>
                    <IconButton href="Calendrier" sx={{color:"black", padding: 0}} size="large">
                        <CalendarMonthIcon/>
                    </IconButton>
                </Nav.Item>
                <Nav.Item>
                    <IconButton href="Panier" sx={{color:"black", padding: 0}} size="large">
                        <ShoppingCartIcon/>
                    </IconButton>
                </Nav.Item>
                <Nav.Item>
                    <IconButton href="Propos" sx={{color:"black", padding: 0}} size="large">
                        <InfoOutlinedIcon/>
                    </IconButton>
                </Nav.Item>
            </Nav>
        </Box>

    );

};