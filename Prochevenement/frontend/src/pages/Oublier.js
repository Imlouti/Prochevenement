
import React, { Component } from 'react';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

class Oublier extends Component {
    async Submit(event) {
        if (event) {
            event.preventDefault();
            const courriel = { courriel: document.getElementById("courriel").value };
            const isAtLeastOneNull = Object.values(courriel).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden").style.display = "block"; 
                return;
            }
            try {
                const response = await fetch('http://localhost:4001/auth/forgot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(courriel)
                });
                const data = await response.json();
                localStorage.setItem('courriel', document.getElementById("courriel").value);
                if (response.ok) {
                    document.location.href = "Reinitialiser";
                } else {
                    console.error('Error:', data);
                }
            } catch (error) {
                console.error('There was an error:', error);
            }
        }
    }

    render() {
        return <div id="background">
            <IconButton href="Connexion" sx={{color:"black", padding: 0}} size="large">
                <ArrowBackIosIcon/>
            </IconButton>
            <h1>Oublier le mot de passe</h1>
            <form onSubmit={this.Submit}>
                <input type="text" id="courriel" class='input' placeholder="Courriel"/>
                <button id="submit" color="primary" type="submit" class='button'>Envoyer un courriel</button>
            </form>
        </div>
    }
}
export default Oublier;
    