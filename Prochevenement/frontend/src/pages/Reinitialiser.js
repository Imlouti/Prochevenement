
import React, { Component } from 'react';
import './styles.css';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

class Reinitialiser extends Component {
    async Submit(event) {
        if (event) {
            event.preventDefault();
            if (document.getElementById("newpassword").value !== document.getElementById("newpasswordagain").value) {
                document.getElementById("hidden").style.display = "block";
            }
            const reinitialiser = {
                courriel: localStorage.getItem('courriel'),
                verificationfe: document.getElementById("verification").value,
                password: document.getElementById("newpassword").value
            };

            const isAtLeastOneNull = Object.values(reinitialiser).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden").style.display = "block";
                return;
            }

            try {
                const response = await fetch('http://localhost:4001/auth/reinitialize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reinitialiser)
                });

                const data = await response.json();
                if (response.ok) {
                    document.location.href = "Connexion";
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
            <IconButton href="Oublier" sx={{color:"black", padding: 0}} size="large">
                <ArrowBackIosIcon/>
            </IconButton>
            <h1>Réinitialiser le mot de passe</h1>
            <form onSubmit={this.Submit}>
                <input type="text" id="verification" class='input' placeholder="Code de verification"/>
                <input type="text" id="newpassword" class='input' placeholder="Nouveau mot de passe"/>
                <input type="text" id="newpasswordagain" class='input' placeholder="Mot de passe encore"/>
                <button id="submit" class='button' type="submit">Réinitialiser</button>
            </form>
            <a id="hidden">Les mots de passe sont différents.</a>
        </div>
    }
}

export default Reinitialiser;
    